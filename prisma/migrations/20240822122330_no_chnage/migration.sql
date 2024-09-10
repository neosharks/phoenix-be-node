/*
  Warnings:

  - A unique constraint covering the columns `[classId,userId]` on the table `ClassParticipants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ClassParticipants_classId_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "ClassParticipants_classId_userId_key" ON "ClassParticipants"("classId", "userId");
