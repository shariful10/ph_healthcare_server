import { z } from "zod";

const createAdminSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    }),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email("Invalid email format"),
    profilePhoto: z
      .string({ invalid_type_error: "Profile photo must be a string" })
      .optional(),
    contactNumber: z.string({
      required_error: "Contact number is required",
      invalid_type_error: "Contact number must be a string",
    }),
  }),
});

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
  createAdminSchema,
  updateAdminSchema,
};
