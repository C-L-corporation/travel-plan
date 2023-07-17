import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import spdy from 'spdy';
import morgan from 'morgan';
import fs from 'fs';
import session from 'express-session';
import createHttpError from 'http-errors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { connect } from 'mongoose';

dotenv.config();
if (process.env.NODE_ENV === 'development')
  dotenv.config({ path: path.join(__dirname, '../../.env.development') });

import { passport, verifyUser } from './authenticate';
import { authRouter } from './routes';

const { NODE_ENV, SESSION_SECRET, SERVER_PORT, MONGODB_URL } = process.env;

const app = express();

// Connect to MongoDB
connect(MONGODB_URL ?? '')
  .then(() => {
    console.info('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(helmet());
app.use(
  session({
    secret: SESSION_SECRET ?? 'wonderful-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/localhost-privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/localhost-cert.pem')),
};
const server = spdy.createServer(options, app);

const port = SERVER_PORT ?? 8000;
server.listen(port, () => {
  console.info('[Server] Listening on port: ' + port + '.');
});

app.use(express.static(path.join(__dirname, '../..', 'client', 'dist')));

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Maximum number of requests allowed per minute
});

app.use('/auth', apiRateLimiter, authRouter);

const MOCK_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'mock_plan.json'), 'utf8')
);
app.post('/plan', verifyUser, apiRateLimiter, (req, res) => {
  const {
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  } = req.body;
  console.info(
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

// TODO: remove this route
app.get('/plan', (_, res) => {
  res.send(MOCK_DATA);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createHttpError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = NODE_ENV === 'development' ? err : {};

  res.status(err.status ?? 500);
  res.json({
    message: err.message,
    error: err,
  });
});
