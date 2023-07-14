import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import spdy from 'spdy';
import fs from 'fs';

const MOCK_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'mock_plan.json'), 'utf8')
);

dotenv.config();

const app = express();
const port = process.env.PORT;
const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/localhost-privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/localhost-cert.pem')),
};
const server = spdy.createServer(options, app);

server.listen(port, () => {
    console.log('[Server] Listening on port: ' + port + '.')
});

app.use(express.static(path.join(__dirname, '../..', 'client', 'dist')));

app.post('/api/plan', (req, res) => {
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


