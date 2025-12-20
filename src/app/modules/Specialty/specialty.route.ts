import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { SpecialtyValidations } from "./specialty.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(SpecialtyValidations.createSpecialtySchema),
  SpecialtyController.createSpecialty
);

router.get("/", SpecialtyController.getAllSpecialties);

router.get("/:specialtyId", SpecialtyController.getSpecialtyById);

router.patch(
  "/:specialtyId",
  validateRequest(SpecialtyValidations.updateSpecialtySchema),
  SpecialtyController.updateSpecialty
);

router.delete("/:specialtyId", SpecialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;
