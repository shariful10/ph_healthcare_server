/*
  Warnings:

  - The values [day] on the enum `Interval` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Interval_new" AS ENUM ('week', 'month', 'year');
ALTER TABLE "public"."plans" ALTER COLUMN "interval" DROP DEFAULT;
ALTER TABLE "public"."plans" ALTER COLUMN "interval" TYPE "public"."Interval_new" USING ("interval"::text::"public"."Interval_new");
ALTER TYPE "public"."Interval" RENAME TO "Interval_old";
ALTER TYPE "public"."Interval_new" RENAME TO "Interval";
DROP TYPE "public"."Interval_old";
ALTER TABLE "public"."plans" ALTER COLUMN "interval" SET DEFAULT 'month';
COMMIT;

-- DropEnum
DROP TYPE "public"."Status";

-- DropEnum
DROP TYPE "public"."SubscriptionType";

-- CreateTable
CREATE TABLE "public"."uploads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "embedding" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatchResult" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "matchedName" TEXT NOT NULL,
    "matchedImage" TEXT NOT NULL,
    "similarity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."uploads" ADD CONSTRAINT "uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchResult" ADD CONSTRAINT "MatchResult_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "public"."uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
