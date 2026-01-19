import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";

const createDoctorSchedule = catchAsync(async (req, res) => {
  const email = req.user.email;

  const result = await DoctorScheduleService.createDoctorScheduleInToDB(
    email,
    req.body.scheduleIds
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
