import prisma from "../../utils/prisma";
import { Prisma, Specialties } from "@prisma/client";
import { IOptions } from "../../interface/pagination";
import { specialtySearchableFields } from "./specialty.constant";
import { paginationHelper } from "../../helpers/paginationHelper";

// Create Specialty
const createSpecialtyInToDB = async (payload: Specialties) => {
  const result = await prisma.specialties.create({
    data: payload,
  });

  return result;
};

// Get All Specialties
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

// Get Specialty by ID
const getSpecialtyByIdFromDB = async (specialtyId: string) => {
  const result = await prisma.specialties.findUniqueOrThrow({
    where: {
      id: specialtyId,
    },
  });

  return result;
};

// Update Specialty by ID
const updateSpecialtyInToDB = async (
  specialtyId: string,
  payload: Partial<Specialties>
) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id: specialtyId,
    },
  });

  const result = await prisma.specialties.update({
    where: { id: specialtyId },
    data: payload,
  });

  return result;
};

// Delete Specialty by ID
const deleteSpecialtyByIdFromDB = async (specialtyId: string) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id: specialtyId,
    },
  });

  await prisma.specialties.delete({
    where: {
      id: specialtyId,
    },
  });

  return;
};

export const SpecialtyService = {
  createSpecialtyInToDB,
  updateSpecialtyInToDB,
  getSpecialtyByIdFromDB,
  getAllSpecialtiesFromDB,
  deleteSpecialtyByIdFromDB,
};
