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
import {
  authRouter,
  planRouter,
  setSystemPrompt,
  setOpenAIClient,
} from './routes';
import { getSystemPrompt } from './utils';
import { Configuration, OpenAIApi } from 'openai';
import { connect } from 'mongoose';

const {
  NODE_ENV,
  SESSION_SECRET,
  PORT,
  SERVER_PORT,
  CHATGPT_API_KEY,
  MONGODB_URL,
} = process.env;

const app = express();

if (!MONGODB_URL) throw new Error('No MongoDB URL provided');
connect(MONGODB_URL)
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err));

if (!CHATGPT_API_KEY) throw new Error('No chatGPT key provided');

const configuration = new Configuration({
  apiKey: CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);
setOpenAIClient(openai);

const port = PORT ?? SERVER_PORT ?? 8000;

app.listen(port, () => {
  console.info('[Server] Listening on port: ' + port + '.');
});

// Read the system prompt
getSystemPrompt()
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

// Trust proxy for IP detection
app.set('trust proxy', 1);
app.use(apiRateLimiter);

app.use('/auth', authRouter);
app.use('/plan', planRouter);

if (NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const swaggerUi = require('swagger-ui-express');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const YAML = require('yamljs');

  const swaggerDocument = YAML.load(
    path.join(__dirname, '../docs/swagger.yaml')
  );

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
