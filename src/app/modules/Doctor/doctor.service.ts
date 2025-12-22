import prisma from "../../utils/prisma";
import { IOptions } from "../../interface/pagination";
import { doctorSearchableFields } from "./doctor.constant";
import { Doctor, DoctorSpecialties, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelper";

const getAllDoctorsFromDB = async (
  query: Record<string, unknown>,
  options: IOptions
) => {
  const { searchTerm, specialties, ...filterData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties as string,
              mode: "insensitive",
            },
          },
        },
      },
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

  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };

  const doctorInfo = await prisma.doctor.findMany({
    where: whereConditions,
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
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

  const total = await prisma.doctor.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: doctorInfo,
  };
};

const getDoctorByIdFromDB = async (
  doctorId: string
): Promise<Doctor | null> => {
  await prisma.doctor.findFirstOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  const doctorInfo = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return doctorInfo;
};

const updateDoctorByIdInToDB = async (
  doctorId: string,
  payload: Partial<Doctor & { specialties?: Partial<DoctorSpecialties>[] }>
) => {
  const { specialties, ...doctorData } = payload;

  // First, get the current doctor with existing specialties
  const existingDoctor = await prisma.doctor.findFirstOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: true,
    },
  });

  const doctorInfo = await prisma.$transaction(async (tx) => {
    // Update basic doctor info
    await tx.doctor.update({
      where: {
        id: existingDoctor.id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      // Get existing specialty IDs for this doctor
      const existingSpecialtyIds = existingDoctor.doctorSpecialties.map(
        (sp) => sp.specialtiesId
      );

      // Separate specialties into different categories
      const specialtiesToDelete = specialties.filter((sp: any) => sp.isDeleted);

      const specialtiesToAdd = specialties.filter(
        (sp: any) =>
          !sp.isDeleted &&
          sp.specialtiesId &&
          !existingSpecialtyIds.includes(sp.specialtiesId)
      );

      // Delete specialties that are marked as deleted
      for (const specialty of specialtiesToDelete) {
        if (specialty.specialtiesId) {
          await tx.doctorSpecialties.deleteMany({
            where: {
              doctorId: existingDoctor.id,
              specialtiesId: specialty.specialtiesId,
            },
          });
        }
      }

      // Create only NEW specialties that don't already exist
      for (const specialty of specialtiesToAdd) {
        if (specialty.specialtiesId) {
          await tx.doctorSpecialties.create({
            data: {
              doctorId: existingDoctor.id,
              specialtiesId: specialty.specialtiesId,
            },
          });
        }
      }
    }

    // Return the updated doctor with all specialties
    return await tx.doctor.findUnique({
      where: {
        id: existingDoctor.id,
      },
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });
  });

  return doctorInfo;
};

const deleteDoctorByIdFromDB = async (
  doctorId: string
): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  const doctorInfo = await prisma.$transaction(async (tx) => {
    const deletedData = await tx.doctor.delete({
      where: {
        id: doctorId,
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

  return doctorInfo;
};

const softDeleteDoctorByIdFromDB = async (
  doctorId: string
): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  const doctorInfo = await prisma.$transaction(async (tx) => {
    const deletedData = await tx.doctor.update({
      where: {
        id: doctorId,
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

  return doctorInfo;
};

export const DoctorService = {
  getAllDoctorsFromDB,
  getDoctorByIdFromDB,
  updateDoctorByIdInToDB,
  deleteDoctorByIdFromDB,
  softDeleteDoctorByIdFromDB,
};
