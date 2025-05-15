import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import prisma from '../lib/prisma.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy.Strategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/oauth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: profile.displayName,
          email,
          username: profile.id,
          storeName: 'Social Store',
          phoneNumber: '0000000000',
          password: 'SOCIAL_AUTH',
        },
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new FacebookStrategy.Strategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: '/api/oauth/facebook/callback',
  profileFields: ['id', 'emails', 'name', 'displayName'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: profile.displayName,
          email,
          username: profile.id,
          storeName: 'Social Store',
          phoneNumber: '0000000000',
          password: 'SOCIAL_AUTH',
        },
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

export default passport;
