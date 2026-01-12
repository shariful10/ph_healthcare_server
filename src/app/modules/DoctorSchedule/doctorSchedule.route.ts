import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post("/create-schedule", DoctorScheduleController.createDoctorSchedule);

export const DoctorScheduleRoutes = router;
