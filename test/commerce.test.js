import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeApp, learner, newLearner } from './helpers.js';
import { allocateDiscount } from '../src/services/cart.js';

test('catalog lists published courses with filters and sorting', async () => {
  const t = makeApp();
  const all = (await t.req('GET', '/api/courses')).body.courses;
  assert.equal(all.length, 14);
  const free = (await t.req('GET', '/api/courses?price=free')).body.courses;
  assert.ok(free.length >= 2 && free.every(c => c.price === 0));
  const data = (await t.req('GET', '/api/courses?cat=nahw&sort=low')).body.courses;
  assert.ok(data.every(c => c.category === 'nahw'));
  assert.deepEqual(data.map(c => c.price), [...data.map(c => c.price)].sort((a, b) => a - b));
  const ar = (await t.req('GET', `/api/courses?q=${encodeURIComponent('أساسيات النحو')}`)).body.courses;
  assert.equal(ar[0].slug, 'nahw-foundations');
  const bad = await t.req('GET', '/api/courses?sort=cheapest');
  assert.equal(bad.status, 400);
});

test('draft courses are hidden from learners but visible to their instructor', async () => {
  const t = makeApp();
  t.db.run("UPDATE courses SET status = 'draft' WHERE slug = 'irab-in-practice'");
  assert.equal((await t.req('GET', '/api/courses/irab-in-practice')).status, 404);
  const inst = await t.login('tarek@altareq.test', 'altareq-teach');
  assert.equal((await t.req('GET', '/api/courses/irab-in-practice', { as: inst })).status, 200);
});

test('the cart prices come from the database and coupons apply server-side', async () => {
  const t = makeApp();
  const me = await newLearner(t);
  const a = t.courseBySlug('balagha-eloquence'), b = t.courseBySlug('irab-in-practice');
  await t.req('POST', '/api/cart', { as: me, body: { courseId: a.id, price: 1 } });
  let r = await t.req('POST', '/api/cart', { as: me, body: { courseId: b.id } });
  assert.equal(r.body.cart.subtotal, a.price + b.price);
  r = await t.req('POST', '/api/cart/coupon', { as: me, body: { code: 'altareq20' } });
  assert.equal(r.body.cart.discount, Math.round((a.price + b.price) * 0.2));
  assert.equal(r.body.cart.items.reduce((s, i) => s + i.paid, 0), r.body.cart.total);
  const bad = await t.req('POST', '/api/cart/coupon', { as: me, body: { code: 'FREEBIES' } });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error, "That code isn't valid.");
});

test('expired and used-up coupons are refused', async () => {
  const t = makeApp();
  t.db.run("INSERT INTO coupons (code, percent, expires_at) VALUES ('OLD', 10, '2020-01-01 00:00:00')");
  t.db.run("INSERT INTO coupons (code, percent, max_uses, uses) VALUES ('GONE', 10, 5, 5)");
  const me = await newLearner(t);
  await t.req('POST', '/api/cart', { as: me, body: { courseId: t.courseBySlug('irab-in-practice').id } });
  assert.equal((await t.req('POST', '/api/cart/coupon', { as: me, body: { code: 'OLD' } })).body.error, 'That code has expired.');
  assert.equal((await t.req('POST', '/api/cart/coupon', { as: me, body: { code: 'GONE' } })).body.error, 'That code has been fully used.');
});

test('free courses enroll directly and cannot be added to the cart', async () => {
  const t = makeApp();
  const me = await newLearner(t);
  const free = t.courseBySlug('reading-fluency');
  assert.equal((await t.req('POST', '/api/cart', { as: me, body: { courseId: free.id } })).status, 400);
  assert.equal((await t.req('POST', `/api/courses/${free.id}/enroll`, { as: me })).status, 200);
  const paid = t.courseBySlug('irab-in-practice');
  assert.equal((await t.req('POST', `/api/courses/${paid.id}/enroll`, { as: me })).status, 400);
});

test('demo checkout enrolls, uses the coupon once and credits instructors', async () => {
  const t = makeApp();
  const me = await newLearner(t);
  const c = t.courseBySlug('naskh-calligraphy');
  await t.req('POST', '/api/cart', { as: me, body: { courseId: c.id } });
  await t.req('POST', '/api/cart/coupon', { as: me, body: { code: 'ALTAREQ20' } });
  const before = t.db.get("SELECT uses FROM coupons WHERE code = 'ALTAREQ20'").uses;
  const r = await t.req('POST', '/api/checkout', { as: me });
  assert.equal(r.body.status, 'paid');
  assert.equal(t.db.get("SELECT uses FROM coupons WHERE code = 'ALTAREQ20'").uses, before + 1);
  const order = (await t.req('GET', `/api/orders/${r.body.orderId}`, { as: me })).body.order;
  assert.equal(order.total, c.price - Math.round(c.price * 0.2));
  const e = t.db.get('SELECT * FROM earnings WHERE order_id = ?', r.body.orderId);
  assert.equal(e.amount, Math.round(order.total * 0.7));
  assert.equal((await t.req('GET', '/api/cart', { as: me })).body.cart.items.length, 0);
});

test('learners cannot see other people\'s orders', async () => {
  const t = makeApp();
  const other = await newLearner(t);
  const mine = (await t.req('GET', '/api/orders', { as: await learner(t) })).body.orders[0];
  assert.equal((await t.req('GET', `/api/orders/${mine.id}`, { as: other })).status, 403);
});

test('discount allocation always adds up to the total', () => {
  const prices = [899, 749, 349];
  const paid = allocateDiscount(prices, 399);
  assert.equal(paid.reduce((a, b) => a + b, 0), prices.reduce((a, b) => a + b, 0) - 399);
});
