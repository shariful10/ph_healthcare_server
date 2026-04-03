import prisma from "../../utils/prisma";
import { Appointment } from "@prisma/client";

const createAppointmentInToDB = async (payload: Appointment, email: string) => {
  const patientData = await prisma.patient.findFirstOrThrow({
    where: {
      user: {
        email,
      },
    },
  });

  console.log("PatientData: =>", patientData);
};

export const AppointmentService = {
  createAppointmentInToDB,
};
