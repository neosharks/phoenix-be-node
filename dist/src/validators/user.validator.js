"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = void 0;
const Joi = __importStar(require("joi"));
exports.userUpdateSchema = Joi.object({
    email: Joi.string().email().lowercase(),
    firstName: Joi.string().min(1),
    lastName: Joi.string().min(1),
    password: Joi.string().min(4),
    phoneNumber: Joi.string(),
    countryCode: Joi.string(),
    profileImage: Joi.string().uri(),
    coverImage: Joi.string().uri(),
    isCreator: Joi.boolean(),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
    role: Joi.array().items(Joi.string().valid("PATRON", "CREATOR", "ADMIN")),
    bio: Joi.string(),
    country: Joi.string().valid("INDIA", "NEPAL", "SRI_LANKA", "BHUTAN", "PAKISTAN"),
    dob: Joi.date().iso(),
    industry: Joi.string().valid("BEAUTY_AND_MAKEUP", "MUSIC", "COMEDY", "PHOTOGRAPHY", "POETRY", "JOURNALISM", "STREAMING", "ESPORTS", "MODELING", "TECHNOLOGY_REVIEWS", "SOFTWARE_DEVELOPMENT", "FITNESS_TRAINING", "NUTRITION", "DIY_CRAFTS", "HOME_RENOVATION", "TRAVEL_BLOGGING", "ADVENTURE", "SCIENCE_COMMUNICATION", "ONLINE_EDUCATION", "LIFE_COACHING", "SOCIAL_ACTIVISM", "ANIMAL_WELFARE", "CULTURAL_INFLUENCE", "HANDMADE_CRAFTS", "CAR_ENTHUSIASTS", "COLLECTING", "HOBBYISTS", "ENTERTAINMENT_INDUSTRY", "VISUAL_ARTS", "WRITING_AND_PUBLISHING", "GAMING", "FASHION_AND_BEAUTY", "COOKING_AND_FOOD", "TECHNOLOGY_AND_GADGETS", "HEALTH_AND_FITNESS", "DIY_AND_HOME_IMPROVEMENT", "TRAVEL_AND_ADVENTURE", "SCIENCE_AND_EDUCATION", "PERSONAL_DEVELOPMENT_AND_MOTIVATION", "PARENTING_AND_FAMILY", "FINANCE_AND_INVESTMENT", "PETS_AND_ANIMALS", "LIFESTYLE_AND_CULTURE", "ARTISANS_AND_CRAFTSMEN", "AUTOMOTIVE_AND_DIY_MECHANICS", "NICHE_HOBBIES"),
    onBoardingComplete: Joi.boolean(),
    onBoardingCompletePercentage: Joi.number().integer().min(0).max(100),
    pageName: Joi.string(),
    youtubeHandle: Joi.string(),
    facebookHandle: Joi.string(),
    twitterHandle: Joi.string(),
    instagramHandle: Joi.string(),
    status: Joi.string().valid("ACTIVE", "INACTIVE", "DELETED", "BLOCKED"),
    referralUserId: Joi.string(),
    referralTimeStamp: Joi.date().iso(),
    referralDevice: Joi.string(),
    emailVerified: Joi.boolean(),
    phoneVerified: Joi.boolean(),
    googleAuthId: Joi.string(),
    facebookAuthId: Joi.string(),
    verificationCode: Joi.number().integer(),
    verificationCodeTimestamp: Joi.date().iso(),
    verificationCodeSource: Joi.string().valid("WHATSAPP", "SMS", "EMAIL"),
    createdAt: Joi.date().iso(),
    updatedAt: Joi.date().iso(),
});
