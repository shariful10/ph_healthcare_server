import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelper";
import { IOptions } from "../../interface/pagination";
import prisma from "../../utils/prisma";
import { patientSearchableFields } from "./patient.constant";

const getAllPatientsFromDB = async (
  query: Record<string, unknown>,
  options: IOptions
) => {
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.PatientWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };

  const result = await prisma.patient.findMany({
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

  const total = await prisma.patient.count({ where: whereConditions });

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

export const PatientService = {
  getAllPatientsFromDB,
};
