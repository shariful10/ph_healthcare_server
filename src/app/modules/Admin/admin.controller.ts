import pick from "../../shared/pick";
import { AdminService } from "./admin.service";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { metaFields } from "../../interface/metaFields";
import { adminFilterableFields } from "./admin.constant";

// Get all admins
const getAllAdmins = catchAsync(async (req, res) => {
  const query = pick(req.query, adminFilterableFields);
  const options = pick(req.query, metaFields);

  const result = await AdminService.getAllAdminsFromDB(query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admins are retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

// Get admin by ID
const getAdminById = catchAsync(async (req, res) => {
  const { adminId } = req.params;

  const result = await AdminService.getAdminByIdFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admin is retrieved successfully.",
    data: result,
  });
});

// Update admin by ID
const updateAdminById = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const payload = req.body;

  const result = await AdminService.updateAdminByIdInToDB(adminId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admin is updated successfully.",
    data: result,
  });
});

// Delete admin by ID
const deleteAdminById = catchAsync(async (req, res) => {
  const { adminId } = req.params;

  await AdminService.deleteAdminByIdFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admin is deleted successfully.",
  });
});

// Soft delete admin by ID
const softDeleteAdminById = catchAsync(async (req, res) => {
  const { adminId } = req.params;

  await AdminService.softDeleteAdminByIdFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Admin is deleted successfully.",
  });
});

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
