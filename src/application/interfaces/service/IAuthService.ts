import { User } from "../../../entities/User";

export interface IAuthService {
  generateToken(user: any): string;
  verifyToken(token: string): User;
}
