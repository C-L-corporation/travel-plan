import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '', // Your Credentials here.
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '', // Your Credentials here.
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
