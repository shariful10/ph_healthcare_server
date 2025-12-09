import config from "../../config";
import prisma from "../../utils/prisma";
import { UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { JwtPayload, Secret } from "jsonwebtoken";
import { TChangePassword } from "./auth.interface";
import { httpStatus } from "../../utils/httpStatus";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { hashPassword } from "../../helpers/hashPassword";
import { passwordCompare } from "../../helpers/comparePasswords";

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatched = await passwordCompare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect!");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access.secret as Secret,
    config.jwt.access.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh.secret as Secret,
    config.jwt.refresh.expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const decodedData = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh.secret as string
  );

  const isUserExist = await prisma.user.findFirstOrThrow({
    where: { email: decodedData.email },
  });

  const accessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.access.secret as Secret,
    config.jwt.access.expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: isUserExist.needPasswordChange,
  };
};

const changePassword = async (user: JwtPayload, payload: TChangePassword) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatched = await passwordCompare(
    payload.oldPassword,
    userData.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect!");
  }

  const hashedPassword = await hashPassword(payload.newPassword);

  await prisma.user.update({
    where: { id: userData.id },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const resetToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.resetPassword.secret as Secret,
    config.jwt.resetPassword.expires_in as string
  );

  const resetPassLink = `${config.verify.reset_pass_ui}?token=${resetToken}`;

  sendEmail(user.email, resetPassLink);
};

const resetPassword = async (token: string, newPassword: string) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid token!");
  }

  const validateToken = jwtHelpers.verifyToken(
    token,
    config.jwt.resetPassword.secret as Secret
  );

  if (!validateToken) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: validateToken.email,
      status: UserStatus.ACTIVE,
    },
  });

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return;
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
