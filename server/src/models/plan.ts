import { Schema, model, ObjectId } from 'mongoose';
import { UserQuery } from '../types';

type EventType = 'ACTIVITY' | 'MEAL';

type TransportationType = 'TRAIN' | 'WALK' | 'DRIVE';
type Transportation = {
  type: TransportationType;
  duration: number;
  from: string;
  to: string;
};
type Event = {
  id: number;
  startAt: number;
  endAt: number;
  description: string;
  type: EventType;
  location: string;
  transportation: Transportation[];
};

type IPlan = {
  name: string;
  user: ObjectId;
  createdAt: Date;
  query: UserQuery;
  querySentence: string;
  gptResponse: {
    name: string;
    hotelLocation: string;
    itinerary: {
      day: number;
      date: number;
      events: Event[];
    }[];
  };
};

const planSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: new Date() },
  query: {
    days: { type: Number, required: true },
    hotelLocation: { type: String, required: true },
    transportation: { type: String, required: true },
    city: { type: String, required: true },
    nation: { type: String, required: true },
    placeOfInterest: { type: [String], required: true },
    foodCategories: { type: [String], required: true },
  },
  querySentence: { type: String, required: true },
  gptResponse: {
    name: { type: String, required: true },
    hotelLocation: { type: String, required: true },
    itinerary: [
      {
        day: { type: Number, required: true },
        date: { type: Number, required: true },
        events: [
          {
            id: { type: Number, required: true },
            startAt: { type: Number, required: true },
            endAt: { type: Number, required: true },
            description: { type: String, required: true },
            type: { type: String, required: true },
            location: { type: String, required: true },
            transportation: [
              {
                type: { type: String, required: true },
                duration: { type: Number, required: true },
                from: { type: String, required: true },
                to: { type: String, required: true },
              },
            ],
          },
        ],
      },
    ],
  },
});

const Plan = model<IPlan>('Plan', planSchema);

export { Plan, IPlan };
