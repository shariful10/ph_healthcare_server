import { Gender } from "@prisma/client";

export type IAdminPayload = {
  admin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
  };
  password: string;
};

export type IDoctorPayload = {
  doctor: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
    address?: string;
    registrationNumber: string;
    experience?: number;
    gender: Gender;
    appointmentFee: number;
    qualifications: string;
    currentWorkingPlace: string;
    designation: string;
  };
  password: string;
};

export type IPatientPayload = {
  patient: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
  };
  password: string;
};
