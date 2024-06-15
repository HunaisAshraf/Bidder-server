import { User } from "../../../entities/User";

export interface IUserInteractor {
  login(email: string, password: string): Promise<User | null>;
  signup(user: User): Promise<User>;
  // updatePassword(email: string, password: string): Promise<User>;
  updateDetails(id: string, value: User): Promise<User>;
  verifyMail(type: string, token: string, email: string): Promise<User | null>;
  forgotPassword(email: string): Promise<void>;
  updatePassword(email: string, password: string): Promise<User | null>;
  googleSignUp(user: User): Promise<User | null>;
  updateProfileImage(_id: string, url: string): Promise<User | null>;
}
