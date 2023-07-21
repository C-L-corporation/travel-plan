import express from 'express';
import passport from 'passport';
import createHttpError from 'http-errors';
import type { ObjectId } from 'mongoose';
import { rateLimit } from 'express-rate-limit';

import {
  FACEBOOK_AUTH_CALLBACK_ROUTE,
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
  max: 5,
  message: 'Login too many times, please try again in a minute.',
});

// Auth
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     description: Redirects to Google for authentication, asking for profile and email permissions.
 *     responses:
 *       302:
 *         description: Redirect to Google's OAuth consent screen.
 */
authRouter.get(
  '/google',
  authRateLimiter,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Authenticate with Facebook
 *     description: Redirects to Facebook for authentication, asking for public profile and email permissions.
 *     responses:
 *       302:
 *         description: Redirect to Facebook's OAuth consent screen.
 */
authRouter.get(
  '/facebook',
  authRateLimiter,
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);

// Auth Callback
authRouter.get(
  GOOGLE_AUTH_CALLBACK_ROUTE,
  authRateLimiter,
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

authRouter.get(
  FACEBOOK_AUTH_CALLBACK_ROUTE,
  authRateLimiter,
  passport.authenticate('facebook', {
    failureRedirect: LANDING_PAGE_ROUTE,
    session: false,
  }),
  async (req, res, next) => {
    try {
      if (!req.user) next(createHttpError(401));

      const { _id, ...rest } = req.user as UserWithId;
      const token = generateToken({ id: _id.toString(), ...rest });

      console.info(
        `[ID: ${_id.toString()}] token generated: ${
          NODE_ENV === 'development'
            ? token
            : `${token.slice(0, 3)}...${token.slice(-3)}`
        }`
      );
      res
        .cookie('token', token, {
          sameSite: true,
          secure: true,
          maxAge: 2 * 60 * 1000,
          path: '/planning',
        })
        .clearCookie('connect.sid')
        .redirect(`${LANDING_PAGE_ROUTE}planning`);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Retrieve the authenticated user's information
 *     description: This API route retrieves the authenticated user's data based on JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's information was retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. The user needs to login.
 */
authRouter.get('/me', authRateLimiter, verifyUser, async (req, res, next) => {
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
