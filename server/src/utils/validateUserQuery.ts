import { UserQuery, UserTransportationType } from '../types';

const isTransportationType = (
  transportation: string
): transportation is UserTransportationType =>
  transportation === 'PUBLIC' || transportation === 'PRIVATE';

const isValidArray = (arr: unknown): arr is string[] =>
  Array.isArray(arr) && arr.every((item) => typeof item === 'string');

const validateUserQuery = (
  query: UserQuery
): { valid: true; message: null } | { valid: false; message: string } => {
  const {
    hotelLocation,
    days,
    transportation,
    city,
    nation,
    placeOfInterest,
    foodCategories,
  } = query;

  if (
    !hotelLocation ||
    !days ||
    !transportation ||
    !city ||
    !nation ||
    !placeOfInterest ||
    !foodCategories
  ) {
    return { valid: false, message: 'Missing required fields' };
  }

  if (days < 2 || days > 7) {
    return { valid: false, message: 'Days must be between 2 and 7' };
  }

  if (!isValidArray(placeOfInterest) || !isValidArray(foodCategories)) {
    return { valid: false, message: 'Invalid array input' };
  }

  if (!isTransportationType(transportation)) {
    return { valid: false, message: 'Invalid transportation type' };
  }

  return { valid: true, message: null };
};

export default validateUserQuery;
