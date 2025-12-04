import prisma from "../../utils/prisma";
import { Admin, Prisma, UserStatus } from "@prisma/client";
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
  await prisma.admin.findFirstOrThrow({
    where: { id: adminId },
  });

  const result = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  return result;
};

const updateAdminByIdInToDB = async (
  adminId: string,
  payload: Partial<Admin>
) => {
  await prisma.admin.findFirstOrThrow({
    where: { id: adminId },
  });

  const result = await prisma.admin.update({
    where: { id: adminId },
    data: payload,
  });

  return result;
};

const deleteAdminByIdFromDB = async (adminId: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id: adminId },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedData = await tx.admin.delete({
      where: { id: adminId },
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

const softDeleteAdminByIdFromDB = async (adminId: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id: adminId },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedData = await tx.admin.update({
      where: {
        id: adminId,
      },
      data: {
        isDeleted: true,
      },
    });

    await tx.user.update({
      where: {
        email: deletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedData;
  });

  return result;
};

export const AdminService = {
  getAllAdminsFromDB,
  getAdminByIdFromDB,
  updateAdminByIdInToDB,
  deleteAdminByIdFromDB,
  softDeleteAdminByIdFromDB,
};
