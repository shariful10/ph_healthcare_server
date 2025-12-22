import { DoctorSpecialties, Gender } from "@prisma/client";

export type IDoctor = {
  name?: string;
  id?: string;
  email?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  gender?: Gender;
  registrationNumber?: string;
  experience?: number;
  appointmentFee?: number;
  qualifications?: string;
  currentWorkingPlace?: string;
  designation?: string;
  specialties?: Partial<DoctorSpecialties>[];
};
