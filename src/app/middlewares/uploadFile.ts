// uploadFile.ts
import multer from "multer";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB default
  },
  fileFilter: (req, file, cb) => {
    // Add allowed file types validation
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mkv",
      "video/avi",
      "video/mpeg",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  },
});
