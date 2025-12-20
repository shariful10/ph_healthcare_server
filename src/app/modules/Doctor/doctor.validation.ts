import z from "zod";
import { Gender } from "@prisma/client";

const updateDoctorSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Name must be a string",
      })
      .optional(),
    email: z
      .string({
        invalid_type_error: "Email must be a string",
      })
      .email("Invalid email address")
      .optional(),
    profilePhoto: z
      .string({
        invalid_type_error: "Profile Photo must be a string URL",
      })
      .optional(),
    contactNumber: z
      .string({
        invalid_type_error: "Contact Number must be a string",
      })
      .optional(),
    address: z
      .string({
        invalid_type_error: "Address must be a string",
      })
      .optional(),
    registrationNumber: z
      .string({
        invalid_type_error: "Registration Number must be a string",
      })
      .optional(),
    experience: z
      .number({
        invalid_type_error: "Experience must be a number",
      })
      .optional()
      .default(0),
    gender: z
      .enum(Object.values(Gender) as [string, ...string[]], {
        invalid_type_error:
          "Gender must be one of 'MALE', 'FEMALE', or 'OTHER'.",
      })
      .optional(),
    appointmentFee: z
      .number({
        invalid_type_error: "Appointment Fee must be a number",
      })
      .optional(),
    qualifications: z
      .string({
        invalid_type_error: "Qualifications must be a string",
      })
      .optional(),
    currentWorkingPlace: z
      .string({
        invalid_type_error: "Current Working Place must be a string",
      })
      .optional(),
    designation: z
      .string({
        invalid_type_error: "Designation must be a string",
      })
      .optional(),
  }),
});

export const DoctorValidations = {
  updateDoctorSchema,
};
