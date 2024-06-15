import { User } from "../../entities/User";
import { IAuthService } from "../../application/interfaces/service/IAuthService";
import jwt from "jsonwebtoken";

export class AuthService implements IAuthService {
  generateToken(user: any): string {
    try {
      const token = jwt.sign(user, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });
      return token;
    } catch (error) {
      console.log(error);
      throw new Error("error in generating token");
    }
  }
  verifyToken(token: string): User {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET!) as any;

      return data;
    } catch (error) {
      console.log(error);
      throw new Error("user not authorised");
    }
  }
}
