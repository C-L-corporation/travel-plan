import express from 'express';
import fs from 'fs';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import { UserWithParsedId, verifyUser } from '../authenticate';
import createHttpError from 'http-errors';
import { User } from '../models';
import { IPlan, Plan } from '../models/plan';
import { isDeepEqual, getUserQuerySentence, validateUserQuery } from '../utils';
import { ObjectId } from 'mongodb';

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
  // TODO: change back to 3
  max: 10000,
  message: 'Call GPT too many times, please try again in a minute.',
});

const planRouter = express.Router();
planRouter.use(express.json());

/**
 * @swagger
 * /plan/same-query-check:
 *   post:
 *     summary: Checks if the new query matches the latest one
 *     tags:
 *       - Plan
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hotelLocation
 *               - days
 *               - transportation
 *               - city
 *               - nation
 *               - placeOfInterest
 *               - foodCategories
 *             properties:
 *               hotelLocation:
 *                 type: string
 *               days:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 7
 *               transportation:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE]
 *               city:
 *                 type: string
 *               nation:
 *                 type: string
 *               placeOfInterest:
 *                 type: array
 *                 items:
 *                   type: string
 *               foodCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Boolean indicating if the new query matches the latest one
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       400:
 *         description: Missing required fields or invalid inputs
 *       401:
 *         description: Unauthorized
 */
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

      const { valid, message } = validateUserQuery({
        hotelLocation,
        days,
        transportation,
        city,
        nation,
        placeOfInterest,
        foodCategories,
      });

      if (!valid) {
        next(createHttpError(400, message));
      }

      if (!req.user) next(createHttpError(401));
      const user = await User.findById(
        (req.user as UserWithParsedId).id
      ).populate({ path: 'plans', options: { sort: { createdAt: -1 }, limit: 1 } });

      if (!user) {
        next(createHttpError(401));
        return;
      }

      if (user.plans.length > 0) {
        const [latestPlan] = (user.plans as unknown as IPlan[]);

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

/**
 * @swagger
 * /plan/latest:
 *  get:
 *    summary: Get the latest plan of the current user
 *    tags:
 *      - Plans
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      '200':
 *        description: The latest plan was returned successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Plan'
 *      '401':
 *        description: No authorization or user not found.
 *      '500':
 *        description: Unexpected error.
 */
planRouter.get(
  '/latest',
  planRateLimiter,
  verifyUser,
  async (req, res, next) => {
    if (!req.user) next(createHttpError(401));

    try {
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
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /plan/new:
 *   post:
 *     summary: Create a new travel plan
 *     tags:
 *       - Plan
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hotelLocation
 *               - days
 *               - transportation
 *               - city
 *               - nation
 *               - placeOfInterest
 *               - foodCategories
 *             properties:
 *               hotelLocation:
 *                 type: string
 *               days:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 7
 *               transportation:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE]
 *               city:
 *                 type: string
 *               nation:
 *                 type: string
 *               placeOfInterest:
 *                 type: array
 *                 items:
 *                   type: string
 *               foodCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: The created travel plan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Missing required fields or invalid inputs
 *       401:
 *         description: Unauthorized
 */
planRouter.post('/new', gptRateLimiter, verifyUser, async (req, res, next) => {
  const {
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  } = req.body;

  // TODO: remove it
  console.log('request', {
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  });
  const { valid, message } = validateUserQuery({
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  });

  if (!valid) {
    next(createHttpError(400, message));
  }
  try {
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

    const plan = new Plan({
      name: `${(req.user as UserWithParsedId).name}-${MOCK_DATA.name}`,
      user: new ObjectId((req.user as UserWithParsedId).id),
      query: {
        hotelLocation,
        days,
        transportation,
        city,
        nation,
        placeOfInterest,
        foodCategories,
      },
      querySentence,
      gptResponse: MOCK_DATA,
    });

    await plan.save();

    await User.findByIdAndUpdate((req.user as UserWithParsedId).id, {
      $push: { plans: plan._id },
      $set: { updatedAt: plan.createdAt },
    });

    res.send(MOCK_DATA);
  } catch (err) {
    next(err);
  }
});

export default planRouter;
