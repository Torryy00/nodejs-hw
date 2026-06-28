import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

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
  celebrate({ body: registerUserSchema }),
  registerUser
);

// LOGIN
router.post(
  '/login',
  celebrate({ body: loginUserSchema }),
  loginUser
);

// REFRESH
router.post('/refresh', refreshUserSession);

// LOGOUT
router.post('/logout', logoutUser);

export default router;