import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmins);

router.get("/:adminId", AdminController.getAdminById);

router.patch("/:adminId", AdminController.updateAdminById);

router.delete("/:adminId", AdminController.deleteAdminById);

router.delete("/soft-delete/:adminId", AdminController.softDeleteAdminById);

export const AdminRoutes = router;
