import config from "./app/config";
import prisma from "./app/utils/prisma";
import { hashPassword } from "./app/helpers/hashPassword";

export const seedSuperAdmin = async () => {
  const email = config.superAdmin.email!;
  const password = config.superAdmin.password!;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // console.log("⚠️  Super Admin already exists!");
    return;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      fullName: "Super Admin",
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });

  console.log("✅ Super Admin seeded successfully.");
};
