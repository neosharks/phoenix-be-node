import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare username: string;
  declare phoneNumber: string;
  declare whatsappNumber: string;
  declare countryCode: string;
  declare profileImage: string;
  declare coverImage: string;
  declare isCreator: boolean;
  declare gender: "MALE" | "FEMALE" | "OTHER";
  declare role: Array<"PATRON" | "CREATOR" | "ADMIN">;
  declare bio: string;
  declare country: "INDIA" | "NEPAL" | "SRI_LANKA" | "BHUTAN" | "PAKISTAN";
  declare dob: Date;
  declare industry: string;
  declare onBoardingComplete: boolean;
  declare onBoardingCompletePercentage: number;
  declare pageName: string;
  declare youtubeHandle: string;
  declare facebookHandle: string;
  declare twitterHandle: string;
  declare instagramHandle: string;
  declare creatorApprovalStatus: "PENDING" | "APPROVED" | "DENIED" | "UNINITIATED";
  declare creatorChangeTimeStamp: Date;
  declare status: "ACTIVE" | "INACTIVE" | "DELETED" | "BLOCKED";
  declare password: string;
  declare referralUserId: ForeignKey<User["id"]>;
  declare referralTimeStamp: Date;
  declare referralDevice: string;
  declare emailVerified: boolean;
  declare phoneVerified: boolean;
  declare googleAuthId: string;
  declare facebookAuthId: string;
  declare verificationCode: number;
  declare verificationCodeTimestamp: Date;
  declare verificationCodeAttempts: number;
  declare verificationCodeSource: "WHATSAPP" | "SMS" | "EMAIL";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare online: boolean;
  declare fcmToken: string;
  declare lastSeen: Date;
  static associate(models: any) {
    User.hasMany(models.Package, { foreignKey: "creatorId" });
    User.hasMany(models.Message, { foreignKey: "senderId" });
    User.hasMany(models.Chat, { as: "participantOne", foreignKey: "participantOneId" });
    User.hasMany(models.Chat, { as: "participantTwo", foreignKey: "participantTwoId" });
    User.hasMany(models.Notification, { as: "aboutUser", foreignKey: "aboutUserId" });
    User.hasMany(models.Notification, { as: "notifiedUser", foreignKey: "notifiedUserId" });
    User.hasMany(models.Poll, { foreignKey: "authorId" });
    User.hasMany(models.PatronCreator, { as: "creatorId", foreignKey: "creatorId" });
    User.hasMany(models.PatronCreator, { as: "patronId", foreignKey: "patronId" });
    User.hasMany(models.PostComment, { foreignKey: "authorId" });
    User.hasMany(models.UserPost, { as: "userPostAuthor", foreignKey: "authorId" });
    User.belongsToMany(models.UserPost, {
      through: "UserPostLikes",
      as: "likedByUser",
      foreignKey: "userId",
    });
    User.hasMany(models.Class, { foreignKey: "creatorId" });
    User.hasMany(models.Payment, { foreignKey: "userId" });
    User.hasMany(models.ClickStream, { foreignKey: "userId" });
    User.hasMany(models.WalletTransactions, { foreignKey: "userId" });
    User.hasMany(models.Referral, { as: "referralUser", foreignKey: "userId" });
    User.hasMany(models.Referral, { as: "referralCreator", foreignKey: "creatorId" });
    User.hasMany(models.AllLinks, { foreignKey: "userId" });
    User.hasMany(models.ClassParticipants, { foreignKey: "userId" });
    User.hasMany(models.ClassMessage, { foreignKey: "userId" });
  }
}

User.init(
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
    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
      allowNull: true,
    },
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
    googleAuthId: { type: DataTypes.STRING, unique: true },
    facebookAuthId: { type: DataTypes.STRING, unique: true },
    verificationCode: DataTypes.INTEGER,
    verificationCodeTimestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    verificationCodeAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    verificationCodeSource: { type: DataTypes.ENUM("WHATSAPP", "SMS", "EMAIL"), allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: DataTypes.DATE,
    online: { type: DataTypes.BOOLEAN, defaultValue: false },
    fcmToken: DataTypes.STRING,
    lastSeen: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "User",
    indexes: [{ fields: ["email", "username", "phoneNumber"] }],
  },
);

// Associations

export default User;
