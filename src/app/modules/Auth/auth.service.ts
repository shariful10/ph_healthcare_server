import config from "../../config";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../utils/httpStatus";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { passwordCompare } from "../../helpers/comparePasswords";
import { UserStatus } from "@prisma/client";

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatched = await passwordCompare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZE, "Password is incorrect!");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh.secret as string,
    config.jwt.refresh.expiresIn as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZE, "You are not authorized!");
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
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  return {
    accessToken,
    needPasswordChange: isUserExist.needPasswordChange,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
