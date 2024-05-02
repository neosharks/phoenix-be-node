import * as Joi from "joi";

enum PACKAGE_NAMES {
  SUPPORT = "SUPPORT",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
  RUBY = "RUBY",
}

export const updatePackageSchema = Joi.object({
  tier: Joi.array().items(Joi.string().required()),
  name: Joi.string().valid(...Object.values(PACKAGE_NAMES)),
  price: Joi.number().integer().min(0),
  description: Joi.string(),
});
