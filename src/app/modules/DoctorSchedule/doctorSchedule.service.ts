import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { IOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";

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

const getMySchedulesFromDB = async (
  query: Record<string, unknown>,
  options: IOptions,
  email: string,
) => {
  const { startDate, endDate, ...filterData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  console.log(startDate, endDate);

  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate as string,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate as string,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    AND: andConditions,
  };

  const scheduleInfo = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    include: {
      schedule: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy as string]: options.sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.doctorSchedule.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: scheduleInfo,
  };
};

export const DoctorScheduleService = {
  getMySchedulesFromDB,
  createDoctorScheduleInToDB,
};
