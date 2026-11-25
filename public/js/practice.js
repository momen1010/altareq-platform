// Interactive practice for a lesson: instant feedback from the server, retry until solved.
import { t, esc, fmt } from './state.js';
import { get, post } from './api.js';
import { ic } from './icons.js';
import { toastErr } from './ui.js';

const q = (s, r) => r.querySelector(s);
const KEYS = [...'ضصثقفغعهخحجد', ...'شسيبلاتنمكط', ...'ئءؤرلاىةوزظ', ...'ًٌٍَُِّْ'];

export async function renderPractice(el, { lessonId, onProgress }) {
  el.innerHTML = `<div class="loading"><div class="spin"></div></div>`;
  let data;
  try { data = await get(`/api/lessons/${lessonId}/exercises`); } catch (e) { el.innerHTML = ''; return toastErr(e); }
  if (!data.total) { el.innerHTML = `<p class="muted">${t('pr_none')}</p>`; return; }
  const state = { solved: data.solved, total: data.total };
  el.innerHTML = `<div class="pr-head"><b class="tnum" id="pr-count"></b><div class="pr-bar" aria-hidden="true"><i id="pr-fill"></i></div></div><div class="pr-list"></div>`;
  const list = q('.pr-list', el);
  const paint = () => {
    q('#pr-count', el).textContent = t('pr_progress', { a: fmt(state.solved), b: fmt(state.total) });
    q('#pr-fill', el).style.width = `${Math.round(100 * state.solved / state.total)}%`;
    onProgress?.(state);
  };
  data.exercises.forEach((ex, i) => list.appendChild(card(ex, i, state, paint)));
  paint();
}

export function card(ex, i, state, paint) {
  const box = document.createElement('section');
  box.className = `pr-card${ex.solved ? ' solved' : ''}`;
  box.innerHTML = `<div class="pr-q"><span class="pr-n">${fmt(i + 1)}</span><p dir="auto">${esc(ex.prompt)}</p></div><div class="pr-body"></div>
    <div class="pr-fb" aria-live="polite"></div><div class="pr-act"><button class="btn btn-accent" type="button">${t('pr_check')}</button></div>`;
  const body = q('.pr-body', box), fb = q('.pr-fb', box), btn = q('button', box);
  let get_ = () => null;
  const id = `ex${ex.id}`;

  if (ex.type === 'mcq') {
    body.innerHTML = ex.options.map((o, oi) => `<label class="opt" dir="auto"><input type="radio" name="${id}" value="${oi}">${esc(o)}</label>`).join('');
    get_ = () => { const r = q(`input[name="${id}"]:checked`, box); return r ? Number(r.value) : null; };
  } else if (ex.type === 'tf') {
    body.innerHTML = [[true, t('pr_true')], [false, t('pr_false')]].map(([v, l]) => `<label class="opt"><input type="radio" name="${id}" value="${v}">${l}</label>`).join('');
    get_ = () => { const r = q(`input[name="${id}"]:checked`, box); return r ? r.value === 'true' : null; };
  } else if (ex.type === 'fill') {
    body.innerHTML = `<input class="pr-in" type="text" dir="rtl" lang="ar" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(t('pr_type'))}" placeholder="${esc(t('pr_type'))}">
      <details class="kb"><summary>${t('pr_kb')}</summary><div class="kb-grid" dir="rtl">${KEYS.map(k => `<button type="button" class="kbk" data-k="${k}">${k}</button>`).join('')}<button type="button" class="kbk wide" data-k=" ">␣</button><button type="button" class="kbk wide" data-back>⌫</button></div></details>`;
    body.addEventListener('click', e => {
      const k = e.target.closest('.kbk'); if (!k) return;
      const inp = q('input.pr-in', box); inp.focus();
      if ('back' in k.dataset) inp.value = inp.value.slice(0, -1); else inp.value += k.dataset.k;
    });
    get_ = () => { const v = q('input', box).value.trim(); return v || null; };
    q('input', box).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } });
  } else if (ex.type === 'order') {
    body.innerHTML = `<div class="pr-slot" aria-live="polite"></div><div class="pr-bank"></div>`;
    const slot = q('.pr-slot', box), bank = q('.pr-bank', box);
    const chosen = [];
    const redraw = () => {
      slot.innerHTML = chosen.length ? chosen.map((k, n) => `<button type="button" class="chip on" data-n="${n}">${esc(ex.words[k])}</button>`).join('') : `<span class="muted">${t('pr_tap')}</span>`;
      bank.innerHTML = ex.words.map((w, k) => `<button type="button" class="chip" data-k="${k}" ${chosen.includes(k) ? 'disabled' : ''}>${esc(w)}</button>`).join('');
    };
    box.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b || box.classList.contains('solved')) return;
      if (b.dataset.k !== undefined) chosen.push(Number(b.dataset.k)); else if (b.dataset.n !== undefined) chosen.splice(Number(b.dataset.n), 1);
      redraw();
    });
    redraw();
    get_ = () => (chosen.length === ex.words.length ? chosen.map(k => ex.words[k]) : null);
  } else if (ex.type === 'match') {
    body.innerHTML = ex.left.map((l, k) => `<div class="pr-row"><span>${esc(l)}</span><select aria-label="${esc(l)}" data-k="${k}"><option value="">${t('pr_choose')}</option>${ex.right.map(r => `<option value="${esc(r)}">${esc(r)}</option>`).join('')}</select></div>`).join('');
    get_ = () => { const v = [...box.querySelectorAll('select')].map(s => s.value); return v.every(Boolean) ? v : null; };
  }

  btn.addEventListener('click', async () => {
    const answer = get_();
    if (answer === null) { fb.innerHTML = `<div class="pr-msg warn">${ic('info')}<span>${t('pr_need')}</span></div>`; return; }
    btn.disabled = true;
    let r;
    try { r = await post(`/api/exercises/${ex.id}/check`, { answer }); } catch (e) { btn.disabled = false; return toastErr(e); }
    btn.disabled = false;
    state.solved = r.progress.solved; state.total = r.progress.total; paint();
    box.querySelectorAll('.opt').forEach(o => o.classList.remove('right', 'wrong'));
    if (r.correct) {
      box.classList.add('solved');
      fb.innerHTML = `<div class="pr-msg ok">${ic('check')}<span><b>${t('pr_right')}</b> ${esc(r.explanation)}</span></div>`;
      box.querySelectorAll('input,select,button.chip').forEach(x => { x.disabled = true; });
      btn.hidden = true;
    } else {
      let hint = '';
      const rv = r.reveal?.answer;
      if (ex.type === 'mcq') { box.querySelectorAll('.opt')[answer]?.classList.add('wrong'); }
      else if (ex.type === 'fill') hint = `${t('pr_answer')}: ${esc(rv)}`;
      else if (ex.type === 'order') hint = `${t('pr_answer')}: ${esc(rv.join(' '))}`;
      else if (ex.type === 'tf') hint = `${t('pr_answer')}: ${rv ? t('pr_true') : t('pr_false')}`;
      else if (ex.type === 'match') {
        const bad = new Set(r.reveal.wrong);
        box.querySelectorAll('.pr-row').forEach((row, k) => row.classList.toggle('bad', bad.has(k)));
        hint = t('pr_match_hint');
      }
      fb.innerHTML = `<div class="pr-msg bad">${ic('info')}<span><b>${t('pr_wrong')}</b> ${hint} ${esc(r.explanation)}</span></div>`;
      btn.textContent = t('pr_retry');
    }
  });
  return box;
}
