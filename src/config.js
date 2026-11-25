import { existsSync } from 'node:fs';

// Load .env without dependencies (Node 21.7+). Real environment variables win.
if (existsSync('.env')) {
  try { process.loadEnvFile('.env'); } catch { /* malformed .env: fall back to the environment */ }
}

/** Build the runtime config from an env object. Exported for tests. */
export function loadConfig(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const list = v => String(v || '').split(',').map(s => s.trim()).filter(Boolean);
  const config = {
    production,
    port: Number(env.PORT) || 3000,
    baseUrl: (env.BASE_URL || `http://localhost:${Number(env.PORT) || 3000}`).replace(/\/$/, ''),
    databasePath: env.DATABASE_PATH || 'data/altareq.db',
    seedDemo: env.SEED_DEMO ? env.SEED_DEMO === 'true' : !production,
    logLevel: env.LOG_LEVEL || 'info',
    email: {
      provider: env.EMAIL_PROVIDER || 'console',
      from: env.EMAIL_FROM || 'Al Tareq <hello@example.com>',
      resendKey: env.RESEND_API_KEY || '',
    },
    payments: {
      provider: env.PAYMENTS_PROVIDER || 'demo',
      paymob: {
        baseUrl: (env.PAYMOB_BASE_URL || 'https://accept.paymob.com').replace(/\/$/, ''),
        secretKey: env.PAYMOB_SECRET_KEY || '',
        publicKey: env.PAYMOB_PUBLIC_KEY || '',
        hmacSecret: env.PAYMOB_HMAC_SECRET || '',
        integrationIds: list(env.PAYMOB_INTEGRATION_IDS).map(Number).filter(Number.isFinite),
      },
    },
    video: {
      bunnyLibraryId: env.BUNNY_LIBRARY_ID || '',
      bunnyTokenKey: env.BUNNY_TOKEN_KEY || '',
      ttl: Number(env.VIDEO_URL_TTL) || 7200,
    },
    backup: { dir: env.BACKUP_DIR || 'data/backups', keep: Number(env.BACKUP_KEEP) || 14 },
    ai: {
      provider: env.AI_PROVIDER || 'demo',
      // Providers: demo (canned), gemini (Google AI Studio free tier), openai (any OpenAI-compatible API such as Groq or
      // OpenRouter), anthropic (Claude, paid). gemini and openai share one client.
      apiKey: (env.AI_PROVIDER === 'anthropic' ? env.ANTHROPIC_API_KEY : (env.AI_API_KEY || env.GEMINI_API_KEY)) || '',
      baseUrl: (env.AI_BASE_URL || env.ANTHROPIC_BASE_URL || (env.AI_PROVIDER === 'gemini' ? 'https://generativelanguage.googleapis.com/v1beta/openai' : env.AI_PROVIDER === 'openai' ? 'https://api.groq.com/openai/v1' : 'https://api.anthropic.com')).replace(/\/$/, ''),
      modelChat: env.AI_MODEL_CHAT || (env.AI_PROVIDER === 'gemini' ? 'gemini-3.8-flash' : env.AI_PROVIDER === 'openai' ? 'openai/gpt-oss-120b' : 'claude-sonnet-5-5'),
      modelFast: env.AI_MODEL_FAST || (env.AI_PROVIDER === 'gemini' ? 'gemini-3.8-flash' : env.AI_PROVIDER === 'openai' ? 'openai/gpt-oss-20b' : 'claude-haiku-4-5-20251001'),
      // USD per million tokens [input, output]. Free providers cost nothing, so their default price is 0.
      globalDailyLimit: num(env.AI_GLOBAL_DAILY_LIMIT, 400),
      priceChat: [num(env.AI_PRICE_CHAT_IN, ['gemini', 'openai'].includes(env.AI_PROVIDER) ? 0 : 2), num(env.AI_PRICE_CHAT_OUT, ['gemini', 'openai'].includes(env.AI_PROVIDER) ? 0 : 10)],
      priceFast: [num(env.AI_PRICE_FAST_IN, ['gemini', 'openai'].includes(env.AI_PROVIDER) ? 0 : 1), num(env.AI_PRICE_FAST_OUT, ['gemini', 'openai'].includes(env.AI_PROVIDER) ? 0 : 5)],
      timeoutMs: num(env.AI_TIMEOUT_MS, 30_000),
      retryDelayMs: num(env.AI_RETRY_DELAY_MS, 1500),
      historyDays: num(env.AI_HISTORY_DAYS, 90),
      dailyLimit: num(env.AI_DAILY_LIMIT || env.AI_DAILY_LIMIT_FREE, 30),
      monthlyBudgetUsd: num(env.AI_MONTHLY_BUDGET_USD, 50),
      maxInputChars: num(env.AI_MAX_INPUT_CHARS, 1500),
      maxOutputTokens: num(env.AI_MAX_OUTPUT_TOKENS, 600),
      perMinute: num(env.AI_RATE_PER_MINUTE, 10),
      experiment: env.AI_EXPERIMENT === 'on',
      search: env.AI_SEARCH === 'keyword' ? 'keyword' : 'auto',
    },
    coach: {
      inactiveDays: num(env.COACH_INACTIVE_DAYS, 3),
      minGapHours: num(env.COACH_MIN_GAP_HOURS, 48),
      maxPerWeek: num(env.COACH_MAX_PER_WEEK, 3),
      quietStart: num(env.COACH_QUIET_START, 22),
      quietEnd: num(env.COACH_QUIET_END, 9),
    },
    // Shown when a learner seems to be in distress. Fill in verified Egyptian support contacts.
    supportResources: env.SUPPORT_RESOURCES_EG || '',
  };
  return config;
}

const num = (v, d) => (v === undefined || v === '' || !Number.isFinite(Number(v)) ? d : Number(v));

/** Problems that must stop a production boot. Returns plain-language messages. */
export function configProblems(config) {
  const out = [];
  if (!config.production) return out;
  if (config.email.provider === 'console') out.push('EMAIL_PROVIDER=console is for development. Set EMAIL_PROVIDER=resend and RESEND_API_KEY.');
  if (config.email.provider === 'resend' && !config.email.resendKey) out.push('RESEND_API_KEY is missing.');
  if (config.payments.provider === 'demo') out.push('PAYMENTS_PROVIDER=demo enrolls people without paying. Set PAYMENTS_PROVIDER=paymob.');
  if (config.payments.provider === 'paymob') {
    const p = config.payments.paymob;
    if (!p.secretKey || !p.publicKey || !p.hmacSecret || !p.integrationIds.length) out.push('Paymob needs PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY, PAYMOB_HMAC_SECRET and PAYMOB_INTEGRATION_IDS.');
  }
  if (!config.baseUrl.startsWith('https://')) out.push('BASE_URL should be your public https:// address.');
  if (!['demo', 'anthropic', 'gemini', 'openai'].includes(config.ai.provider)) out.push('AI_PROVIDER must be "demo", "gemini", "openai" or "anthropic".');
  if (config.ai.provider === 'anthropic' && !config.ai.apiKey) out.push('AI_PROVIDER=anthropic needs ANTHROPIC_API_KEY.');
  if (['gemini', 'openai'].includes(config.ai.provider) && !config.ai.apiKey) out.push(`AI_PROVIDER=${config.ai.provider} needs AI_API_KEY (or GEMINI_API_KEY).`);
  return out;
}
