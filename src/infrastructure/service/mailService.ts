import { IMailerService } from "../../application/interfaces/service/IMailerService";
import { IUserRepository } from "../../application/interfaces/user/IUserRepository";
import { User } from "../../entities/User";
import { Auction } from "../../entities/auction";
import { ErrorResponse } from "../../utils/errors";
import { sendAuctionMail, sendMail } from "../../utils/sendMail";
import { generateHashPassword } from "../middlewares/hashPasswordMiddleware";

export class MailService implements IMailerService {
  private repository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async accountVerificationMail(user: User, type: string): Promise<void> {
    try {
      let token = await generateHashPassword(user._id.toString());
      console.log("kdjsfkjasdhfasdhfjkshdfjkhsdjkfhkhsdfsdhfjk");

      const currentDate = new Date();
      const twoDaysLater = new Date(currentDate);

      if (type === "verifyEmail") {
        twoDaysLater.setDate(currentDate.getDate() + 2);
        user.verifyToken = token;

        user.verifyTokenExpiry = twoDaysLater;
      } else if (type === "forgotPassword") {
        twoDaysLater.setDate(currentDate.getDate() + 1);
        user.forgotPasswordToken = token;
        user.forgotPasswordTokenExpiry = twoDaysLater;
      }

      let data = await this.repository.update(user._id.toString(), user);

      await sendMail(user.name, user.email, type, token);
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async auctionStartMail(user: any, auction: Auction): Promise<void> {
    try {
      await sendAuctionMail(user.name, user.email, auction);
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  // async forgotPasswordMail(email: string): Promise<void> {
  //   throw new Error("Method not implemented.");
  // }
}
