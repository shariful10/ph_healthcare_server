import pick from "../../shared/pick";
import { AdminService } from "./admin.service";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";

const getAllAdmins = catchAsync(async (req, res) => {
  const query = pick(req.query, [
    "name",
    "email",
    "searchTerm",
    "contactNumber",
  ]);
  const result = await AdminService.getAllAdminsFromDB(query);

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
