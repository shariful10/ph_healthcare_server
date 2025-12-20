import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { SpecialtyValidations } from "./specialty.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(SpecialtyValidations.createSpecialtySchema),
  SpecialtyController.insertSpecialty
);

router.get("/", SpecialtyController.getAllSpecialties);

router.get("/:specialtyId", SpecialtyController.getSpecialtyById);

export const SpecialtyRoutes = router;
