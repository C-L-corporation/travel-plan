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

if (!GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID not set');
if (!GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET not set');

// Google passport strategy
const GOOGLE_AUTH_CALLBACK_ROUTE = '/google/callback';
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
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
          console.info(
            'New user from Google (user id: %s) created',
            profile.id
          );
        } else {
          if (user.providers.every((p) => p.userId !== profile.id)) {
            user.providers.push({
              userId: profile.id,
              provider: profile.provider,
            });
            user.updateAt = new Date();
            await user.save();
            console.info(
              `Google added to user ${user._id.toString()} new provider`
            );
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

if (!FACEBOOK_APP_ID) throw new Error('FACEBOOK_APP_ID not set');
if (!FACEBOOK_APP_SECRET) throw new Error('FACEBOOK_APP_SECRET not set');

// Facebook passport strategy
const FACEBOOK_AUTH_CALLBACK_ROUTE = '/facebook/callback';
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
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
          console.info(
            'New user from Facebook (user id: %s) created',
            profile.id
          );
        } else {
          if (user.providers.every((p) => p.userId !== profile.id)) {
            user.providers.push({
              userId: profile.id,
              provider: profile.provider,
            });
            user.updateAt = new Date();
            await user.save();
            console.info(
              `Facebook added to user ${user._id.toString()} new provider`
            );
          }
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
