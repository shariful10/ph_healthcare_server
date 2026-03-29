import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentController } from "./appointment.controller";
import { AppointmentValidations } from "./appointment.validation";

const router = Router();

router.post(
  "/create",
  auth(UserRole.PATIENT),
  validateRequest(AppointmentValidations.createAppointmentSchema),
  AppointmentController.createAppointment,
);

export const AppointmentRoutes = router;
