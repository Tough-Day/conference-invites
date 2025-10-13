import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Allowed domain for email restriction
const ALLOWED_DOMAIN = 'tough.day';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract email from profile
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Check if email domain is allowed
        const emailDomain = email.split('@')[1];
        if (emailDomain !== ALLOWED_DOMAIN) {
          return done(
            new Error(`Access denied. Only @${ALLOWED_DOMAIN} email addresses are allowed.`),
            undefined
          );
        }

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Create new user
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: email,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            },
          });
        } else {
          // Update existing user info
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
