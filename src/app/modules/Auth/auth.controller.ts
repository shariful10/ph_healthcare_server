import { httpStatus } from "../../utils/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

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

export const AuthController = {
  login,
};
