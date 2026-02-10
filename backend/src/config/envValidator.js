/**
 * Environment Variables Validator (ZOD)
 * Valida e tipifica variáveis de environment no startup
 */

const { z } = require('zod');

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  
  // Database
  DATABASE_URL: z.string().includes('://'),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default('7d'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  
  // Email (SMTP)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Twilio
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  TWILIO_WHATSAPP_FROM: z.string().optional(),
  
  // PIX
  PIX_WEBHOOK_SECRET: z.string().min(32),
  
  // Sentry
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.string().default('development'),
  
  // S3/Upload
  AWS_S3_BUCKET: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  
  // Redis (optional)
  REDIS_URL: z.string().optional(),
  
  // 2FA / ENCRYPTION
  ENCRYPTION_KEY: z.string().min(32).optional(),
  TWO_FACTOR_ISSUER: z.string().default('Leidy Cleaner'),
});

/**
 * Valida e retorna env vars tipificadas
 * @throws {Error} Se validação falhar
 */
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:');
    if (error.errors) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw new Error('Invalid environment configuration');
  }
}

module.exports = {
  validateEnv,
  envSchema
};
