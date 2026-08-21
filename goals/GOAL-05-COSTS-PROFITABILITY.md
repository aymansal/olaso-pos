# Goal 05 Plan — Costs and Profitability

This is the approved execution plan for the costs and profitability system.
Project rules and durable product decisions remain in `AGENTS.md`, `PRODUCT.md`,
`ARCHITECTURE.md`, `DESIGN.md`, and `BRAND.md`. This file owns only Goal 05
execution scope and card order.

## Status

**Goal:** Goal 05 — Costs and Profitability

**Status:** planned; not active

**Objective:** Turn stock purchasing, recipe consumption, staff compensation,
and operating expenses into exact product-cost, inventory-value, and monthly
profitability information without weakening offline checkout or exposing
sensitive compensation data.

**Start prompt:** [`GOAL-05-START-PROMPT.md`](GOAL-05-START-PROMPT.md)

## Confirmed Decisions

- Purchased ingredients are received using package count, base-unit quantity
  per package, and integer-centime package price.
- Ingredient valuation uses perpetual weighted average with deterministic
  integer arithmetic.
- Purchase cash, closing inventory value, and ingredient cost consumed remain
  separate report measures.
- Recipe/product cost includes direct ingredients and consumables only.
- Rent, compensation, utilities, and other overhead are not allocated to
  individual products in the first release.
- Missing ingredient costs propagate an explicit incomplete state; they never
  become zero.
- Historical sales keep immutable ingredient-cost snapshots.
- Staff profiles may have optional effective-dated monthly compensation; owner
  or unpaid profiles leave compensation blank.
- Individual compensation is owner-only and excluded from operational caches.
- Other expenses are one-time or monthly recurring.
- Costs and profitability are monthly first and live inside Reports, not a new
  permanent navigation destination.
- This is an operational management report, not payroll, tax filing, statutory
  accounting, or an accounting-system integration.

## Included

- Exact cost calculation primitives and focused runnable checks.
- Convex schema/functions, indexes, deterministic seed data, and migrations.
- Local SQLite/cache fields required to cost offline sales.
- Retry-safe purchased-stock receipt and append-only valuation history.
- Weighted-average inventory value and stock-adjustment cost effects.
- Current recipe/product ingredient cost, gross profit, margin, and completeness.
- Immutable local/cloud sale and line cost snapshots with correction reversal.
- Staff profiles and effective compensation schedules.
- One-time and monthly recurring operating expenses.
- Monthly cost/profit summaries and bounded detail pages.
- Owner-only compensation boundary, quota review, full regression, and physical
  tablet QA.

## Excluded

- FIFO or lot-selection costing.
- Suppliers, invoices, accounts payable, or multi-line purchase orders.
- Payroll calculation, attendance, bonuses, social contributions, or tax filing.
- Statutory accounting statements or external accounting integrations.
- Arbitrary overhead allocation to products.
- Forecasting, budgets, AI recommendations, or theoretical waste.
- A seventh top-level navigation item, POS redesign, or new state library.
- Printer transport or receipt-template changes.
- A claim of production authentication before the separate identity/session
  decision is implemented. Production cost functions still fail closed without
  the required role; any development override remains development-only.

## Git Workflow

- Goal branch: `codex/goal-05-costs-profitability`.
- Keep one card in progress and unrelated work out of its commit.
- Every card commit begins with its card ID.
- Push after every successful card commit and record its full SHA and remote
  branch before marking the card done.
- Never commit `.env.local`, credentials, salary exports, production data,
  signing material, or printer secrets.

## Task Board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| COST-01 | Add exact cost primitives, schema/migration plan, indexes, and deterministic cost fixtures | pending | — |
| COST-02 | Add retry-safe ingredient purchases and weighted-average inventory valuation | pending | — |
| COST-03 | Connect package-based receiving, valuation, and purchase history to Stock | pending | — |
| COST-04 | Show complete/incomplete recipe and product costs, gross profit, and margin | pending | — |
| COST-05 | Save and synchronize immutable offline sale-cost snapshots and correction reversals | pending | — |
| COST-06 | Add staff profiles and owner-only effective compensation periods | pending | — |
| COST-07 | Add validated one-time and recurring operating expenses | pending | — |
| COST-08 | Add the bounded monthly Costs and Profitability report | pending | — |
| COST-09 | Run full regression, security/quota review, tablet QA, documentation closeout, and final push | pending | — |

## Card Contracts

### COST-01 — Cost foundation

- Add the smallest pure helpers for weighted-average valuation, deterministic
  allocation, margin, recurrence, and incomplete-cost propagation.
- Store money as integer centimes and quantities as integer base units.
- Add only schema fields/tables and indexes used by this goal.
- Add ordered SQLite migrations; never rewrite a released migration.
- Extend deterministic development data with complete and incomplete cost cases.
- Add focused checks before connecting UI.

### COST-02 — Purchases and valuation

- Receive package count, base quantity per package, package price, date, and
  optional note/supplier label in one retry-safe mutation.
- Append the purchase, stock movement, quantity, and valuation effects
  atomically.
- Preserve weighted-average carrying value with deterministic rounding.
- Correct purchases through explicit reversing/replacement history.
- Apply valued physical-count losses and flag unvalued count increases.

### COST-03 — Stock cost workflow

- Extend the existing Stock receive interaction rather than creating a second
  inventory screen.
- Show package math, total quantity, total purchase cost, average cost,
  inventory value, and append-only purchase/valuation history.
- Keep ordinary quantity corrections visibly distinct from purchases.
- Preserve the approved 1340 × 800 geometry and existing component boundaries.

### COST-04 — Recipe and product cost

- Calculate current direct cost from active recipe and modifier ingredient
  effects.
- Show selling price, ingredient cost, gross profit, and gross-margin percentage.
- Identify exactly which ingredients make a cost incomplete.
- Do not include compensation, rent, utilities, or arbitrary overhead.

### COST-05 — Historical sale cost

- Cache the trusted valuation revision needed for offline checkout.
- Save sale and line ingredient-cost/completeness snapshots in the same local
  transaction as price, recipe, stock, and outbox effects.
- Synchronize idempotently and validate/recalculate at the cloud boundary.
- Cancellation/refund reverses the original saved cost effect; current prices
  never rewrite historical profit.
- Offline checkout continues when cost is incomplete and records that fact.

### COST-06 — Staff compensation

- Add plain staff profiles independently from authentication identities.
- Add optional monthly compensation periods with effective start/end history.
- Do not duplicate compensation as a manually entered expense.
- Require owner authorization for individual compensation reads and writes.
- Keep compensation out of cashier snapshots, general staff reads, and logs.

### COST-07 — Operating expenses

- Add owner-managed categories plus one-time and monthly recurring expenses.
- Use effective periods, revision checks, retry IDs, and archive/correction
  history rather than rewriting reported months.
- Keep tax filing, payroll, invoice management, and forecasting out of scope.

### COST-08 — Monthly Costs report

- Add Costs within the existing Reports workspace.
- Return one bounded monthly summary plus paginated purchase/expense detail.
- Show revenue, ingredient cost consumed, gross profit, compensation, other
  expenses, operating profit, purchase cash spent, and closing inventory value.
- Never subtract purchases again after ingredient cost consumed.
- Show data coverage and withhold a complete-profit claim when costs are missing.

### COST-09 — Closeout

- Run all domain, persistence, sync, management, reports, Android, TypeScript,
  and production-build checks.
- Verify indexed/bounded queries, retry safety, integer arithmetic, compensation
  authorization, secret absence, and Convex call/I/O shape.
- Inspect every affected screen at 1340 × 800 and on the physical Galaxy Tab A9
  with no clipping, overflow, console errors, or console warnings.
- Refresh Graphify after structural changes and update all owning documentation.
- Record every pushed SHA and finish with a clean synchronized worktree.

## Goal Completion Criteria

- COST-01 through COST-09 are done, verified, committed, and pushed.
- The ten-carton milk example produces 10,000 ml, 200 MAD purchase spend, and
  the checked weighted-average valuation without floating-point money.
- Product costs and margins agree with checked recipe samples and expose
  missing-cost ingredients honestly.
- Offline sales keep immutable cost snapshots and retries/corrections do not
  duplicate or rewrite cost effects.
- Monthly reports reconcile revenue, ingredient cost, compensation, other
  expenses, operating profit, purchases, and closing inventory without double
  counting.
- Salary data is absent from unauthorized queries, operational caches, logs,
  and exports not explicitly requested by the owner.
- Required checks, build, Graphify, browser QA, and physical-tablet QA pass.

## Current Checkpoint

- Goal 01 and Goal 02 are complete and archived.
- The physical Galaxy Tab A9 viewport fix is verified and present on `main`.
- Current inventory tracks exact quantities and append-only movements but no
  purchase price, carrying value, or ingredient cost.
- Current profiles are presentation data and not staff/authentication records.
- `PRODUCT.md` and `ARCHITECTURE.md` define the approved cost model.
- Goal 05 is planned only and follows the runtime and printer goals. No card is
  in progress and no goal branch exists.
- Exact next action after explicit `/goal` activation: re-read the DOX chain and
  ledger, query Graphify, create/push `codex/goal-05-costs-profitability`, mark
  COST-01 in progress, and implement only COST-01.

## Planning Journal

### 2026-08-21 — Goal 05 rescheduled

- Renumbered the inactive cost plan from Goal 03 to Goal 05 so physical-tablet
  startup quality and the production-critical receipt path are handled first.
- Scope, cost model, card order, and exclusions remain unchanged.

### 2026-08-21 — Goal 05 drafted

- Confirmed the existing schema contains ingredient quantities and stock
  movements but no purchase-cost or valuation fields.
- Confirmed the visible cashier profile is not a persistent staff record.
- Recorded weighted-average direct costing, immutable sale snapshots, optional
  effective compensation, recurring expenses, monthly profitability, explicit
  incomplete-cost states, and purchase/COGS separation.
- Kept costs inside Reports and excluded accounting, payroll, tax, supplier,
  forecasting, overhead-allocation, printer, and redesign scope.
- No application source code changed and Goal 05 remains inactive.
