import express from 'express';
import fs from 'fs';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import { ObjectId } from 'mongodb';
import createHttpError from 'http-errors';
import { Configuration, OpenAIApi } from 'openai';
import dontenv from 'dotenv';

import { UserWithParsedId, verifyUser } from '../authenticate';
import { User } from '../models';
import { IPlan, Plan } from '../models/plan';
import { isDeepEqual, getUserPrompt, validateUserQuery } from '../utils';

dontenv.config();

// ChatGPT setup
const MOCK_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../mock_plan.json'), 'utf8')
);
const { CHATGPT_API_KEY } = process.env;
if (!CHATGPT_API_KEY) throw new Error('CHATGPT_API_KEY is not defined');

const configuration = new Configuration({
  apiKey: CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

let systemPrompt: string | null = null;
// The prompt should be set before this module is imported
export function setSystemPrompt(newPrompt: string): void {
  systemPrompt = newPrompt;
}

const planRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  handler: (req, res, next) => {
    next(
      createHttpError(
        429,
        'Your requests are being made too rapidly. Please pause for a minute before resubmitting'
      )
    );
  },
});

const gptRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  // TODO: change back to 3
  max: 3,
  handler: (req, res, next) => {
    next(
      createHttpError(
        429,
        "You've exceeded the maximum number of GPT calls for today. Please retry tomorrow."
      )
    );
  },
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
      ).populate({
        path: 'plans',
        options: { sort: { createdAt: -1 }, limit: 1 },
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
      return res.json(latestPlan);
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
    const userPrompt = getUserPrompt({
      hotelLocation,
      days,
      transportation,
      city,
      nation,
      placeOfInterest,
      foodCategories,
    });

    if (systemPrompt === null) {
      next(createHttpError(500, 'Missing system prompt'));
      return;
    }

    console.info(
      `[${(req.user as UserWithParsedId).name} (${
        (req.user as UserWithParsedId).id
      })]: ${userPrompt}`
    );
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      temperature: 0.7,
      max_tokens: 12_000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const gptMessage = chatCompletion.data.choices[0].message;
    if (!gptMessage || !gptMessage.content) {
      next(createHttpError(500, 'Missing GPT message'));
      return;
    }
    const gptResponse = JSON.parse(gptMessage.content);

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
      userPrompt,
      gptResponse,
    });

    await Promise.all([
      plan.save(),
      User.findByIdAndUpdate((req.user as UserWithParsedId).id, {
        $push: { plans: plan._id },
        $set: { updatedAt: plan.createdAt },
      }),
    ]);

    res.json(gptResponse);
  } catch (err) {
    next(err);
  }
});

export default planRouter;
