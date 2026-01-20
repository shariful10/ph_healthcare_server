import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule,
);

router.get("/", auth(), DoctorScheduleController.getAllDoctorSchedules);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedules,
);

router.delete(
  "/:scheduleId",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteDoctorSchedule,
);

export const DoctorScheduleRoutes = router;
