import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { Session } from '../models/session.js';
import { User } from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw createHttpError(401, 'Missing access token');
    }

    let session;

    try {
      jwt.verify(accessToken, JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Access token expired');
    }

    session = await Session.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};