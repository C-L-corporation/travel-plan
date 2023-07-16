import express from 'express';
import passport from 'passport';
import { GOOGLE_AUTH_CALLBACK_ROUTE, authenticateMiddleware } from '../authentication';

const { NODE_ENV, CLIENT_PORT } = process.env;

const authRouter = express.Router();
authRouter.use(express.json());

// Auth
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Auth Callback
authRouter.get(
  GOOGLE_AUTH_CALLBACK_ROUTE,
  passport.authenticate('google', {
    successRedirect:
      NODE_ENV === 'development'
        ? `http://localhost:${CLIENT_PORT}/planning`
        : '/planning',
    failureRedirect:
      NODE_ENV === 'development' ? `http://localhost:${CLIENT_PORT}` : '/',
  })
);

// Get the current user
authRouter.get('/me', authenticateMiddleware, (req, res) => {
    res.json(req.user);
  });

export default authRouter;