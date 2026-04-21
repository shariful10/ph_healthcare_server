import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../utils/httpStatus";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req, res) => {
  const id = req.user.id;
  const result = await AppointmentService.createAppointmentInToDB(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Appointment created successfully",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
};
