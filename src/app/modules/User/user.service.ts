import {
  Admin,
  Doctor,
  Prisma,
  Patient,
  UserRole,
  UserStatus,
} from "@prisma/client";
import {
  IAdminPayload,
  IDoctorPayload,
  IPatientPayload,
} from "./user.interface";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../utils/httpStatus";
import { IOptions } from "../../interface/pagination";
import { userSearchableFields } from "./user.constants";
import { hashPassword } from "../../helpers/hashPassword";
import { paginationHelper } from "../../helpers/paginationHelper";

const createAdminIntoDB = async (payload: IAdminPayload): Promise<Admin> => {
  const isUserExistByEmail = await prisma.user.findUnique({
    where: { email: payload.admin.email },
  });

  if (isUserExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Admin with email: ${payload.admin.email} already exists!`
    );
  }

  const isAdminExistByEmail = await prisma.admin.findUnique({
    where: { email: payload.admin.email },
  });

  if (isAdminExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Admin with email: ${payload.admin.email} already exists!`
    );
  }

  const hashedPassword = await hashPassword(payload.password);

  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const createAdmin = await tx.admin.create({
      data: payload.admin,
    });

    return createAdmin;
  });

  return result;
};

const createDoctorIntoDB = async (payload: IDoctorPayload): Promise<Doctor> => {
  const isUserExistByEmail = await prisma.user.findUnique({
    where: { email: payload.doctor.email },
  });

  if (isUserExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Doctor with email: ${payload.doctor.email} already exists!`
    );
  }

  const isDoctorExistByEmail = await prisma.doctor.findUnique({
    where: { email: payload.doctor.email },
  });

  if (isDoctorExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Doctor with email: ${payload.doctor.email} already exists!`
    );
  }

  const hashedPassword = await hashPassword(payload.password);

  const userData = {
    email: payload.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const createDoctor = await tx.doctor.create({
      data: payload.doctor,
    });

    return createDoctor;
  });

  return result;
};

const createPatientIntoDB = async (
  payload: IPatientPayload
): Promise<Patient> => {
  const isUserExistByEmail = await prisma.user.findUnique({
    where: { email: payload.patient.email },
  });

  if (isUserExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Patient with email: ${payload.patient.email} already exists!`
    );
  }

  const isPatientExistByEmail = await prisma.patient.findUnique({
    where: { email: payload.patient.email },
  });

  if (isPatientExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Patient with email: ${payload.patient.email} already exists!`
    );
  }

  const hashedPassword = await hashPassword(payload.password);

  const userData = {
    email: payload.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const createPatient = await tx.patient.create({
      data: payload.patient,
    });

    return createPatient;
  });

  return result;
};

const getAllUsersFromDB = async (
  query: Record<string, unknown>,
  options: IOptions
) => {
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy as string]: options.sortOrder,
          }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      admin: true,
      doctor: true,
      patient: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({ where: whereConditions });

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

const getSingleUserByIdFromDB = async (userId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userInfo) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with this ID: ${userId} not found!!!!`
    );
  }

  const { password, ...rest } = userInfo;

  return rest;
};

const changeUserStatusIntoDB = async (userId: string, status: UserStatus) => {
  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const getMyProfileFromDB = async (email: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
    },
  });

  let profileInfo;

  if (
    userInfo.role === UserRole.SUPER_ADMIN ||
    userInfo.role === UserRole.ADMIN
  ) {
    profileInfo = await prisma.admin.findUnique({
      where: { email },
    });
  }

  if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: { email },
    });
  }

  if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: { email },
    });
  }

  return {
    ...userInfo,
    ...profileInfo,
  };
};

export const UserService = {
  getAllUsersFromDB,
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getMyProfileFromDB,
  changeUserStatusIntoDB,
  getSingleUserByIdFromDB,
};
