import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, learner, newLearner } from './helpers.js';
import { normalizeArabic } from '../src/lib/arabic.js';
import { validateExercise } from '../src/services/exercises.js';

test('Arabic normalisation ignores tashkeel, alef/ya/ta marbuta variants and spacing', () => {
  assert.equal(normalizeArabic('  الضَّمَّةُ '), normalizeArabic('الضمة'));
  assert.equal(normalizeArabic('إسمية'), normalizeArabic('اسميه'));
  assert.equal(normalizeArabic('مرفوعًا'), normalizeArabic('مرفوعا'));
  assert.equal(normalizeArabic('على'), normalizeArabic('علي'));
  assert.notEqual(normalizeArabic('كتب'), normalizeArabic('كاتب'));
});

test('exercise definitions are validated', () => {
  assert.throws(() => validateExercise({ type: 'mcq', prompt: 'x', options: ['a'], answer: 0 }), /Options/);
  assert.throws(() => validateExercise({ type: 'mcq', prompt: 'x', options: ['a', 'b'], answer: 5 }), /correct/);
  assert.throws(() => validateExercise({ type: 'nope', prompt: 'x' }), /type/);
  assert.throws(() => validateExercise({ type: 'order', prompt: 'x', answers: [['a', 'b'], ['a', 'c']] }), /same words/);
  assert.equal(validateExercise({ type: 'tf', prompt: 'x', answer: true }).data.answer, true);
});

const lessonOf = (t, slug, pos) => {
  const c = t.courseBySlug(slug);
  return t.db.get('SELECT id FROM lessons WHERE course_id = ? AND position = ?', c.id, pos).id;
};

test('lesson exercises hide answers, require enrollment, and give instant feedback', async () => {
  const t = makeApp();
  const lid = lessonOf(t, 'nahw-foundations', 1);

  const stranger = await newLearner(t);
  const denied = await t.req('GET', `/api/lessons/${lid}/exercises`, { as: stranger });
  assert.equal(denied.status, 403);
  assert.equal((await t.req('GET', `/api/lessons/${lid}/exercises`)).status, 401);

  const me = await learner(t);
  const r = await t.req('GET', `/api/lessons/${lid}/exercises`, { as: me });
  assert.equal(r.status, 200);
  assert.ok(r.body.total >= 4);
  assert.equal(r.body.solved, 0);
  const raw = JSON.stringify(r.body);
  assert.ok(!raw.includes('"answer"') && !raw.includes('accept') && !raw.includes('explanation'), 'public view leaks no solution');

  const mcq = r.body.exercises.find(e => e.type === 'mcq');
  const wrong = await t.req('POST', `/api/exercises/${mcq.id}/check`, { as: me, body: { answer: 1 } });
  assert.equal(wrong.body.correct, false);
  assert.equal(wrong.body.reveal.answer, 0);
  assert.ok(wrong.body.explanation);
  const right = await t.req('POST', `/api/exercises/${mcq.id}/check`, { as: me, body: { answer: 0 } });
  assert.equal(right.body.correct, true);
  assert.equal(right.body.reveal, undefined);
  assert.equal(right.body.progress.solved, 1);

  const fill = r.body.exercises.find(e => e.type === 'fill');
  const lenient = await t.req('POST', `/api/exercises/${fill.id}/check`, { as: me, body: { answer: 'اسْمِيَّة' } });
  assert.equal(lenient.body.correct, true, 'diacritics and ta marbuta variants are accepted');
  const bad = await t.req('POST', `/api/exercises/${fill.id}/check`, { as: me, body: { answer: 'فعلية' } });
  assert.equal(bad.body.correct, false);

  const order = r.body.exercises.find(e => e.type === 'order');
  assert.equal(order.words.length, 3);
  const ok = await t.req('POST', `/api/exercises/${order.id}/check`, { as: me, body: { answer: ['كتبَ', 'الطالبُ', 'الدرسَ'] } });
  assert.equal(ok.body.correct, true);
  const alt = await t.req('POST', `/api/exercises/${order.id}/check`, { as: me, body: { answer: ['الدرسَ', 'الطالبُ', 'كتبَ'] } });
  assert.equal(alt.body.correct, false);

  const again = await t.req('GET', `/api/lessons/${lid}/exercises`, { as: me });
  assert.equal(again.body.solved, 3);
  assert.equal(again.body.exercises.filter(e => e.solved).length, 3);
});

test('matching and true/false grading, with bad input refused', async () => {
  const t = makeApp();
  const me = await learner(t);
  const lid = lessonOf(t, 'nahw-foundations', 0);
  const { body } = await t.req('GET', `/api/lessons/${lid}/exercises`, { as: me });
  const match = body.exercises.find(e => e.type === 'match');
  assert.deepEqual(match.left, ['قلم', 'يكتبُ', 'في', 'مدرسة']);
  const good = await t.req('POST', `/api/exercises/${match.id}/check`, { as: me, body: { answer: ['اسم', 'فعل', 'حرف', 'اسم'] } });
  assert.equal(good.body.correct, true);
  const miss = await t.req('POST', `/api/exercises/${match.id}/check`, { as: me, body: { answer: ['فعل', 'فعل', 'حرف', 'اسم'] } });
  assert.deepEqual(miss.body.reveal.wrong, [0]);
  const tf = body.exercises.find(e => e.type === 'tf');
  assert.equal((await t.req('POST', `/api/exercises/${tf.id}/check`, { as: me, body: { answer: false } })).body.correct, true);
  assert.equal((await t.req('POST', `/api/exercises/${tf.id}/check`, { as: me, body: { answer: 'yes' } })).status, 400);
  assert.equal((await t.req('POST', `/api/exercises/${tf.id}/check`, { as: me, body: {} })).status, 400);
  assert.equal((await t.req('POST', '/api/exercises/999999/check', { as: me, body: { answer: true } })).status, 404);
});
