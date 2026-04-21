import prisma from "../../utils/prisma";
import { Appointment } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

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

  const videoCallingId = await uuidv4();

  console.log("PatientData: =>", patientData);
  console.log("DoctorData: =>", doctorData);
  console.log("DoctorScheduleData: =>", doctorScheduleData);
  console.log("payload: =>", payload);
  console.log("videoCallingId: =>", videoCallingId);
};

export const AppointmentService = {
  createAppointmentInToDB,
};
