import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

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

export const GOOGLE_AUTH_CALLBACK_ROUTE = '/auth/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: GOOGLE_AUTH_CALLBACK_ROUTE,
    },
    function (accessToken, refreshToken, user, cb) {
      return cb(null, user);
    }
  )
);
