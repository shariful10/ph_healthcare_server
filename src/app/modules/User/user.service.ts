import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import { AdminPayload } from "./user.interface";
import { User, UserRole } from "@prisma/client";
import { httpStatus } from "../../utils/httpStatus";
import QueryBuilder from "../../builder/QueryBuilder";
import { hashPassword } from "../../helpers/hashPassword";

const createAdminIntoDB = async (payload: AdminPayload) => {
  const isUserExistByEmail = await prisma.user.findUnique({
    where: { email: payload.admin.email },
  });

  if (isUserExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User with this email: ${payload.admin.email} already exists!`
    );
  }

  const isAdminExistByEmail = await prisma.admin.findUnique({
    where: { email: payload.admin.email },
  });

  if (isAdminExistByEmail) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Admin with this email: ${payload.admin.email} already exists!`
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

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(prisma.user, query)
    .search(["fullName", "email"])
    .select(["-password"])
    .paginate();

  const [result, meta] = await Promise.all([
    userQuery.execute(),
    userQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Remove password from each user
  const data = result.map((user: User) => {
    const { password, ...rest } = user;
    return rest;
  });

  return {
    meta,
    data,
  };
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
  getAllUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getSingleUserByIdFromDB,
};
