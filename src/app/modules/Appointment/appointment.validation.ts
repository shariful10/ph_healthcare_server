import z from "zod";

const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string({
      required_error: "Doctor ID is required.",
      invalid_type_error: "Doctor ID must be a string.",
    }),
    scheduleId: z.string({
      required_error: "Schedule ID is required.",
      invalid_type_error: "Schedule ID must be a string.",
    }),
    status: z
      .enum(["SCHEDULED", "INPROGRESS", "COMPLETED", "CANCELED"], {
        required_error: "Status is required.",
        invalid_type_error:
          "Status must be one of 'SCHEDULED', 'INPROGRESS', 'COMPLETED', or 'CANCELED'.",
      })
      .default("SCHEDULED")
      .optional(),
    paymentStatus: z
      .enum(["PAID", "UNPAID"], {
        required_error: "Payment status is required.",
        invalid_type_error:
          "Payment status must be one of 'PAID', or 'UNPAID'.",
      })
      .default("UNPAID")
      .optional(),
  }),
});

export const AppointmentValidations = {
  createAppointmentSchema,
};
