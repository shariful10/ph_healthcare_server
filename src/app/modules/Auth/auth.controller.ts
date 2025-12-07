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

  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   secure: false, // config.NODE_ENV === "production"
  //   sameSite: "lax", // config.NODE_ENV === "production" ? true : "lax",
  //   maxAge: 24 * 60 * 60 * 1000,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Access token refreshed successfully!",
    data: result,
  });
});

export const AuthController = {
  login,
  refreshToken,
};
