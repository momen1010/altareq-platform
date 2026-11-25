// Placement test: one question at a time, then a level and recommended courses.
import { t, esc, fmt } from '../state.js';
import { get, post } from '../api.js';
import { app, card, loading, errorView, toastErr } from '../ui.js';
import { ic } from '../icons.js';

export async function placementPage() {
  loading();
  let data, cats = [];
  try { [data, { categories: cats }] = await Promise.all([get('/api/placement'), get('/api/categories').catch(() => ({ categories: [] }))]); } catch (e) { return errorView(e); }
  document.title = `${t('pt_title')} · ${t('brand')}`;
  const answers = [];
  let i = 0;
  const intro = () => {
    app().innerHTML = `<section class="wrap pt"><div class="pt-box"><span class="pt-ic">${ic('compass')}</span><div class="eyebrow">${t('pt_eyebrow')}</div><h1>${t('pt_title')}</h1><p class="muted">${t('pt_sub', { n: fmt(data.total) })}</p><button class="btn btn-accent" id="pt-go">${t('pt_start')}</button></div></section>`;
    document.getElementById('pt-go').addEventListener('click', ask);
  };
  const ask = () => {
    const q = data.questions[i];
    app().innerHTML = `<section class="wrap pt"><div class="pt-box"><div class="pr-head"><b class="tnum">${fmt(i + 1)} / ${fmt(data.total)}</b><div class="pr-bar" aria-hidden="true"><i style="width:${Math.round(100 * i / data.total)}%"></i></div></div>
      <h2 dir="auto" class="pt-q">${esc(q.prompt)}</h2><div class="pt-opts">${q.options.map((o, k) => `<button class="opt pt-o" dir="auto" data-k="${k}">${esc(o)}</button>`).join('')}</div></div></section>`;
    app().querySelectorAll('.pt-o').forEach(b => b.addEventListener('click', () => { answers[i] = Number(b.dataset.k); i++; if (i < data.total) ask(); else finish(); }));
  };
  const finish = async () => {
    loading();
    let r;
    try { r = await post('/api/placement', { answers }); } catch (e) { toastErr(e); i = 0; return intro(); }
    const lv = { beg: t('lvl_beg'), int: t('lvl_int'), adv: t('lvl_adv') }[r.level] || r.level;
    app().innerHTML = `<section class="wrap pt"><div class="pt-box pt-res"><span class="pt-ic ok">${ic('award')}</span><div class="eyebrow">${t('pt_result')}</div><h1>${lv}</h1>
      <p class="muted tnum">${t('pt_score', { a: fmt(r.score), b: fmt(r.total) })}</p>
      <div class="pt-lv">${['beg', 'int', 'adv'].map(k => `<div><small>${{ beg: t('lvl_beg'), int: t('lvl_int'), adv: t('lvl_adv') }[k]}</small><b class="tnum">${fmt(r.byLevel[k][0])}/${fmt(r.byLevel[k][1])}</b></div>`).join('')}</div></div>
      <h2 style="margin:28px 0 14px">${t('pt_recs')}</h2><div class="grid">${r.courses.map(c => card(c, cats)).join('')}</div>
      <p style="margin-top:20px"><button class="btn btn-ghost" id="pt-again">${t('pt_again')}</button></p></section>`;
    document.getElementById('pt-again').addEventListener('click', () => { answers.length = 0; i = 0; intro(); });
  };
  intro();
}
