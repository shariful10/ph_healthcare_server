import { z } from "zod";

const createAdminSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: "Password is required.",
        invalid_type_error: "Password must be a string.",
      })
      .min(6, "Password must be at least 6 characters long."),
    admin: z.object({
      name: z.string({
        required_error: "Name is required.",
        invalid_type_error: "Name must be a string.",
      }),
      email: z
        .string({
          required_error: "Email is required.",
          invalid_type_error: "Email must be a string.",
        })
        .email("Invalid email address."),
      contactNumber: z.string({
        required_error: "Contact number is required.",
        invalid_type_error: "Contact number must be a string.",
      }),
    }),
  }),
});

export const UserValidations = {
  createAdminSchema,
};
