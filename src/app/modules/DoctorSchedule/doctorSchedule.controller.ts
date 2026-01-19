import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { metaFields } from "../../interface/metaFields";
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

const getAllDoctorSchedules = catchAsync(async (req, res) => {
  // TODO: Implement filtering if needed
  // TODO: Implement pagination if needed
  // TODO: Implement sorting if needed
});

export const DoctorScheduleController = {
  createDoctorSchedule,
  getAllDoctorSchedules,
};
