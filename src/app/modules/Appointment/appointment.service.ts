import { Appointment } from "@prisma/client";

const createAppointmentInToDB = async (
  payload: Appointment,
  patientId: string,
) => {
  console.log("Appointment payload:", payload);
  console.log("Patient ID:", patientId);
};

export const AppointmentService = {
  createAppointmentInToDB,
};
