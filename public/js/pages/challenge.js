// Daily challenge: five quick vocabulary questions, the same for everyone each day. Streak lives on this device.
import { esc, fmt, L } from '../state.js';
import { ic } from '../icons.js';
import { app } from '../ui.js';
import { allWords } from '../vocab-data.js';
import { canSpeak, speak, stripTashkeel } from '../speak.js';

const KEY = 'altareq-challenge';
const X = (en, ar) => L({ en, ar });
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked */ } };

/** Small seeded generator so every learner gets the same questions on the same day. */
function rng(seed) { let a = [...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7); return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (arr, n, r) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };

export function challengeStatus() {
  const s = load(), today = dayKey(), y = dayKey(new Date(Date.now() - 86400000));
  const streak = s.last === today || s.last === y ? s.streak || 0 : 0;
  return { done: s.last === today, streak, best: s.best || 0, score: s.last === today ? s.score : null };
}

export async function challengePage() {
  const today = dayKey(), r = rng(today);
  const qs = pick(allWords, 5, r).map(w => ({ w, options: pick([w, ...pick(allWords.filter(x => x.id !== w.id && x.en !== w.en), 3, r)], 4, r) }));
  let i = 0, score = 0;
  const done = () => {
    const s = load(), y = dayKey(new Date(Date.now() - 86400000));
    if (s.last !== today) { s.streak = s.last === y ? (s.streak || 0) + 1 : 1; s.best = Math.max(s.best || 0, s.streak); s.last = today; s.score = score; save(s); }
    const st = challengeStatus();
    app().innerHTML = `<section class="wrap vb"><div class="pt-box pt-res"><span class="pt-ic ok">${ic('award')}</span><h1>${X(`${score} out of 5`, `${fmt(score)} من ٥`)}</h1>
      <p class="muted">${X('Come back tomorrow for a new challenge.', 'ارجع بكرة لتحدٍّ جديد.')}</p>
      <div class="ch-streak"><b>${fmt(st.streak)}</b> ${X('day streak', 'يوم متتالٍ')} · ${X('best', 'أفضل')} ${fmt(st.best)}</div>
      <p style="margin-top:16px"><a class="btn btn-brand" href="/vocabulary">${X('Practice more words', 'تدرّب على المزيد')}</a></p></div></section>`;
  };
  const render = () => {
    if (i >= qs.length) return done();
    const q = qs[i];
    app().innerHTML = `<section class="wrap vb"><a class="back" href="/">${ic('back', 'flip')}${X('Home', 'الرئيسية')}</a>
      <div class="eyebrow" style="margin-top:12px">${X('Daily challenge', 'تحدي اليوم')}</div>
      <div class="pr-head" style="margin:8px 0 14px"><b class="tnum">${fmt(i + 1)} / ${fmt(qs.length)}</b><div class="pr-bar" aria-hidden="true"><i style="width:${Math.round(100 * i / qs.length)}%"></i></div></div>
      <div class="box ch-q"><p class="muted">${X('Which Arabic word means:', 'أي كلمة عربية معناها:')}</p><h2 class="ch-en" dir="ltr">${esc(q.w.en)}</h2>
      <div class="ch-opts">${q.options.map((o, k) => `<button class="ch-opt" data-k="${k}" dir="rtl" lang="ar">${esc(o.ar)}</button>`).join('')}</div>
      <p class="ch-fb muted" id="chfb" aria-live="polite"></p></div></section>`;
    document.querySelectorAll('.ch-opt').forEach(b => b.addEventListener('click', () => {
      const o = q.options[Number(b.dataset.k)], ok = o.id === q.w.id;
      if (ok) score++;
      document.querySelectorAll('.ch-opt').forEach((x, k) => { x.disabled = true; if (q.options[k].id === q.w.id) x.classList.add('ok'); });
      if (!ok) b.classList.add('bad');
      if (canSpeak()) speak(q.w.ar);
      document.getElementById('chfb').innerHTML = `${ok ? X('Correct!', 'أحسنت!') : X('Not quite.', 'ليست الإجابة الصحيحة.')} <span dir="rtl" lang="ar">${esc(q.w.ex)}</span><br><button class="btn btn-brand" id="chnext" style="margin-top:12px">${i + 1 === qs.length ? X('Finish', 'إنهاء') : X('Next', 'التالي')}</button>`;
      document.getElementById('chnext').addEventListener('click', () => { i++; render(); });
    }));
  };
  render();
}
