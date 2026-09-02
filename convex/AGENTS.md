# Convex Backend DOX

## Purpose

Owns the synchronized cloud schema and Convex functions for Olaso operational
data, reporting summaries, and development seeding.

## Ownership

- `schema.ts` owns table shapes and indexes, including additive product-owned
  sizes, choice sections, values, typed ingredient effects, and per-size
  quantity overrides. Live shared modifier groups are not used.
- `_generated/` is produced by the Convex CLI and committed.
- Business functions live in domain files such as `categories.ts`,
  `products.ts`, `recipes.ts`, `productConfiguration.ts`, `ingredients.ts`,
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
- `expenses.ts` owns retry-safe exact-date expense creation/correction;
  `staff.ts` owns owner-only bounded compensation reads, period creation, and
  forward-only stops.
- `identity.ts` and `identityInternal.ts` own PIN verification, device sessions,
  and retry-safe owner-authorized staff credential provisioning. Public staff
  creation receives only a derived credential and returns the new device
  session; no raw PIN is queued for later synchronization. Signed-in staff may
  update their own `preferredLanguage` through `setPreferredLanguage`.
  Offline staff provisioning also carries the profile's saved language so the
  first cloud acknowledgement cannot reset it to English.
- `lib/` holds only helpers genuinely shared by multiple domain operations.

## Local Contracts

- Public functions validate every argument and authorization boundary.
- Public management functions require an authenticated `owner` or `manager`
  session; no deployment bypass is permitted.
- Public POS functions require an authenticated operational session; no
  deployment bypass is permitted.
- A new session revokes prior same-device tokens and removes already-revoked
  session rows; session reads remain bounded by the staff-profile index.
- Use indexed, bounded reads; sales, sale items, stock movements, and reports
  are never read with an unbounded `.collect()`.
- Dashboard snapshots read at most 12 daily summaries, 100 ingredients, four
  warnings, and four recent sales.
- Report snapshots read at most 32 indexed daily summaries per current/prior
  range, accept no more than 31 days, and cap each detail aggregate at 20.
  Used-ingredient on-hand is the live active stock for that name and unit.
- Store money as integer centimes and stock in integer ingredient base units.
- Product photos are optional compressed JPEG data URLs (`imageJpeg`), never
  bundled-key replacements and never uncompressed camera files.
- Keep sales, corrections, stock movements, purchases, immutable recipes, and
  compensation append-only or historical. Live categories, products,
  ingredients, and owner-managed staff may be permanently deleted only after
  their independent historical names/facts and earlier queued effects are
  preserved; category removal leaves products uncategorized.
- One synchronized sale is one retry-safe mutation keyed by
  `deviceId + localSaleId`.
- The sale mutation re-reads current products, revisions, recipes, modifiers,
  product-owned sizes and choices, and ingredients and computes trusted totals
  and deductions before writing any effect. Size/choice resolution must match
  `src/lib/productConfiguration.ts`. An optional complimentary flag charges 0
  while still deducting recipe stock; daily metrics use the charged total.
  Optional tenders on the receipt snapshot store Cash/Card method and due plus
  cash amount given/change; their dues must sum to the charged sale total.
- Seed/reset work is internal, development-only, deterministic, refuses to run
  without the disposable-deployment acknowledgement, and never replaces staff
  profile IDs that own credentials.
 - Reports All never loops pagination inside one query: `getAllSummaryPage`
   calls `.paginate()` exactly once with the official `paginationOpts`
   validator, and the Reports data layer collects pages client-side with the
   returned cursors until `isDone` (the documented manual collection pattern).
   The live-ingredient stock overlay is a separate bounded
   `getAllSummaryStock` query.
- Do not add actions for ordinary database work or import backend clients into
  React components.

## Verification

- `npm run check:convex` only runs codegen and typecheck; it never publishes
  functions. Every Convex schema, validator, or function change must be
  followed by `npx convex dev --once` before any tablet can synchronize.
  A tablet sale whose snapshot field the deployed validator does not accept
  fails with `Cloud rejected this saved order.` and stays failed until Manual
  Sync — this exact deployment gap broke sale sync three times
  (receipt number, size/choice fields, then tenders).
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
- Run `npm run check:staff` and `npm run check:permissions` after staff
  identity, credential provisioning, session, or authorization changes.
- Run `npx convex dev --once` when schema or deployed functions change.
- Review every new index against an implemented access path.

## Child DOX Index

No child DOX files.
