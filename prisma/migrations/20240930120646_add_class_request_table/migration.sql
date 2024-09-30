-- CreateTable
CREATE TABLE "ClassRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassRequest_userId_creatorId_idx" ON "ClassRequest"("userId", "creatorId");
