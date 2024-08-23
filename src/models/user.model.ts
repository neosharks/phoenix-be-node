import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import Package from "./package.model";
import Message from "./message.model";
import Chat from "./chat.model";
import Notification from "./notification.model";
import PatronCreator from "./patronCreator.model";
import UserPost from "./userPost.model";
import PostComment from "./postComment.model";
import Poll from "./poll.model";
import Payment from "./payment.model";
import ClickStream from "./clickStream.model";
import WalletTransactions from "./walletTransactions.model";
import AllLinks from "./allLinks.model";
import Class from "./class.model";
import ClassMessage from "./classMessage.model";
import ClassParticipants from "./classParticipants.model";
import Referral from "./referral.model";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    whatsappNumber: DataTypes.STRING,
    countryCode: {
      type: DataTypes.STRING,
      defaultValue: "+91",
    },
    profileImage: DataTypes.STRING,
    coverImage: DataTypes.STRING,
    isCreator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gender: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
    role: {
      type: DataTypes.ARRAY(DataTypes.ENUM("PATRON", "CREATOR", "ADMIN")),
      defaultValue: ["PATRON"],
    },
    bio: DataTypes.STRING,
    country: {
      type: DataTypes.ENUM("INDIA", "NEPAL", "SRI_LANKA", "BHUTAN", "PAKISTAN"),
      defaultValue: "INDIA",
    },
    dob: DataTypes.DATE,
    industry: DataTypes.ENUM(
      "BEAUTY_AND_MAKEUP",
      "MUSIC",
      "COMEDY",
      "PHOTOGRAPHY",
      "POETRY",
      "JOURNALISM",
      "STREAMING",
      "ESPORTS",
      "MODELING",
      "TECHNOLOGY_REVIEWS",
      "SOFTWARE_DEVELOPMENT",
      "FITNESS_TRAINING",
      "NUTRITION",
      "DIY_CRAFTS",
      "HOME_RENOVATION",
      "TRAVEL_BLOGGING",
      "ADVENTURE",
      "SCIENCE_COMMUNICATION",
      "ONLINE_EDUCATION",
      "LIFE_COACHING",
      "SOCIAL_ACTIVISM",
      "ANIMAL_WELFARE",
      "CULTURAL_INFLUENCE",
      "HANDMADE_CRAFTS",
      "CAR_ENTHUSIASTS",
      "COLLECTING",
      "HOBBYISTS",
      "ENTERTAINMENT_INDUSTRY",
      "VISUAL_ARTS",
      "WRITING_AND_PUBLISHING",
      "GAMING",
      "FASHION_AND_BEAUTY",
      "COOKING_AND_FOOD",
      "TECHNOLOGY_AND_GADGETS",
      "HEALTH_AND_FITNESS",
      "DIY_AND_HOME_IMPROVEMENT",
      "TRAVEL_AND_ADVENTURE",
      "SCIENCE_AND_EDUCATION",
      "PERSONAL_DEVELOPMENT_AND_MOTIVATION",
      "PARENTING_AND_FAMILY",
      "FINANCE_AND_INVESTMENT",
      "PETS_AND_ANIMALS",
      "LIFESTYLE_AND_CULTURE",
      "ARTISANS_AND_CRAFTSMEN",
      "AUTOMOTIVE_AND_DIY_MECHANICS",
      "NICHE_HOBBIES",
    ),
    onBoardingComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    onBoardingCompletePercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pageName: DataTypes.STRING,
    youtubeHandle: DataTypes.STRING,
    facebookHandle: DataTypes.STRING,
    twitterHandle: DataTypes.STRING,
    instagramHandle: DataTypes.STRING,
    creatorApprovalStatus: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "DENIED", "UNINITIATED"),
      defaultValue: "UNINITIATED",
    },
    creatorChangeTimeStamp: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE", "DELETED", "BLOCKED"),
      defaultValue: "ACTIVE",
    },
    password: DataTypes.STRING,
    referralUserId: DataTypes.INTEGER,
    referralTimeStamp: DataTypes.DATE,
    referralDevice: DataTypes.STRING,
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    googleAuthId: {
      type: DataTypes.STRING,
      unique: true,
    },
    facebookAuthId: {
      type: DataTypes.STRING,
      unique: true,
    },
    verificationCode: DataTypes.INTEGER,
    verificationCodeTimestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    verificationCodeAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    verificationCodeSource: DataTypes.ENUM("WHATSAPP", "SMS", "EMAIL"),
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: DataTypes.DATE,
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fcmToken: DataTypes.STRING,
    lastSeen: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "User",
    indexes: [
      {
        fields: ["email", "username", "phoneNumber"],
      },
    ],
  },
);

// // Define associations
// User.hasMany(Package);
// User.hasMany(Message);
// User.hasMany(Chat, { as: "participantOne", foreignKey: "participantOneId" });
// User.hasMany(Chat, { as: "participantTwo", foreignKey: "participantTwoId" });
// User.hasMany(Notification, { as: "aboutUser", foreignKey: "aboutUserId" });
// User.hasMany(Notification, { as: "notifiedUser", foreignKey: "notifiedUserId" });
// User.hasMany(Poll);
// User.hasMany(PatronCreator, { as: "creatorId", foreignKey: "creatorId" });
// User.hasMany(PatronCreator, { as: "patronId", foreignKey: "patronId" });
// User.hasMany(PostComment);
// User.hasMany(UserPost, { as: "userPostAuthor", foreignKey: "authorId" });
// User.hasMany(UserPost, { as: "likedByUser", foreignKey: "authorId" });
// User.hasMany(Payment);
// User.hasMany(ClickStream);
// User.hasMany(WalletTransactions);
// User.hasMany(Referral, { as: "referralUser", foreignKey: "userId" });
// User.hasMany(Referral, { as: "referralCreator", foreignKey: "creatorId" });
// User.hasMany(AllLinks);
User.hasMany(ClassParticipants);
User.hasMany(ClassMessage);
User.hasMany(Class);

export default User;
