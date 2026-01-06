import prisma from "../../utils/prisma";
import { IPatient } from "./patient.interface";
import { IOptions } from "../../interface/pagination";
import { patientSearchableFields } from "./patient.constant";
import { Prisma, Patient, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelper";

// Get All Patients
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
    include: {
      patientHealthRecord: true,
      medicalReports: true,
    },
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

// Get Patient by ID
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
    include: {
      patientHealthRecord: true,
      medicalReports: true,
    },
  });

  return patientInfo;
};

// Update Patient by ID
const updatePatientByIdInToDB = async (
  patientId: string,
  payload: Partial<IPatient>
): Promise<Patient | null> => {
  const { patientHealthRecord, medicalReports, ...patientData } = payload;

  const patientInfo = await prisma.patient.findFirstOrThrow({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    // Update the basic info of the patient if provided
    await tx.patient.update({
      where: {
        id: patientInfo.id,
      },
      data: patientData,
      include: {
        patientHealthRecord: true,
        medicalReports: true,
      },
    });

    // Create or update patient health record if provided
    if (patientHealthRecord) {
      await tx.patientHealthRecord.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthRecord,
        create: {
          ...patientHealthRecord,
          patientId: patientInfo.id,
        },
      });
    }

    // Create new medical reports if provided
    if (medicalReports) {
      // Filter out reports that don't have required fields
      const validReports = medicalReports.filter(
        (report) => report.reportName && report.reportLink
      );

      if (validReports.length > 0) {
        await tx.medicalReport.createMany({
          data: validReports.map((report) => ({
            reportName: report.reportName!,
            reportLink: report.reportLink!,
            patientId: patientInfo.id,
          })),
          skipDuplicates: true,
        });
      }
    }

    // Return the updated patient with relations
    return await tx.patient.findUnique({
      where: { id: patientInfo.id },
      include: {
        patientHealthRecord: true,
        medicalReports: true,
      },
    });
  });

  return result;
};

// Delete Patient by ID
const deletePatientByIdFromDB = async (
  patientId: string
): Promise<Patient | null> => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    await tx.medicalReport.deleteMany({
      where: {
        patientId: patientId,
      },
    });

    await tx.patientHealthRecord.delete({
      where: {
        patientId: patientId,
      },
    });

    const deletedPatient = await tx.patient.delete({
      where: {
        id: patientId,
      },
    });

    await tx.user.delete({
      where: {
        email: patientInfo.email,
      },
    });

    return deletedPatient;
  });

  return result;
};

// Soft Delete Patient by ID
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
