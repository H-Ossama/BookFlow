import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

export const authConfig = {
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET'),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
  },
};

