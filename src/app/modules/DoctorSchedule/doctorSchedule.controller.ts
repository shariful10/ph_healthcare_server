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
    req.body.scheduleIds,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Doctor schedule created successfully",
    data: result,
  });
});

const getMySchedules = catchAsync(async (req, res) => {
  const email = req.user.email;
  const options = pick(req.query, metaFields);
  const query = pick(req.query, ["startDate", "endDate", "isBooked"]);

  const result = await DoctorScheduleService.getMySchedulesFromDB(
    query,
    options,
    email,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "My Schedules are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const DoctorScheduleController = {
  createDoctorSchedule,
  getMySchedules,
};
