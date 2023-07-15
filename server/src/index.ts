import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import spdy from 'spdy';
import morgan from 'morgan';
import passport from 'passport';
import fs from 'fs';
import crypto from 'crypto';
import session from 'express-session';

dotenv.config();

const app = express();
const secret = crypto
  .generateKeySync('aes', { length: 128 })
  .export()
  .toString('hex');
app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

import { authenticateMiddleware } from './authentication';
import './authentication';

const { PORT, NODE_ENV } = process.env;

const MOCK_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'mock_plan.json'), 'utf8')
);

app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

app.use(passport.initialize());
app.use(passport.session());

const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/localhost-privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/localhost-cert.pem')),
};
const server = spdy.createServer(options, app);

const port = PORT ?? 8000;
server.listen(port, () => {
  console.log('[Server] Listening on port: ' + port + '.');
});

app.use(express.static(path.join(__dirname, '../..', 'client', 'dist')));

// Google OAuth2
// Auth
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

const GOOGLE_AUTH_CALLBACK_ROUTE = '/auth/google/callback';
// Auth Callback
app.get(
  GOOGLE_AUTH_CALLBACK_ROUTE,
  passport.authenticate('google', {
    successRedirect: `${GOOGLE_AUTH_CALLBACK_ROUTE}/success`,
    failureRedirect: `${GOOGLE_AUTH_CALLBACK_ROUTE}/failure`,
  })
);

// Success
app.get(`${GOOGLE_AUTH_CALLBACK_ROUTE}/success`, (req, res) => {
  if (!req.user) res.redirect(`${GOOGLE_AUTH_CALLBACK_ROUTE}/failure`);

  res.json(req.user);
});

// failure
app.get(`${GOOGLE_AUTH_CALLBACK_ROUTE}/failure`, (req, res) => {
  res.status(401).json({ error: 'Error logging in. Please try again.' });
});

app.post('/api/plan', authenticateMiddleware, (req, res) => {
  const {
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  } = req.body;
  console.log(
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories
  );
  res.send(MOCK_DATA);
});

app.get('/plan', (_, res) => {
  res.send(MOCK_DATA);
});
