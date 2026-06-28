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

const authRouter = Router();

// REGISTER
authRouter.post(
  '/register',
  celebrate({ body: registerUserSchema }),
  registerUser,
);

// LOGIN
authRouter.post(
  '/login',
  celebrate({ body: loginUserSchema }),
  loginUser,
);

// ❗ logout БЕЗ authenticate
authRouter.post('/logout', logoutUser);

// ❗ refresh БЕЗ authenticate
authRouter.post('/refresh', refreshUserSession);

// REQUEST RESET EMAIL
authRouter.post(
  '/request-reset-email',
  celebrate({ body: requestResetEmailSchema }),
  requestResetEmail,
);

// RESET PASSWORD
authRouter.post(
  '/reset-password',
  celebrate({ body: resetPasswordSchema }),
  resetPassword,
);

export default authRouter;