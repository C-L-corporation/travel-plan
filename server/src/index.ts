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

import { passport } from './authenticate';
import { authRouter, planRouter } from './routes';

const { NODE_ENV, SESSION_SECRET, PORT, SERVER_PORT, MONGODB_URL } =
  process.env;

const app = express();

// Connect to MongoDB
connect(MONGODB_URL ?? '')
  .then(() => {
    console.info('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(err);
  });

if (NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const swaggerUi = require('swagger-ui-express');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const swaggerJsdoc = require('swagger-jsdoc');

  const options = {
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'Travel plan API',
        version: '1.0.0',
      },
    },
    apis: [
      path.resolve(__dirname, '../docs/components.yaml'),
      `${__dirname}/routes/*.ts`,
    ],
  };

  const specs = swaggerJsdoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.info('Swagger UI available at /api-docs');
}

const server = spdy.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'ssl/localhost-privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl/localhost-cert.pem')),
  },
  app
);

const port = PORT ?? SERVER_PORT ?? 8000;
server.listen(port, () => {
  console.info('[Server] Listening on port: ' + port + '.');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(helmet());
if (!SESSION_SECRET) throw new Error('SESSION_SECRET not set');
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../..', 'client', 'dist')));

const loginRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Maximum number of requests allowed per minute
});

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  // TODO: save result to db, along with timestamp, user_id, input
  max: 30, // Maximum number of requests allowed per minute
});

app.use('/auth', loginRateLimiter, authRouter);
app.use('/plan', apiRateLimiter, planRouter);

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
