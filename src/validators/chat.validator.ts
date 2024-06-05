import * as Joi from "joi";

export const chatSchema = Joi.object({
  chatId: Joi.string(),
  senderId: Joi.number(),
  contentType: Joi.string(),
  message: Joi.string(),
  participants: Joi.array().items(Joi.string()),
  participantOne: Joi.string(),
  participantTwo: Joi.string(),
});
