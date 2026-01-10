import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";
import { Schedule } from "@prisma/client";
import { ISchedule } from "./schedule.interface";

const createScheduleInToDB = async (payload: ISchedule): Promise<any> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      )
    );

    const endDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );

    console.log("Start DateTime:", startDateTime);
    console.log("End DateTime:", endDateTime);

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };

      const result = await prisma.schedule.create({
        data: scheduleData,
      });
      schedules.push(result);

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;

  // TODO: Implement creation logic
};

export const ScheduleService = {
  createScheduleInToDB,
};
