import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PatientController } from "./patient.controller";
import { PatientValidations } from "./patient.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.getAllPatients
);

router.get(
  "/:patientId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.getPatientById
);

router.patch(
  "/:patientId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(PatientValidations.updatePatientSchema),
  PatientController.updatePatientById
);

router.delete(
  "/:patientId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.deletePatientById
);

router.delete(
  "/soft-delete/:patientId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.softDeletePatientById
);

export const PatientRoutes = router;
