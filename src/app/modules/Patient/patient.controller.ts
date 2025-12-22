import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import { PatientService } from "./patient.service";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { metaFields } from "../../interface/metaFields";
import { patientFilterableFields } from "./patient.constant";

const getAllPatients = catchAsync(async (req, res) => {
  const query = pick(req.query, patientFilterableFields);
  const options = pick(req.query, metaFields);

  const result = await PatientService.getAllPatientsFromDB(query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patients are retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const getPatientById = catchAsync(async (req, res) => {
  const { patientId } = req.params;

  const result = await PatientService.getPatientByIdFromDB(patientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient is retrieved successfully.",
    data: result,
  });
});

const updatePatientById = catchAsync(async (req, res) => {
  const { patientId } = req.params;
  const payload = req.body;

  const result = await PatientService.updatePatientByIdInToDB(
    patientId,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient is updated successfully.",
    data: result,
  });
});

const deletePatientById = catchAsync(async (req, res) => {
  const { patientId } = req.params;

  await PatientService.deletePatientByIdFromDB(patientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient is deleted successfully.",
  });
});

const softDeletePatientById = catchAsync(async (req, res) => {
  const { patientId } = req.params;

  await PatientService.softDeletePatientByIdFromDB(patientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient is deleted successfully.",
  });
});

export const PatientController = {
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
  softDeletePatientById,
};
