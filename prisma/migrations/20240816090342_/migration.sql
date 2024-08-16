/*
  Warnings:

  - You are about to drop the column `replyToMessageId` on the `ClassMessage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassMessage" DROP CONSTRAINT "ClassMessage_replyToMessageId_fkey";

-- AlterTable
ALTER TABLE "ClassMessage" DROP COLUMN "replyToMessageId",
ADD COLUMN     "repliedMessageId" INTEGER;

-- AddForeignKey
ALTER TABLE "ClassMessage" ADD CONSTRAINT "ClassMessage_repliedMessageId_fkey" FOREIGN KEY ("repliedMessageId") REFERENCES "ClassMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
