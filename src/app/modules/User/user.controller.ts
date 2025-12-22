import pick from "../../shared/pick";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../utils/httpStatus";
import { metaFields } from "../../interface/metaFields";
import { userFilterableFields } from "./user.constants";

// Create Admin User
const createAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createAdminIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Admin created successfully.",
    data: result,
  });
});

// Create Doctor User
const createDoctor = catchAsync(async (req, res) => {
  const result = await UserService.createDoctorIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Doctor created successfully.",
    data: result,
  });
});

// Create Patient User
const createPatient = catchAsync(async (req, res) => {
  const result = await UserService.createPatientIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Patient created successfully.",
    data: result,
  });
});

// Get All Users
const getAllUsers = catchAsync(async (req, res) => {
  const query = pick(req.query, userFilterableFields);
  const options = pick(req.query, metaFields);

  const result = await UserService.getAllUsersFromDB(query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

// Get User By ID
const getSingleUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await UserService.getSingleUserByIdFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User retrieved successfully.",
    data: result,
  });
});

// Change User Status
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

// Get My Profile
const getMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserService.getMyProfileFromDB(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "My profile retrieved successfully!",
    data: result,
  });
});

// Update My Profile
const updateMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user;
  const Payload = req.body;

  const result = await UserService.updateMyProfileInDB(email, Payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "My profile updated successfully!",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  createAdmin,
  createDoctor,
  getMyProfile,
  createPatient,
  updateMyProfile,
  changeUserStatus,
  getSingleUserById,
};
