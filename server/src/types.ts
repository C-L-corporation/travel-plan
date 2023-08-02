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
