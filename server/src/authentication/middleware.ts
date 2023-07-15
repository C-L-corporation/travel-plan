export const authenticateMiddleware = (req, res, next) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      // User is authenticated, proceed to the next middleware or route handler
      return next();
    } else {
      // User is not authenticated, send a 401 Unauthorized response
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
