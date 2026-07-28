# Goal 01 Archive — Functional POS Interactions

This is the completed execution record for Goal 01.

Project rules and product decisions remain in `AGENTS.md`, `PRODUCT.md`,
`ARCHITECTURE.md`, `DESIGN.md`, and `BRAND.md`. This file records only execution
state.

## Ledger Rules

- Keep one active goal at a time.
- Use only `pending`, `in progress`, `done`, or `blocked` for task status.
- Keep at most one task `in progress`.
- Update the checkpoint and journal after every meaningful completed task.
- Journal entries state what changed, which files changed, and what verification
  passed.
- Do not mark a task done without its required verification.
- Do not rewrite old journal entries except to correct a factual error; record
  the correction in a new entry.
- When a goal finishes, reduce its detailed state to a short entry under
  Completed Goals before defining the next goal.

## Active Goal

### Goal 01 — Functional POS interactions

**Status:** complete  
**Objective:** Make the approved POS screen fully interactive without changing
its visual design.

**Goal command objective:** Complete Goal 01 exactly as defined in
`WORK_LEDGER.md`, processing one POS task at a time, journaling every completed
task, preserving the approved Pencil design, and stopping before permanent sale
persistence, stock deduction, cloud sync, printing, or Android packaging.

### Included

- Search products.
- Filter products by category.
- Add products to the current order.
- Increase, decrease, and remove order lines.
- Edit service mode, customer name, and table.
- Calculate prices and totals in integer centimes.
- Preserve the active cart while navigating between existing screens.
- Validate the cart and expose clear checkout-boundary feedback.
- Add focused runnable checks for cart and money calculations.
- Verify the POS visually at 1340 × 800.

### Excluded

- Permanent sale persistence with SQLite.
- Convex synchronization.
- Recipe-based stock deduction.
- Authentication and permissions.
- ESC/POS or Android printer integration.
- Android packaging.
- Redesigning the approved POS composition.

The checkout action must not pretend an unsaved order is a permanent completed
sale. Real sale completion belongs to the local-persistence goal.

## Task Board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| POS-01 | Record the current interaction baseline and exact component/state ownership | done | `App` owns the navigation-surviving POS session; `PosScreen` coordinates interactions; leaf components stay prop-driven. Affected-file map recorded below. |
| POS-02 | Normalize temporary categories/products and add pure cart and money operations | done | Stable category/product IDs, category associations, integer-centime MAD prices, pure cart/totals operations, and `npm run check:pos` passing |
| POS-03 | Implement controlled search, category selection, filtering, and an empty result state | done | Controlled local search/category state; runnable filter checks; browser QA kept the screen at 1340 × 800 and grid at 966 × 502 |
| POS-04 | Implement add-to-cart, dynamic order lines, quantity changes, removal, and receipt scrolling | done | Repeated adds merge; dynamic lines increment/decrement/remove; integer-centime totals stay synchronized; multi-line rail scroll verified |
| POS-05 | Make service mode, customer name, and table controls editable and controlled | done | Controlled native inputs and single service selection retained values through cart edits in browser QA |
| POS-06 | Connect subtotal, explicit tax policy, total, validation, disabled states, and honest checkout-boundary feedback | done | Pure validation/totals checks plus empty, invalid, processing, success browser QA; cart retained and no save claimed |
| POS-07 | Preserve the complete POS session across top-level screen navigation | done | Full session survived browser round trips through Dashboard, Orders, Products, Stock, and Reports |
| POS-08 | Finish required empty, pressed, focus, disabled, loading, success, and error presentation without redesigning the screen | done | All visible controls named and at least 44 × 44; focus/pressed/disabled/loading/success/error/empty states audited at 1340 × 800 |
| POS-09 | Run final regression, 1340 × 800 visual comparison, build, Graphify refresh, and documentation closeout | done | `npm run check:pos` and `npm run build` passed; live geometry matched Pencil `W26Y6`; all six screens and console were clean; Graphify rebuilt to 532 nodes/680 edges |

## Task Contracts

### POS-01 — Baseline and ownership

- Trace `App`, `PosScreen`, menu components, receipt components, and fixture
  data.
- Decide the smallest persistent React owner for the POS session.
- Record the affected files before editing.
- Do not create abstractions or change the visual design in this task.

### POS-02 — Data and pure operations

- Give categories and products stable IDs.
- Store product prices as integer MAD centimes; format money only for display.
- Associate each temporary product with a category.
- Define the smallest cart-line and POS-session shapes.
- Add pure operations for add, increment, decrement/remove, subtotal, tax, and
  total.
- Add the smallest runnable checks covering money and cart edge cases.

### POS-03 — Menu discovery

- Make the search input controlled.
- Make category cards interactive and expose the selected category.
- Filter locally by selected category and case-insensitive product name.
- Show a useful empty result without changing the menu column geometry.
- Search and filtering must not modify the cart or make network calls.

### POS-04 — Cart and receipt

- Add one unit when a product add control is pressed.
- Merge repeated products into one line.
- Render receipt lines from cart data rather than the hardcoded Americano.
- Connect quantity increment, decrement, and an explicit accessible removal
  action.
- Keep totals synchronized and let multiple lines scroll inside the existing
  receipt region.

### POS-05 — Order details

- Make service type a controlled single selection.
- Replace read-only customer and table fixtures with controlled native inputs.
- Preserve persistent labels and the approved geometry.
- Keep these values within the POS session.

### POS-06 — Totals and checkout boundary

- Render subtotal, tax, total, and action amount from the cart.
- Keep tax behavior explicit and isolated because the owner has not confirmed
  the final tax rule; do not silently preserve the current decorative 10%.
- Disable checkout for an empty or invalid cart and while processing.
- Validate required order details.
- Provide truthful feedback that the order is ready for the future local-save
  operation; do not clear the cart or claim a permanent sale was recorded.

### POS-07 — Navigation survival

- Keep the complete POS session alive when `PosScreen` unmounts during
  top-level navigation.
- Use React and the smallest existing ownership boundary; do not add a state
  library or browser-storage substitute for SQLite.
- Verify a round trip through every top-level destination is non-destructive.

### POS-08 — Interaction and accessibility states

- Verify visible focus, 44-pixel targets, accessible names, disabled behavior,
  and status text.
- Cover empty results, empty cart, pressed controls, checkout-ready feedback,
  and recoverable error feedback.
- Use Phosphor icons and existing Olaso tokens only.

### POS-09 — Goal closeout

- Run all runnable calculation checks and `npm run build`.
- Inspect POS at 1340 × 800 against Pencil node `W26Y6`.
- Check all top-level screens if shared navigation or App ownership changed.
- Confirm no clipping, overflow, console error, or console warning.
- Refresh Graphify after structural changes.
- Re-read the DOX chain, update this ledger, and record any durable contract
  changes in the owning documentation.

## Goal Completion Criteria

- Every task is `done` with its completion evidence recorded.
- Every visible control on the POS screen has honest behavior.
- The active cart and order details survive navigation.
- Cart and money operations pass their runnable checks.
- The visual composition still matches Pencil node `W26Y6` at 1340 × 800.
- No temporary persistence, fake completed sale, cloud call, stock deduction,
  printer integration, or Android packaging was introduced.
- `npm run build` succeeds and the browser console is clean.

## Current Checkpoint

- Goal 01 and POS-01 through POS-09 are complete.
- `npm run check:pos` and `npm run build` pass.
- The live POS matches Pencil node `W26Y6` geometry at 1340 × 800; all six
  top-level screens fit without clipping or overflow, and the console is clean.
- Graphify was refreshed after the structural changes and now contains 532
  nodes and 680 edges.
- The checkout boundary remains local and truthful: no sale persistence, cloud
  call, stock deduction, printing, or Android behavior was added.

**Exact next action:** None — Goal 01 is complete. Permanent local sale saving
remains excluded and belongs to a future persistence goal.

## Decisions and Blockers

### Decisions

- Goal 01 stops at the checkout boundary instead of introducing temporary
  persistence that conflicts with the planned SQLite architecture.
- Existing POS geometry and styling remain unchanged unless a functional state
  requires a documented visual state.
- New behavior reuses existing components and dependencies.
- `App` owns the complete transient POS session because every top-level screen
  replaces `PosScreen`; `PosScreen` coordinates interactions and leaf
  components remain controlled through props.
- Until the owner confirms tax treatment, cart calculations use an explicit 0%
  temporary rate; `PRODUCT.md` records that this is not a production tax rule.

### Blockers

None.

## Journal

### 2026-07-28 — POS-09 goal closeout complete

- Ran the focused cart/money checks and production build successfully.
- Compared the live POS to Pencil node `W26Y6` at 1340 × 800; the application,
  header, menu column, search, categories, product grid, receipt rail, and
  single order-card geometry matched the approved coordinates.
- Regressed Dashboard, POS, Orders, Products, Stock, and Reports at the target
  viewport; confirmed no clipping, overflow, console warning, or console error.
- Refreshed Graphify after the structural changes and queried the resulting POS
  session/cart/checkout/navigation path.
- Re-read the complete applicable DOX chain and confirmed the documentation,
  tax policy, accessibility contract, task board, and implementation agree.
- Files changed during Goal 01: `PRODUCT.md`, `DESIGN.md`, `package.json`,
  `scripts/check-pos.mjs`, `src/App.tsx`, POS fixtures/session/screen modules,
  and affected POS components and CSS Modules.
- Verification: `npm run check:pos` passed; `npm run build` passed; browser QA
  and Pencil comparison passed; Graphify rebuilt to 532 nodes/680 edges.

### 2026-07-28 — POS-08 interaction and accessibility states complete

- Added visible focus and pressed presentation to POS inputs, categories,
  product/cart actions, service segments, header actions, and checkout.
- Added meaningful product image alternatives and a stable general product
  region label.
- Made native inputs full-height targets and widened the quantity stepper to
  116 × 44 so both quantity buttons are independent 44 × 44 controls.
- Updated `DESIGN.md` to keep the quantity-stepper contract current.
- Files changed: `DESIGN.md`, `ProductCard.tsx`, `ProductGrid.tsx`, and affected
  POS component CSS Modules.
- Verification: `npm run check:pos` passed; `npm run build` passed; browser
  audit at 1340 × 800 found no unnamed or sub-44-pixel controls, confirmed a
  visible keyboard outline, all required interaction/status states, 296 × 20
  unclipped success text, no page overflow, and no console warnings/errors.

### 2026-07-28 — POS-07 navigation survival complete

- Lifted the complete transient POS session to `App` and kept `PosScreen`
  controlled through plain session/setter props.
- Made POS the documented default destination and kept top-level navigation as
  the existing screen selector.
- Verified query, selected category, cart line and total, service mode,
  customer, and table after round trips through every other destination.
- No state library, browser storage, persistence, or external call was added.
- Files changed: `src/App.tsx` and `src/features/pos/PosScreen.tsx`.
- Verification: `npm run check:pos` passed; `npm run build` passed; browser QA
  at 1340 × 800 preserved `LATTE`, Tea, Latte/18.00 MAD, Take Away, Amina, and
  T4 through Dashboard, Orders, Products, Stock, and Reports; console clean.

### 2026-07-28 — POS-06 totals and checkout boundary complete

- Added pure POS validation for empty carts, invalid cart lines, and the
  provisional dine-in table rule; documented customer/table policy in
  `PRODUCT.md`.
- Connected subtotal, explicit temporary 0% tax, total, and action amount to
  integer-centime cart calculations.
- Disabled checkout for empty, invalid, and processing states and added concise
  neutral, error, processing, and success status text.
- Changed the action to `Check Order`; it only validates and reports readiness
  for the future local-save boundary, never clears the cart or claims a sale.
- Files changed: `PRODUCT.md`, `PosScreen.tsx`, `posSession.ts`, the runnable
  check, `ReceiptRail`, `PrimaryAction`, and affected CSS Modules.
- Verification: `npm run check:pos` passed; `npm run build` passed; fresh-page
  browser QA at 1340 × 800 verified empty-disabled, validation-error,
  ready-enabled, busy-disabled, and not-recorded success states with the cart
  retained and no console warnings/errors.

### 2026-07-28 — POS-05 order details complete

- Made service mode a controlled single-selection button group.
- Replaced the read-only customer/table fixtures with controlled native text
  inputs and persistent visible labels.
- Kept all three values in the existing POS session so cart edits cannot reset
  them.
- Files changed: `PosScreen.tsx`, `ReceiptRail`, `SegmentedControl`, and
  `LabeledField` plus its CSS Module.
- Verification: `npm run check:pos` passed; `npm run build` passed; browser QA
  confirmed `Take Away`, `Amina`, and `T4` remained after adding a cart item.

### 2026-07-28 — POS-04 cart and receipt complete

- Connected product add controls to the cart, merging repeated products into a
  single line.
- Replaced the hardcoded Americano receipt with dynamic product lines,
  synchronized unit/line/payment totals, controlled quantity changes, disabled
  decrement at one, and an explicit Phosphor removal action.
- Added a scrollable multi-line order viewport inside the fixed receipt rail.
- Extended the runnable check for decrement-at-minimum and explicit removal.
- Files changed: `PosScreen.tsx`, `posSession.ts`, the runnable check,
  `ProductCard`, `ProductGrid`, `ReceiptRail`, `OrderItemCard`,
  `QuantityStepper`, `PaymentSummary`, and affected CSS Modules.
- Verification: `npm run check:pos` passed; `npm run build` passed; browser QA
  at 1340 × 800 verified merge, four dynamic lines, increment, decrement,
  removal, synchronized 57.00 MAD total, and a scrollable 240/364-pixel order
  viewport inside the unchanged 320 × 688 receipt rail.

### 2026-07-28 — POS-03 menu discovery complete

- Made search and category selection controlled session values and added the
  pure local product filter.
- Made category cards semantic pressed buttons and added the in-grid empty
  result state without changing the menu column dimensions.
- Extended `npm run check:pos` with case-insensitive search, category, and empty
  result checks.
- Files changed: `PosScreen.tsx`, `posSession.ts`, the runnable check,
  `SearchField`, `CategoryRow`, `CategoryCard`, `ProductGrid`, and their affected
  CSS Modules.
- Verification: `npm run check:pos` passed; `npm run build` passed; browser QA
  at 1340 × 800 confirmed a 1340 × 800 screen, 966 × 502 grid, working search,
  selected category, empty state, and no console warnings/errors.

### 2026-07-28 — POS-02 data and pure operations complete

- Added stable category/product IDs, product category associations, and
  integer-centime MAD fixture prices.
- Added the minimal POS session/cart shapes and pure add, increment,
  decrement/remove, subtotal, tax, total, and money-format operations.
- Added `scripts/check-pos.mjs` and the `npm run check:pos` script using Node's
  built-in assertion module; no dependency was added.
- Replaced the decorative 10% assumption with an explicit temporary 0% policy
  and documented it in `PRODUCT.md`.
- Files changed: `package.json`, `PRODUCT.md`, POS fixture data,
  `posSession.ts`, the runnable check, and product/category rendering keys.
- Verification: `npm run check:pos` passed; `npm run build` passed.

### 2026-07-28 — POS-01 baseline and ownership complete

- Traced `App`, `PosScreen`, every menu and receipt component, and both fixture
  data modules, including all direct component callers.
- Confirmed the current baseline is static: menu discovery, cart, order details,
  totals, and checkout controls have no stateful behavior.
- Chose `App` as the smallest navigation-surviving POS-session owner and
  `PosScreen` as the interaction coordinator; no ownership question remains.
- Recorded the affected-file map in the current checkpoint.
- Files changed: `WORK_LEDGER.md`.
- Verification: Graphify POS query plus complete source/caller trace.

### 2026-07-28 — Goal 01 started

- Marked Goal 01 active and POS-01 in progress.
- Read the complete applicable DOX chain, work ledger, and project authority
  documents.
- Queried the existing Graphify graph for the POS interaction surface before
  manual source inspection.
- Application source code was not changed.

### 2026-07-28 — Goal 01 tasks established

- Audited the current static POS component flow.
- Replaced the broad draft cards with nine ordered, verifiable tasks and
  explicit task contracts.
- Added the exact goal objective and completion criteria.
- Confirmed the goal stops before permanent persistence and hardware work.
- Application source code was not changed.

### 2026-07-28 — Ledger initialized

- Added the durable goal, scope, board, checkpoint, decisions, and restart
  protocol.
- Updated root DOX instructions to require ledger reading and maintenance.
- Application source code was not changed.

## Completed Goals

- Goal 01 — Functional POS interactions (2026-07-28): POS-01 through POS-09
  completed with focused cart/money checks, a passing production build, exact
  1340 × 800 Pencil geometry verification, clean six-screen browser regression,
  a clean console, refreshed Graphify, and current documentation.
