import catchAsync from "../../utils/catchAsync";
import { AdminService } from "./admin.service";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminService.getAllAdminsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admins are retrieved successfully!",
    meta: null,
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
};
