// Shared checks for the Nour proxy (Vercel serverless). The Gemini key lives only in the
// GEMINI_API_KEY environment variable of this project; it is never sent to the browser.
export const ORIGINS = new Set([
  'https://altareq-learning.web.app', 'https://altareq-learning.firebaseapp.com', 'https://altareq-platform.vercel.app',
  'http://localhost:3000', 'http://localhost:3111',
]);
export const MODEL = process.env.AI_MODEL_CHAT || 'gemini-3.6-flash';
export const UPSTREAM = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

export function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  }
  return !origin || ORIGINS.has(origin);
}

// Best-effort limits kept in memory (a warm function instance). Google's own free quota is the hard backstop.
const hits = new Map();
let day = '', today = 0;
export function allow(ip) {
  const now = Date.now(), d = new Date(now).toISOString().slice(0, 10);
  if (d !== day) { day = d; today = 0; }
  if (today >= Number(process.env.NOUR_DAILY_CAP || 400)) return 'busy';
  const list = (hits.get(ip) || []).filter(t => now - t < 60_000);
  if (list.length >= 12) return 'rate';
  list.push(now); hits.set(ip, list); today++;
  if (hits.size > 5000) hits.clear();
  return null;
}
