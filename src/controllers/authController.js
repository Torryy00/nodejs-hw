import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

import { createSession, setSessionCookies } from '../services/auth.js';

import bcrypt from 'bcrypt';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    // ❗ FIX: должно быть 400, а не 409
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

    // ❗ FIX: удалить старые сессии (обязательно по ревью)
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

      return res.status(401).json({
        message: 'Session token expired',
      });
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