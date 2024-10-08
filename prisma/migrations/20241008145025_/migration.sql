-- DropForeignKey
ALTER TABLE "AllLinks" DROP CONSTRAINT "AllLinks_userId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_participantOneId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_participantTwoId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "ClassMessage" DROP CONSTRAINT "ClassMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClassParticipants" DROP CONSTRAINT "ClassParticipants_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClickStream" DROP CONSTRAINT "ClickStream_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_aboutUserId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notifiedUserId_fkey";

-- DropForeignKey
ALTER TABLE "OffensiveReporting" DROP CONSTRAINT "OffensiveReporting_reportedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "OffensiveReporting" DROP CONSTRAINT "OffensiveReporting_reportedUserId_fkey";

-- DropForeignKey
ALTER TABLE "OffensiveReporting" DROP CONSTRAINT "OffensiveReporting_resolvedById_fkey";

-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "PatronCreator" DROP CONSTRAINT "PatronCreator_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "PatronCreator" DROP CONSTRAINT "PatronCreator_patronId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_userPostId_fkey";

-- DropForeignKey
ALTER TABLE "UserPost" DROP CONSTRAINT "UserPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "WalletTransactions" DROP CONSTRAINT "WalletTransactions_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "WalletTransactions" DROP CONSTRAINT "WalletTransactions_senderId_fkey";

-- AlterTable
ALTER TABLE "OffensiveReporting" ADD COLUMN     "userPostId" INTEGER,
ALTER COLUMN "reportedUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participantOneId_fkey" FOREIGN KEY ("participantOneId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participantTwoId_fkey" FOREIGN KEY ("participantTwoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_aboutUserId_fkey" FOREIGN KEY ("aboutUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifiedUserId_fkey" FOREIGN KEY ("notifiedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronCreator" ADD CONSTRAINT "PatronCreator_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronCreator" ADD CONSTRAINT "PatronCreator_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_userPostId_fkey" FOREIGN KEY ("userPostId") REFERENCES "UserPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickStream" ADD CONSTRAINT "ClickStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransactions" ADD CONSTRAINT "WalletTransactions_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransactions" ADD CONSTRAINT "WalletTransactions_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllLinks" ADD CONSTRAINT "AllLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMessage" ADD CONSTRAINT "ClassMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassParticipants" ADD CONSTRAINT "ClassParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffensiveReporting" ADD CONSTRAINT "OffensiveReporting_reportedByUserId_fkey" FOREIGN KEY ("reportedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffensiveReporting" ADD CONSTRAINT "OffensiveReporting_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffensiveReporting" ADD CONSTRAINT "OffensiveReporting_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffensiveReporting" ADD CONSTRAINT "OffensiveReporting_userPostId_fkey" FOREIGN KEY ("userPostId") REFERENCES "UserPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
