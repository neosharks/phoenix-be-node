-- CreateEnum
CREATE TYPE "WALLET_SOURCE" AS ENUM ('REFERRAL', 'PURCHASE');

-- CreateEnum
CREATE TYPE "CURRENCY" AS ENUM ('INR');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('PATRON', 'CREATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "PACKAGE_NAMES" AS ENUM ('SUPPORT', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'RUBY');

-- CreateEnum
CREATE TYPE "TIER_TYPE" AS ENUM ('GENERAL_SUPPORT', 'EXCLUSIVE_POSTS', 'BEHIND_THE_SCENES', 'UNLIMITED_MESSAGE', 'ONE_TIME_MESSAGE', 'NAME_POST_DESCRIPTION', 'NAME_POST_END', 'EXCLUSIVE_POLLS', 'MENTORSHIP', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "COUNTRY" AS ENUM ('INDIA', 'NEPAL', 'SRI_LANKA', 'BHUTAN', 'PAKISTAN');

-- CreateEnum
CREATE TYPE "INDUSTRY" AS ENUM ('BEAUTY_AND_MAKEUP', 'MUSIC', 'COMEDY', 'PHOTOGRAPHY', 'POETRY', 'JOURNALISM', 'STREAMING', 'ESPORTS', 'MODELING', 'TECHNOLOGY_REVIEWS', 'SOFTWARE_DEVELOPMENT', 'FITNESS_TRAINING', 'NUTRITION', 'DIY_CRAFTS', 'HOME_RENOVATION', 'TRAVEL_BLOGGING', 'ADVENTURE', 'SCIENCE_COMMUNICATION', 'ONLINE_EDUCATION', 'LIFE_COACHING', 'SOCIAL_ACTIVISM', 'ANIMAL_WELFARE', 'CULTURAL_INFLUENCE', 'HANDMADE_CRAFTS', 'CAR_ENTHUSIASTS', 'COLLECTING', 'HOBBYISTS', 'ENTERTAINMENT_INDUSTRY', 'VISUAL_ARTS', 'WRITING_AND_PUBLISHING', 'GAMING', 'FASHION_AND_BEAUTY', 'COOKING_AND_FOOD', 'TECHNOLOGY_AND_GADGETS', 'HEALTH_AND_FITNESS', 'DIY_AND_HOME_IMPROVEMENT', 'TRAVEL_AND_ADVENTURE', 'SCIENCE_AND_EDUCATION', 'PERSONAL_DEVELOPMENT_AND_MOTIVATION', 'PARENTING_AND_FAMILY', 'FINANCE_AND_INVESTMENT', 'PETS_AND_ANIMALS', 'LIFESTYLE_AND_CULTURE', 'ARTISANS_AND_CRAFTSMEN', 'AUTOMOTIVE_AND_DIY_MECHANICS', 'NICHE_HOBBIES');

-- CreateEnum
CREATE TYPE "PATRON_CREATOR_STATUS" AS ENUM ('ACTIVE', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "NOTIFICATION" AS ENUM ('NEW_POST', 'MESSAGE', 'POLL', 'MENTIONED', 'NEW_COMMENT', 'NEW_LIKE', 'CLASS');

-- CreateEnum
CREATE TYPE "MESSAGE_TYPE" AS ENUM ('TEXT', 'IMAGE', 'AUDIO');

-- CreateEnum
CREATE TYPE "CONVERSATION_TYPE" AS ENUM ('ONE_TO_ONE');

-- CreateEnum
CREATE TYPE "VERIFICATION_CODE_SOURCE" AS ENUM ('WHATSAPP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "CREATOR_APPROVAL_STATUS" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'UNINITIATED');

-- CreateEnum
CREATE TYPE "VERIFICATION_CODE_TYPE" AS ENUM ('LOGIN', 'FORGET_PASSWORD');

-- CreateEnum
CREATE TYPE "USER_POST_TYPE" AS ENUM ('TEXT', 'IMAGE', 'POLL', 'LINK', 'VIDEO', 'CLASS', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "VISIBILITY" AS ENUM ('EVERYONE', 'FREE_MEMBER', 'PAID_MEMBER');

-- CreateEnum
CREATE TYPE "SUBSCRIPTION_TYPE" AS ENUM ('FREE', 'PAID');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('CREATED', 'PAID', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "PAYMENT_FREQUENCY" AS ENUM ('ONE_TIME', 'MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "whatsappNumber" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT '+91',
    "profileImage" TEXT,
    "coverImage" TEXT,
    "isCreator" BOOLEAN NOT NULL DEFAULT false,
    "gender" "GENDER",
    "role" "ROLE"[] DEFAULT ARRAY['PATRON']::"ROLE"[],
    "bio" TEXT,
    "country" "COUNTRY" NOT NULL DEFAULT 'INDIA',
    "dob" TIMESTAMP(3),
    "industry" "INDUSTRY",
    "onBoardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "onBoardingCompletePercentage" INTEGER NOT NULL DEFAULT 0,
    "pageName" TEXT,
    "youtubeHandle" TEXT,
    "facebookHandle" TEXT,
    "twitterHandle" TEXT,
    "instagramHandle" TEXT,
    "creatorApprovalStatus" "CREATOR_APPROVAL_STATUS" NOT NULL DEFAULT 'UNINITIATED',
    "creatorChangeTimeStamp" TIMESTAMP(3),
    "status" "USER_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "password" TEXT,
    "referralUserId" INTEGER,
    "referralTimeStamp" TIMESTAMP(3),
    "referralDevice" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "googleAuthId" TEXT,
    "facebookAuthId" TEXT,
    "verificationCode" INTEGER,
    "verificationCodeTimestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "verificationCodeAttempts" INTEGER NOT NULL DEFAULT 0,
    "verificationCodeSource" "VERIFICATION_CODE_SOURCE",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "fcmToken" TEXT,
    "lastSeen" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentId" INTEGER,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" SERIAL NOT NULL,
    "tierType" "TIER_TYPE" NOT NULL DEFAULT 'GENERAL_SUPPORT',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "name" "PACKAGE_NAMES" NOT NULL DEFAULT 'SUPPORT',
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userPostId" INTEGER,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "contentType" "MESSAGE_TYPE" NOT NULL DEFAULT 'TEXT',
    "chatId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "participantOneId" INTEGER NOT NULL,
    "participantTwoId" INTEGER NOT NULL,
    "type" "CONVERSATION_TYPE" NOT NULL DEFAULT 'ONE_TO_ONE',
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "pendingAllowed" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "aboutUserId" INTEGER NOT NULL,
    "notifiedUserId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "link" TEXT,
    "type" "NOTIFICATION" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatronCreator" (
    "id" SERIAL NOT NULL,
    "patronId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "packageId" INTEGER,
    "type" "SUBSCRIPTION_TYPE" NOT NULL DEFAULT 'FREE',
    "expiry" TIMESTAMP(3),
    "status" "PATRON_CREATOR_STATUS" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatronCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPost" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "type" "USER_POST_TYPE" NOT NULL DEFAULT 'TEXT',
    "image" TEXT,
    "title" TEXT,
    "description" TEXT,
    "videoUrl" TEXT,
    "document" TEXT,
    "visibility" "VISIBILITY" NOT NULL DEFAULT 'EVERYONE',
    "allowComments" BOOLEAN NOT NULL DEFAULT true,
    "pollId" INTEGER,
    "classId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostComment" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "userPostId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "options" JSONB[],
    "selectedOptions" JSONB[],
    "image" TEXT,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "currency" "CURRENCY" NOT NULL DEFAULT 'INR',
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'CREATED',
    "packageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClickStream" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "info" JSONB,
    "type" TEXT,
    "url" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClickStream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransactions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "source" "WALLET_SOURCE" NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllLinks" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "platform" TEXT,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT,
    "price" INTEGER,
    "paymentFrequency" "PAYMENT_FREQUENCY" NOT NULL DEFAULT 'ONE_TIME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassMessage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "message" TEXT,
    "image" TEXT,
    "video" TEXT,
    "document" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "classId" INTEGER NOT NULL,
    "repliedMessageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassParticipants" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_likedByUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PackageToTier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleAuthId_key" ON "User"("googleAuthId");

-- CreateIndex
CREATE UNIQUE INDEX "User_facebookAuthId_key" ON "User"("facebookAuthId");

-- CreateIndex
CREATE INDEX "User_email_username_phoneNumber_idx" ON "User"("email", "username", "phoneNumber");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");

-- CreateIndex
CREATE INDEX "Notification_aboutUserId_notifiedUserId_idx" ON "Notification"("aboutUserId", "notifiedUserId");

-- CreateIndex
CREATE INDEX "UserPost_visibility_authorId_idx" ON "UserPost"("visibility", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassParticipants_classId_userId_key" ON "ClassParticipants"("classId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_likedByUser_AB_unique" ON "_likedByUser"("A", "B");

-- CreateIndex
CREATE INDEX "_likedByUser_B_index" ON "_likedByUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackageToTier_AB_unique" ON "_PackageToTier"("A", "B");

-- CreateIndex
CREATE INDEX "_PackageToTier_B_index" ON "_PackageToTier"("B");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_userPostId_fkey" FOREIGN KEY ("userPostId") REFERENCES "UserPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participantOneId_fkey" FOREIGN KEY ("participantOneId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participantTwoId_fkey" FOREIGN KEY ("participantTwoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_aboutUserId_fkey" FOREIGN KEY ("aboutUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifiedUserId_fkey" FOREIGN KEY ("notifiedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronCreator" ADD CONSTRAINT "PatronCreator_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronCreator" ADD CONSTRAINT "PatronCreator_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronCreator" ADD CONSTRAINT "PatronCreator_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_userPostId_fkey" FOREIGN KEY ("userPostId") REFERENCES "UserPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickStream" ADD CONSTRAINT "ClickStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransactions" ADD CONSTRAINT "WalletTransactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransactions" ADD CONSTRAINT "WalletTransactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllLinks" ADD CONSTRAINT "AllLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMessage" ADD CONSTRAINT "ClassMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMessage" ADD CONSTRAINT "ClassMessage_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMessage" ADD CONSTRAINT "ClassMessage_repliedMessageId_fkey" FOREIGN KEY ("repliedMessageId") REFERENCES "ClassMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassParticipants" ADD CONSTRAINT "ClassParticipants_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassParticipants" ADD CONSTRAINT "ClassParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedByUser" ADD CONSTRAINT "_likedByUser_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedByUser" ADD CONSTRAINT "_likedByUser_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageToTier" ADD CONSTRAINT "_PackageToTier_A_fkey" FOREIGN KEY ("A") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageToTier" ADD CONSTRAINT "_PackageToTier_B_fkey" FOREIGN KEY ("B") REFERENCES "Tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
