-- DropIndex
DROP INDEX "ClassParticipants_classId_userId_key";

-- CreateIndex
CREATE INDEX "ClassParticipants_classId_userId_idx" ON "ClassParticipants"("classId", "userId");
