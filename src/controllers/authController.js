import createHttpError from 'http-errors';

import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

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