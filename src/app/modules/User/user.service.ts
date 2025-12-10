import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import { User, UserRole } from "@prisma/client";
import { httpStatus } from "../../utils/httpStatus";
import { existingUser } from "../../utils/existingUser";
import { hashPassword } from "../../helpers/hashPassword";
import { IAdminPayload, IDoctorPayload } from "./user.interface";

const createAdminIntoDB = async (payload: IAdminPayload) => {
  const isUserExistByEmail = await prisma.user.findUnique({
    where: { email: payload.admin.email },
  });

  if (isUserExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      existingUser(payload.admin.email)
    );
  }

  const isAdminExistByEmail = await prisma.admin.findUnique({
    where: { email: payload.admin.email },
  });

  if (isAdminExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      existingUser(payload.admin.email, "Admin")
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

const createDoctorIntoDB = async (payload: IDoctorPayload) => {
  const isUserExistByEmail = await prisma.user.findUnique({
    where: { email: payload.doctor.email },
  });

  if (isUserExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      existingUser(payload.doctor.email)
    );
  }

  const isAdminExistByEmail = await prisma.admin.findUnique({
    where: { email: payload.doctor.email },
  });

  if (isAdminExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      existingUser(payload.doctor.email, "Admin")
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

const updateUserIntoDB = async (userId: string, payload: Partial<User>) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with this ID: ${userId} not found!`
    );
  }

  // const updatedUser = await prisma.user.update({
  //   where: { id: userId },
  //   data: {
  //     name: payload.name,
  //     profilePic: payload.profilePic || "",
  //   },
  //   select: {
  //     id: true,
  //     name: true,
  //     email: true,
  //     profilePic: true,
  //     role: true,
  //     isVerified: true,
  //     createdAt: true,
  //     updatedAt: true,
  //   },
  // });

  return null;
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

const deleteUserFromDB = async (userId: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with this ID: ${userId} not found!`
    );
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return null;
};

export const UserService = {
  createAdminIntoDB,
  createDoctorIntoDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getSingleUserByIdFromDB,
};
