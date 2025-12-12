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

router.patch("/update", auth(), UserController.updateUser);

router.delete(
  "/:userId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.deleteUser
);

router.patch(
  "/change-profile-status",
  auth(),
  validateRequest(UserValidations.changeProfileStatusSchema),
  UserController.changeProfileStatus
);

export const UserRoutes = router;
