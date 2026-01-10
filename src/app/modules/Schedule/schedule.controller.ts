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

export const ScheduleController = {
  createSchedule,
};
