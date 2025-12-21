import z from "zod";

const updatePatientSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Name must be a string.",
      })
      .optional(),
    email: z
      .string({
        invalid_type_error: "Email must be a string.",
      })
      .email("Invalid email address.")
      .optional(),
    profilePhoto: z
      .string({ invalid_type_error: "Profile photo must be a string." })
      .optional(),
    contactNumber: z
      .string({
        invalid_type_error: "Contact number must be a string.",
      })
      .optional(),
    address: z
      .string({
        invalid_type_error: "Address must be a string.",
      })
      .optional(),
  }),
});

export const PatientValidations = {
  updatePatientSchema,
};
