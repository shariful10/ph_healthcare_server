import { AuthService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  const { accessToken, refreshToken, needPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // config.NODE_ENV === "production"
    sameSite: "lax", // config.NODE_ENV === "production" ? true : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Access token refreshed successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  await AuthService.changePassword(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password changed successfully!",
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  await AuthService.forgotPassword(req.body.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Password reset token sent to your email: ${req.body.email} successfully!`,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { newPassword } = req.body;
  const token = req.headers.authorization;

  await AuthService.resetPassword(token as string, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password reset successfully!",
  });
});

export const AuthController = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
