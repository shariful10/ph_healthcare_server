import config from "../../config";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../utils/httpStatus";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createAdminIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Admin created successfully!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const result = await UserService.createDoctorIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Doctor created successfully!",
    data: result,
  });
});

const createPatient = catchAsync(async (req, res) => {
  const result = await UserService.createPatientIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Patient created successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully!",
    data: result,
  });
});

const getSingleUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await UserService.getSingleUserByIdFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User retrieved successfully!",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.body;

  const result = await UserService.changeProfileStatusIntoDB(userId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User status updated successfully!",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  createAdmin,
  createDoctor,
  createPatient,
  getSingleUserById,
  changeProfileStatus,
};
