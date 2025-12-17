import pick from "../../shared/pick";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../utils/httpStatus";
import { metaFields } from "../../interface/metaFields";
import { userFilterableFields } from "./user.constants";

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
  const query = pick(req.query, userFilterableFields);
  const options = pick(req.query, metaFields);

  const result = await UserService.getAllUsersFromDB(query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
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

const changeUserStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const { userId } = req.params;

  const result = await UserService.changeUserStatusIntoDB(userId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User status updated successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserService.getMyProfileFromDB(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "My profile retrieved successfully!",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  createAdmin,
  createDoctor,
  getMyProfile,
  createPatient,
  changeUserStatus,
  getSingleUserById,
};
