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

  const doctorData = await prisma.doctor.findFirstOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  const doctorScheduleData = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  console.log("PatientData: =>", patientData);
  console.log("DoctorData: =>", doctorData);
  console.log("DoctorScheduleData: =>", doctorScheduleData);
  console.log("payload: =>", payload);
};

export const AppointmentService = {
  createAppointmentInToDB,
};
