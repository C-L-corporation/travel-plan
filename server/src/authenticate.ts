import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { type IUser, User } from './models';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  JWT_SECRET,
} = process.env;

// JWT passport strategy
if (!JWT_SECRET) throw new Error('JWT_SECRET not set');
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
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

type UserWithParsedId = IUser & { id: string };
const generateToken = (user: UserWithParsedId) =>
  jwt.sign(user, JWT_SECRET, {
    expiresIn: '1h',
  });

const verifyUser = passport.authenticate('jwt', { session: false });

// Google passport strategy
const GOOGLE_AUTH_CALLBACK_ROUTE = '/google/callback';
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

        const update = {
          $setOnInsert: {
            name: profile.displayName,
            photo: profile.photos?.[0]?.value ?? null,
            email: profile.emails?.[0].value ?? null,
          },
          $addToSet: {
            providers: { userId: profile.id, provider: profile.provider },
          },
        };

        // Set the upsert option to true to create a new document if no document matches the query
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // The user should always exist after upserting
        const user = await User.findOneAndUpdate(query, update, options);

        if (!user) throw new Error('Unexpected error while upserting user');

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// Facebook passport strategy
const FACEBOOK_AUTH_CALLBACK_ROUTE = '/facebook/callback';
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

export {
  passport,
  GOOGLE_AUTH_CALLBACK_ROUTE,
  FACEBOOK_AUTH_CALLBACK_ROUTE,
  generateToken,
  verifyUser,
  UserWithParsedId,
};
