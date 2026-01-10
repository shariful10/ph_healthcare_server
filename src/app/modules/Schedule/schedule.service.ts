import { addHours, format } from "date-fns";
import prisma from "../../utils/prisma";
import { Schedule } from "@prisma/client";
import { ISchedule } from "./schedule.interface";

const createScheduleInToDB = async (payload: ISchedule): Promise<any> => {
  const { startDate, endDate, startTime, endTime } = payload;

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
        `${format(endDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );

    while (startDateTime <= endDateTime) {}

    console.log("Start DateTime:", startDateTime);
    console.log("End DateTime:", endDateTime);
  }
  // TODO: Implement database creation logic
  // const result = await prisma.schedule.create({
  //   data: null,
  // });
  // return result;
};

export const ScheduleService = {
  createScheduleInToDB,
};
