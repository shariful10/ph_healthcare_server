import prisma from "../../utils/prisma";

const createDoctorScheduleInToDB = async (email: string, payload: string[]) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const doctorScheduleData = payload.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });

  return result;
};

export const DoctorScheduleService = {
  createDoctorScheduleInToDB,
};
