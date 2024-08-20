"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const Message = require("./message.models");
const Chat = require("./chat.models");
const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
    },
    whatsappNumber: {
        type: DataTypes.STRING,
    },
    countryCode: {
        type: DataTypes.STRING,
        defaultValue: "+91",
    },
    profileImage: {
        type: DataTypes.STRING,
    },
    coverImage: {
        type: DataTypes.STRING,
    },
    isCreator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    gender: {
        type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
    },
    role: {
        type: DataTypes.ARRAY(DataTypes.ENUM("PATRON", "CREATOR", "ADMIN")),
        defaultValue: ["PATRON"],
    },
    bio: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.ENUM("INDIA", "USA", "UK", "NEPAL", "SRI_LANKA", "BHUTAN", "PAKISTAN"),
        defaultValue: "INDIA",
    },
    dob: {
        type: DataTypes.DATE,
    },
    industry: {
        type: DataTypes.ENUM("BEAUTY_AND_MAKEUP", "MUSIC", "COMEDY", "PHOTOGRAPHY", "POETRY", "JOURNALISM", "STREAMING", "ESPORTS", "MODELING", "TECHNOLOGY_REVIEWS", "SOFTWARE_DEVELOPMENT", "FITNESS_TRAINING", "NUTRITION", "DIY_CRAFTS", "HOME_RENOVATION", "TRAVEL_BLOGGING", "ADVENTURE", "SCIENCE_COMMUNICATION", "ONLINE_EDUCATION", "LIFE_COACHING", "SOCIAL_ACTIVISM", "ANIMAL_WELFARE", "CULTURAL_INFLUENCE", "HANDMADE_CRAFTS", "CAR_ENTHUSIASTS", "COLLECTING", "HOBBYISTS", "ENTERTAINMENT_INDUSTRY", "VISUAL_ARTS", "WRITING_AND_PUBLISHING", "GAMING", "FASHION_AND_BEAUTY", "COOKING_AND_FOOD", "TECHNOLOGY_AND_GADGETS", "HEALTH_AND_FITNESS", "DIY_AND_HOME_IMPROVEMENT", "TRAVEL_AND_ADVENTURE", "SCIENCE_AND_EDUCATION", "PERSONAL_DEVELOPMENT_AND_MOTIVATION", "PARENTING_AND_FAMILY", "FINANCE_AND_INVESTMENT", "PETS_AND_ANIMALS", "LIFESTYLE_AND_CULTURE", "ARTISANS_AND_CRAFTSMEN", "AUTOMOTIVE_AND_DIY_MECHANICS", "NICHE_HOBBIES"),
    },
    onBoardingComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    onBoardingCompletePercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    pageName: {
        type: DataTypes.STRING,
    },
    youtubeHandle: {
        type: DataTypes.STRING,
    },
    facebookHandle: {
        type: DataTypes.STRING,
    },
    twitterHandle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instagramHandle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    creatorApprovalStatus: {
        type: DataTypes.ENUM("UNINITIATED", "PENDING", "APPROVED", "REJECTED"),
        defaultValue: "UNINITIATED",
    },
    creatorChangeTimeStamp: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE", "BANNED"),
        defaultValue: "ACTIVE",
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    referralUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    referralTimeStamp: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    referralDevice: {
        type: DataTypes.STRING,
        allowNull: true,
    },
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
        allowNull: true,
    },
    facebookAuthId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    verificationCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    verificationCodeTimestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    verificationCodeAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    verificationCodeSource: {
        type: DataTypes.ENUM("SMS", "EMAIL", "CALL"),
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    fcmToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastSeen: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    indexes: [
        {
            fields: ["email", "username", "phoneNumber"],
        },
    ],
});
// Associations
User.hasMany(Message);
User.hasMany(Chat);
exports.default = User;
