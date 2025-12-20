import { metaFields } from "../../interface/metaFields";
import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import prisma from "../../utils/prisma";
import sendResponse from "../../utils/sendResponse";
import { specialtyFilterableFields } from "./specialty.constant";
import { SpecialtyService } from "./specialty.service";

const insertSpecialty = catchAsync(async (req, res) => {
  const result = await SpecialtyService.insertSpecialtyInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty inserted successfully!",
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
  const specialtyId = req.params.specialtyId;

  const result = await SpecialtyService.getSpecialtyByIdFromDB(specialtyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty retrieved successfully!",
    data: result,
  });
});

export const SpecialtyController = {
  insertSpecialty,
  getSpecialtyById,
  getAllSpecialties,
};
