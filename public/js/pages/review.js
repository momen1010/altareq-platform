// Spaced review: exercises the learner missed or is due to see again.
import { store, t, esc, fmt, L } from '../state.js';
import { get } from '../api.js';
import { ic } from '../icons.js';
import { app, loading, errorView, requireUser } from '../ui.js';
import { card } from '../practice.js';

export async function reviewPage() {
  if (!requireUser()) return;
  loading();
  let d;
  try { d = await get('/api/review'); } catch (e) { return errorView(e); }
  document.title = `${t('review_title')} · ${t('brand')}`;
  if (!d.exercises.length) {
    app().innerHTML = `<section class="wrap"><div class="empty rv-empty"><span class="rv-big">${ic('check')}</span><h1>${t('review_clear')}</h1><p class="muted">${t('review_clear_sub')}</p><a class="btn btn-accent" href="/learning">${t('nav_learning')}</a></div></section>`;
    return;
  }
  const state = { solved: 0, total: d.exercises.length };
  app().innerHTML = `<section class="wrap rv"><div class="eyebrow">${t('review_eyebrow')}</div><h1>${t('review_title')}</h1>
    <p class="muted" style="max-width:62ch">${t('review_sub', { n: fmt(d.dueCount) })}</p>
    <div class="pr-head" style="margin-top:18px"><b class="tnum" id="rv-count"></b><div class="pr-bar" aria-hidden="true"><i id="rv-fill"></i></div></div>
    <div class="pr-list" id="rv-list"></div><div id="rv-done"></div></section>`;
  const paint = () => {
    document.getElementById('rv-count').textContent = t('pr_progress', { a: fmt(state.solvedNow), b: fmt(state.total) });
    document.getElementById('rv-fill').style.width = `${Math.round(100 * state.solvedNow / state.total)}%`;
    if (state.solvedNow === state.total) document.getElementById('rv-done').innerHTML = `<div class="rv-finish">${ic('award')}<div><b>${t('review_done')}</b><p class="muted">${t('review_done_sub')}</p></div><a class="btn btn-brand" href="/learning">${t('nav_learning')}</a></div>`;
  };
  state.solvedNow = 0;
  const list = document.getElementById('rv-list');
  d.exercises.forEach((ex, i) => {
    // a per-card state shim: the card reports lesson-level progress, we only count cards solved in this session
    const local = { solved: 0, total: 0 };
    const el = card(ex, i, local, () => {});
    const tag = document.createElement('div');
    tag.className = 'rv-tag';
    tag.innerHTML = `${ic('book', 'sm')} ${esc(L(ex.course.title))}`;
    el.prepend(tag);
    new MutationObserver(() => {
      if (el.classList.contains('solved') && !el.dataset.counted) { el.dataset.counted = '1'; state.solvedNow++; paint(); }
    }).observe(el, { attributes: true, attributeFilter: ['class'] });
    list.appendChild(el);
  });
  paint();
}
