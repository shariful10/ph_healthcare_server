import prisma from "../../utils/prisma";

const getAllAdminsFromDB = async () => {
  const result = await prisma.admin.findMany();
  return result;
};

export const AdminService = {
  getAllAdminsFromDB,
};
