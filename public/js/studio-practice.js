// Studio → Practice: write and edit the interactive exercises of each lesson.
import { t, esc, L } from './state.js';
import { get, put } from './api.js';
import { ic } from './icons.js';
import { app, $, $$, footer, loading, errorView, toast, toastErr } from './ui.js';
import { guard, head, subnav } from './studio.js';

const X = (en, ar) => L({ en, ar });
const TYPE_NAMES = () => ({ mcq: X('Multiple choice', 'اختيار من متعدد'), tf: X('True or false', 'صح أو خطأ'), fill: X('Fill in the blank', 'أكمل الفراغ'), order: X('Put in order', 'رتّب الكلمات'), match: X('Match pairs', 'صلّ الأزواج') });
const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);

let course = null, lessonId = null, list = [];

/** Server shape -> editable text fields. */
const toForm = e => ({
  type: e.type, prompt: e.prompt, explanation: e.explanation || '',
  options: (e.options || []).join('\n'), answer: e.answer ?? (e.type === 'tf' ? true : 0),
  accept: (e.accept || []).join('\n'),
  sentences: (e.answers || []).map(a => a.join(' ')).join('\n'),
  pairs: (e.pairs || []).map(p => `${p[0]} | ${p[1]}`).join('\n'),
});
/** Editable text fields -> server shape. */
const fromForm = f => {
  const base = { type: f.type, prompt: f.prompt.trim(), explanation: f.explanation.trim() };
  switch (f.type) {
    case 'mcq': return { ...base, options: lines(f.options), answer: Number(f.answer) };
    case 'tf': return { ...base, answer: f.answer === true || f.answer === 'true' };
    case 'fill': return { ...base, accept: lines(f.accept) };
    case 'order': return { ...base, answers: lines(f.sentences).map(s => s.split(/\s+/)) };
    default: return { ...base, pairs: lines(f.pairs).map(l => l.split('|').map(x => x.trim())) };
  }
};
const blank = type => toForm({ type, prompt: '', options: type === 'mcq' ? ['', ''] : [], answer: type === 'tf' ? true : 0, accept: [], answers: [], pairs: [] });

function card(f, i) {
  const f2 = (label, body) => `<label class="field" style="display:block;margin-top:10px"><span class="muted" style="font-size:.85rem">${label}</span>${body}</label>`;
  const ta = (k, rows, ph = '') => `<textarea data-k="${k}" rows="${rows}" dir="auto" placeholder="${esc(ph)}" style="width:100%">${esc(f[k])}</textarea>`;
  let body = '';
  if (f.type === 'mcq') body = f2(X('Options (one per line)', 'الاختيارات (واحد في كل سطر)'), ta('options', 4)) + f2(X('Number of the correct option (1 = first)', 'رقم الاختيار الصحيح (١ = الأول)'), `<input data-k="answer1" type="number" min="1" max="6" value="${Number(f.answer) + 1}" style="width:90px">`);
  if (f.type === 'tf') body = f2(X('Correct answer', 'الإجابة الصحيحة'), `<select data-k="answer"><option value="true" ${f.answer === true ? 'selected' : ''}>${X('True', 'صح')}</option><option value="false" ${f.answer === false ? 'selected' : ''}>${X('False', 'خطأ')}</option></select>`);
  if (f.type === 'fill') body = f2(X('Accepted answers (one per line)', 'الإجابات المقبولة (واحدة في كل سطر)'), ta('accept', 3));
  if (f.type === 'order') body = f2(X('Correct sentence(s), one per line (learners get the words shuffled)', 'الجملة الصحيحة، جملة في كل سطر (تُخلط الكلمات للمتعلم)'), ta('sentences', 3));
  if (f.type === 'match') body = f2(X('Pairs, one per line: left | right', 'الأزواج، زوج في كل سطر: يمين | يسار'), ta('pairs', 4, 'قلم | اسم'));
  return `<div class="box pr-ed" data-i="${i}" style="margin-top:14px"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>${i + 1}. ${TYPE_NAMES()[f.type]}</b>
    <span><button class="mini-btn" data-act="up" ${i === 0 ? 'disabled' : ''}>↑</button> <button class="mini-btn" data-act="down" ${i === list.length - 1 ? 'disabled' : ''}>↓</button> <button class="mini-btn" data-act="del">${X('Remove', 'حذف')}</button></span></div>
    ${f2(X('Question', 'السؤال'), ta('prompt', 2))}${body}${f2(X('Explanation shown after answering (optional)', 'شرح يظهر بعد الإجابة (اختياري)'), ta('explanation', 2))}</div>`;
}

/** Copy what is typed in the cards back into `list`. */
function collect() {
  $$('.pr-ed').forEach(el => {
    const f = list[Number(el.dataset.i)];
    el.querySelectorAll('[data-k]').forEach(inp => {
      const k = inp.dataset.k;
      if (k === 'answer1') f.answer = Math.max(0, Number(inp.value) - 1);
      else if (k === 'answer') f.answer = inp.value === 'true';
      else f[k] = inp.value;
    });
  });
}

function render() {
  const lessons = course.sections.flatMap(s => s.lessons);
  app().innerHTML = `<section class="wrap">${head(esc(course.title_en), `<a class="btn btn-ghost" href="/studio/courses/${course.id}">${ic('pen')}${t('edit')}</a>`)}${subnav()}
  <div class="box"><h2 style="font-size:1.1rem">${X('Practice exercises', 'تمارين التدريب')}</h2>
  <p class="muted" style="margin:4px 0 10px">${X('Add short interactive questions to a lesson. Learners get instant feedback and earn XP.', 'أضف أسئلة تفاعلية قصيرة للدرس. يحصل المتعلم على تصحيح فوري ويكسب نقاط خبرة.')}</p>
  <select id="pr-lesson" style="max-width:100%">${lessons.map((l, i) => `<option value="${l.id}" ${l.id === lessonId ? 'selected' : ''}>${i + 1}. ${esc(l.title_en || l.title_ar)}</option>`).join('')}</select></div>
  <div id="pr-list">${list.map(card).join('') || `<div class="empty"><p>${X('No exercises in this lesson yet.', 'لا توجد تمارين في هذا الدرس بعد.')}</p></div>`}</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;align-items:center">
    <select id="pr-type">${Object.entries(TYPE_NAMES()).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
    <button class="btn btn-ghost" id="pr-add">${ic('plus')}${X('Add exercise', 'أضف تمرينًا')}</button>
    <button class="btn btn-accent" id="pr-save">${X('Save exercises', 'احفظ التمارين')}</button></div></section>${footer()}`;
  $('#pr-lesson').addEventListener('change', async e => { lessonId = Number(e.target.value); await loadLesson(); render(); });
  $('#pr-add').addEventListener('click', () => { collect(); list.push(blank($('#pr-type').value)); render(); });
  $('#pr-save').addEventListener('click', async () => {
    collect();
    try { const r = await put(`/api/studio/lessons/${lessonId}/exercises`, { exercises: list.map(fromForm) }); toast(X(`Saved ${r.saved} exercises`, `تم حفظ ${r.saved} تمرين`)); } catch (e) { toastErr(e); }
  });
  $$('.pr-ed [data-act]').forEach(b => b.addEventListener('click', () => {
    collect(); const i = Number(b.closest('.pr-ed').dataset.i);
    if (b.dataset.act === 'del') list.splice(i, 1);
    else { const j = b.dataset.act === 'up' ? i - 1 : i + 1; [list[i], list[j]] = [list[j], list[i]]; }
    render();
  }));
}

async function loadLesson() { list = (await get(`/api/studio/lessons/${lessonId}/exercises`)).exercises.map(toForm); }

export async function practiceEditorPage(m) {
  if (!guard()) return;
  loading();
  try {
    ({ course } = await get(`/api/studio/courses/${m[1]}`));
    lessonId = course.sections.flatMap(s => s.lessons)[0]?.id;
    if (lessonId) await loadLesson(); else list = [];
  } catch (e) { return errorView(e); }
  render();
}
