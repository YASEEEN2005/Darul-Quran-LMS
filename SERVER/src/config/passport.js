const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma } = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Check if user exists by googleId
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        if (!user) {
          // If not found by GoogleId, check if email exists (whitelisted by Admin)
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // User was whitelisted, update with googleId
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId, name: user.name || name },
            });
          } else {
            // User completely new - auto register but NOT approved
            user = await prisma.user.create({
              data: {
                googleId,
                email,
                name,
                role: 'STUDENT',
                approved: false, // Must be approved by admin
              },
            });
          }
        }

        // Return user to passport
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
