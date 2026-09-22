# Lyktsaga

Lyktsaga ("lantern tail") is a fictional online bookstore — a learning/portfolio
project demonstrating a full-stack TypeScript monorepo. Users can buy, read
(e-reader), and listen to (audiobook) books online.

Full architecture and technology decisions: see
[`docs/superpowers/specs/2026-09-22-lyktsaga-platform-design.md`](docs/superpowers/specs/2026-09-22-lyktsaga-platform-design.md)
and [`docs/adr/0001-initial-platform-stack.md`](docs/adr/0001-initial-platform-stack.md).

## Apps

| App         | Description                         | Stack                         |
| ----------- | ----------------------------------- | ----------------------------- |
| `store-web` | Public storefront (buy/read/listen) | Angular, SSR (`@angular/ssr`) |
| `store-api` | API backing the storefront          | NestJS                        |
| `admin-web` | Back-office for catalog/orders      | Angular (CSR SPA)             |
| `admin-api` | API backing the admin panel         | NestJS                        |

## Shared libraries

| Lib            | Purpose                                               |
| -------------- | ----------------------------------------------------- |
| `shared-types` | DTOs/interfaces shared by every app                   |
| `data`         | Prisma schema + generated client                      |
| `auth`         | JWT auth guards/decorators shared by both APIs        |
| `payments`     | `PaymentProvider` abstraction (mocked, Stripe-shaped) |
| `ui`           | Shared Angular design-system components               |

## Getting started

Requires the Node version pinned in `.nvmrc` and `pnpm` (enable via
`corepack enable`).

```bash
pnpm install

# serve an individual app
pnpm exec nx serve store-api    # http://localhost:3000/api/v1
pnpm exec nx serve admin-api    # http://localhost:3001/api/v1
pnpm exec nx serve store-web    # http://localhost:4200
pnpm exec nx serve admin-web    # http://localhost:4201

# run tests / lint for everything affected by your change
pnpm exec nx affected -t lint test build

# run tests / lint for the whole workspace
pnpm exec nx run-many -t lint test build
```

## Build order

This project is being built backend-first: `store-api` / `admin-api` get real
structure and are validated against minimal HTML/CSS pages before the Angular
UI (Material + Tailwind) is attached in a later phase.

## License

MIT — see [`LICENSE`](LICENSE).
