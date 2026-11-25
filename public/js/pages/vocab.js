// Flashcards with spaced repetition, stored on the learner's device.
import { t, esc, fmt } from '../state.js';
import { ic } from '../icons.js';
import { app } from '../ui.js';
import { decks, allWords } from '../vocab-data.js';
import { canSpeak, speak } from '../speak.js';

const KEY = 'altareq-vocab-v1';
const DAYS = [0, 1, 3, 7, 14, 30];
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked */ } };
const dueNow = (st, w) => { const c = st[w.id]; return !c || c.due <= Date.now(); };

export function vocabPage(m) {
  const state = load();
  const deckId = new URLSearchParams(location.search).get('deck');
  document.title = `${t('vocab_title')} · ${t('brand')}`;
  if (!deckId) return home(state);
  study(state, decks.find(d => d.id === deckId) || decks[0]);
}

function home(state) {
  const learned = allWords.filter(w => (state[w.id]?.box || 0) >= 3).length;
  app().innerHTML = `<section class="wrap vb"><div class="eyebrow">${t('vocab_eyebrow')}</div><h1>${t('vocab_title')}</h1>
    <p class="muted" style="max-width:62ch">${t('vocab_sub', { a: fmt(learned), b: fmt(allWords.length) })}</p>
    <div class="grid vb-grid">${decks.map(d => {
      const ws = allWords.filter(w => w.deck === d.id);
      const known = ws.filter(w => (state[w.id]?.box || 0) >= 3).length;
      const due = ws.filter(w => dueNow(state, w)).length;
      return `<a class="vb-deck" href="/vocabulary?deck=${d.id}"><span class="vb-glyph">${esc(d.glyph)}</span><div><b dir="auto">${esc(store_lang() === 'ar' ? d.ar : d.en)}</b><small class="muted">${fmt(ws.length)} ${t('vocab_words')} · ${fmt(due)} ${t('vocab_due')}</small><div class="bar"><i style="width:${Math.round(100 * known / ws.length)}%"></i></div></div></a>`;
    }).join('')}</div></section>`;
}
const store_lang = () => document.documentElement.lang;

function study(state, deck) {
  const words = allWords.filter(w => w.deck === deck.id);
  let queue = words.filter(w => dueNow(state, w));
  let flipped = false;
  const total = queue.length;
  const render = () => {
    if (!queue.length) {
      app().innerHTML = `<section class="wrap vb"><div class="pt-box pt-res"><span class="pt-ic ok">${ic('award')}</span><h1>${t('vocab_done')}</h1><p class="muted">${t('vocab_done_sub')}</p>
        <p style="margin-top:16px"><a class="btn btn-brand" href="/vocabulary">${t('vocab_back')}</a></p></div></section>`;
      return;
    }
    const w = queue[0];
    const lang = document.documentElement.lang;
    app().innerHTML = `<section class="wrap vb"><a class="back" href="/vocabulary">${ic('back', 'flip')}${t('vocab_back')}</a>
      <div class="pr-head" style="margin:14px 0"><b class="tnum">${fmt(total - queue.length + 1)} / ${fmt(total)}</b><div class="pr-bar" aria-hidden="true"><i style="width:${Math.round(100 * (total - queue.length) / total)}%"></i></div></div>
      <button class="fc ${flipped ? 'flip' : ''}" id="fc" aria-label="${t('vocab_flip')}"><div class="fc-ar" dir="rtl" lang="ar">${esc(w.ar)}</div>
        ${flipped ? `<div class="fc-back"><div class="fc-tr">${esc(w.tr)}</div><div class="fc-en">${esc(w.en)}</div><div class="fc-ex" dir="rtl" lang="ar">${esc(w.ex)}</div></div>` : `<div class="fc-hint muted">${t('vocab_tap')}</div>`}</button>
      <div class="fc-act">${canSpeak() ? `<button class="btn btn-ghost" id="fc-say">${ic('speaker', 'sm')} ${t('listen')}</button>` : ''}
        ${flipped ? `<button class="btn btn-ghost" id="fc-again">${t('vocab_again')}</button><button class="btn btn-accent" id="fc-know">${t('vocab_know')}</button>` : `<button class="btn btn-brand" id="fc-show">${t('vocab_show')}</button>`}</div></section>`;
    document.getElementById('fc').addEventListener('click', () => { flipped = !flipped; render(); });
    document.getElementById('fc-show')?.addEventListener('click', () => { flipped = true; render(); });
    document.getElementById('fc-say')?.addEventListener('click', e => { e.stopPropagation(); speak(w.ar); });
    const rate = good => {
      const c = state[w.id] || { box: 0 };
      c.box = good ? Math.min(c.box + 1, DAYS.length - 1) : 0;
      c.due = Date.now() + DAYS[c.box] * 86400000;
      state[w.id] = c; save(state);
      queue.shift(); if (!good) queue.push(w);
      flipped = false; render();
    };
    document.getElementById('fc-know')?.addEventListener('click', () => rate(true));
    document.getElementById('fc-again')?.addEventListener('click', () => rate(false));
    void lang;
  };
  void deck;
  render();
}
