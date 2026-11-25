import { id } from '../lib/validate.js';
import { badRequest } from '../lib/errors.js';

export default function exerciseRoutes(r, s) {
  const { exercises, db, access, catalog } = s;
  const inst = { auth: 'instructor' };
  const ownLesson = (u, lid) => {
    const l = db.get('SELECT * FROM lessons WHERE id = ?', lid);
    if (!l || !access.teaches(u, catalog.row(l.course_id))) throw badRequest("We couldn't find that lesson.");
  };
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
  r.get('/api/studio/lessons/:id/exercises', ctx => {
    const lid = id(ctx.params.id, 'lesson'); ownLesson(ctx.user, lid);
    return { exercises: exercises.sourceForLesson(lid) };
  }, inst);
  r.put('/api/studio/lessons/:id/exercises', ctx => {
    const lid = id(ctx.params.id, 'lesson'); ownLesson(ctx.user, lid);
    if (!ctx.body || !Array.isArray(ctx.body.exercises)) throw badRequest('Send the list of exercises.');
    return { saved: exercises.replaceForLesson(lid, ctx.body.exercises) };
  }, inst);
}
