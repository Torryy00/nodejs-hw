import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';

const router = Router();

// REGISTER
router.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  registerUser
);

// LOGIN
router.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  loginUser
);

// REFRESH (без body)
router.post('/refresh', refreshUserSession);

// LOGOUT (без body)
router.post('/logout', logoutUser);

export default router;