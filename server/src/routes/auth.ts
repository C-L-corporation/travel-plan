import express from 'express';
import passport from 'passport';
import {
  FACEBOOK_AUTH_CALLBACK_ROUTE,
  GOOGLE_AUTH_CALLBACK_ROUTE,
  authenticateMiddleware,
} from '../authentication';

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
    successRedirect: `${LANDING_PAGE_ROUTE}planning`,
    failureRedirect: LANDING_PAGE_ROUTE,
  })
);

authRouter.get(
  FACEBOOK_AUTH_CALLBACK_ROUTE,
  passport.authenticate('facebook', {
    successRedirect: `${LANDING_PAGE_ROUTE}planning`,
    failureRedirect: LANDING_PAGE_ROUTE,
  })
);

// Get the current user
authRouter.get('/me', authenticateMiddleware, (req, res) => {
  res.json(req.user);
});

authRouter.get('/logout', authenticateMiddleware, (req, res, next) => {
  req.logout(next);
  res.redirect(LANDING_PAGE_ROUTE);
});

export default authRouter;
