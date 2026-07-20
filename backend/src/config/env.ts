const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

const optionalWithWarning = [
  'REDIS_URL',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'FROM_EMAIL',
  'STRIPE_SECRET_KEY',
] as const;

export function validateEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('   See .env.example for reference.');
    process.exit(1);
  }

  for (const k of optionalWithWarning) {
    if (!process.env[k]) {
      console.warn(`⚠️  Optional env var ${k} is not set. Related features may not work.`);
    }
  }

  console.log('✅ Environment variables validated');
}
