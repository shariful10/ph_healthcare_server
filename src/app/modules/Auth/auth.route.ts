import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidations.loginSchema),
  AuthController.login
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/change-password",
  auth(),
  validateRequest(AuthValidations.changePasswordSchema),
  AuthController.changePassword
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
