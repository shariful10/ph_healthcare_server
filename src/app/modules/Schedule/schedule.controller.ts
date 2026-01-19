import pick from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import { httpStatus } from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { ScheduleService } from "./schedule.service";
import { metaFields } from "../../interface/metaFields";

const createSchedule = catchAsync(async (req, res) => {
  const result = await ScheduleService.createScheduleInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const query = pick(req.query, ["startDateTime", "endDateTime"]);
  const options = pick(req.query, metaFields);

  const result = await ScheduleService.getAllSchedulesFromDB(query, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Schedules are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
};
