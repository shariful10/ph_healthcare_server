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
  const email = req.user.email;
  const options = pick(req.query, metaFields);
  const query = pick(req.query, ["startDate", "endDate"]);

  const result = await ScheduleService.getAllSchedulesFromDB(
    query,
    options,
    email,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Schedules are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getScheduleByID = catchAsync(async (req, res) => {
  const { scheduleId } = req.params;

  const result = await ScheduleService.getScheduleByIdFromDB(scheduleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Schedule retrieved successfully",
    data: result,
  });
});

const deleteScheduleById = catchAsync(async (req, res) => {
  const { scheduleId } = req.params;

  await ScheduleService.deleteScheduleByIdFromDB(scheduleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Schedule deleted successfully",
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getScheduleByID,
  deleteScheduleById,
};
