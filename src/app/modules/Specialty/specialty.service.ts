import { paginationHelper } from "../../helpers/paginationHelper";
import { IOptions } from "../../interface/pagination";
import prisma from "../../utils/prisma";
import { Prisma, Specialties } from "@prisma/client";
import { specialtySearchableFields } from "./specialty.constant";

const insertSpecialtyInToDB = async (payload: Specialties) => {
  const result = await prisma.specialties.create({
    data: payload,
  });

  return result;
};

const getAllSpecialtiesFromDB = async (
  query: Record<string, unknown>,
  options: IOptions
) => {
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.SpecialtiesWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: specialtySearchableFields.map((field) => ({
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

  const whereConditions: Prisma.SpecialtiesWhereInput = { AND: andConditions };

  const result = await prisma.specialties.findMany({
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

  const total = await prisma.specialties.count({ where: whereConditions });

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

const getSpecialtyByIdFromDB = async (specialtyId: string) => {
  const result = await prisma.specialties.findUniqueOrThrow({
    where: {
      id: specialtyId,
    },
  });

  return result;
};

export const SpecialtyService = {
  insertSpecialtyInToDB,
  getSpecialtyByIdFromDB,
  getAllSpecialtiesFromDB,
};
