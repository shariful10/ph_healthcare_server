import config from "../config";
import AppError from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { httpStatus } from "../utils/httpStatus";

export const verifyToken = (
  token: string,
  secret = config.jwt.access.secret as string
): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(httpStatus.UNAUTHORIZED, "JWT token is expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid JWT token");
    } else {
      throw new AppError(httpStatus.UNAUTHORIZED, "Failed to verify token");
    }
  }
};
