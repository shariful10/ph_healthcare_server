import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";
import { DoctorValidations } from "./doctor.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get("/", DoctorController.getAllDoctors);

router.get(
  "/:doctorId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.getDoctorById
);

router.patch(
  "/:doctorId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(DoctorValidations.updateDoctorSchema),
  DoctorController.updateDoctorById
);

router.delete(
  "/:doctorId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.deleteDoctorById
);

router.delete(
  "/soft-delete/:doctorId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.softDeleteDoctorById
);

export const DoctorRoutes = router;
