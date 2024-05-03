import * as Joi from "joi";

export const chatSchema = Joi.object({
  chatId: Joi.string(),
  senderId: Joi.string(),
  firstName: Joi.string().min(1),
  lastName: Joi.string().min(1),
  profileImage: Joi.string().uri(),
  email: Joi.string().email().lowercase(),
  username: Joi.string(),
  role: Joi.array().items(Joi.string().valid("PATRON", "CREATOR", "ADMIN")),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
  unreadCount: Joi.number().integer(),
  pendingAllowed: Joi.string(),
  message: Joi.string(),
  contentType: Joi.string(),
  type: Joi.string().valid("ONE_TO_ONE"),
  participants: Joi.array().items(Joi.string()),
  participantOne: Joi.string(),
  participantTwo: Joi.string(),
});

export const paginationSchema = Joi.object({
  skip: Joi.number().integer().min(0).default(0),
  take: Joi.number().integer().min(1).default(10),
});
