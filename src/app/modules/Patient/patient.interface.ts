import { MedicalReport, PatientHealthRecord } from "@prisma/client";

export type IPatient = {
  name: string;
  address?: string;
  profilePhoto?: string;
  contactNumber?: string;
  patientHealthRecord?: PatientHealthRecord;
  medicalReports?: Partial<MedicalReport>[];
};
