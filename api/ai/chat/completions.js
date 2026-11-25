// Nour proxy: forwards a chat request to Gemini's free tier with the server-side key.
import { cors, allow, MODEL, UPSTREAM } from '../../_guard.js';

export default async function handler(req, res) {
  if (!cors(req, res)) return res.status(403).json({ error: 'origin' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const key = (process.env.GEMINI_API_KEY || '').trim();
  if (!key) return res.status(503).json({ error: 'not configured' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const verdict = allow(ip);
  if (verdict) return res.status(429).json({ error: verdict });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const messages = Array.isArray(b.messages) ? b.messages.filter(m => m && ['system', 'user', 'assistant'].includes(m.role) && typeof m.content === 'string') : [];
  if (!messages.length || messages.reduce((n, m) => n + m.content.length, 0) > 40_000) return res.status(400).json({ error: 'bad request' });
  // Only what Nour needs: our model, a capped answer length. Nothing else from the caller is passed on.
  const body = { model: MODEL, reasoning_effort: 'minimal', messages, max_tokens: Math.min(Number(b.max_tokens) || 600, 1500), ...(b.stream ? { stream: true, stream_options: { include_usage: true } } : {}) };

  const call = model => fetch(UPSTREAM, { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body: JSON.stringify({ ...body, model }) });
  let up;
  try {
    up = await call(MODEL);
    // The free tier is sometimes busy: one more try after a short pause.
    if ([429, 503].includes(up.status)) { await new Promise(r => setTimeout(r, 1200)); up = await call(MODEL); }
  } catch { return res.status(502).json({ error: 'upstream' }); }
  res.status(up.status);
  res.setHeader('content-type', up.headers.get('content-type') || 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (!up.body) return res.end(await up.text());
  const reader = up.body.getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}
