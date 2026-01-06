[![wakatime](https://wakatime.com/badge/github/shariful10/ph_healthcare_server.svg)](https://wakatime.com/badge/github/shariful10/ph_healthcare_server)

# PH Healthcare Server

A comprehensive healthcare management backend API built with Node.js, Express.js, TypeScript, Zod, Prisma, and PostgreSQL. This API provides complete functionality for managing doctors, patients, appointments, specialties, and admin operations.

## 🚀 Features

- **Multi-Role Access Control**: Three-tier role system (USER, ADMIN, SUPER_ADMIN) with permission-based access.
- **User Management**: User registration, authentication, profile management, and status tracking.
- **Doctor Management**: Complete doctor profiles with specialties, experience, and appointment fees.
- **Patient Management**: Patient registration with medical history and medical records tracking.
- **Appointment System**: Appointment scheduling, status management, and tracking.
- **Specialty Management**: Medical specialty categories and management.
- **File Upload**: Secure file upload functionality with Cloudinary integration.
- **Email Services**: Automated email notifications using Nodemailer for verification and notifications.
- **Database Management**: PostgreSQL with Prisma ORM for type-safe database operations.
- **Error Handling**: Comprehensive error handling with custom error classes and validation.
- **Security**: Password hashing with bcrypt, JWT tokens, request validation, and CORS configuration.

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer SMTP
- **Validation**: Zod for request validation
- **Development**: ts-node-dev, ESLint
- **Password Hashing**: Bcrypt

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Yarn or npm package manager
- Cloudinary account for file uploads
- Nodemailer SMTP credentials for email services

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shariful10/ph_healthcare_server.git
   cd ph_healthcare_server
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

   or,

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Application Configuration
   NODE_ENV=development
   PORT=5000

   # Database Configuration
   DATABASE_URL=postgresql://postgres:password@localhost:5432/ph_healthcare

   # JWT Configuration
   JWT_ACCESS_SECRET=your_jwt_access_secret_here
   JWT_ACCESS_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   JWT_REFRESH_EXPIRES_IN=30d

   # URL Configuration
   BACKEND_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000

   # Cloudinary Configuration
   CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Configuration (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@example.com
   ```

4. **Set up the database**

   # Generate Prisma client

   ```bash
   yarn prisma generate
   ```

   # Run database migrations

   ```bash
   yarn prisma migrate dev
   ```

   # Seed the database (creates super admin automatically)

   ```bash
   yarn dev
   ```

## 🚀 Running the Application

### Development Mode

```bash
yarn dev
```

### Production Build

```bash
yarn build
yarn start
```

### Using Docker

```bash
docker-compose up -d
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
src/
├── app/
│   ├── builder/           # Query builder utilities
│   ├── config/            # Configuration files
│   ├── errors/            # Error handling utilities
│   ├── helpers/           # Helper functions (password, JWT, OTP)
│   ├── interface/         # TypeScript interfaces
│   ├── middlewares/       # Express middlewares (auth, error handling, validation)
│   ├── modules/           # Feature modules
│   │   ├── Admin/         # Admin management
│   │   ├── Auth/          # Authentication (login, registration)
│   │   ├── Doctor/        # Doctor management
│   │   ├── FileUpload/    # File upload module
│   │   ├── Patient/       # Patient management
│   │   ├── Specialty/     # Medical specialty management
│   │   └── User/          # User management
│   ├── routes/            # Route definitions
│   ├── shared/            # Shared utilities
│   └── utils/             # Utility functions
├── prisma/                # Database schema and migrations
├── views/                 # View templates (EJS)
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
└── seedSuperAdmin.ts      # Super admin seeding script
```

## 🔗 API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout

### Users

- `POST /api/v1/users/register` - User registration
- `GET /api/v1/users` - Get all users (Admin/Super Admin only)
- `GET /api/v1/users/:userId` - Get user by ID
- `PATCH /api/v1/users/:userId` - Update user information

### Doctors

- `GET /api/v1/doctors` - Get all doctors with pagination
- `GET /api/v1/doctors/:doctorId` - Get doctor by ID
- `POST /api/v1/doctors` - Create doctor (Admin/Super Admin)
- `PATCH /api/v1/doctors/:doctorId` - Update doctor (Admin/Super Admin)
- `DELETE /api/v1/doctors/:doctorId` - Delete doctor (Admin/Super Admin)

### Patients

- `GET /api/v1/patients` - Get all patients with pagination
- `GET /api/v1/patients/:patientId` - Get patient by ID
- `POST /api/v1/patients` - Create patient (Admin/Super Admin)
- `PATCH /api/v1/patients/:patientId` - Update patient (Admin/Super Admin)
- `DELETE /api/v1/patients/:patientId` - Delete patient (Admin/Super Admin)

### Admins

- `GET /api/v1/admins` - Get all admins (Super Admin only)
- `GET /api/v1/admins/:adminId` - Get admin by ID
- `POST /api/v1/admins` - Create admin (Super Admin)
- `PATCH /api/v1/admins/:adminId` - Update admin (Super Admin)
- `DELETE /api/v1/admins/:adminId` - Delete admin (Super Admin)

### Specialties

- `GET /api/v1/specialties` - Get all specialties
- `POST /api/v1/specialties` - Create specialty (Admin/Super Admin)
- `PATCH /api/v1/specialties/:specialtyId` - Update specialty (Admin/Super Admin)
- `DELETE /api/v1/specialties/:specialtyId` - Delete specialty (Admin/Super Admin)

### File Upload

- `POST /api/v1/files/upload` - Upload file/image to Cloudinary

## 🗃️ Database Schema

### User Model

- Unique email-based authentication with password hashing
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Account status tracking (ACTIVE, INACTIVE, DELETED)
- Password change requirement flag
- Relations to Admin, Doctor, and Patient profiles

### Admin Model

- Admin profile with contact information
- Profile photo support
- Linked to User model via email
- Soft delete support

### Doctor Model

- Complete doctor profile with specialization
- Appointment fee configuration
- Experience tracking in years
- Gender and identification information
- Profile photo support
- Linked to User and Specialty models
- Relations to Appointment and Schedule models

### Patient Model

- Patient profile with medical history
- Contact and address information
- Gender tracking
- Soft delete support
- Relations to Appointment and PatientHealthData models

### Specialty Model

- Medical specialty categories
- Description and metadata
- Relations to Doctor model

### PatientHealthData Model

- Medical records and health history
- Patient health information tracking
- Relations to Patient model

## 🔒 Authentication & Authorization

The API uses JWT-based authentication with robust security measures:

### **Token Security**

- **Dual Token System**: Separate access and refresh tokens with different secret keys
- **Token Expiration**:
  - Access tokens: 1 hour (configurable)
  - Refresh tokens: 7 days (configurable)
  - Password reset tokens: 10 minutes (short-lived for security)
- **Token Validation**: Secure token verification on every protected route
- **Automatic Invalidation**: Tokens become invalid when passwords are changed

### **Role-Based Access Control**

- **USER**: Regular users with basic access to personal data and subscriptions
- **ADMIN**: Administrative users with extended permissions for user and plan management
- **SUPER_ADMIN**: Full system access including all administrative functions

### **Authentication Flow**

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Token refresh is handled automatically through the `/api/v1/auth/refresh-token` endpoint.

## 💳 Payment Integration

Currently, this project does not include Stripe integration. Payment processing can be added in future versions.

## 📧 Email Services

- **Email Provider**: Nodemailer SMTP service
- **Email Notifications**: Automated email notifications for user activities
- **Template Support**: HTML email templates for formatted messages

## 🛡️ Security Features

- **Password Security**: Bcrypt hashing with salt rounds for secure password storage
- **JWT Token Security**:
  - Access and refresh token-based authentication
  - Configurable token expiration
  - Secure token generation and validation
  - Token-based authentication for all protected routes
- **Request Validation**: Zod schema validation for all incoming requests
- **CORS Configuration**: Configured for specific frontend origins with credentials support
- **Role-Based Access**: Three-tier role system (USER, ADMIN, SUPER_ADMIN) with route protection
- **File Upload Security**: Secure file handling with Cloudinary integration
- **Error Handling**: Comprehensive error handling without exposing sensitive information
- **Soft Deletes**: Logical deletion support for data preservation

## 🧪 Development

### Code Style

The project uses ESLint and TypeScript for code quality and type safety.

### Database Management

Use Prisma Studio to manage your database:

```bash
yarn prisma studio
```

### Debugging

The application includes comprehensive error handling and logging for debugging purposes.

## License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sk Shariful Islam**

- Email: sharifulisl96@gmail.com
- Whatsapp: +8801518726852
