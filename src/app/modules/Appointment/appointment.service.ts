import { v4 as uuidv4 } from "uuid";
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

  await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId: string = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        videoCallingId,
        doctorId: doctorData.id,
        patientId: patientData.id,
        scheduleId: payload.scheduleId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    return appointmentData;
  });

  return result;
};

export const AppointmentService = {
  createAppointmentInToDB,
};
