import prisma from "../../utils/prisma";
import { Specialties } from "@prisma/client";

const insertSpecialtyInToDB = async (payload: Specialties) => {
  const result = await prisma.specialties.create({
    data: payload,
  });

  return result;
};

export const SpecialtyService = {
  insertSpecialtyInToDB,
};
