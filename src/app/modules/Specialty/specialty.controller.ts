import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { SpecialtyService } from "./specialty.service";
import { metaFields } from "../../interface/metaFields";
import { specialtyFilterableFields } from "./specialty.constant";

const createSpecialty = catchAsync(async (req, res) => {
  const result = await SpecialtyService.createSpecialtyInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty created successfully!",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req, res) => {
  const query = pick(req.query, specialtyFilterableFields);
  const options = pick(req.query, metaFields);

  const result = await SpecialtyService.getAllSpecialtiesFromDB(query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialties retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSpecialtyById = catchAsync(async (req, res) => {
  const { specialtyId } = req.params;

  const result = await SpecialtyService.getSpecialtyByIdFromDB(specialtyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty retrieved successfully!",
    data: result,
  });
});

const updateSpecialty = catchAsync(async (req, res) => {
  const { specialtyId } = req.params;
  const payload = req.body;

  const result = await SpecialtyService.updateSpecialtyInToDB(
    specialtyId,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty updated successfully!",
    data: result,
  });
});

const deleteSpecialty = catchAsync(async (req, res) => {
  const { specialtyId } = req.params;

  await SpecialtyService.deleteSpecialtyByIdFromDB(specialtyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty deleted successfully!",
  });
});

export const SpecialtyController = {
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  getSpecialtyById,
  getAllSpecialties,
};
