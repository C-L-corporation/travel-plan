import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  SESSION_SECRET,
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

// JWT passport strategy
export const getToken = (user) =>
  jwt.sign(user, SESSION_SECRET ?? 'wonderful-secret', { expiresIn: '1d' });

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SESSION_SECRET ?? 'wonderful-secret',
    },
    async function (jwtPayload, done) {
      try {
        const user = await User.findById(jwtPayload.id);
        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// Google passport strategy
export const GOOGLE_AUTH_CALLBACK_ROUTE = '/google/callback';
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID ?? '',
      clientSecret: GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: `/auth${GOOGLE_AUTH_CALLBACK_ROUTE}`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const email = profile.emails?.[0].value ?? null;

        const query = email
          ? { email }
          : {
              providers: {
                $elemMatch: { userId: profile.id, provider: profile.provider },
              },
            };
        let user = await User.findOne(query);

        if (!user) {
          user = new User({
            name: profile.displayName,
            providers: [{ userId: profile.id, provider: profile.provider }],
            photo: profile.photos?.[0]?.value ?? null,
            email: profile.emails?.[0].value ?? null,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
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
    async function (accessToken, refreshToken, profile, done) {
      try {
        const email = profile.emails?.[0].value ?? null;

        const query = email
          ? { email }
          : {
              providers: {
                $elemMatch: { userId: profile.id, provider: profile.provider },
              },
            };
        let user = await User.findOne(query);

        if (!user) {
          user = new User({
            name: profile.displayName,
            providers: [{ userId: profile.id, provider: profile.provider }],
            photo: profile.photos?.[0]?.value ?? null,
            email: profile.emails?.[0].value ?? null,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export { passport };
