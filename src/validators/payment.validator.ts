import * as Joi from "joi";

export const paymentSchema = Joi.object({
  orderId: Joi.string(),
  packageId: Joi.string(),
});
