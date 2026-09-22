# Lyktsaga — Platform Design

Status: Approved (technology selection only — no UI/visual design yet)
Date: 2026-09-22

## 1. Overview

Lyktsaga ("lantern tail") is a fictional online bookstore built as a learning/portfolio
project. It lets users buy, read (e-reader), and listen to (audiobook) books online.
The goal is to demonstrate current best practices across a full-stack TypeScript
monorepo, deployed for free/cheap so the app is publicly checkable.

The project is deliberately decomposed into four applications inside a single Nx
monorepo:

1. **store-web** — public-facing Angular SSR storefront (buy/read/listen)
2. **store-api** — NestJS API backing the storefront
3. **admin-web** — Angular SPA back-office for managing the catalog/orders
4. **admin-api** — NestJS API backing the admin panel

Each app-pair (web + api) is a separate deployable unit, but they share domain logic,
types, auth, and UI building blocks through Nx libraries — see §3.

## 2. Non-goals (for now)

- No real payment processing (mocked, but built behind a swappable interface — §6).
- No real book/audio content — catalog uses generated placeholder EPUB files and short
  sample audio clips, not licensed or pirated media.
- No visual/UI design system yet. Angular apps are scaffolded with plain, minimal
  markup; a real design pass happens at the end of the build, once backend and core
  flows work.
- No horizontal scaling, multi-region, or paid infrastructure — everything targets
  free tiers.

## 3. Monorepo structure

- **Nx** monorepo, **pnpm** as package manager (`packageManager` field pinned in
  `package.json`; `.nvmrc` pins Node).
- Apps: `apps/store-web`, `apps/store-api`, `apps/admin-web`, `apps/admin-api`.
- Shared libraries:
  - `libs/shared-types` — DTOs/interfaces shared between every frontend and backend.
  - `libs/data` — Prisma schema + generated client, one schema shared by both APIs.
  - `libs/auth` — JWT issuing/validation, guards, role decorators, shared by both APIs.
  - `libs/payments` — the `PaymentProvider` abstraction and its mock implementation.
  - `libs/ui` — shared Angular design-system components, used by both `store-web` and
    `admin-web` once the UI pass begins.
- **Module boundaries**: every project is tagged (`type:app|feature|data-access|ui|util`,
  `scope:store|admin|shared`) in `nx.json`/project configs, enforced by
  `@nx/enforce-module-boundaries` so, e.g., `admin-api` cannot accidentally import
  `store-web` internals.
- **Nx Cloud** (free tier) for remote caching and `nx affected` in CI.

## 4. Frontend stack

- Latest **Angular**, standalone components, `@angular/ssr` for `store-web` (built-in
  SSR + hydration — no separate Angular Universal package).
- `admin-web` is a plain CSR SPA (no SEO need, behind auth).
- Styling/components (final pass, not scaffolding): **Angular Material + Tailwind**.
- State: Angular **Signals** for local/component state; **@ngrx/signals (SignalStore)**
  for the few global slices (cart, auth session) once needed.
- SEO (store-web only): per-route `Meta`/`Title`, JSON-LD `schema.org/Book` structured
  data, `sitemap.xml`, prerendering for static/catalog routes.

## 5. Backend stack

- **NestJS** (latest), REST + OpenAPI/Swagger (`@nestjs/swagger`) rather than GraphQL.
- API versioning from the start: all routes under `/api/v1/...`.
- **Prisma** ORM against **PostgreSQL** (Supabase free tier — see §9), one shared
  schema in `libs/data`.
- `class-validator` / `class-transformer` for DTO validation; `@nestjs/config` with a
  Zod-validated env schema.
- `helmet` + `@nestjs/throttler` wired in from scaffolding time (security headers,
  basic rate limiting), even though there's no real traffic yet.
- Consistent API error envelope via a shared exception filter.

## 6. Auth

Self-built, not a managed provider (explicit choice — better demonstrates backend
security practices for a learning project):

- **Passport-JWT**: short-lived access token + rotating refresh token.
- **argon2** for password hashing.
- Role-based guards (`customer` vs `admin`), shared via `libs/auth` so both APIs
  enforce identical rules.

## 7. Payments (mocked, Stripe-shaped)

- `libs/payments` defines a `PaymentProvider` interface modeled directly on Stripe's
  API surface (`createPaymentIntent`, `confirmPayment`, `refund`, webhook-event shape).
- `MockPaymentProvider` implements it now (simulates pending → succeeded, fake webhook
  events).
- A future `StripePaymentProvider` (test-mode keys) can implement the same interface
  with no caller changes — this is the intended seam if/when the project goes further.

## 8. Reading & listening experience

- **Read**: catalog ships with a handful of generated, validly-formed **EPUB** files
  (placeholder content, not real books) rendered client-side with **epub.js** — real
  pagination, bookmarks, font/theme controls against real EPUB files.
- **Listen**: short generated/royalty-free sample audio per chapter, played through a
  custom player built on the native HTML5 `Audio` element + RxJS — speed control,
  sleep timer, chapter navigation, resume position. No heavy third-party audio library.
- Media files live in object storage (§9), not committed to the repo.

## 9. Data & storage

- **Supabase** free tier: managed Postgres (used via Prisma) _and_ an S3-compatible
  storage bucket (EPUB/audio placeholder files) from a single free provider.

## 10. Testing & quality

- **Jest** for unit tests (Angular + Nest).
- **Playwright** for e2e (Nx plugin; can drive the real SSR store).
- **Supertest** for Nest API e2e tests.
- **ESLint + Prettier** (Nx defaults), **Husky + lint-staged** pre-commit,
  **Conventional Commits** via commitlint.

## 11. CI/CD & hosting (all free-tier)

- **GitHub Actions** + `nx affected` — lint/test/build only what changed.
- **store-web** (SSR): Vercel Hobby — first-class Angular SSR build support.
- **admin-web** (SPA): Vercel or Netlify static hosting.
- **store-api** / **admin-api**: Render free web services (sleep after 15 min idle —
  acceptable for a demo).
- **Database + storage**: Supabase free tier.
- Repository hosted on **GitHub**.

## 12. Future considerations (explicitly deferred)

These are known gaps, intentionally postponed because the project is a demo today —
revisit if/when it becomes a real product:

- Structured logging (pino) and error tracking (Sentry free tier) for observability.
- GDPR / cookie-consent basics once real user accounts and real payments are live.
- Real payment provider swap-in (Stripe live/test) behind the existing `PaymentProvider`
  interface.
- Caching layer (Redis) if traffic/latency ever demands it — skipped now to avoid an
  extra paid/free-tier dependency.
- Real book/audio content sourcing and licensing if the catalog becomes real.

## 13. Build sequence (as directed)

Backend-first: scaffold and build out `store-api`/`admin-api` with real structure,
validate flows via minimal unmodified HTML/CSS pages, then attach the real Angular UI
(Material/Tailwind, `libs/ui`) as the last phase. This document only covers the
technology scaffolding; each subsequent piece (auth module, catalog module, orders,
etc.) is implemented and reviewed incrementally, one at a time.
