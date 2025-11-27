import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../utils/httpStatus";
import { adminSearchableFields } from "./admin.constant";
import { paginationHelper } from "../../helpers/paginationHelper";

const getAllAdminsFromDB = async (
  query: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.AdminWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
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

  const total = await prisma.admin.count({ where: whereConditions });

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

const getAdminByIdFromDB = async (adminId: string) => {
  const result = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Admin with ID: ${adminId} not found`
    );
  }

  return result;
};

export const AdminService = {
  getAllAdminsFromDB,
  getAdminByIdFromDB,
};
