import config from "./app/config";
import prisma from "./app/utils/prisma";
import { hashPassword } from "./app/helpers/hashPassword";
import { UserRole, UserStatus, User } from "@prisma/client";

export const seedSuperAdmin = async (): Promise<User | null> => {
  const email = config.superAdmin.email;
  const password = config.superAdmin.password;

  if (!email || !password) {
    console.warn(
      "Super admin credentials are not configured. Skipping seeding."
    );
    return null;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    const superAdminName = "Super Admin";
    const superAdminContact = "054824568521";

    if (existingUser) {
      const existingAdmin = await prisma.admin.findUnique({ where: { email } });

      if (!existingAdmin) {
        await prisma.admin.create({
          data: {
            email,
            name: superAdminName,
            contactNumber: superAdminContact,
          },
        });
        console.info("Created missing Admin record for existing user.");
      } else {
        console.info("Super Admin already exist. Skipping.");
      }

      return existingUser;
    }

    const hashedPassword = await hashPassword(password);

    // Create user and admin in a transaction so both are created atomically
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: UserRole.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
        },
      });

      await tx.admin.create({
        data: {
          email: user.email,
          name: superAdminName,
          contactNumber: superAdminContact,
        },
      });

      return user;
    });

    console.info("✅ Super Admin seeded successfully.");
    return created;
  } catch (error) {
    // Seeding should not crash the app startup — log and continue.
    console.error("❌ Failed to seed Super Admin:", error);
    return null;
  }
};

export default seedSuperAdmin;
