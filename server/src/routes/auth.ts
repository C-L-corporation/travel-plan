import express from 'express';
import passport from 'passport';
import createHttpError from 'http-errors';
import type { ObjectId } from 'mongoose';
import { rateLimit } from 'express-rate-limit';

import {
  // FACEBOOK_AUTH_CALLBACK_ROUTE,
  GOOGLE_AUTH_CALLBACK_ROUTE,
  generateToken,
  verifyUser,
  type UserWithParsedId,
} from '../authenticate';
import { User, type IUser } from '../models';

const { NODE_ENV, CLIENT_PORT } = process.env;
const LANDING_PAGE_ROUTE =
  NODE_ENV === 'development' ? `http://localhost:${CLIENT_PORT}/` : '/';

const authRouter = express.Router();

type UserWithId = IUser & { _id: ObjectId };

const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  handler: (req, res, next) => {
    next(
      createHttpError(
        429,
        'Too many login attempts. Please try again in one minute.'
      )
    );
  },
});

authRouter.use(authRateLimiter);

// Auth
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);

// Auth Callback
authRouter.get(
  GOOGLE_AUTH_CALLBACK_ROUTE,
  passport.authenticate('google', {
    failureRedirect: LANDING_PAGE_ROUTE,
    session: false,
  }),
  async (req, res, next) => {
    try {
      if (!req.user) next(createHttpError(401));

      const { _id, ...rest } = req.user as UserWithId;
      const token = generateToken({ id: _id.toString(), ...rest });

      console.info(`[ID: ${_id.toString()}] token generated: ${token}`);
      res
        .cookie('token', token, {
          sameSite: true,
          secure: true,
          maxAge: 60 * 1000,
          path: '/planning',
        })
        .clearCookie('connect.sid')
        .redirect(`${LANDING_PAGE_ROUTE}planning`);
    } catch (err) {
      next(err);
    }
  }
);

// authRouter.get(
//   FACEBOOK_AUTH_CALLBACK_ROUTE,
//   passport.authenticate('facebook', {
//     failureRedirect: LANDING_PAGE_ROUTE,
//     session: false,
//   }),
//   async (req, res, next) => {
//     try {
//       if (!req.user) next(createHttpError(401));

//       const { _id, ...rest } = req.user as UserWithId;
//       const token = generateToken({ id: _id.toString(), ...rest });

//       console.info(
//         `[ID: ${_id.toString()}] token generated: ${
//           NODE_ENV === 'development'
//             ? token
//             : `${token.slice(0, 3)}...${token.slice(-3)}`
//         }`
//       );
//       res
//         .cookie('token', token, {
//           sameSite: true,
//           secure: true,
//           maxAge: 2 * 60 * 1000,
//           path: '/planning',
//         })
//         .clearCookie('connect.sid')
//         .redirect(`${LANDING_PAGE_ROUTE}planning`);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

authRouter.get('/me', verifyUser, async (req, res, next) => {
  try {
    if (!req.user) next(createHttpError(401));

    const user = await User.findById((req.user as UserWithParsedId).id);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default authRouter;
