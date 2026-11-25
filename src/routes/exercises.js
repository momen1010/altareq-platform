import { id } from '../lib/validate.js';
import { badRequest } from '../lib/errors.js';

export default function exerciseRoutes(r, s) {
  const { exercises } = s;
  const user = { auth: 'user' };

  r.get('/api/lessons/:id/exercises', ctx => exercises.forLesson(ctx.user, id(ctx.params.id, 'lesson')), user);
  r.get('/api/placement', () => s.placement.questions());
  r.post('/api/placement', ctx => s.placement.grade(ctx.body?.answers, ctx.user?.id));
  r.get('/api/me/xp', ctx => exercises.xp(ctx.user.id), user);
  r.get('/api/review', ctx => exercises.reviewQueue(ctx.user), user);
  r.post('/api/exercises/:id/check', ctx => {
    if (!ctx.body || typeof ctx.body !== 'object' || !('answer' in ctx.body)) throw badRequest('Send your answer.');
    return exercises.check(ctx.user, id(ctx.params.id, 'exercise'), ctx.body.answer);
  }, user);
}
