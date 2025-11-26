import prisma from "../../utils/prisma";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const result = await prisma.admin.findMany({
    where: {
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
    },
  });
  return result;
};

export const AdminService = {
  getAllAdminsFromDB,
};
