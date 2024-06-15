import { User } from "../../../entities/User";

export interface IMailerService {
  accountVerificationMail(user: User,type:string): Promise<void>;
  // forgotPasswordMail(email: string): Promise<void>;
}
