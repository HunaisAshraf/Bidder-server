import express from "express";
import {
  loginValidator,
  signupValidator,
} from "../middlewares/userValidation/userValidation";
import { UserController } from "../../adapters/controllers/userController";
import { UserRepository } from "../../adapters/repositories/userRepository";
import { UserInteractor } from "../../application/usecases/users/userInteractor";
import { AuthService } from "../service/authService";
import { MailService } from "../service/mailService";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

const repository = new UserRepository();

const mailService = new MailService(repository);

const interactor = new UserInteractor(repository, mailService);

const authService = new AuthService();

const controller = new UserController(interactor, authService);

router.post("/login", loginValidator, controller.onUserLogin.bind(controller));
router.post(
  "/admin-login",
  loginValidator,
  controller.onAdminLogin.bind(controller)
);
router.post(
  "/signup",
  signupValidator,
  controller.onUserSignUp.bind(controller)
);
router.post("/google-signup", controller.onGoogleSignUp.bind(controller));
router.post("/verify-email", controller.onVerifyAccount.bind(controller));
router.post("/forgotpassword", controller.onForgotPassword.bind(controller));
// router.put(
//   "/update-role",
//   isAuthenticated,
//   controller.onUpdateUser.bind(controller)
// );
router.put(
  "/update-user",
  isAuthenticated,
  controller.onUpdateUser.bind(controller)
);
router.get("/logout", controller.onUserLogout.bind(controller));
router.get("/admin-logout", controller.onAdminLogout.bind(controller));
router.put(
  "/update-profile-image",
  isAuthenticated,
  controller.onUpdateProfileImage.bind(controller)
);
router.put("/update-password", controller.onUpdatePassword.bind(controller));
router.get(
  "/verify-token",
  isAuthenticated,
  controller.onVerifyToken.bind(controller)
);
router.get(
  "/get-all-users",
  isAdmin,
  controller.onGetAllUsers.bind(controller)
);

router.get("/filter-users", isAdmin, controller.onFilterUser.bind(controller));
router.put(
  "/change-user-status/:id",
  isAdmin,
  controller.onChangeStatus.bind(controller)
);
router.get("/search-users", isAdmin, controller.onSearchUser.bind(controller));

router.get(
  "/dashboard-user",
  isAdmin,
  controller.onGetAdminDashboard.bind(controller)
);

export { router as userRouter };
