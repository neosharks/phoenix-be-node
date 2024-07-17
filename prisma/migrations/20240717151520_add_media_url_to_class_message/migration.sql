/*
  Warnings:

  - You are about to drop the column `emojis` on the `ClassMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClassMessage" DROP COLUMN "emojis",
ADD COLUMN     "image" TEXT;
