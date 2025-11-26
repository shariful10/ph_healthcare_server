import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm as string,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.searchTerm as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  console.dir(andConditions, { depth: Infinity });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereConditions,
  });

  return result;
};

export const AdminService = {
  getAllAdminsFromDB,
};
