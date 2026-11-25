import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, learner, newLearner, admin } from './helpers.js';
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

test('XP, daily goal and spaced review queue', async () => {
  const t = makeApp();
  const me = await learner(t);
  const xp0 = (await t.req('GET', '/api/me/xp', { as: me })).body;
  assert.ok(xp0.xp > 0 && xp0.level >= 1 && xp0.goal.target === 30);

  // seeded history has misses that are due now
  const q = (await t.req('GET', '/api/review', { as: me })).body;
  assert.ok(q.dueCount > 0 && q.exercises.length > 0);
  assert.ok(!JSON.stringify(q).includes('"accept"'));
  const first = q.exercises[0];
  assert.equal(first.box, 0);

  // answering it correctly moves it out of box 0 and removes it from the due list (next review is days away)
  const lid = t.db.get('SELECT lesson_id FROM exercises WHERE id = ?', first.id).lesson_id;
  const full = (await t.req('GET', `/api/lessons/${lid}/exercises`, { as: me })).body.exercises.find(e => e.id === first.id);
  assert.equal(full.id, first.id);
  const def = JSON.parse(t.db.get('SELECT data_json FROM exercises WHERE id = ?', first.id).data_json);
  const ans = first.type === 'mcq' ? def.answer : first.type === 'tf' ? def.answer : first.type === 'fill' ? def.accept[0] : first.type === 'order' ? def.answers[0] : def.pairs.map(p => p[1]);
  const res = await t.req('POST', `/api/exercises/${first.id}/check`, { as: me, body: { answer: ans } });
  assert.equal(res.body.correct, true);
  const after = (await t.req('GET', '/api/review', { as: me })).body;
  assert.ok(!after.exercises.some(e => e.id === first.id));
  assert.equal(after.dueCount, q.dueCount - 1);
  assert.equal((await t.req('GET', '/api/review')).status, 401);
});

test('placement test grades, picks a level and recommends courses', async () => {
  const t = makeApp();
  const q = await t.req('GET', '/api/placement');
  assert.equal(q.status, 200);
  assert.equal(q.body.questions.length, 12);
  assert.ok(!JSON.stringify(q.body).includes('answers'));
  const all0 = await t.req('POST', '/api/placement', { body: { answers: Array(12).fill(0) } });
  assert.equal(all0.status, 200);
  assert.ok(['beg', 'int', 'adv'].includes(all0.body.level));
  assert.ok(all0.body.courses.length > 0 && all0.body.courses.length <= 3);
  const perfect = await t.req('POST', '/api/placement', { body: { answers: all0.body.answers } });
  assert.equal(perfect.body.score, 12);
  assert.equal(perfect.body.level, 'adv');
  assert.equal((await t.req('POST', '/api/placement', { body: { answers: [1, 2] } })).status, 400);
});

test('instructors can read and replace a lesson\'s exercises; learners cannot', async () => {
  const t = makeApp();
  const lid = lessonOf(t, 'nahw-foundations', 1);
  const boss = await admin(t);
  const me = await learner(t);
  assert.equal((await t.req('GET', `/api/studio/lessons/${lid}/exercises`, { as: me })).status, 403);
  assert.equal((await t.req('PUT', `/api/studio/lessons/${lid}/exercises`, { as: me, body: { exercises: [] } })).status, 403);

  const src = await t.req('GET', `/api/studio/lessons/${lid}/exercises`, { as: boss });
  assert.equal(src.status, 200);
  assert.ok(src.body.exercises.length >= 4);
  // Round trip: what we read is valid to save as is.
  const same = await t.req('PUT', `/api/studio/lessons/${lid}/exercises`, { as: boss, body: { exercises: src.body.exercises } });
  assert.equal(same.status, 200);
  assert.equal(same.body.saved, src.body.exercises.length);

  const bad = await t.req('PUT', `/api/studio/lessons/${lid}/exercises`, { as: boss, body: { exercises: [{ type: 'mcq', prompt: 'x', options: ['a'], answer: 0 }] } });
  assert.equal(bad.status, 400);
  const still = await t.req('GET', `/api/studio/lessons/${lid}/exercises`, { as: boss });
  assert.equal(still.body.exercises.length, src.body.exercises.length, 'a rejected save changes nothing');

  const one = await t.req('PUT', `/api/studio/lessons/${lid}/exercises`, { as: boss, body: { exercises: [{ type: 'tf', prompt: 'اختبار', answer: true }] } });
  assert.equal(one.body.saved, 1);
  const pub = await t.req('GET', `/api/lessons/${lid}/exercises`, { as: me });
  assert.equal(pub.body.total, 1);
});
