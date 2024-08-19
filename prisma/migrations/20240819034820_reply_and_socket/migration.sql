/*
  Warnings:

  - You are about to drop the column `repliedMessageId` on the `ClassMessage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassMessage" DROP CONSTRAINT "ClassMessage_repliedMessageId_fkey";

-- AlterTable
ALTER TABLE "ClassMessage" DROP COLUMN "repliedMessageId",
ADD COLUMN     "replyToMessageId" INTEGER;

-- AddForeignKey
ALTER TABLE "ClassMessage" ADD CONSTRAINT "ClassMessage_replyToMessageId_fkey" FOREIGN KEY ("replyToMessageId") REFERENCES "ClassMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
