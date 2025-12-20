import prisma from "../../utils/prisma";
import { Doctor, Prisma } from "@prisma/client";
import { IOptions } from "../../interface/pagination";
import { doctorSearchableFields } from "./doctor.constant";
import { paginationHelper } from "../../helpers/paginationHelper";

const getAllDoctorsFromDB = async (
  query: Record<string, unknown>,
  options: IOptions
) => {
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm as string,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  andConditions.push({ isDeleted: false });

  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy as string]: options.sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.doctor.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getDoctorByIdFromDB = async (
  doctorId: string
): Promise<Doctor | null> => {
  await prisma.doctor.findFirstOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  return result;
};

const updateDoctorByIdInToDB = async (
  doctorId: string,
  payload: Partial<Doctor>
): Promise<Doctor> => {
  await prisma.doctor.findFirstOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  const result = await prisma.doctor.update({
    where: {
      id: doctorId,
    },
    data: payload,
  });

  return result;
};

const deleteDoctorByIdFromDB = async (
  doctorId: string
): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedData = await tx.doctor.delete({
      where: {
        id: doctorId,
        isDeleted: false,
      },
    });

    await tx.user.delete({
      where: {
        email: deletedData.email,
      },
    });

    return deletedData;
  });

  return result;
};

export const DoctorService = {
  getAllDoctorsFromDB,
  getDoctorByIdFromDB,
  updateDoctorByIdInToDB,
  deleteDoctorByIdFromDB,
};
