import { cors } from '../_guard.js';

export default function handler(req, res) {
  if (!cors(req, res)) return res.status(403).json({ ok: false });
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: Boolean((process.env.GEMINI_API_KEY || '').trim()) });
}
