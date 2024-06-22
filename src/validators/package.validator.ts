import * as Joi from "joi";

enum PACKAGE_NAMES {
  SUPPORT = "SUPPORT",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
  RUBY = "RUBY",
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
  tierType: Joi.string(),
});

export const updatePackageSchema = Joi.object({
  tier: Joi.array().items(Joi.string().required()),
  name: Joi.string().valid(...Object.values(PACKAGE_NAMES)),
  price: Joi.number().integer().min(0),
  description: Joi.string(),
});
