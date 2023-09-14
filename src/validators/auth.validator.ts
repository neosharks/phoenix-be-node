import * as Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  firstName: Joi.string().min(1).required(),
  password: Joi.string().min(4).required(),
  lastName: Joi.string().min(1).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
});

export default { registerSchema, loginSchema };
