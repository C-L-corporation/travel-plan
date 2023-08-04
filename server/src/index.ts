import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import session from 'express-session';
import createHttpError from 'http-errors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

dotenv.config();
if (process.env.NODE_ENV === 'development')
  dotenv.config({ path: path.join(__dirname, '../../.env.development') });

import { passport } from './authenticate';
import { authRouter, planRouter, setSystemPrompt, setOpenAIClient } from './routes';
import { connectToDb, getOpenAIClient, getSystemPrompt } from './utils';

const {
  NODE_ENV,
  SESSION_SECRET,
  PORT,
  SERVER_PORT,
  STORAGE_PATH,
} = process.env;

const app = express();

connectToDb();

getOpenAIClient().then((openai) => {
  console.info('Got openai client');
  setOpenAIClient(openai);
}).catch((error) => { console.error(error) });

const port = PORT ?? SERVER_PORT ?? 8000;
app.listen(port, () => {
  console.info('[Server] Listening on port: ' + port + '.');
});

if (NODE_ENV === 'production' && !STORAGE_PATH) {
  throw new Error('No google cloud storage path provided');
}
const [projectId, bucketName, fileName] = (STORAGE_PATH?? '').split('::');
// Read the system prompt
getSystemPrompt({ projectId, bucketName, fileName })
  .then((content: string) => {
    if (typeof content === 'string') {
      console.info('Got system prompt');
      setSystemPrompt(content);
    } else {
      throw new Error('System prompt not found');
    }
  })
  .catch((error) => {
    console.error(error);
  });

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

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Maximum number of requests allowed per minute
  handler: (req, res, next) => {
    next(
      createHttpError(
        429,
        'Your requests are being made too rapidly. Please pause for a minute before resubmitting.'
      )
    );
  },
});
app.use(apiRateLimiter);
app.use('/auth', authRouter);
app.use('/plan', planRouter);

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
    tags: [
      { name: 'Auth', description: 'APIs related to authentication' },
      { name: 'Plans', description: 'APIs for managing plans' },
    ],
    apis: [
      path.resolve(__dirname, '../docs/components.yaml'),
      `${__dirname}/routes/*.ts`,
    ],
  };

  const specs = swaggerJsdoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.info('Swagger UI available at /api-docs');
}

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
