import { z } from "zod";

const specialtySchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Specialty title is required",
      invalid_type_error: "Specialty title must be a string",
    }),
    icon: z.string({
      required_error: "Specialty icon is required",
      invalid_type_error: "Specialty icon must be a string",
    }),
  }),
});

export const SpecialtyValidations = {
  specialtySchema,
};
