-- CreateEnum
CREATE TYPE "COMMUNITY_CREATOR_STATUS" AS ENUM ('PENDING', 'ACCEPTED', 'DENIED');

-- AlterTable
ALTER TABLE "UserPost" ADD COLUMN     "combinedCommunityId" INTEGER;

-- CreateTable
CREATE TABLE "CombinedCommunity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdById" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CombinedCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityCreator" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "communityId" INTEGER NOT NULL,
    "status" "COMMUNITY_CREATOR_STATUS" NOT NULL DEFAULT 'PENDING',
    "statusUpdateDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityCreator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CombinedCommunity" ADD CONSTRAINT "CombinedCommunity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityCreator" ADD CONSTRAINT "CommunityCreator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityCreator" ADD CONSTRAINT "CommunityCreator_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "CombinedCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_combinedCommunityId_fkey" FOREIGN KEY ("combinedCommunityId") REFERENCES "CombinedCommunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
