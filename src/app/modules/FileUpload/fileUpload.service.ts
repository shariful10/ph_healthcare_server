// fileUpload.service.ts
import { Request } from "express";
import AppError from "../../errors/AppError";
import fileUploadToCloudinary from "../../utils/fileUploadToCloudinary";

const fileUpload = async (req: Request): Promise<string> => {
  if (!req.file) {
    throw new AppError(400, "No file provided");
  }

  const fileUrl = await fileUploadToCloudinary(req.file);
  return fileUrl;
};

const uploadMultipleFiles = async (req: Request): Promise<string[]> => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new AppError(400, "No files provided");
  }

  const uploadPromises = req.files.map((file) => fileUploadToCloudinary(file));

  const result = await Promise.all(uploadPromises);
  return result;
};

export const FileUploadService = {
  fileUpload,
  uploadMultipleFiles,
};
