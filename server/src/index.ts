import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const MOCK_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, "mock_plan.json"), 'utf8'));

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, "../..", "client", "dist")));

app.post('/api/plan', (req, res) => {
  const { hotelLocation, days, transportation, city, nation, placeOfInterest, foodCategories } = req.body;
  console.log(hotelLocation, days, transportation, city, nation, placeOfInterest, foodCategories);
  res.send(MOCK_DATA);
});

app.get('/api/plan', (_, res) => {
  res.send(MOCK_DATA);
});



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
