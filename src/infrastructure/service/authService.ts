import { User } from "../../entities/User";
import { IAuthService } from "../../application/interfaces/service/IAuthService";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export class AuthService implements IAuthService {
  generateToken(user: any): string {
    try {
      const token = jwt.sign(user, config.JWT_SECRET!, {
        expiresIn: "30d",
      });
      return token;
    } catch (error) {
      throw new Error("error in generating token");
    }
  }
  verifyToken(token: string): User {
    try {
      const data = jwt.verify(token, config.JWT_SECRET!) as any;

      return data;
    } catch (error) {
      throw new Error("user not authorised");
    }
  }
}
