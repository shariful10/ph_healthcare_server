import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";

const createDoctorSchedule = catchAsync(async (req, res) => {
  const result = await DoctorScheduleService.createDoctorScheduleInToDB(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Doctor schedule created successfully",
    data: result,
  });
});

export const DoctorScheduleController = {
  createDoctorSchedule,
};
