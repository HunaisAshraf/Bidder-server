import { Request, Response, NextFunction } from "express";
import { User } from "../../entities/User";
import { IUserInteractor } from "../../application/interfaces/user/IuserInteractor";
import { validationResult } from "express-validator";
import { IAuthService } from "../../application/interfaces/service/IAuthService";
import { IRequestWithUser } from "../../application/types/types";
import { ErrorResponse } from "../../utils/errors";
import { io } from "../..";

export class UserController {
  private interactor: IUserInteractor;
  private authService: IAuthService;
  constructor(interactor: IUserInteractor, authService: IAuthService) {
    this.interactor = interactor;
    this.authService = authService;
  }

  async onUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new ErrorResponse("Invalid email or password", 401);
      }

      const { email, password } = req.body;
      const user = await this.interactor.login(email, password);

      if (user?.role === "admin") {
        throw new ErrorResponse("User not found", 404);
      }

      const data = {
        _id: user?._id,
        email: user?.email,
        role: user?.role,
      };

      const loginUser = {
        ...JSON.parse(JSON.stringify(user)),
        password: undefined,
      };

      const token = this.authService.generateToken(data);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({ success: true, user: loginUser, token });
    } catch (error) {
      next(error);
    }
  }

  async onAdminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new ErrorResponse("Invalid email or password", 401);
      }

      const { email, password } = req.body;

      const admin = await this.interactor.adminLogin(email, password);

      const data = {
        _id: admin?._id,
        email: admin?.email,
        role: admin?.role,
      };

      const adminLogin = {
        ...JSON.parse(JSON.stringify(admin)),
        password: undefined,
      };

      const token = this.authService.generateToken(data);
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({ success: true, admin: adminLogin, token });
    } catch (error) {
      next(error);
    }
  }

  async onUserSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let err = errors.array();
        throw new ErrorResponse(err[0].msg, 401);
      }

      const body = req.body;
      const user = await this.interactor.signup(body);
      const data = {
        _id: user?._id,
        email: user?.email,
        role: user?.role,
      };

      const newUser = {
        ...JSON.parse(JSON.stringify(user)),
        password: undefined,
      };

      const token = this.authService.generateToken(data);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      return res.status(200).json({ success: true, user: newUser, token });
    } catch (error) {
      next(error);
    }
  }

  async onVerifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, token, email } = req.body;

      const data = await this.interactor.verifyMail(type, token, email);

      if (data) {
        const user = {
          ...JSON.parse(JSON.stringify(data)),
          password: undefined,
        };
        res
          .status(200)
          .json({ success: true, message: "account verified", user });
      }
    } catch (error) {
      next(error);
    }
  }

  async onResendEmail(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;
      const data = await this.interactor.resendMail(id);

      if (data) {
        res.status(200).json({ success: true, message: "mail successfull" });
      }
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
  async onForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const data = await this.interactor.forgotPassword(email);

      res
        .status(200)
        .json({ success: true, message: "mail send successfully" });
    } catch (error) {
      next(error);
    }
  }

  async onUpdateUser(req: IRequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;

      const body = req.body;

      let user = await this.interactor.updateDetails(id, body);

      return res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async onUpdatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await this.interactor.updatePassword(email, password);
      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async onGoogleSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      body.isVerified = true;

      const user = await this.interactor.googleSignUp(body);

      const data = {
        _id: user?._id,
        email: user?.email,
        role: user?.role,
      };

      const token = this.authService.generateToken(data);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({ success: true, user, token });
    } catch (error) {
      next(error);
    }
  }

  async onUserLogout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async onAdminLogout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("admin_token", "", { httpOnly: true, expires: new Date(0) });
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async onUpdateProfileImage(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;
      const { fileUrl } = req.body;

      const user = await this.interactor.updateProfileImage(id, fileUrl);

      return res.status(200).send({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async onVerifyToken(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, token } = req.user!;
      await this.interactor.verifyUser(id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).send({ success: true, message: "user verified" });
    } catch (error) {
      next(error);
    }
  }

  async onGetAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = req.query;

      const users = await this.interactor.getAllUser(page);
      const count = await this.interactor.getCount({});

      return res.status(200).json({
        success: true,
        message: "users retrieved successfully",
        users,
        count,
      });
    } catch (error) {
      next(error);
    }
  }

  async onFilterUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { filter, page } = req.query;

      const users = await this.interactor.filterUser(filter, page);

      const count = await this.interactor.getCount(filter);

      return res.status(200).json({
        success: true,
        message: "users filtered successfully",
        users,
        count,
      });
    } catch (error) {
      next(error);
    }
  }

  async onChangeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await this.interactor.chaneStatus(id);

      if (!user.isActive) {
        io.emit("user_blocked", { userId: user._id });
      }

      return res.status(200).json({
        success: true,
        message: "users updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async onSearchUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;
      const users = await this.interactor.searchUser(search?.toString()!);
      const count = await this.interactor.getCount(search);

      return res.status(200).json({
        success: true,
        message: "search user successfull",
        users,
        count,
      });
    } catch (error) {
      next(error);
    }
  }

  async onGetAdminDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.interactor.getDashboard();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
