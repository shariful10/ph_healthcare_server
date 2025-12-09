// uploadToCloudinary.ts
import config from "../config";
import streamifier from "streamifier";
import AppError from "../errors/AppError";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const fileUploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = "uploads"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto", // Automatically detect image, video, raw, etc.
        public_id: `${file.originalname}`,
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError(500, "Failed to upload file to Cloudinary"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Pipe the file buffer directly to Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export default fileUploadToCloudinary;
