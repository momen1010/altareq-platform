# Roadmap: from demo to a production Arabic-learning platform

Goal: a production-ready platform, not a demo, aiming at the level of the best Arabic-learning products (Alif, Madinah Arabic, Arabic101, Duolingo-style practice, Udemy-style marketplaces).

## What exists today (verified in code, 104 tests passing)

| Area | State |
| --- | --- |
| Accounts | Register, login, verify email, reset password, sessions, roles (learner / instructor / admin) |
| Catalog | 14 sample courses, 8 categories, search, wishlist, cart, coupons |
| Learning | Lesson player, completion, notes, streak, minutes per day |
| Quizzes | One multiple-choice checkpoint per course, single correct answer, pass mark 2/3, attempts stored |
| Certificates | Issued after 100% lessons + passed quiz, public lookup by code |
| Payments | Paymob (cards, wallets), HMAC webhook, refunds, instructor earnings and payouts |
| Studio / Admin | Course builder, publish checks, Q&A moderation, live sessions, admin console |
| AI | Nour mentor grounded in lesson notes, budget limits, coach nudges |
| Ops | CSP, CSRF, rate limits, backups, CI |

**The live site is the browser-only demo** (SQLite in `localStorage`, fake payments, canned AI). Nothing a visitor does is shared or persisted server-side. The real server exists in `src/` but is not deployed.

## What is missing for a world-class Arabic platform

1. **Exercise engine.** Only multiple choice, only at course end. Arabic learning needs per-lesson practice with instant feedback.
2. **Arabic-specific tooling:** tashkeel (diacritics) toggle, i3rab (parsing) exercises, root/pattern drills, typing with an on-screen Arabic keyboard, audio for every vocabulary item, handwriting/calligraphy guides.
3. **Spaced repetition** (vocabulary and grammar review queue).
4. **Placement test** and level paths (CEFR-like for non-natives).
5. **Real content and real video.** Seed lessons are text notes.
6. **Production deployment** with persistent DB, monitoring, backups off-box.
7. **Accessibility, performance and SEO** for a public site (the SPA is client-rendered).
8. **Mobile app / PWA** (manifest exists, no service worker, no offline).
9. **Legal and trust:** real terms, privacy, refund pages reviewed; support channel.

## Phased plan

### Phase A: Go live (2 to 3 weeks)
- Deploy the Node server (Fly.io, Railway or a VPS) with a persistent volume, HTTPS, custom domain; `PAYMENTS_PROVIDER=paymob`, `EMAIL_PROVIDER=resend`, `SEED_DEMO=false`.
- Off-site backups (nightly copy to object storage) and uptime/error monitoring.
- Keep Firebase Hosting only as a static marketing/demo site, or retire the demo.
- Paymob needs a commercial registration and tax card. Until then run InstaPay/wallet transfer with manual confirmation.
- Replace sample courses with the real first course set; real video (Bunny Stream).
- Add a service worker and complete PWA icons.

### Phase B: Exercises with instant feedback (3 to 4 weeks) — DONE: engine, 5 types, 10 courses seeded, studio editor. Remaining: multi-select, i3rab selection, audio dictation, final exams, attempt limits
- Migration `007_exercises`: `exercises(id, lesson_id, type, prompt, data_json, explanation)` and `exercise_attempts`.
- Types: multiple choice, multi-select, fill-in-the-blank, word ordering, matching, true/false, typed answer with Arabic normalization (tashkeel, alef/hamza/ya variants), i3rab selection, audio dictation.
- Immediate feedback with explanation and retry; XP and per-lesson mastery.
- Per-course question banks, randomized final exams, attempt limits.

### Phase C: Progress and retention (2 to 3 weeks) — PARTLY DONE: review queue, XP/daily goal, placement test, vocabulary flashcards. Remaining: streak freeze, per-skill mastery, weak-topic report
- Review queue with spaced repetition (SM-2 style) over vocabulary and missed exercises.
- Learner dashboard: weekly goal, streak freeze, per-skill mastery, weak-topic report.
- Placement test and recommended path; parent reports already exist, extend them.

### Phase D: Certificates and credibility (1 to 2 weeks)
- PDF certificates with QR to the verification page, bilingual, shareable (LinkedIn).
- Per-course pass rules (minimum score, time on course), certificate revocation.

### Phase E: Content management (2 to 3 weeks)
- Studio: rich lesson editor (Arabic RTL, tashkeel helpers), exercise builder, bulk import (CSV/JSON), drafts and versioning, media library with uploads.
- Review workflow: instructor submits, admin approves.
- Admin analytics: completion funnel, quiz item difficulty, revenue by course.

### Phase F: Audio, speaking, mobile (4+ weeks)
- Recorded audio per word and sentence; pronunciation practice with speech recognition.
- Installable PWA with offline lessons; later a native wrapper.
- Server-side rendering of public pages for SEO (course and certificate pages already have server meta).

## Architecture: does it need Firebase?

No. Unlike Velora (static storefront with no server, so Firestore plus rules), Al Tareq already has a real backend with relational data (enrollments, orders, quizzes, earnings) and server-side business rules. SQLite with WAL on a persistent volume is enough for the first tens of thousands of learners; the DB layer is a thin wrapper, so moving to Postgres later (when you need multiple instances) is a contained change. Keep Firebase Hosting only for static assets or the demo. Add a CDN in front (Cloudflare) and Bunny for video.

## Suggested order
A (live) then B (exercises) then C and D in parallel, then E. Phases A and B are what turn it from a demo into a product.
