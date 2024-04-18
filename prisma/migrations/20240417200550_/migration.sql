-- CreateEnum
CREATE TYPE "SUBSCRIPTION_TYPE" AS ENUM ('FREE', 'PAID');

-- DropForeignKey
ALTER TABLE "PatronCreator" DROP CONSTRAINT "PatronCreator_packageId_fkey";

-- AlterTable
ALTER TABLE "PatronCreator" ADD COLUMN     "type" "SUBSCRIPTION_TYPE" NOT NULL DEFAULT 'FREE',
ALTER COLUMN "packageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PatronCreator" ADD CONSTRAINT "PatronCreator_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
