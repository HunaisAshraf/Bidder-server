import { IMailerService } from "../../application/interfaces/service/IMailerService";
import { IUserRepository } from "../../application/interfaces/user/IUserRepository";
import { User } from "../../entities/User";
import { sendMail } from "../../utils/sendMail";
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

      console.log("token ddddddddddddddddddddddd",user);
      

      let data = await this.repository.update(user._id.toString(), user);

      await sendMail(user.name, user.email, type, token);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  // async forgotPasswordMail(email: string): Promise<void> {
  //   throw new Error("Method not implemented.");
  // }
}
