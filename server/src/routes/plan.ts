import express from 'express';
import fs from 'fs';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import { UserWithParsedId, verifyUser } from '../authenticate';
import createHttpError from 'http-errors';
import { User } from '../models';
import { IPlan } from '../models/plan';
import { isDeepEqual, getUserQuerySentence } from '../utils';

const MOCK_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../mock_plan.json'), 'utf8')
);

const planRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: 'Plan too many times, please try again in a minute.',
});

const gptRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: 3,
  message: 'Call GPT too many times, please try again in a minute.',
});

const planRouter = express.Router();
planRouter.use(express.json());

planRouter.post(
  '/same-query-check',
  planRateLimiter,
  verifyUser,
  async (req, res, next) => {
    try {
      const {
        hotelLocation,
        days,
        transportation,
        city,
        nation,
        placeOfInterest,
        foodCategories,
      } = req.body;

      if (
        !hotelLocation ||
        !days ||
        !transportation ||
        !city ||
        !nation ||
        !placeOfInterest ||
        !foodCategories
      ) {
        next(createHttpError(400, 'Missing required fields'));
      }

      if (days < 1 || days > 7) {
        next(createHttpError(400, 'Days must be between 1 and 7'));
      }

      if (!req.user) next(createHttpError(401));
      const user = await User.findById(
        (req.user as UserWithParsedId).id
      ).populate({
        path: 'plans',
        options: { sort: { createdAt: -1 } }, // sort in descending order
      });

      if (!user) {
        next(createHttpError(401));
        return;
      }

      if (user.plans.length > 0) {
        const [latestPlan] = user.plans as unknown as IPlan[];

        return (
          latestPlan.query.hotelLocation === hotelLocation &&
          latestPlan.query.days === days &&
          latestPlan.query.transportation === transportation &&
          latestPlan.query.city === city &&
          latestPlan.query.nation === nation &&
          isDeepEqual(latestPlan.query.placeOfInterest, placeOfInterest) &&
          isDeepEqual(latestPlan.query.foodCategories, foodCategories)
        );
      }
      return false;
    } catch (err) {
      next(err);
    }
  }
);

planRouter.get(
  '/previous',
  planRateLimiter,
  verifyUser,
  async (req, res, next) => {
    if (!req.user) next(createHttpError(401));

    const user = await User.findById(
      (req.user as UserWithParsedId).id
    ).populate({
      path: 'plans',
      options: { sort: { createdAt: -1 } }, // sort in descending order
    });

    if (!user) {
      next(createHttpError(401));
      return;
    }
    const [latestPlan] = user.plans as unknown as IPlan[];
    return res.send(latestPlan);
  }
);

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
planRouter.post('/', gptRateLimiter, verifyUser, async (req, res, next) => {
  const {
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  } = req.body;

  const querySentence = getUserQuerySentence({
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  });
  console.info(querySentence);

  res.send(MOCK_DATA);
});

export default planRouter;
