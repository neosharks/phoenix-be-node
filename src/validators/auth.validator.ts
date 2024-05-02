import * as Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().min(1),
  lastName: Joi.string().min(1),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase(),
  password: Joi.string().min(4).required(),
});

export const sendOtpSchema = Joi.object({
  number: Joi.string(),
});
export const resetPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(4),
  newPassword: Joi.string().min(4),
});
export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});
export const verifyForgetPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  code: Joi.number(),
  password: Joi.string().min(4),
});
export const loginViaNumberSchema = Joi.object({
  phoneNumber: Joi.string(),
  otp: Joi.string().min(6),
});
