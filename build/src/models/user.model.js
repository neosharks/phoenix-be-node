"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const message_model_1 = __importDefault(require("./message.model"));
const chat_model_1 = __importDefault(require("./chat.model"));
const notification_model_1 = __importDefault(require("./notification.model"));
const patronCreator_model_1 = __importDefault(require("./patronCreator.model"));
const userPost_model_1 = __importDefault(require("./userPost.model"));
const postComment_model_1 = __importDefault(require("./postComment.model"));
const clickStream_model_1 = __importDefault(require("./clickStream.model"));
const walletTransactions_model_1 = __importDefault(require("./walletTransactions.model"));
const class_model_1 = __importDefault(require("./class.model"));
const classMessage_model_1 = __importDefault(require("./classMessage.model"));
const classParticipants_model_1 = __importDefault(require("./classParticipants.model"));
const referral_model_1 = __importDefault(require("./referral.model"));
const User = sequelize_2.sequelize.define("User", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: sequelize_1.DataTypes.STRING,
    lastName: sequelize_1.DataTypes.STRING,
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    whatsappNumber: sequelize_1.DataTypes.STRING,
    countryCode: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "+91",
    },
    profileImage: sequelize_1.DataTypes.STRING,
    coverImage: sequelize_1.DataTypes.STRING,
    isCreator: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    gender: sequelize_1.DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
    role: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.ENUM("PATRON", "CREATOR", "ADMIN")),
        defaultValue: ["PATRON"],
    },
    bio: sequelize_1.DataTypes.STRING,
    country: {
        type: sequelize_1.DataTypes.ENUM("INDIA", "NEPAL", "SRI_LANKA", "BHUTAN", "PAKISTAN"),
        defaultValue: "INDIA",
    },
    dob: sequelize_1.DataTypes.DATE,
    industry: sequelize_1.DataTypes.ENUM("BEAUTY_AND_MAKEUP", "MUSIC", "COMEDY", "PHOTOGRAPHY", "POETRY", "JOURNALISM", "STREAMING", "ESPORTS", "MODELING", "TECHNOLOGY_REVIEWS", "SOFTWARE_DEVELOPMENT", "FITNESS_TRAINING", "NUTRITION", "DIY_CRAFTS", "HOME_RENOVATION", "TRAVEL_BLOGGING", "ADVENTURE", "SCIENCE_COMMUNICATION", "ONLINE_EDUCATION", "LIFE_COACHING", "SOCIAL_ACTIVISM", "ANIMAL_WELFARE", "CULTURAL_INFLUENCE", "HANDMADE_CRAFTS", "CAR_ENTHUSIASTS", "COLLECTING", "HOBBYISTS", "ENTERTAINMENT_INDUSTRY", "VISUAL_ARTS", "WRITING_AND_PUBLISHING", "GAMING", "FASHION_AND_BEAUTY", "COOKING_AND_FOOD", "TECHNOLOGY_AND_GADGETS", "HEALTH_AND_FITNESS", "DIY_AND_HOME_IMPROVEMENT", "TRAVEL_AND_ADVENTURE", "SCIENCE_AND_EDUCATION", "PERSONAL_DEVELOPMENT_AND_MOTIVATION", "PARENTING_AND_FAMILY", "FINANCE_AND_INVESTMENT", "PETS_AND_ANIMALS", "LIFESTYLE_AND_CULTURE", "ARTISANS_AND_CRAFTSMEN", "AUTOMOTIVE_AND_DIY_MECHANICS", "NICHE_HOBBIES"),
    onBoardingComplete: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    onBoardingCompletePercentage: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    pageName: sequelize_1.DataTypes.STRING,
    youtubeHandle: sequelize_1.DataTypes.STRING,
    facebookHandle: sequelize_1.DataTypes.STRING,
    twitterHandle: sequelize_1.DataTypes.STRING,
    instagramHandle: sequelize_1.DataTypes.STRING,
    creatorApprovalStatus: {
        type: sequelize_1.DataTypes.ENUM("PENDING", "APPROVED", "DENIED", "UNINITIATED"),
        defaultValue: "UNINITIATED",
    },
    creatorChangeTimeStamp: sequelize_1.DataTypes.DATE,
    status: {
        type: sequelize_1.DataTypes.ENUM("ACTIVE", "INACTIVE", "DELETED", "BLOCKED"),
        defaultValue: "ACTIVE",
    },
    password: sequelize_1.DataTypes.STRING,
    referralUserId: sequelize_1.DataTypes.INTEGER,
    referralTimeStamp: sequelize_1.DataTypes.DATE,
    referralDevice: sequelize_1.DataTypes.STRING,
    emailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    phoneVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    googleAuthId: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    facebookAuthId: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    verificationCode: sequelize_1.DataTypes.INTEGER,
    verificationCodeTimestamp: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    verificationCodeAttempts: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    verificationCodeSource: {
        type: sequelize_1.DataTypes.ENUM("WHATSAPP", "SMS", "EMAIL"),
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: sequelize_1.DataTypes.DATE,
    online: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    fcmToken: sequelize_1.DataTypes.STRING,
    lastSeen: sequelize_1.DataTypes.DATE,
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "User",
    indexes: [
        {
            fields: ["email", "username", "phoneNumber"],
        },
    ],
});
// // Define associations
User.hasMany(chat_model_1.default, { as: "participantOne", foreignKey: "participantOneId" });
User.hasMany(chat_model_1.default, { as: "participantTwo", foreignKey: "participantTwoId" });
User.hasMany(notification_model_1.default, { as: "aboutUser", foreignKey: "aboutUserId" });
User.hasMany(notification_model_1.default, { as: "notifiedUser", foreignKey: "notifiedUserId" });
User.hasMany(userPost_model_1.default, { as: "userPostAuthor", foreignKey: "authorId" });
User.hasMany(userPost_model_1.default, { as: "likedByUser", foreignKey: "authorId" });
User.hasMany(referral_model_1.default, { as: "referralUser", foreignKey: "userId" });
User.hasMany(referral_model_1.default, { as: "referralCreator", foreignKey: "creatorId" });
User.hasMany(postComment_model_1.default);
User.hasMany(classMessage_model_1.default);
User.hasMany(class_model_1.default);
User.hasMany(classParticipants_model_1.default);
classParticipants_model_1.default.belongsTo(class_model_1.default, { foreignKey: "classId" });
class_model_1.default.hasMany(classParticipants_model_1.default, { foreignKey: "classId" });
classParticipants_model_1.default.belongsTo(User, { foreignKey: "userId" });
User.hasMany(classParticipants_model_1.default, { foreignKey: "userId" });
//ClickStream associate
clickStream_model_1.default.belongsTo(User, { foreignKey: "userId" });
User.hasMany(clickStream_model_1.default);
// Class Associate
User.hasMany(class_model_1.default, { foreignKey: "creatorId" });
User.hasMany(class_model_1.default, {
    foreignKey: "creatorId",
    as: "classes",
});
class_model_1.default.belongsTo(User, {
    foreignKey: "creatorId",
    as: "creator",
});
class_model_1.default.belongsTo(User, { foreignKey: "creatorId" });
User.hasMany(classParticipants_model_1.default, { foreignKey: "userId" });
class_model_1.default.hasMany(classParticipants_model_1.default, { foreignKey: "classId" });
class_model_1.default.hasMany(classParticipants_model_1.default, { foreignKey: "classId", as: "participants" });
class_model_1.default.hasMany(classMessage_model_1.default, { foreignKey: "classId", as: "messages" });
class_model_1.default.hasMany(userPost_model_1.default, { foreignKey: "classId", as: "posts" });
// ClassParticipants associate
classParticipants_model_1.default.belongsTo(class_model_1.default, { foreignKey: "classId" });
classParticipants_model_1.default.belongsTo(User, { foreignKey: "userId" });
//Chat associate
chat_model_1.default.belongsTo(User, { as: "participantOne", foreignKey: "participantOneId" });
chat_model_1.default.belongsTo(User, { as: "participantTwo", foreignKey: "participantTwoId" });
chat_model_1.default.hasMany(message_model_1.default, { foreignKey: "chatId", onDelete: "CASCADE" });
// ClassMessage associate
classMessage_model_1.default.belongsTo(class_model_1.default, { foreignKey: "classId" });
classMessage_model_1.default.belongsTo(User, { foreignKey: "userId" });
classMessage_model_1.default.belongsTo(classMessage_model_1.default, { as: "repliedMessage", foreignKey: "repliedMessageId" });
classMessage_model_1.default.hasMany(classMessage_model_1.default, { as: "replies", foreignKey: "repliedMessageId" });
//Message associate
User.hasMany(message_model_1.default);
message_model_1.default.belongsTo(chat_model_1.default, { foreignKey: "chatId" });
message_model_1.default.belongsTo(User, { as: "sender", foreignKey: "senderId" });
//Notification associate
notification_model_1.default.belongsTo(User, { as: "aboutUser", foreignKey: "aboutUserId" });
notification_model_1.default.belongsTo(User, { as: "notifiedUser", foreignKey: "notifiedUserId" });
//PatronCreator associate
patronCreator_model_1.default.belongsTo(User, { as: "patron", foreignKey: "patronId" });
patronCreator_model_1.default.belongsTo(User, { as: "creator", foreignKey: "creatorId" });
User.hasMany(patronCreator_model_1.default, { as: "creatorId", foreignKey: "creatorId" });
User.hasMany(patronCreator_model_1.default, { as: "patronId", foreignKey: "patronId" });
//PostComment associate
postComment_model_1.default.belongsTo(User, { as: "author", foreignKey: "authorId" });
postComment_model_1.default.belongsTo(userPost_model_1.default, { foreignKey: "userPostId" });
//Referral associate
referral_model_1.default.belongsTo(User, { as: "creator", foreignKey: "creatorId" });
referral_model_1.default.belongsTo(User, { as: "user", foreignKey: "userId" });
userPost_model_1.default.belongsTo(User, { as: "author", foreignKey: "authorId" });
userPost_model_1.default.belongsToMany(User, { through: "LikedBy", as: "likedBy" });
walletTransactions_model_1.default.belongsTo(User, { foreignKey: "userId" });
exports.default = User;
