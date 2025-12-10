import { Gender } from "@prisma/client";
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
      profilePhoto: z
        .string({ invalid_type_error: "Profile photo must be a string." })
        .optional(),
      contactNumber: z.string({
        required_error: "Contact number is required.",
        invalid_type_error: "Contact number must be a string.",
      }),
    }),
  }),
});

const createDoctorSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: "Password is required.",
        invalid_type_error: "Password must be a string.",
      })
      .min(6, "Password must be at least 6 characters long."),
    doctor: z.object({
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
      profilePhoto: z
        .string({ invalid_type_error: "Profile photo must be a string." })
        .optional(),
      contactNumber: z.string({
        required_error: "Contact number is required.",
        invalid_type_error: "Contact number must be a string.",
      }),
      address: z
        .string({
          invalid_type_error: "Address must be a string.",
        })
        .optional(),
      registrationNumber: z.string({
        required_error: "Registration number is required.",
        invalid_type_error: "Registration number must be a string.",
      }),
      experience: z
        .number({
          invalid_type_error: "Experience must be a number.",
        })
        .optional()
        .default(0),
      gender: z.enum(Object.values(Gender) as [string, ...string[]], {
        required_error: "Gender is required.",
        invalid_type_error:
          "Gender must be one of 'MALE', 'FEMALE', or 'OTHER'.",
      }),
      appointmentFee: z.number({
        required_error: "Appointment fee is required.",
        invalid_type_error: "Appointment fee must be a number.",
      }),
      qualifications: z.string({
        required_error: "Qualifications are required.",
        invalid_type_error: "Qualifications must be a string.",
      }),
      currentWorkingPlace: z.string({
        required_error: "Current working place is required.",
        invalid_type_error: "Current working place must be a string.",
      }),
      designation: z.string({
        required_error: "Designation is required.",
        invalid_type_error: "Designation must be a string.",
      }),
    }),
  }),
});

export const UserValidations = {
  createAdminSchema,
  createDoctorSchema,
};
