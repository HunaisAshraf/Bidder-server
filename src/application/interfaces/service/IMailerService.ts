import { User } from "../../../entities/User";
import { Auction } from "../../../entities/auction";

export interface IMailerService {
  accountVerificationMail(user: User, type: string): Promise<void>;
  auctionStartMail(user: any, auction: Auction): Promise<void>;
}
