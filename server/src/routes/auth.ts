import express from 'express';
import passport from 'passport';
import createHttpError from 'http-errors';
import {
  FACEBOOK_AUTH_CALLBACK_ROUTE,
  GOOGLE_AUTH_CALLBACK_ROUTE,
  getToken,
  verifyUser,
} from '../authenticate';
import { User } from '../models';

const { NODE_ENV, CLIENT_PORT } = process.env;
const LANDING_PAGE_ROUTE =
  NODE_ENV === 'development' ? `http://localhost:${CLIENT_PORT}/` : '/';

const authRouter = express.Router();

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
      const token = getToken(req.user as string);

      res
        .cookie('token', token, {
          sameSite: true,
          secure: true,
          maxAge: 60 * 1000,
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
  passport.authenticate('facebook', {
    failureRedirect: LANDING_PAGE_ROUTE,
    session: false,
  }),
  async (req, res, next) => {
    try {
      if (!req.user) next(createHttpError(401));
      const token = getToken(req.user as string);

      res
        .cookie('token', token, {
          sameSite: true,
          secure: true,
          maxAge: 60 * 1000,
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
 * /auth/token:
 *   get:
 *     summary: Get authentication token
 *     description: Returns the authentication token for the currently logged in user.
 *     responses:
 *       200:
 *         description: Returns the authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Not authorized.
 */
authRouter.get('/token', async (req, res, next) => {
  try {
    if (!req.user) next(createHttpError(401));
    const token = getToken(req.user as string);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

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
authRouter.get('/me', verifyUser, async (req, res, next) => {
  try {
    if (!req.user) next(createHttpError(401));
    const user = await User.findById(req.user);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout
 *     description: Logs out the currently logged in user and redirects to the landing page.
 *     responses:
 *       302:
 *         description: Redirects to the landing page.
 */
authRouter.get('/logout', verifyUser, (req, res, next) => {
  res.clearCookie('token');
  res.redirect(LANDING_PAGE_ROUTE);
});

export default authRouter;
