import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { authConfig } from './auth';
import { AuthRepository } from '../repositories/auth.repository';
import type { JwtPayload } from '../types/auth.types';

if (authConfig.google.clientId && authConfig.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: authConfig.google.clientId,
        clientSecret: authConfig.google.clientSecret,
        callbackURL: authConfig.google.callbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'), false);
          }

          let user = await AuthRepository.findByGoogleId(profile.id);

          if (!user) {
            user = await AuthRepository.findByEmail(email);

            if (user) {
              user = await AuthRepository.linkGoogleAccount(user.id, profile.id);
            } else {
              user = await AuthRepository.createUser({
                email,
                firstName: profile.name?.givenName || 'GoogleUser',
                lastName: profile.name?.familyName || '',
                role: 'CUSTOMER',
                googleId: profile.id,
                emailVerified: true,
                avatar: profile.photos?.[0]?.value,
              });
            }
          }

          const payload: JwtPayload = {
            userId: user.id,
            role: user.role,
            companyId: user.companyId,
          };

          return done(null, payload);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
} else {
  console.warn('⚠️ Google OAuth Client ID or Client Secret is missing. Google Login will be disabled.');
}

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
