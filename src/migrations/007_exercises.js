// Phase B: per-lesson interactive exercises with instant, server-side feedback.
export default {
  version: 7,
  name: 'exercises',
  up: db => db.exec(`
    CREATE TABLE exercises (
      id INTEGER PRIMARY KEY,
      lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('mcq', 'tf', 'fill', 'order', 'match')),
      prompt TEXT NOT NULL,
      data_json TEXT NOT NULL,
      explanation TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX idx_exercises_lesson ON exercises(lesson_id, position);
    CREATE TABLE exercise_attempts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
      correct INTEGER NOT NULL,
      answer_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX idx_exercise_attempts_user ON exercise_attempts(user_id, exercise_id);
  `),
};
