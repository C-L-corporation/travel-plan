import createHttpError from 'http-errors';

export const authenticateMiddleware = (req, res, next) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  }

  // User is not authenticated, send a 401 Unauthorized response
  return next(createHttpError(401, 'Please login to access'));
};
