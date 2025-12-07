import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { UserValidations } from "./user.validation";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/:userId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getSingleUserById
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.createAdminSchema),
  UserController.createAdmin
);

router.patch("/update", auth(), UserController.updateUser);

router.delete(
  "/:userId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.deleteUser
);

export const UserRoutes = router;
