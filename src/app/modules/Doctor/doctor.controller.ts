import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import { DoctorService } from "./doctor.service";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { metaFields } from "../../interface/metaFields";
import { doctorFilterableFields } from "./doctor.constant";

const getAllDoctors = catchAsync(async (req, res) => {
  const query = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, metaFields);

  const result = await DoctorService.getAllDoctorsFromDB(query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctors are retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getDoctorById = catchAsync(async (req, res) => {
  const { doctorId } = req.params;

  const result = await DoctorService.getDoctorByIdFromDB(doctorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor is retrieved successfully!",
    data: result,
  });
});

const updateDoctorById = catchAsync(async (req, res) => {
  const { doctorId } = req.params;
  const payload = req.body;

  const result = await DoctorService.updateDoctorByIdInToDB(doctorId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor is updated successfully!",
    data: result,
  });
});

const deleteDoctorById = catchAsync(async (req, res) => {
  const { doctorId } = req.params;

  await DoctorService.deleteDoctorByIdFromDB(doctorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor is deleted successfully!",
  });
});

const softDeleteDoctorById = catchAsync(async (req, res) => {
  const { doctorId } = req.params;

  await DoctorService.softDeleteDoctorByIdFromDB(doctorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Doctor is soft deleted successfully!",
  });
});

export const DoctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  softDeleteDoctorById,
};
