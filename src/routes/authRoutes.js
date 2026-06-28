import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';

import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// 🔐 AUTH
router.post(
  '/register',
  celebrate({ body: registerUserSchema }),
  registerUser,
);

router.post(
  '/login',
  celebrate({ body: loginUserSchema }),
  loginUser,
);

router.post('/logout', authenticate, logoutUser);

router.post('/refresh', authenticate, refreshUserSession);

// 📧 RESET PASSWORD FLOW
router.post(
  '/request-reset-email',
  celebrate({ body: requestResetEmailSchema }),
  requestResetEmail,
);

router.post(
  '/reset-password',
  celebrate({ body: resetPasswordSchema }),
  resetPassword,
);

export default router;