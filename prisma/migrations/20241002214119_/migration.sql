-- CreateEnum
CREATE TYPE "REPORTING_TYPE" AS ENUM ('USER', 'POST', 'MESSAGE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "eulaAccepted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "OffensiveReporting" (
    "id" SERIAL NOT NULL,
    "type" "REPORTING_TYPE" NOT NULL,
    "reportedByUserId" INTEGER NOT NULL,
    "reportedUserId" INTEGER NOT NULL,
    "resolvedById" INTEGER,
    "message" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OffensiveReporting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OffensiveReporting" ADD CONSTRAINT "OffensiveReporting_reportedByUserId_fkey" FOREIGN KEY ("reportedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffensiveReporting" ADD CONSTRAINT "OffensiveReporting_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffensiveReporting" ADD CONSTRAINT "OffensiveReporting_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
