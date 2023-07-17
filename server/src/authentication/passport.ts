import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} = process.env;

passport.serializeUser(function (user: any, cb) {
  process.nextTick(() => {
    cb(null, user);
  });
});

passport.deserializeUser(function (user: any, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Google passport strategy
export const GOOGLE_AUTH_CALLBACK_ROUTE = '/google/callback';
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID ?? '',
      clientSecret: GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: `/auth${GOOGLE_AUTH_CALLBACK_ROUTE}`,
    },
    function (accessToken, refreshToken, user, cb) {
      return cb(null, {
        accountId: user.id,
        username: user.displayName,
        photo: user.photos?.[0]?.value ?? null,
        email: user.emails?.[0] ?? null,
        provider: user.provider,
      });
    }
  )
);

// Facebook passport strategy
export const FACEBOOK_AUTH_CALLBACK_ROUTE = '/facebook/callback';
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID ?? '',
      clientSecret: FACEBOOK_APP_SECRET ?? '',
      callbackURL: `/auth${FACEBOOK_AUTH_CALLBACK_ROUTE}`,
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    function (accessToken, refreshToken, user, cb) {
      return cb(null, {
        accountId: user.id,
        username: user.displayName,
        photo: user.photos?.[0]?.value ?? null,
        email: user.emails?.[0] ?? null,
        provider: user.provider,
      });
    }
  )
);

export { passport };
