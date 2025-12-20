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

export const DoctorController = {
  getAllDoctors,
};
