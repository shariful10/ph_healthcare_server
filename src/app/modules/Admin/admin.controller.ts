import pick from "../../shared/pick";
import { AdminService } from "./admin.service";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { adminFilterableFields, metaFields } from "./admin.constant";

const getAllAdmins = catchAsync(async (req, res) => {
  const query = pick(req.query, adminFilterableFields);
  const options = pick(req.query, metaFields);

  const result = await AdminService.getAllAdminsFromDB(query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admins are retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { adminId } = req.params;

  const result = await AdminService.getAdminByIdFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admin is retrieved successfully!",
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getAdminById,
};
