import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

passport.serializeUser(function (user: any, cb) {
  process.nextTick(() => {
    if (user.provider === 'google') {
      return cb(null, {
        id: user.id,
        username: user.displayName,
        picture: user.picture,
        email: user.email,
        provider: user.provider,
      });
    }
    cb(null, user);
  });
});

passport.deserializeUser(function (user: any, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export const GOOGLE_AUTH_CALLBACK_ROUTE = '/google/callback';
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID ?? '',
      clientSecret: GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: `/auth${GOOGLE_AUTH_CALLBACK_ROUTE}`,
    },
    function (accessToken, refreshToken, user, cb) {
      return cb(null, user);
    }
  )
);

export { passport };
