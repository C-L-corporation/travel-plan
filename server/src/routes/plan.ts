import express from 'express';
import fs from 'fs';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import { verifyUser } from '../authenticate';

const MOCK_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../mock_plan.json'), 'utf8')
);

const gptRateLimiter = rateLimit({
  // TODO: change this to 1 hour
  windowMs: 60 * 1000, // 1 minute
  // TODO: change this to 3
  max: 5,
  message: 'Call GPT too many times, please try again in a minute.',
});

const planRouter = express.Router();
planRouter.use(express.json());

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a plan
 *     tags: [Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelLocation:
 *                 type: string
 *               days:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *                 description: The number of days in the plan. Must be between 1 and 7.
 *               transportation:
 *                 type: string
 *               city:
 *                 type: string
 *               nation:
 *                 type: string
 *               placeOfInterest:
 *                 type: string
 *               foodCategories:
 *                 type: string
 *     responses:
 *       200:
 *         description: The plan was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Bad request. Days must be between 1 and 7.
 */
planRouter.post('/', gptRateLimiter, verifyUser, (req, res) => {
  const {
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  } = req.body;
  if (days < 1 || days > 7) {
    return res.status(400).send('Days must be between 1 and 7');
  }

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
planRouter.get('/', (_, res) => {
  res.send(MOCK_DATA);
});

export default planRouter;
