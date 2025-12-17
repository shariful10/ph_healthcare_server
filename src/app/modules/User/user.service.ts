import {
  Admin,
  Doctor,
  Patient,
  User,
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
import { hashPassword } from "../../helpers/hashPassword";

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

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const getSingleUserByIdFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with this ID: ${userId} not found!`
    );
  }

  const { password, ...rest } = user;

  return rest;
};

const changeProfileStatusIntoDB = async (
  userId: string,
  status: UserStatus
) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId, status: UserStatus.ACTIVE },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with this ID: ${userId} not found!`
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status,
    },
  });

  return updatedUser;
};

export const UserService = {
  getAllUsersFromDB,
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getSingleUserByIdFromDB,
  changeProfileStatusIntoDB,
};
