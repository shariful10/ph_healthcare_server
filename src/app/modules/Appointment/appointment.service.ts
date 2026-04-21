import prisma from "../../utils/prisma";
import { Appointment } from "@prisma/client";

const createAppointmentInToDB = async (payload: Appointment, id: string) => {
  const patientData = await prisma.patient.findFirstOrThrow({
    where: {
      user: {
        id,
      },
    },
  });

  console.log("PatientData: =>", patientData);
};

export const AppointmentService = {
  createAppointmentInToDB,
};
