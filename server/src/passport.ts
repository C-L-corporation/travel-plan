import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '', // Your Credentials here.
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '', // Your Credentials here.
      callbackURL: 'http://localhost:8000/auth/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
