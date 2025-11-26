import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmins);

router.post("/create-admin", AdminController.getAllAdmins);

export const AdminRoutes = router;
