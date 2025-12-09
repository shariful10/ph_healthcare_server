import { z } from "zod";

const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({ required_error: "Old password is required" })
      .min(6, {
        message: "Old password must be at least 6 characters long",
      }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, { message: "New password must be at least 6 characters long" }),
  }),
});

const resetPasswordSchema = z.object({
  body: z
    .object({
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match!",
      path: ["confirmPassword"],
    }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
  }),
});

const resendConfirmationLinkSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
  }),
});

export const AuthValidations = {
  loginSchema,
  resetPasswordSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resendConfirmationLinkSchema,
};
