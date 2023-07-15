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

import { authenticateMiddleware, GOOGLE_AUTH_CALLBACK_ROUTE } from './authentication';
import './authentication';

const { PORT, NODE_ENV, CLIENT_PORT } = process.env;

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

// Auth Callback
app.get(
  GOOGLE_AUTH_CALLBACK_ROUTE,
  passport.authenticate('google', {
    successRedirect: NODE_ENV === 'development' ? `http://localhost:${CLIENT_PORT}` : '/',
    failureRedirect: NODE_ENV === 'development' ? `http://localhost:${CLIENT_PORT}` : '/',
  })
);

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
