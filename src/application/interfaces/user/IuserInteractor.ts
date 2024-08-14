import { User } from "../../../entities/User";

export interface IUserInteractor {
  login(email: string, password: string): Promise<User | null>;
  signup(user: User): Promise<User>;
  adminLogin(email: string, password: string): Promise<User | null>;
  updateDetails(id: string, value: User): Promise<User>;
  verifyMail(type: string, token: string, email: string): Promise<User | null>;
  resendMail(id: string): any;
  forgotPassword(email: string): Promise<void>;
  updatePassword(email: string, password: string): Promise<User | null>;
  googleSignUp(user: User): Promise<User | null>;
  updateProfileImage(_id: string, url: string): Promise<User | null>;
  getAllUser(page: any): Promise<User[]>;
  filterUser(filter: any, page: any): Promise<User[]>;
  getCount(filter: any): Promise<number>;
  chaneStatus(id: string): Promise<User>;
  searchUser(search: string): Promise<User[]>;
  verifyUser(id: string): Promise<User>;
  getDashboard(): Promise<any>;
}
