import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import spdy from 'spdy';
import morgan from 'morgan';
import fs from 'fs';
import crypto from 'crypto';
import session from 'express-session';
import createHttpError from 'http-errors';
import { passport, authenticateMiddleware } from './authentication';
import { authRouter } from './routes';

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

app.use('/auth', authRouter);

app.post('/plan', authenticateMiddleware, (req, res) => {
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
