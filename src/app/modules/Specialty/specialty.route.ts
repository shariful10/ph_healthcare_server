import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { SpecialtyValidations } from "./specialty.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(SpecialtyValidations.specialtySchema),
  SpecialtyController.insertSpecialty
);

export const SpecialtyRoutes = router;
