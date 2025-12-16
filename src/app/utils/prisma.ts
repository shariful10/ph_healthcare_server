import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Set it in .env or the environment.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

// Handle connection issues
async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to the database successfully!");
  } catch (error) {
    console.error("Prisma connection failed:", error);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected due to application termination.");
    process.exit(0);
  });
}

connectPrisma();

export default prisma;
