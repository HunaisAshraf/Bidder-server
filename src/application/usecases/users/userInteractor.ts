import { User } from "../../../entities/User";
import {
  comparePassword,
  generateHashPassword,
} from "../../../infrastructure/middlewares/hashPasswordMiddleware";
import { IMailerService } from "../../interfaces/service/IMailerService";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { IUserInteractor } from "../../interfaces/user/IuserInteractor";

export class UserInteractor implements IUserInteractor {
  private repository: IUserRepository;
  private mailService: IMailerService;

  constructor(repository: IUserRepository, mailService: IMailerService) {
    this.repository = repository;
    this.mailService = mailService;
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      let user = await this.repository.findByEmail(email);

      if (!user) {
        throw new Error("user dosen't exist");
      }
      console.log(user);

      const passwordMatch = await comparePassword(password, user.password);

      if (!passwordMatch) {
        throw new Error("password dosen't match");
      }

      return user;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }

  async signup(user: User): Promise<User> {
    try {
      console.log("REACHED INTERACTOR");

      const userExist = await this.repository.findByEmail(user.email);

      console.log("userExist", userExist);

      if (userExist) {
        throw new Error("user aldready registered");
      }
      if (user.password) {
        const hashedPassword = await generateHashPassword(user.password);
        user.password = hashedPassword;
      }

      const newUser = await this.repository.add(user);

      if (!newUser.googleId) {
        await this.mailService.accountVerificationMail(newUser, "verifyEmail");
      }

      return newUser;
    } catch (error: any) {
      console.log(error.message);

      throw new Error(error.message);
    }
  }

  async updateDetails(id: string, value: User): Promise<User> {
    try {
      console.log("user", value, id);

      const data = await this.repository.findByEmail(value.email);

      if (data && data._id === value._id) {
        throw new Error("email already exists");
      }

      const user = await this.repository.update(id, value);
      if (!user) {
        throw new Error("error in updating user");
      }
      return user;
    } catch (error) {
      throw new Error("error in updating user");
    }
  }
  // async updatePassword(email: string, password: string): Promise<User> {
  //   try {
  //     const hashedPassword = await generateHashPassword(password);

  //     const data = await this.repository.update(email, {
  //       password: hashedPassword,
  //     });

  //     if (!data) {
  //       throw new Error("error in updating user");
  //     }

  //     return data;
  //   } catch (error) {
  //     throw new Error("Method not implemented.");
  //   }
  // }

  async verifyMail(
    type: string,
    token: string,
    email: string
  ): Promise<User | null> {
    try {
      const user = await this.repository.findByEmail(email);

      if (type === "verifyEmail" && user?.verifyTokenExpiry) {
        const date = user.verifyTokenExpiry.getTime();

        if (date < Date.now()) {
          throw new Error("Token expired");
        }

        if (user.verifyToken === token) {
          const data = {
            isVerified: true,
            verifyToken: "",
            verifyTokenExpiry: "",
          };

          let updatedUser = await this.repository.update(
            user._id.toString(),
            data
          );
          console.log(updatedUser);

          return updatedUser;
        }
      } else if (type === "forgotPassword" && user?.forgotPasswordTokenExpiry) {
        const date = user.forgotPasswordTokenExpiry.getTime();

        if (date < Date.now()) {
          throw new Error("Token expired");
        }

        if (user.forgotPasswordToken === token) {
          const data = {
            isVerified: true,
            forgotPasswordToken: "",
            verifyTokenExforgotPasswordTokenExpirypiry: "",
          };

          let updatedUser = await this.repository.update(
            user._id.toString(),
            data
          );
          console.log(updatedUser);

          return updatedUser;
        }
      }
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.repository.findByEmail(email);

      if (!user) {
        throw new Error("User not found");
      }

      this.mailService.accountVerificationMail(user, "forgotPassword");
      return;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async updatePassword(email: string, password: string): Promise<User | null> {
    try {
      const hashedPassword = await generateHashPassword(password);

      const user = await this.repository.findByEmail(email);

      const updatedUser = await this.repository.update(user?._id.toString()!, {
        password: hashedPassword,
      });
      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async googleSignUp(user: User): Promise<User | null> {
    try {
      const data = await this.repository.upsert(user);
      if (!data) {
        throw new Error("error in google signup");
      }

      if (user.email) {
        const data = await this.repository.findByEmail(user.email);
        return data;
      }
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateProfileImage(_id: string, url: string): Promise<User | null> {
    try {
      const data = { profilePicture: url };
      const user = await this.repository.update(_id, data);
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
