# ال طارق | Al Tareq

**A bilingual (Arabic / English), RTL-first learning platform for Arabic language courses: grammar, morphology, rhetoric, spelling, calligraphy, reading and literature, and Arabic for non-native speakers.**

Learners browse a catalog, buy courses through Paymob, watch lessons, keep notes, pass a checkpoint quiz and earn a publicly verifiable certificate. Instructors build courses in a studio and get paid. Admins run everything from one console. An AI mentor, **Nour**, answers questions from the course's own material.

[![Node](https://img.shields.io/badge/Node-%E2%89%A522.13-5FA04E?logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/runtime%20dependencies-0-0E5E6F)](package.json)
[![Tests](https://img.shields.io/badge/tests-104%20passing-2EA44F)](test)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Arabic documentation: [README.ar.md](README.ar.md) | Plan: [ROADMAP.md](ROADMAP.md)

## Live

- Demo build (runs fully in the browser, data stays on the visitor's device): https://altareq-learning.web.app/ and https://altareq-platform.vercel.app/

## Features

**Learners**
- Bilingual catalog with search, filters, learning paths, wishlist, cart that works before sign-up, coupons
- Checkout with Paymob (Intention API + Unified Checkout, HMAC-verified webhooks), receipts, order history
- Lesson player for YouTube, Vimeo, MP4 and protected Bunny Stream video
- Progress tracking, learning streak, per-lesson notes
- Checkpoint quiz per course (pass mark: two thirds) and **public certificate verification**
- Q&A, announcements, live-session schedule, notifications
- **Practice**: five exercise types per lesson (multiple choice, true/false, fill-in, word order, matching) with instant feedback and Arabic-aware answer checking (ignores tashkeel and alef/ya/ta marbuta variants), on-screen Arabic keyboard, listen button
- **XP, levels, daily goal and achievements**; **spaced-repetition review** of missed exercises; **placement test**
- **Vocabulary flashcards** (5 decks, 50 words, Leitner boxes), word of the day, harakat toggle

**Nour, the AI mentor**
- Answers only from the course content and names the source lesson
- Replies in Arabic, Egyptian dialect or English
- Daily limits per plan, monthly spend cap, response cache, answer rating and reporting, admin controls
- Study coach: gentle nudges with quiet hours and weekly caps; optional parent progress reports

**Instructors**: studio for courses, sections, lessons and quizzes with publish checks; exercise editor per lesson; earnings ledger (70% share by default); payouts by bank transfer, InstaPay or wallet.

**Admins**: revenue overview, users and roles, course review, orders and refunds, coupons, payout approval, instructor applications, AI oversight.

**Engineering**: email verification and password reset, Resend or console mail, server-rendered meta / Open Graph / JSON-LD, `sitemap.xml`, `robots.txt`, `/healthz`, structured JSON logs, CSP, CSRF and Origin checks, rate limiting, scheduled backups. In production the server refuses to start with unsafe settings (console mail, demo payments, missing Paymob keys, non-https base URL).

## Architecture

```
src/
├── server.js        node:http adapter
├── app.js           createApp(): services + routes behind a transport-agnostic handle()
├── config.js        env parsing and production guards
├── db.js            node:sqlite wrapper (WAL)
├── routes/          auth, catalog, cart, learning, studio, admin, payments, mentor
├── services/        business logic, one factory per domain
├── migrations/      001..006
├── lib/             crypto, validation, rate limit, email, Paymob, video, AI, SEO
└── data/ seed.js    demo catalog and lesson notes
public/              vanilla-JS SPA (ES modules, no build step), CSS, i18n (ar/en)
demo/                browser backend: the same server code on sql.js (SQLite WASM)
scripts/             backup.js, build-demo.js (static demo into dist/)
test/                104 tests on node:test
```

The same `createApp()` runs behind `node:http` in production and inside the browser in the static demo, so the demo exercises the real code paths.

**Stack:** Node 22 (`node:http`, `node:sqlite`, `node:crypto`), SQLite, vanilla JS SPA, Paymob, Resend, Bunny Stream, Anthropic API (optional), Firebase Hosting for the demo. Zero runtime dependencies.

## Run locally

```bash
npm start        # http://localhost:3000, creates data/altareq.db and seeds demo data
npm run dev      # restart on change
npm test         # 104 tests
npm run backup   # snapshot to data/backups/
npm run build:demo   # static browser-only demo into dist/
```

Copy `.env.example` to `.env` to configure email, payments, video and AI. Emails print to the log in development; open http://localhost:3000/dev/mail to read them.

Demo accounts (development seed only): `learner@altareq.test`, `tarek@altareq.test` (instructor), `admin@altareq.test`. Passwords are in `src/seed.js` and exist only in seeded dev databases.

## Deployment

- **Production server:** any Node 22.13+ host with a persistent disk for `DATABASE_PATH`. Set `NODE_ENV=production`, an https `BASE_URL`, `EMAIL_PROVIDER=resend`, `PAYMENTS_PROVIDER=paymob` and the Paymob keys.
- **Static demo:** `npm run deploy:demo` (Firebase Hosting, site `altareq-learning`; set `DEMO_URL` first).

## Provenance and license

MIT, see [LICENSE](LICENSE). Built on the open-source [Manhal](https://github.com/AbanoubRashad/manhal) platform by Abanoub Rashad (MIT), with new branding and Arabic-language course content for Al Tareq.

## CI

The GitHub Actions workflow lives at `ci/github-actions-ci.yml` (Node 22 and 24: `npm test` and `npm run build:demo`). Move it to `.github/workflows/ci.yml` to enable it; pushing workflow files needs a token with the `workflow` scope.
