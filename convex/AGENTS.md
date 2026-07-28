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
- `sales.ts` owns the idempotent sale mutation and the bounded, cursor-paginated
  receipt-snapshot history query.
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
- Run `npm run check:orders` after sale-history pagination or receipt-snapshot
  read changes.
- Run `npx convex dev --once` when schema or deployed functions change.
- Review every new index against an implemented access path.

## Child DOX Index

No child DOX files.
