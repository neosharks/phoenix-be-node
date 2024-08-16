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
exports.updatePackageSchema = exports.packageSchema = void 0;
const Joi = __importStar(require("joi"));
var PACKAGE_NAMES;
(function (PACKAGE_NAMES) {
    PACKAGE_NAMES["SUPPORT"] = "SUPPORT";
    PACKAGE_NAMES["BRONZE"] = "BRONZE";
    PACKAGE_NAMES["SILVER"] = "SILVER";
    PACKAGE_NAMES["GOLD"] = "GOLD";
    PACKAGE_NAMES["PLATINUM"] = "PLATINUM";
    PACKAGE_NAMES["RUBY"] = "RUBY";
})(PACKAGE_NAMES || (PACKAGE_NAMES = {}));
var TIER_TYPE;
(function (TIER_TYPE) {
    TIER_TYPE["GENERAL_SUPPORT"] = "GENERAL_SUPPORT";
    TIER_TYPE["EXCLUSIVE_POSTS"] = "EXCLUSIVE_POSTS";
    TIER_TYPE["BEHIND_THE_SCENES"] = "BEHIND_THE_SCENES";
    TIER_TYPE["UNLIMITED_MESSAGE"] = "UNLIMITED_MESSAGE";
    TIER_TYPE["ONE_TIME_MESSAGE"] = "ONE_TIME_MESSAGE";
    TIER_TYPE["NAME_POST_DESCRIPTION"] = "NAME_POST_DESCRIPTION";
    TIER_TYPE["NAME_POST_END"] = "NAME_POST_END";
    TIER_TYPE["EXCLUSIVE_POLLS"] = "EXCLUSIVE_POLLS";
    TIER_TYPE["MENTORSHIP"] = "MENTORSHIP";
    TIER_TYPE["COMMUNITY"] = "COMMUNITY";
})(TIER_TYPE || (TIER_TYPE = {}));
exports.packageSchema = Joi.object({
    patronId: Joi.number(),
    creatorId: Joi.number(),
    name: Joi.string().valid(...Object.values(PACKAGE_NAMES)),
    description: Joi.string(),
    postId: Joi.number(),
    userId: Joi.number(),
    username: Joi.string(),
    tiers: Joi.array().items(Joi.string()),
    role: Joi.array().items(Joi.string().valid("PATRON", "CREATOR", "ADMIN")),
    tierType: Joi.string().valid(...Object.values(TIER_TYPE)),
});
exports.updatePackageSchema = Joi.object({
    tier: Joi.array().items(Joi.string().required()),
    tierType: Joi.string().valid(...Object.values(TIER_TYPE)),
    name: Joi.string().valid(...Object.values(PACKAGE_NAMES)),
    price: Joi.number().integer().min(0),
    description: Joi.string(),
});
