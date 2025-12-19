import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { SpecialtyService } from "./specialty.service";

const insertSpecialty = catchAsync(async (req, res) => {
  const result = await SpecialtyService.insertSpecialtyInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty inserted successfully!",
    data: result,
  });
});

export const SpecialtyController = {
  insertSpecialty,
};
