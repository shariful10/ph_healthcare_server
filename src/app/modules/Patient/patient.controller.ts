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
    message: "Patients are retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const PatientController = {
  getAllPatients,
};
