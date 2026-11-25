import { badRequest } from '../lib/errors.js';
import { placement } from '../data/placement.js';

export const levelFor = score => (score >= 10 ? 'adv' : score >= 6 ? 'int' : 'beg');

export function placementService({ catalog }) {
  return {
    questions: () => ({ questions: placement.map(([prompt, options], i) => ({ id: i, prompt, options })), total: placement.length }),
    grade(answers, userId = null) {
      if (!Array.isArray(answers) || answers.length !== placement.length || answers.some(a => !Number.isInteger(a) || a < 0 || a > 9)) {
        throw badRequest('Answer every question first.');
      }
      let score = 0;
      const byLevel = { beg: [0, 0], int: [0, 0], adv: [0, 0] };
      placement.forEach(([, , ok, lvl], i) => { byLevel[lvl][1]++; if (answers[i] === ok) { score++; byLevel[lvl][0]++; } });
      const level = levelFor(score);
      const courses = catalog.list({}, userId).filter(c => c.level === level || c.level === 'all')
        .sort((a, b) => (b.level === level) - (a.level === level) || b.rating - a.rating).slice(0, 3);
      return { score, total: placement.length, level, byLevel, answers: placement.map(p => p[2]), courses };
    },
  };
}
