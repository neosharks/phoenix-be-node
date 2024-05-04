-- AlterTable
ALTER TABLE "ClickStream" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "response" INTEGER,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "type" DROP NOT NULL;
