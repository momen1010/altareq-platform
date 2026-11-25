import { id } from '../lib/validate.js';
import { badRequest } from '../lib/errors.js';

export default function exerciseRoutes(r, s) {
  const { exercises } = s;
  const user = { auth: 'user' };

  r.get('/api/lessons/:id/exercises', ctx => exercises.forLesson(ctx.user, id(ctx.params.id, 'lesson')), user);
  r.post('/api/exercises/:id/check', ctx => {
    if (!ctx.body || typeof ctx.body !== 'object' || !('answer' in ctx.body)) throw badRequest('Send your answer.');
    return exercises.check(ctx.user, id(ctx.params.id, 'exercise'), ctx.body.answer);
  }, user);
}
