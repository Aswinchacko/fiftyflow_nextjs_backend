import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).refine((s) => s.startsWith('mongodb'), 'DATABASE_URL must be a MongoDB connection string'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

let _config;
function getConfig() {
  if (!_config) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      console.error('Invalid env:', msg);
      throw new Error(`Invalid environment configuration: ${msg}`);
    }
    _config = parsed.data;
  }
  return _config;
}

export const config = new Proxy({}, {
  get(_, prop) {
    return getConfig()[prop];
  },
});
