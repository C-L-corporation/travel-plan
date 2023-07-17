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
authRouter.use(express.json());

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

// Get the current user
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

authRouter.get('/logout', verifyUser, (req, res, next) => {
  res.clearCookie('token');
  res.redirect(LANDING_PAGE_ROUTE);
});

export default authRouter;
