import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import config from "../config";
import streamifier from "streamifier";
import AppError from "../errors/AppError";
import { httpStatus } from "./httpStatus";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
  secure: true,
});

const fileUploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = "uploads"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file exists
    if (!file || !file.buffer) {
      return reject(new AppError(400, "No file provided"));
    }

    // Validate Cloudinary config
    if (
      !config.cloudinary.cloud_name ||
      !config.cloudinary.api_key ||
      !config.cloudinary.api_secret
    ) {
      return reject(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Cloudinary configuration error"
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
        // Remove spaces and special characters from filename
        public_id: `${Date.now()}-${file.originalname
          .replace(/\s+/g, "-")
          .replace(/[^\w.-]/g, "")}`,
        // Add timeout
        timeout: 60000, // 60 seconds timeout
      },
      (
        err: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (err) {
          console.error("Cloudinary upload error details:", {
            message: err.message,
            http_code: err.http_code,
            name: err.name,
          });
          reject(
            new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              `Failed to upload file: ${err.message}`
            )
          );
        } else if (!result) {
          reject(
            new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "No response from Cloudinary"
            )
          );
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Handle stream errors
    uploadStream.on("error", (streamError) => {
      console.error("Stream error:", streamError);
      reject(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "File upload stream error"
        )
      );
    });

    // Pipe the file buffer to Cloudinary
    const readableStream = streamifier.createReadStream(file.buffer);
    readableStream.pipe(uploadStream);

    // Handle stream creation error
    readableStream.on("error", (err) => {
      console.error("Readable stream error:", err);
      reject(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error reading file stream"
        )
      );
    });
  });
};

export default fileUploadToCloudinary;
