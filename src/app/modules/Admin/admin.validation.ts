import { z } from "zod";

const updateAdminSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Name must be a string",
      })
      .optional(),
    profilePhoto: z
      .string({ invalid_type_error: "Profile photo must be a string" })
      .optional(),
    contactNumber: z
      .string({
        invalid_type_error: "Contact number must be a string",
      })
      .optional(),
  }),
});

export const AdminValidations = {
  updateAdminSchema,
};
