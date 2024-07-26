/*
  Warnings:

  - You are about to drop the column `mediaUrl` on the `ClassMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClassMessage" DROP COLUMN "mediaUrl",
ADD COLUMN     "emojis" TEXT[],
ADD COLUMN     "media" JSONB;
