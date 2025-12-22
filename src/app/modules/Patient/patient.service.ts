import prisma from "../../utils/prisma";
import { IOptions } from "../../interface/pagination";
import { patientSearchableFields } from "./patient.constant";
import { Patient, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelper";

const getAllPatientsFromDB = async (
  query: Record<string, unknown>,
  options: IOptions
) => {
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.PatientWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm as string,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  andConditions.push({ isDeleted: false });

  const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };

  const patientInfo = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy as string]: options.sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.patient.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: patientInfo,
  };
};

const getPatientByIdFromDB = async (
  patientId: string
): Promise<Patient | null> => {
  await prisma.patient.findFirstOrThrow({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });

  const patientInfo = await prisma.patient.findUnique({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });

  return patientInfo;
};

const updatePatientByIdInToDB = async (
  patientId: string,
  payload: Partial<Patient>
): Promise<Patient> => {
  await prisma.patient.findFirstOrThrow({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });

  const patientInfo = await prisma.patient.update({
    where: {
      id: patientId,
    },
    data: payload,
  });

  return patientInfo;
};

const deletePatientByIdFromDB = async (
  patientId: string
): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });

  const patientInfo = await prisma.$transaction(async (tx) => {
    const deletedData = await tx.patient.delete({
      where: {
        id: patientId,
        isDeleted: false,
      },
    });

    await tx.user.delete({
      where: {
        email: deletedData.email,
      },
    });

    return deletedData;
  });

  return patientInfo;
};

const softDeletePatientByIdFromDB = async (
  patientId: string
): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });

  const patientInfo = await prisma.$transaction(async (tx) => {
    const deletedData = await tx.patient.update({
      where: {
        id: patientId,
      },
      data: {
        isDeleted: true,
      },
    });

    await tx.user.update({
      where: {
        email: deletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedData;
  });

  return patientInfo;
};

export const PatientService = {
  getAllPatientsFromDB,
  getPatientByIdFromDB,
  updatePatientByIdInToDB,
  deletePatientByIdFromDB,
  softDeletePatientByIdFromDB,
};
