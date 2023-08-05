export type UserTransportationType = 'PUBLIC' | 'PRIVATE';

export type UserQuery = {
  days: number;
  hotelLocation: string;
  transportation: UserTransportationType;
  city: string;
  nation: string;
  placeOfInterest: string[];
  foodCategories: string[];
};

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
export type GptResponse = {
  name: string;
  hotelLocation: string;
  itinerary: {
    day: number;
    date: number;
    events: Event[];
  }[];
};
