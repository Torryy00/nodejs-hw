import Joi from 'joi';

// регистрация пользователя (если уже есть — не трогай)
export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// логин (если уже есть — не трогай)
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// 🔥 REQUEST RESET EMAIL
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// 🔥 RESET PASSWORD
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  token: Joi.string().required(),
});