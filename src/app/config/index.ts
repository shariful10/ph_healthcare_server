import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  host: process.env.HOST || "localhost",
  databaseUrl: process.env.DATABASE_URL,
  sendEmail: {
    app_user: process.env.APP_USER,
    app_pass: process.env.APP_PASS,
    brevo_user: process.env.BREVO_USER,
    brevo_pass: process.env.BREVO_PASS,
    brevo_email: process.env.BREVO_EMAIL,
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    resetPassword: {
      secret: process.env.JWT_RESET_PASS_SECRET,
      expires_in: process.env.JWT_RESET_PASS_ACCESS_EXPIRES_IN,
    },
  },
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
  url: {
    file: process.env.FILE_URL,
    image: process.env.IMAGE_URL,
    backend: process.env.BACKEND_URL,
    frontend: process.env.FRONTEND_URL,
  },
  verify: {
    email: process.env.VERIFY_EMAIL_LINK,
    reset_pass_ui: process.env.RESET_PASS_UI_LINK,
    reset_pass_link: process.env.VERIFY_RESET_PASS_LINK,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};
