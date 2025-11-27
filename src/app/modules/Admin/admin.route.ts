import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmins);

router.get("/:adminId", AdminController.getAdminById);

export const AdminRoutes = router;
