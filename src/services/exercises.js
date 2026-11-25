import { badRequest, notFound, forbidden } from '../lib/errors.js';
import { normalizeArabic } from '../lib/arabic.js';

export const TYPES = ['mcq', 'tf', 'fill', 'order', 'match'];

/** Deterministic shuffle (seeded by exercise id) so a reload shows the same layout. */
function shuffled(items, seed) {
  const a = items.map((v, i) => ({ v, k: Math.sin(seed * 9301 + (i + 1) * 49297) }));
  a.sort((x, y) => x.k - y.k);
  const out = a.map(x => x.v);
  // never hand the learner the solved arrangement
  if (out.length > 1 && out.every((v, i) => v === items[i])) out.push(out.shift());
  return out;
}

/** Validate an exercise definition from an instructor or the seed. Throws 400 with a clear message. */
export function validateExercise(ex) {
  if (!ex || typeof ex !== 'object') throw badRequest('Exercise is missing.');
  if (!TYPES.includes(ex.type)) throw badRequest(`Exercise type must be one of: ${TYPES.join(', ')}.`);
  if (typeof ex.prompt !== 'string' || !ex.prompt.trim()) throw badRequest('Every exercise needs a prompt.');
  if (ex.prompt.length > 600) throw badRequest('Exercise prompt is too long.');
  const strs = (arr, min, max, label) => {
    if (!Array.isArray(arr) || arr.length < min || arr.length > max || arr.some(x => typeof x !== 'string' || !x.trim() || x.length > 200)) {
      throw badRequest(`${label} must have ${min} to ${max} non-empty items.`);
    }
  };
  switch (ex.type) {
    case 'mcq':
      strs(ex.options, 2, 6, 'Options');
      if (!Number.isInteger(ex.answer) || ex.answer < 0 || ex.answer >= ex.options.length) throw badRequest('Pick which option is correct.');
      return { type: 'mcq', prompt: ex.prompt.trim(), data: { options: ex.options, answer: ex.answer }, explanation: ex.explanation || '' };
    case 'tf':
      if (typeof ex.answer !== 'boolean') throw badRequest('True/false needs a boolean answer.');
      return { type: 'tf', prompt: ex.prompt.trim(), data: { answer: ex.answer }, explanation: ex.explanation || '' };
    case 'fill':
      strs(ex.accept, 1, 10, 'Accepted answers');
      return { type: 'fill', prompt: ex.prompt.trim(), data: { accept: ex.accept }, explanation: ex.explanation || '' };
    case 'order': {
      const answers = Array.isArray(ex.answers?.[0]) ? ex.answers : [ex.words];
      for (const a of answers) strs(a, 2, 10, 'Words');
      if (answers.some(a => a.length !== answers[0].length || [...a].sort().join('|') !== [...answers[0]].sort().join('|'))) throw badRequest('Every accepted order must use the same words.');
      return { type: 'order', prompt: ex.prompt.trim(), data: { answers }, explanation: ex.explanation || '' };
    }
    case 'match':
      if (!Array.isArray(ex.pairs) || ex.pairs.length < 2 || ex.pairs.length > 8 || ex.pairs.some(p => !Array.isArray(p) || p.length !== 2 || p.some(x => typeof x !== 'string' || !x.trim()))) {
        throw badRequest('Matching needs 2 to 8 pairs.');
      }
      return { type: 'match', prompt: ex.prompt.trim(), data: { pairs: ex.pairs }, explanation: ex.explanation || '' };
  }
}

/** Interactive exercises: public view hides answers; checking happens on the server. */
export function exercisesService({ db, catalog }) {
  const enrolled = (userId, courseId) => db.get('SELECT 1 AS ok FROM enrollments WHERE user_id = ? AND course_id = ?', userId, courseId);
  const canTeach = (user, course) => user.role === 'admin' || course.instructor_id === user.id;

  function access(user, lessonId) {
    const l = db.get('SELECT id, course_id FROM lessons WHERE id = ?', lessonId);
    if (!l) throw notFound("We couldn't find that lesson.");
    const course = catalog.row(l.course_id);
    if (!course) throw notFound("We couldn't find that course.");
    if (!enrolled(user.id, l.course_id) && !canTeach(user, course)) throw forbidden('Enroll in this course to practice.');
    return l;
  }

  function publicView(row) {
    const d = JSON.parse(row.data_json);
    const base = { id: row.id, type: row.type, prompt: row.prompt };
    switch (row.type) {
      case 'mcq': return { ...base, options: d.options };
      case 'tf': return base;
      case 'fill': return base;
      case 'order': return { ...base, words: shuffled(d.answers[0], row.id) };
      case 'match': return { ...base, left: d.pairs.map(p => p[0]), right: shuffled(d.pairs.map(p => p[1]), row.id) };
    }
  }

  /** Grade an answer. Returns { correct, detail } where detail is safe to reveal after the attempt. */
  function grade(row, answer) {
    const d = JSON.parse(row.data_json);
    switch (row.type) {
      case 'mcq': {
        if (!Number.isInteger(answer) || answer < 0 || answer >= d.options.length) throw badRequest('Pick one of the options.');
        return { correct: answer === d.answer, reveal: { answer: d.answer } };
      }
      case 'tf': {
        if (typeof answer !== 'boolean') throw badRequest('Choose true or false.');
        return { correct: answer === d.answer, reveal: { answer: d.answer } };
      }
      case 'fill': {
        if (typeof answer !== 'string' || !answer.trim()) throw badRequest('Type your answer first.');
        if (answer.length > 200) throw badRequest('That answer is too long.');
        const n = normalizeArabic(answer);
        return { correct: d.accept.some(a => normalizeArabic(a) === n), reveal: { answer: d.accept[0] } };
      }
      case 'order': {
        if (!Array.isArray(answer) || answer.some(w => typeof w !== 'string')) throw badRequest('Arrange all the words first.');
        if (answer.length !== d.answers[0].length) throw badRequest('Use every word.');
        const mine = answer.map(normalizeArabic);
        return { correct: d.answers.some(a => a.every((w, i) => normalizeArabic(w) === mine[i])), reveal: { answer: d.answers[0] } };
      }
      case 'match': {
        if (!Array.isArray(answer) || answer.length !== d.pairs.length || answer.some(w => typeof w !== 'string')) throw badRequest('Match every item first.');
        // answer[i] is the right-hand text chosen for left item i
        const wrong = d.pairs.map((p, i) => normalizeArabic(p[1]) === normalizeArabic(answer[i]) ? null : i).filter(i => i !== null);
        return { correct: wrong.length === 0, reveal: { answer: d.pairs.map(p => p[1]), wrong } };
      }
    }
  }

  return {
    /** Exercises for a lesson, with what the learner has already solved. */
    forLesson(user, lessonId) {
      access(user, lessonId);
      const rows = db.all('SELECT * FROM exercises WHERE lesson_id = ? ORDER BY position, id', lessonId);
      const solved = new Set(db.all(`SELECT DISTINCT exercise_id FROM exercise_attempts WHERE user_id = ? AND correct = 1
        AND exercise_id IN (SELECT id FROM exercises WHERE lesson_id = ?)`, user.id, lessonId).map(r => r.exercise_id));
      return {
        exercises: rows.map(r => ({ ...publicView(r), solved: solved.has(r.id) })),
        solved: rows.filter(r => solved.has(r.id)).length,
        total: rows.length,
      };
    },

    check(user, exerciseId, answer) {
      const row = db.get('SELECT * FROM exercises WHERE id = ?', exerciseId);
      if (!row) throw notFound("We couldn't find that exercise.");
      access(user, row.lesson_id);
      const { correct, reveal } = grade(row, answer);
      db.run('INSERT INTO exercise_attempts (user_id, exercise_id, correct, answer_json) VALUES (?, ?, ?, ?)', user.id, exerciseId, correct ? 1 : 0, JSON.stringify(answer));
      const total = db.get('SELECT COUNT(*) AS n FROM exercises WHERE lesson_id = ?', row.lesson_id).n;
      const solved = db.get(`SELECT COUNT(DISTINCT a.exercise_id) AS n FROM exercise_attempts a JOIN exercises e ON e.id = a.exercise_id
        WHERE a.user_id = ? AND a.correct = 1 AND e.lesson_id = ?`, user.id, row.lesson_id).n;
      // Reveal the solution only after a miss, so a correct hit leaks nothing extra and retries stay meaningful.
      return { correct, explanation: row.explanation, ...(correct ? {} : { reveal }), progress: { solved, total } };
    },

    /** Replace a lesson's exercises (studio and seed). Validates everything before writing anything. */
    replaceForLesson(lessonId, list) {
      if (!Array.isArray(list) || list.length > 40) throw badRequest('A lesson can have up to 40 exercises.');
      const clean = list.map(validateExercise);
      db.tx(() => {
        db.run('DELETE FROM exercises WHERE lesson_id = ?', lessonId);
        clean.forEach((c, i) => db.run('INSERT INTO exercises (lesson_id, position, type, prompt, data_json, explanation) VALUES (?, ?, ?, ?, ?, ?)',
          lessonId, i, c.type, c.prompt, JSON.stringify(c.data), c.explanation));
      });
      return clean.length;
    },

    /** Per-course practice summary for the learner dashboard. */
    courseSummary(userId, courseId) {
      const total = db.get('SELECT COUNT(*) AS n FROM exercises e JOIN lessons l ON l.id = e.lesson_id WHERE l.course_id = ?', courseId).n;
      const solved = db.get(`SELECT COUNT(DISTINCT a.exercise_id) AS n FROM exercise_attempts a JOIN exercises e ON e.id = a.exercise_id
        JOIN lessons l ON l.id = e.lesson_id WHERE a.user_id = ? AND a.correct = 1 AND l.course_id = ?`, userId, courseId).n;
      return { solved, total };
    },
  };
}
