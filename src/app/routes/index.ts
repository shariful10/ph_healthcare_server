import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.routes";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { DoctorRoutes } from "../modules/Doctor/doctor.route";
import { PatientRoutes } from "../modules/Patient/patient.route";
import { ScheduleRoutes } from "../modules/Schedule/schedule.route";
import { SpecialtyRoutes } from "../modules/Specialty/specialty.route";
import { FileUploadRoutes } from "../modules/FileUpload/fileUpload.route";
import { DoctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/doctors",
    route: DoctorRoutes,
  },
  {
    path: "/patients",
    route: PatientRoutes,
  },
  {
    path: "/files",
    route: FileUploadRoutes,
  },
  {
    path: "/specialties",
    route: SpecialtyRoutes,
  },
  {
    path: "/schedules",
    route: ScheduleRoutes,
  },
  {
    path: "/doctor-schedules",
    route: DoctorScheduleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
