import prisma from "../../utils/prisma";
import { IOptions } from "../../interface/pagination";
import { adminSearchableFields } from "./admin.constant";
import { Admin, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelper";

// Get all admins
const getAllAdminsFromDB = async (
  query: Record<string, unknown>,
  options: IOptions
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

  andConditions.push({ isDeleted: false });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const adminInfo = await prisma.admin.findMany({
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
    data: adminInfo,
  };
};

// Get admin by ID
const getAdminByIdFromDB = async (adminId: string): Promise<Admin | null> => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });

  const adminInfo = await prisma.admin.findUnique({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });

  return adminInfo;
};

// Update admin by ID
const updateAdminByIdInToDB = async (
  adminId: string,
  payload: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });

  const adminInfo = await prisma.admin.update({
    where: { id: adminId },
    data: payload,
  });

  return adminInfo;
};

// Delete admin by ID
const deleteAdminByIdFromDB = async (
  adminId: string
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });

  const adminInfo = await prisma.$transaction(async (tx) => {
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

  return adminInfo;
};

// Soft delete admin by ID
const softDeleteAdminByIdFromDB = async (
  adminId: string
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });

  const adminInfo = await prisma.$transaction(async (tx) => {
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

  return adminInfo;
};

export const AdminService = {
  getAllAdminsFromDB,
  getAdminByIdFromDB,
  updateAdminByIdInToDB,
  deleteAdminByIdFromDB,
  softDeleteAdminByIdFromDB,
};
