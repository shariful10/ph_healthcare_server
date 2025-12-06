import { Router } from "express";
import { AdminController } from "./admin.controller";
import { AdminValidations } from "./admin.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get("/", AdminController.getAllAdmins);

router.get("/:adminId", AdminController.getAdminById);

router.patch(
  "/:adminId",
  validateRequest(AdminValidations.updateAdminSchema),
  AdminController.updateAdminById
);

router.delete("/:adminId", AdminController.deleteAdminById);

router.delete("/soft-delete/:adminId", AdminController.softDeleteAdminById);

export const AdminRoutes = router;
