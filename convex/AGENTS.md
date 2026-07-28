# Convex Backend DOX

## Purpose

Owns the synchronized cloud schema and Convex functions for Olaso operational
data, reporting summaries, and development seeding.

## Ownership

- `schema.ts` owns table shapes and indexes.
- `_generated/` is produced by the Convex CLI and committed.
- Business functions live in domain files such as `categories.ts`,
  `products.ts`, `modifiers.ts`, `recipes.ts`, `ingredients.ts`,
  `inventory.ts`, `sales.ts`, and `reports.ts`.
- `sync.ts` owns the bounded operational snapshot consumed by the tablet cache.
  An optional validated request ID lets deliberate manual sync bypass a stale
  client cache without changing the bounded read.
- `sales.ts` owns the idempotent sale mutation and the bounded, cursor-paginated
  receipt-snapshot history query.
- `dashboard.ts` owns the one-call saved-summary, current-warning, and
  recent-order snapshot.
- `reports.ts` owns the one-call current/prior saved-summary range and bounded
  product, category, payment, service, and exact-unit ingredient aggregates.
- `lib/` holds only helpers genuinely shared by multiple domain operations.

## Local Contracts

- Public functions validate every argument and authorization boundary.
- Public management functions require an `owner` or `manager` identity claim;
  the unauthenticated override is allowed only as an explicit deployment
  setting on the dedicated development deployment.
- Public POS functions require an authenticated operational identity; the
  separate unauthenticated POS override is allowed only on the dedicated
  development deployment.
- Use indexed, bounded reads; sales, sale items, stock movements, and reports
  are never read with an unbounded `.collect()`.
- Dashboard snapshots read at most 12 daily summaries, 100 ingredients, four
  warnings, and four recent sales.
- Report snapshots read at most 32 indexed daily summaries per current/prior
  range, accept no more than 31 days, and cap each detail aggregate at 20.
- Store money as integer centimes and stock in integer ingredient base units.
- Archive records referenced by history and keep stock movements append-only.
- One synchronized sale is one retry-safe mutation keyed by
  `deviceId + localSaleId`.
- The sale mutation re-reads current products, revisions, recipes, modifiers,
  and ingredients and computes trusted totals and deductions before writing any
  effect.
- Seed/reset work is internal, development-only, deterministic, and runnable
  through the CLI.
- Do not add actions for ordinary database work or import backend clients into
  React components.

## Verification

- Run `npm run check:convex`.
- Run `npm run check:management` after category, product, modifier, recipe, or
  management-authorization changes.
- Run `npm run check:inventory` after ingredient, stock balance, movement, or
  inventory-schema changes.
- Run `npm run check:sales` after operational snapshot, sale, receipt, stock
  deduction, or POS-authorization changes.
- Run `npm run check:settings` after changing the manual snapshot request
  boundary.
- Run `npm run check:orders` after sale-history pagination or receipt-snapshot
  read changes.
- Run `npm run check:dashboard` after Dashboard summary, warning, or
  recent-order read changes.
- Run `npm run check:reports` after saved report ranges or daily summary
  aggregation changes.
- Run `npx convex dev --once` when schema or deployed functions change.
- Review every new index against an implemented access path.

## Child DOX Index

No child DOX files.
