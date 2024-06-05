import * as Joi from "joi";

export const paymentSchema = Joi.object({
  orderId: Joi.number(),
  packageId: Joi.number(),
});
