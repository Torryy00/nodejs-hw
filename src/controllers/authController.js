import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { sendEmail } from '../utils/sendMail.js';

// ===================== REGISTER =====================
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(createHttpError(400, 'Email in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const session = await createSession(newUser._id);

    setSessionCookies(res, session);

    return res.status(201).json({
      user: {
        email: newUser.email,
        id: newUser._id,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===================== LOGIN =====================
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(createHttpError(401, 'Email or password is wrong'));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(createHttpError(401, 'Email or password is wrong'));
    }

    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);

    setSessionCookies(res, session);

    return res.status(200).json({
      user: {
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===================== LOGOUT =====================
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ===================== REFRESH =====================
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      return next(createHttpError(401, 'No session data'));
    }

    const session = await Session.findOne({
      _id: sessionId,
      refreshToken,
    });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    if (session.refreshTokenValidUntil < new Date()) {
      await Session.deleteOne({ _id: sessionId });

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('sessionId');

      return next(createHttpError(401, 'Session token expired'));
    }

    const userId = session.userId;

    await Session.deleteOne({ _id: sessionId });

    const newSession = await createSession(userId);
    setSessionCookies(res, newSession);

    return res.status(200).json({
      message: 'Session refreshed',
    });
  } catch (err) {
    next(err);
  }
};

// ===================== REQUEST RESET EMAIL =====================
export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    }

    const token = jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'reset-password-email.html',
    );

    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);

    const html = template({
      name: user.email,
      link: resetLink,
    });

    await sendEmail({
      to: email,
      subject: 'Reset password',
      html,
    });

    return res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  } catch {
    return next(
      createHttpError(500, 'Failed to send the email, please try again later.'),
    );
  }
};

// ===================== RESET PASSWORD =====================
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    const user = await User.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: user._id },
      { password: hashedPassword },
    );

    return res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (err) {
    next(err);
  }
};