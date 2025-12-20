import { metaFields } from "../../interface/metaFields";
import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
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

export const SpecialtyController = {
  insertSpecialty,
  getAllSpecialties,
};
