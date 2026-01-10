import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/create-schedule", ScheduleController.createSchedule);

export const ScheduleRoutes = router;
