import * as Joi from "joi";

export const packageSchema = Joi.object({
  patronId: Joi.string().required(),
  creatorId: Joi.string().required(),
  type: Joi.string().valid("FREE", "TEXT").required(),
  status: Joi.string().valid("PENDING").required(),
  price: Joi.number().integer().required(),
  name: Joi.string().valid("SUPPORT").required(),
  description: Joi.string().required(),
  userId: Joi.string().required(),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
  userPostId: Joi.string(),
  firstName: Joi.string().min(1),
  lastName: Joi.string().min(1),
  profileImage: Joi.string().uri(),
  email: Joi.string().email().lowercase(),
  username: Joi.string(),
  tiers: Joi.array().items(Joi.string()),
  role: Joi.array().items(Joi.string().valid("PATRON", "CREATOR", "ADMIN")),
  tierType: Joi.string(),
  participantOneId: Joi.string(),
  participantTwoId: Joi.string(),
  unreadCount: Joi.number(),
  pendingAllowed: Joi.string(),
  orderId: Joi.string(),
  packageId: Joi.string(),
  orderID: Joi.string(),
  expiry: Joi.date().iso(),
});

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
