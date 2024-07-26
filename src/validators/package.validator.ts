import * as Joi from "joi";

enum PACKAGE_NAMES {
  SUPPORT = "SUPPORT",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
  RUBY = "RUBY",
}

enum TIER_TYPE {
  GENERAL_SUPPORT = "GENERAL_SUPPORT",
  EXCLUSIVE_POSTS = "EXCLUSIVE_POSTS",
  BEHIND_THE_SCENES = "BEHIND_THE_SCENES",
  UNLIMITED_MESSAGE = "UNLIMITED_MESSAGE",
  ONE_TIME_MESSAGE = "ONE_TIME_MESSAGE",
  NAME_POST_DESCRIPTION = "NAME_POST_DESCRIPTION",
  NAME_POST_END = "NAME_POST_END",
  EXCLUSIVE_POLLS = "EXCLUSIVE_POLLS",
  MENTORSHIP = "MENTORSHIP",
  COMMUNITY = "COMMUNITY",
}

export const packageSchema = Joi.object({
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

export const updatePackageSchema = Joi.object({
  tier: Joi.array().items(Joi.string().required()),
  tierType: Joi.string().valid(...Object.values(TIER_TYPE)),
  name: Joi.string().valid(...Object.values(PACKAGE_NAMES)),
  price: Joi.number().integer().min(0),
  description: Joi.string(),
});
