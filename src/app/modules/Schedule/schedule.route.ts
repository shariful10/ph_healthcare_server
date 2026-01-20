import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post(
  "/create-schedule",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.createSchedule,
);

router.get("/", auth(UserRole.DOCTOR), ScheduleController.getAllSchedules);

router.get(
  "/:scheduleId",
  auth(UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.getScheduleByID,
);

router.delete(
  "/:scheduleId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.deleteScheduleById,
);

export const ScheduleRoutes = router;
