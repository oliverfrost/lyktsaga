# ADR 0001: Initial platform stack

Date: 2026-09-22
Status: Accepted

## Context

Lyktsaga is a new demo/portfolio bookstore project split into 4 apps (store-web,
store-api, admin-web, admin-api) in a single Nx monorepo. Full rationale and the
complete technology list live in
`docs/superpowers/specs/2026-09-22-lyktsaga-platform-design.md`. This ADR records the
key decisions and the alternatives that were considered, for future reference.

## Decisions

| Area          | Chosen                                                                                        | Alternatives considered                                 | Why                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Monorepo tool | Nx + pnpm                                                                                     | Turborepo, plain pnpm workspaces                        | Nx generators/module boundaries/Nx Cloud fit a 4-app + shared-libs shape well                       |
| Frontend      | Angular (latest) + `@angular/ssr`                                                             | Next.js/React                                           | User-specified; Angular SSR meets the SEO/speed goal                                                |
| Backend       | NestJS (latest)                                                                               | Express/Fastify raw, tRPC                               | User-specified; structured, testable, good DI                                                       |
| API style     | REST + OpenAPI/Swagger                                                                        | GraphQL                                                 | Simpler for a learning project; a Swagger doc is a good portfolio artifact                          |
| ORM           | Prisma                                                                                        | TypeORM                                                 | Stronger type safety and migration DX                                                               |
| DB            | PostgreSQL via Supabase                                                                       | Neon + separate object storage                          | One free provider covers Postgres + object storage (EPUB/audio files)                               |
| Auth          | Self-built JWT (Passport, argon2)                                                             | Auth0/Clerk/Supabase Auth                               | Explicit choice to demonstrate backend security practices                                           |
| Payments      | Mocked, behind a Stripe-shaped `PaymentProvider` interface                                    | Fully mocked with no abstraction; real Stripe test mode | Keeps zero cost/risk now, but a real Stripe implementation can drop in later with no caller changes |
| Reader        | epub.js against generated placeholder EPUB files                                              | Plain text viewer                                       | Chosen "full e-reader" depth; real EPUB files needed for epub.js to be meaningful                   |
| Player        | Custom HTML5 Audio + RxJS                                                                     | Howler.js                                               | Full audiobook feature set (speed/sleep timer/chapters) doesn't need a heavy library                |
| Hosting       | Vercel (store-web SSR), Vercel/Netlify (admin-web), Render (both APIs), Supabase (DB+storage) | Railway, Fly.io                                         | Currently the most generous true free tiers for this app shape                                      |

## Consequences

- Two separate Postgres-touching Nest apps share one Prisma schema (`libs/data`) —
  schema changes affect both APIs; migrations must be coordinated.
- Render free web services cold-start after idling — acceptable for a demo, would need
  a paid tier if this became a real product with real users.
- The payments abstraction adds a small amount of upfront structure for no immediate
  functional gain — accepted deliberately as a "seam" for a possible future real
  integration.
