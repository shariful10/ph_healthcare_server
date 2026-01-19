import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule
);

export const DoctorScheduleRoutes = router;
