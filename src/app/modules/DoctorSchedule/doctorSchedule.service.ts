import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelper";
import { IOptions } from "../../interface/pagination";
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

const getAllDoctorSchedulesFromDB = async (
  query: Record<string, unknown>,
  options: IOptions
) => {
  // TODO: Implement logic here
  // const { searchTerm, ...filterData } = query;
  // const { page, limit, skip } = paginationHelper.calculatePagination(options);
  // const andConditions: Prisma.ScheduleWhereInput[] = [];
  // if (Object.keys(filterData).length > 0) {
  //   andConditions.push({
  //     AND: Object.keys(filterData).map((key) => ({
  //       [key]: {
  //         equals: filterData[key],
  //       },
  //     })),
  //   });
  // }
  // const whereConditions: Prisma.ScheduleWhereInput = { AND: andConditions };
  // const scheduleInfo = await prisma.schedule.findMany({
  //   where: whereConditions,
  //   skip,
  //   take: limit,
  //   orderBy:
  //     options.sortBy && options.sortOrder
  //       ? {
  //           [options.sortBy as string]: options.sortOrder,
  //         }
  //       : { createdAt: "desc" },
  // });
  // const total = await prisma.schedule.count({ where: whereConditions });
  // return {
  //   meta: {
  //     page,
  //     limit,
  //     total,
  //     totalPages: Math.ceil(total / limit),
  //   },
  //   data: scheduleInfo,
  // };
};

export const DoctorScheduleService = {
  createDoctorScheduleInToDB,
  getAllDoctorSchedulesFromDB,
};
