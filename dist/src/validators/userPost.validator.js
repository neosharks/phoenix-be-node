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
exports.userPostSchema = void 0;
const Joi = __importStar(require("joi"));
exports.userPostSchema = Joi.object({
    pollId: Joi.number(),
    postId: Joi.number(),
    selectedId: Joi.string(),
    authorId: Joi.number(),
    type: Joi.string(),
    visibility: Joi.string(),
    allowComments: Joi.boolean(),
    email: Joi.string().email().lowercase(),
    firstName: Joi.string().min(1),
    lastName: Joi.string().min(1),
    username: Joi.string(),
    phoneNumber: Joi.string(),
    countryCode: Joi.string(),
    profileImage: Joi.string().uri(),
    coverImage: Joi.string().uri(),
    isCreator: Joi.boolean(),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
    role: Joi.array().items(Joi.string().valid("PATRON", "CREATOR", "ADMIN")),
    description: Joi.string(),
    options: Joi.string(),
    selectedOptions: Joi.string(),
    title: Joi.string(),
    videoUrl: Joi.string(),
    packages: Joi.array().items(Joi.string()),
    userPostId: Joi.number(),
});
