import { UserTransportationType } from '../types';

const joinWithAndWording = (arr: string[]): string => {
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr.join(' and ');
  return `${arr.slice(0, -1).join(', ')}, and ${arr.slice(-1)}`;
};

type Query = {
  hotelLocation: string;
  days: number;
  transportation: UserTransportationType;
  city: string;
  nation: string;
  placeOfInterest: string[];
  foodCategories: string[];
};
/**
 * example:
 * Plan a 3-day trip to Tokyo, Japan, focusing on nature landscapes and museums. The hotel is located in the Shinjuku area. I prefer seafood for meals and want to use public transportation only.
 */
const getUserQuerySentence = ({
  hotelLocation,
  days,
  transportation,
  city,
  nation,
  placeOfInterest,
  foodCategories,
}: Query): string => {
  return `Plan a ${days}-day trip to ${city}, ${nation}${
    placeOfInterest.length > 0
      ? `, focusing on ${joinWithAndWording(placeOfInterest)}.`
      : '.'
  } The hotel is located in ${hotelLocation}. I${
    foodCategories.length > 0
      ? ` prefer ${joinWithAndWording(foodCategories)} for meals and`
      : ''
  } want to use ${transportation.toLowerCase()} transportation only.`;
};

export default getUserQuerySentence;
