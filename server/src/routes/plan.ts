import express from 'express';
import fs from 'fs';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import { ObjectId } from 'mongodb';
import createHttpError from 'http-errors';
import { OpenAIApi } from 'openai';
import dontenv from 'dotenv';

import { UserWithParsedId, verifyUser } from '../authenticate';
import { User } from '../models';
import { IPlan, Plan } from '../models/plan';
import { isDeepEqual, getUserPrompt, validateUserQuery } from '../utils';
import { GptResponse } from '../types';

dontenv.config();

// ChatGPT setup
const MOCK_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../mock_plan.json'), 'utf8')
);

let systemPrompt: string | null = null;
// The prompt should be set before this module is imported
export function setSystemPrompt(newPrompt: string): void {
  systemPrompt = newPrompt;
}

let openAIClient: OpenAIApi | null = null;
export function setOpenAIClient(openai: OpenAIApi): void {
  openAIClient = openai;
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
    if (systemPrompt === null) {
      next(createHttpError(500, 'Missing system prompt'));
      return;
    }
    if (openAIClient === null) {
      next(createHttpError(500, 'Missing OpenAI client'));
      return;
    }

    const userPrompt = getUserPrompt({
      hotelLocation,
      days,
      transportation,
      city,
      nation,
      placeOfInterest,
      foodCategories,
    });

    console.info(
      `[${(req.user as UserWithParsedId).name} (${
        (req.user as UserWithParsedId).id
      })]: ${userPrompt}`
    );
    const chatCompletion = await openAIClient.createChatCompletion({
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
    const gptResponse: GptResponse = JSON.parse(gptMessage.content);

    const plan = new Plan({
      name: `${(req.user as UserWithParsedId).name}-${gptResponse.name}`,
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
