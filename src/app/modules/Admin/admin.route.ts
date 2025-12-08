import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AdminController } from "./admin.controller";
import { AdminValidations } from "./admin.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getAllAdmins
);

router.get(
  "/:adminId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getAdminById
);

router.patch(
  "/:adminId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AdminValidations.updateAdminSchema),
  AdminController.updateAdminById
);

router.delete(
  "/:adminId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.deleteAdminById
);

router.delete(
  "/soft-delete/:adminId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.softDeleteAdminById
);

export const AdminRoutes = router;
