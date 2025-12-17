import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { UserValidations } from "./user.validation";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllUsers
);

router.get("/my-profile", auth(), UserController.getMyProfile);

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

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.createDoctorSchema),
  UserController.createDoctor
);

router.post(
  "/create-patient",
  validateRequest(UserValidations.createPatientSchema),
  UserController.createPatient
);

router.patch(
  "/:userId/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.changeUserStatusSchema),
  UserController.changeUserStatus
);

router.patch(
  "/update-my-profile",
  auth(),
  // validateRequest(UserValidations.updateMyProfileSchema),
  UserController.updateMyProfile
);

export const UserRoutes = router;
