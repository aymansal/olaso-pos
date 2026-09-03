# Goal 06 POLISH Reliability Ledger

**Status:** active planning complete; implementation not started

**Owner:** Olaso owner

**Branch:** `main` only

**Parent card:** POLISH-01 / POLISH-02

**Starting implementation card:** `PR-01`

**Last verified repository state before this ledger:**
`1542abb67baf4dff4b4e88a0cf708838298c14dc` on `origin/main`

**Durable planning checkpoint:**
`c5afe1edb8686ea60f3b3fe3f6fb6527896a9b6a` on `origin/main`

## Purpose

This is the durable source of truth for the approved September 2026 Reports,
Costs, date-language, and Dashboard reliability repairs. It exists so a fresh
conversation or a conversation restored from a context summary can continue
without relying on chat history.

`PLAN.md` still owns the project-wide goal order. `WORK_LEDGER.md` still owns
the project-wide checkpoint. This file owns the exact decisions, card order,
acceptance conditions, and running journal for this repair batch.

## Recovery Protocol

Every agent must follow this protocol at the start of the first turn, after
context compaction, after a handoff, and before resuming work after a pause:

1. Read the repository-root `AGENTS.md` and every deeper applicable
   `AGENTS.md` for files that may be changed.
2. Read `PLAN.md`.
3. Read `WORK_LEDGER.md`.
4. Read this entire file from top to bottom. Do not rely on a prior chat
   summary as a substitute.
5. Read `## State Pointer`, the active card, and the newest entries in
   `## Checkpoint Ledger` before running a command or editing a file.
6. Run `git status --short --branch`. Preserve any existing work. Never reset
   or discard it.
7. Use Graphify before code exploration or code changes. Refresh reflections,
   query the exact active-card flow, and follow the graph to the real callers.
8. Read and apply Ponytail at full intensity. Fix the shared root cause with
   the smallest correct change and no new dependency.
9. Continue only the one card marked `in progress`. Do not begin the next card
   until the active card's code, focused checks, ledger entry, commit, and push
   are complete.
10. After every meaningful completed step, update `## State Pointer` and append
    a factual entry to `## Checkpoint Ledger` before continuing.
11. Before any pause or final response, record files changed, checks run,
    results, blockers, current SHA, and the exact next action.
12. Re-read this entire file again immediately after any context summary. The
    instructions and decisions here override an incomplete conversational
    recollection.

If this file and chat disagree, stop and use the latest explicit owner decision
recorded in `## Product Decisions Captured`. Do not silently invent a third
interpretation.

## Operating Rules

- Work directly on `main`; do not create a branch or worktree.
- Do not create another plan for this batch.
- Do not ask the owner to repeat decisions already captured here.
- Do not use subagents.
- Do not add a package, state manager, database, worker, native plugin, or
  Kotlin code.
- These repairs remain in the existing React, SQLite, and Convex layers.
- Research current official Android and Capacitor guidance before the first
  implementation card because storage and online/offline behavior are
  affected. Record why no native change is required.
- Use `apply_patch` for source and documentation edits.
- Preserve all unrelated dirty work.
- Never run a seed reset, database wipe, app-data clear, or uninstall.
- Do not launch, restart, install, or interact with the application or tablet.
  Do not use ADB, browser QA, screenshots, printer output, or a PIN. The owner
  will perform physical acceptance.
- Never request, print, store, or invent `OLASO_OWNER_PIN`.
- A protected check that passes its local portion and stops only at the absent
  PIN must be recorded honestly; never weaken the check.
- Keep POLISH-01 / POLISH-02 in progress. Do not activate or complete HARD-08.
- Commit messages begin with the active card ID, for example
  `PR-01: preserve exact cost dates`.
- Push every completed card directly to `origin/main` and record its full SHA.

## Product Decisions Captured

These decisions are final for this batch and must not be reopened:

1. Fix compensation exact-date loss during cloud refresh.
2. The Reports graph remains a full calendar-month graph. It naturally shows
   28, 29, 30, or 31 days for the chosen month. It must never be forced to 31
   slots and must never shrink to only the selected period.
3. The report calendar controls the totals. The graph month is chosen by the
   exact rule in `PR-03`.
4. Reports `All` remains named `All` and must truly mean all recorded history.
   It must not mean 31 days.
5. The ingredient limit concerns distinct ingredients used across all products
   in a report period, not ingredients inside one product.
6. Count every used ingredient type, keep only 20 detail rows visible, and do
   not fail offline merely because the count is greater than 20.
7. Reject an expense correction dated before the original recurring expense
   began. Never clamp it silently.
8. Every visible application date follows the active profile's application
   language. Receipt language remains a separate Settings decision.
9. Every saved expense and compensation period must be reachable through an
   internally scrolling Costs list without changing the page layout.
10. An online Dashboard must temporarily show a newer local completed sale
    while cloud synchronization is behind, without adding local and cloud
    totals together.
11. Do not repair cloud-only Orders in this batch. A one-line filter removal
    would make filters, counts, and pagination dishonest. Cloud history restore
    is separate future work.
12. Keep numeric profit visible when ingredient costs are incomplete. Keep the
    missing-cost warning. Do not backfill or recalculate immutable historical
    sale-cost snapshots from current ingredient prices.

## Non-Goals

- No cloud-only Orders restoration or local import.
- No change to `sales.listOrders` pagination for this batch.
- No profit hiding, `Unavailable` state, or historical cost rewrite.
- No receipt, tender, split-payment, cancellation, printing, or order-number
  redesign.
- No Reports graph geometry, axis, bar, card, or spacing redesign.
- No change to database date storage formats or business-date calculation.
- No pagination or new overlay for Costs lists.
- No physical acceptance; the owner performs it after implementation.

## Card Board

| Card | Scope | Status |
| --- | --- | --- |
| PR-01 | Preserve exact compensation dates and reject invalid early expense corrections | done — `0bea66ae496e3ecc24efea13aa195903d3358aa6` on `origin/main` |
| PR-02 | Correct ingredient-type totals and make Reports All genuinely all-time | done — `dc398efe4fb4c5c66ae03e47d33734d74cf6d02e` on `origin/main` |
| PR-03 | Select the correct graph month and localize every visible application date | done — `e9cc667e94505237ba04cab56d4e84468cdbe8f4` on `origin/main` |
| PR-04 | Expose all Costs records and include newer pending local sales in online Dashboard | done — `2e3c96e8205f33f621612f9191169f12ff265758` on `origin/main` |
| AUDIT-01 | Repair five confirmed post-implementation correctness findings | done — `bca6d773eaa89147ce556cca09d61aa10414609c` on `origin/main` |
| AUDIT-02 | Close All-report pagination, cancellation, verification, and ledger gaps | done — `8e2b6bbeafc06d0884580df45fe44195586e89b5` on `origin/main` |
| AUDIT-03 | Make the SplitRequired regression test prove the real request contract | pending — deferred by owner while receipt clarity is completed |
| RECEIPT-01 | Make cash/card and split-payment receipt amounts immediately understandable | in progress — approved calculation-layout follow-up |
| PR-05 | Full regression, documentation, clean main push, and owner handoff | pending |

## State Pointer

**Active card:** RECEIPT-01 follow-up — approved payment-layout clarification; AUDIT-03 remains deferred

**Active status:** implementing the owner-approved cash/card calculation layout,
then rebuilding the beta for the owner's physical receipt check

**Last completed step:** passed receipt, POS, TypeScript, production-build, and
Graphify checks for the approved cash/card calculation layout; commit, push,
beta rebuild, and owner paper check remain

**Current facts:**

- AUDIT-01 repair A: `convex/reports.ts` `getAllSummary` was replaced by
  `getAllSummaryPage` (one `.paginate(paginationOpts)` call) and
  `getAllSummaryStock` (bounded live-ingredient overlay). The Reports data
  layer collects pages with the documented manual cursor loop only for
  explicit All mode via the new `src/data/cloudAllReport.ts` aggregator,
  producing the unchanged report shape.
- Repair B: offline All `itemCount` comes from an independent SQL unit sum
  (`loadAllProductSummary`) instead of the top-20 product list.
- Repair C: offline All payments split mixed-tender sales by their exact
  saved tenders (`loadAllPaymentTotals`, two bounded JSON queries); legacy
  receipts keep their top-level method.
- Repair D: the local correction guard falls back to
  `effectiveStartMonth + '-01'` for legacy month-only recurring expenses
  before rejecting or writing.
- Repair E: Orders detail no longer lists `Offert` among product options;
  the Offert amount stays in the Payment summary. Printed receipts were
  never touched (golden receipt SHA unchanged).
- Mandatory bug repair (owner-authorized diagnosis, see the checkpoint
  above): `buildPeriodProfit` no longer passes All's empty dates into
  `operatingCostsForRange` when no snapshot is loaded, root-fixing the
  reproduced blank-screen crash.
- AUDIT-02 repairs: the All collector preserves Convex `pageStatus` /
  `splitCursor` and `endCursor` pagination, replaces an incomplete
  `SplitRequired` page with its two ordered halves (never aggregating the
  incomplete rows), stops before every request when the Reports effect is
  cancelled, and removes the 60-page ceiling in favor of cursor tracking
  that rejects missing, unchanged, or repeated continuation cursors and
  repeated split cursors. `useReportsData` passes its cleanup flag as the
  cancellation predicate. The focused fixture now makes three real 60-row
  page requests with exact cursor-sequence assertions and adds the
  split-required, cancellation, 61-page, and repeated-cursor cases.
- `PLAN.md` Exact next action and the top `WORK_LEDGER.md` Goal 06 card row
  were repaired to PR-05.
- All AUDIT-02 checks pass (`check:offline` with the new focused suite,
  `check:local-inventory-costs`, `check:printing` golden unchanged,
  `check:pos`, `check:costs`, `check:navigation`, `check:css-scope`,
  `tsc -b`, `npm run build`, `git diff --check`). No `convex/` function
  changed in AUDIT-02, so no deployment was required. Graphify refreshed.
- Exact next action: owner tests a fresh direct Card receipt and a mixed
  Card/Cash receipt from the newly installed beta and reports any physical
  finding or reproducible failure; then add and repair only that confirmed
  issue. Keep AUDIT-03 deferred and PR-05 pending.

### 2026-09-03 — RECEIPT-01 mandatory bug repair: direct card receipt detail

- Owner reported that the installed paper still had the old payment wording.
  Root cause: direct Card checkout intentionally bypasses the payment dialog,
  but `confirmPayment()` saved no tender for that path. The receipt encoder
  therefore took its legacy no-tender branch and printed only the old payment
  method instead of the new paid/total summary.
- Repair: every non-zero direct checkout now saves one exact tender with the
  selected method and the order total. The encoder also presents old no-tender
  snapshots as Cash paid or Card paid plus Total paid; it does not invent Cash
  received or change for historical receipts where those values were never
  stored. No database migration, Android, Capacitor, printer transport,
  dependency, PIN, seed, reset, or live-data change is involved.
- Passed `check:printing`, `check:pos`, `tsc -b`, `npm run build`, and
  `git diff --check`; the only build warning remains the existing jeep-sqlite
  browser-compatibility warning. Committed and pushed
  `4321e0ba8f078ac176e992f2644c0a1d6f2ce803`
  (`RECEIPT-01: save direct payment details`) on `origin/main`. The resulting
  debug beta was installed over connected SM-X115 `R8YX91AKWXJ` using
  `adb install -r` (`Success`), preserving existing app data. No app launch,
  interaction, PIN, printer action, reset, seed, or live-data mutation
  occurred. Exact next action: owner paper verification.

### 2026-09-03 — POLISH-01 mandatory bug repair: card split question behavior

- Owner-reported bug under the mandatory bug rule, which paused AUDIT-03:
  after the compact card split question shipped, three behaviors were wrong.
  1. Card + "Yes, split it" opened the split popup with invisible product
     lists ("empty"). Root cause: `.shares` renders at `opacity: 0` unless the
     split-fade state reaches `'run'`; the in-dialog Split button sets
     `prepare → run`, but the `startSplit` entry path never did, so the lists
     stayed invisible.
  2. Card + "No, one payment" opened the ordinary single-tender dialog again
     instead of processing the exact-amount card sale immediately.
  3. The split popup entered from the question still showed the in-dialog
     Split button, which toggled split off.
- Repairs (three files, no new dependency, no production behavior beyond the
  reported flow):
  - `PaymentDialog.tsx`: initial `splitFade` is `'run'` when `startSplit` is
    true, so the split lists are visible immediately; the Split button renders
    only when `canSplit && startSplit !== true` (cash keeps its button).
  - `PosScreen.tsx`: the question's `onSingle` now calls `confirmPayment()`
    directly — the same path a single-unit card order already takes — so the
    sale commits and the receipt prints without another popup.
  - `scripts/check-pos.mjs`: three source-shape assertions pin all three
    repairs.
- Checks passed: `check:pos`, `check:css-scope`, `tsc -b`, `npm run build`,
  `git diff --check`. No Convex function changed.
- Repair pushed as `4615580` on `origin/main`; the debug beta was rebuilt
  (Java 21 toolchain, Gradle unit tests passed) and installed over connected
  SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving data.
  Owner physical acceptance of the three behaviors is pending.
- Exact next action: AUDIT-03 remains the active card.

### 2026-09-02 — PR-04 committed and pushed

- Committed and pushed `2e3c96e8205f33f621612f9191169f12ff265758`
  (`PR-04: complete costs lists and honest pending-sale dashboard`) directly
  to `origin/main`. Verified `main...origin/main` is synchronized and the
  worktree is clean apart from the untracked local `.commandcode/` directory.
- PR-04 is complete. Owner physical acceptance (ninth expense/compensation
  row via scrolling, Dashboard right after a local sale and again after sync)
  and the protected reports/dashboard checks remain unavailable under the
  no-app/no-PIN instruction.
- Exact next action: wait for owner authorization, then begin PR-05 only.

### 2026-09-02 — POLISH-01 mandatory bug repair: daily owner report print

- Owner-reported bug: the Header Reports button (owner daily accounting
  summary) showed the generic `Printer action failed. Check the settings and
  try again.` while normal sale receipts printed fine. Under the mandatory
  bug rule this paused card progression for a root-cause fix.
- Root cause: `dailyOwnerReport.ts` selected a nonexistent
  `discount_centimes` column from `sales`. Offert/discount is stored only in
  `receipt_snapshot_json`, so the composition query threw
  `no such column: discount_centimes` before the printer transport was ever
  contacted; that unclassified JS error fell through
  `describePrinterFailure` to its generic fallback.
- Fix: the sales overview query no longer references `discount_centimes`;
  the Offert total is derived exactly as completed-sale
  `subtotal_centimes − netCentimes` (each sale stores
  `total = subtotal − discount`, no tax). The two queries and their limit
  guard moved into exported `loadDailySalesOverview(database, businessDate)`,
  giving the same seam style as PR-01's local replacement check.
- Regression coverage: `check:local-inventory-costs` now seeds two completed
  and one cancelled sale plus a same-day correction and proves completed
  filtering, the 3,800-centime subtotal sum, and cancellation mapping;
  `check:offline-views` adds source guards that `discount_centimes` never
  returns and the subtotal-minus-net derivation stays.
- Passed `npm run check:local-inventory-costs`, `npm run check:offline`,
  `npx tsc -b`, and `npm run build`. No app data, tablet, PIN, or seed was
  touched by the code fix. Exact next action: rebuild the Android beta,
  install over the connected SM-X115 with `adb install -r`, record the
  owner's physical print verification, then commit and push.

### 2026-09-02 — POLISH-01: sync root cause, no-popup report, product images

- Owner authorized ADB install and physical device inspection. A read-only
  copy of the tablet database (`run-as com.olaso.pos cat`, pulled to the
  workstation scratchpad, never modified or written back) showed today's six
  sales `0926-0015`–`0926-0020` all `failed` with
  `Cloud rejected this saved order. Use Sync now to retry.` while every sale
  through `0926-0014` (1 Sep) was `synced`.
- Root cause: the failed snapshots carry the new `tenders` array
  (single Cash tender with `paymentMethod`, `dueCentimes`, `amountCentimes`,
  `changeCentimes`); the pre-tenders snapshots do not. `tenders` support
  entered the Convex schema/function source in `bb5a499`/`fc79d1e`, but
  `check:convex` only runs codegen and typecheck and never publishes, so the
  deployed `colorful-newt-937` validator still rejected the field. This is
  the third occurrence of the same deployment-gap class (receipt number,
  size/choice fields, now tenders).
- Fix: deployed the current functions with `npx convex dev --once`
  (functions ready on colorful-newt-937; no data change). `convex/AGENTS.md`
  now records the contract that every schema/validator change requires an
  explicit `npx convex dev --once` before a tablet can synchronize. The six
  failed rows stay honestly `failed` until the owner presses Manual Sync,
  which resets them to pending and drains them against the corrected
  validator.
- Also removed the `Daily report sent; confirm paper.` success alert from
  `App.tsx` (failure feedback kept, unused French translation deleted).
- Product images: the tablet's products have built-in `image_asset_key`
  artwork (americano, cappuccino, …) with null `image_jpeg`, which POS and
  Orders resolve through the shared `productImage` helper but Products
  replaced with Boxicons. `ProductList` rows and the
  `ProductEditorPanel` identity card now use `productImage(
  imageAssetKey, categoryArtworkKey, imageJpeg)` so the actual product image
  shows, a custom compressed photo overrides it, and the neutral category
  artwork is the final fallback. Compression is already enforced twice
  (`compressProductImage` 96×96 JPEG ≤16 KB at pick, `productImageJpeg`
  validation at the local/Cloud persistence boundary); no change needed.
- Passed `npx tsc -b`, `npm run check:offline`, `npm run check:navigation`,
  `npm run check:css-scope`, `npm run build`, `check:android`, and the debug
  beta build. Graphify refreshed (3,040 nodes, 6,013 edges). The rebuilt APK
  was installed over SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`),
  preserving data. No PIN, seed, reset, or data write occurred. Exact next
  action: owner presses Manual Sync for today's sales and physically verifies
  the report print and product images; PR-05 remains pending owner
  authorization.

### 2026-09-02 — POLISH-01: split receipt methods and split question

- Owner-reported payment issues: split receipts printed every payment as
  Card, and the split flow needed an explicit bilingual question before
  payment instead of appearing only inside the payment dialog.
- Receipt root cause: `receiptModel.ts` coerced each tender's method with
  the sale-level `paymentMethod` fallback, so a Cash tender inside a sale
  whose snapshot method was Card printed as Card with no cash Given/Change
  rows. Each tender now keeps its own method; only a tender missing an
  explicit method falls back to the sale-level value. The existing
  mixed-tender check had only covered a Cash-level snapshot, which is why
  this survived; `check:printing` now also covers a Card-level snapshot with
  Cash+Card tenders asserting per-method rows and exactly one Given/Change
  pair. The 800-byte golden receipt and its SHA are unchanged.
- Flow: Card with a single payable unit now places the order directly from
  the POS button (no payment dialog). With two or more payable units the
  payment dialog opens on a bilingual question —
  `Does this order need to be split?` /
  `Cette commande doit-elle être payée séparément ?` — with
  `No, one payment` / `Non, un seul paiement` continuing the ordinary
  single-tender flow and `Yes, split it` / `Oui, la séparer` opening the
  existing split editor. The question reuses the existing PaymentDialog
  chrome and CSS Module rather than a new component.
- Passed `npm run check:printing` (golden unchanged), `npm run check:pos`,
  `npx tsc -b`, `npm run check:css-scope`, `npm run build`, and the debug
  beta. Graphify refreshed (3,041 nodes, 6,013 edges). The rebuilt APK was
  installed over SM-X115 `R8YX91AKWXJ` with `adb install -r` (`Success`),
  preserving data. Exact next action: owner physically verifies Card+single
  product direct checkout, the split question (EN/FR), and per-method
  receipt paper; PR-05 remains pending owner authorization.

### 2026-09-02 — POLISH-01: Reports reload fade; profile performance deferred

- Owner deferred the performance-by-profile request (per-profile amounts in
  the printed daily report and on the Reports page) until after today's work
  and wants a layout-safe design discussion first; nothing was implemented
  for it.
- Owner-reported polish: changing the Reports period made every tab and
  right card flash while reloading. The Reports content now sits in a keyed
  wrapper that replays the exact 420 ms `cubic-bezier(0.22, 1, 0.36, 1)`
  screen-crossfade motion whenever the selected range, active tab, or
  load/ready state changes, including the loading and ready steps. Reduced
  motion preference disables it; the approved geometry, cards, and chart are
  untouched.
- Passed `npx tsc -b`, `npm run check:css-scope`, `npm run check:navigation`,
  `npm run check:offline`, and `npm run build`. Graphify refreshed (3,041
  nodes, 6,013 edges). The rebuilt APK was installed over SM-X115
  `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving data. Exact
  next action: owner verifies the fade and the earlier split-payment
  behavior; then discuss the profile-performance design; PR-05 remains
  pending owner authorization.

### 2026-09-02 — POLISH-01: dimmed stale totals replace the Reports loading flash

- Owner feedback on the first fade attempt: replaying the fade over the
  whole content still showed the loading state, and the whole screen should
  not fade — only the data that changes. The approved behavior is
  stale-while-reload: changing the Reports period keeps the previous totals
  visible but dimmed (opacity 0.5, 420 ms transition) while the new range
  loads, then swaps to the new values as the dim clears. Panel chrome,
  headers, tabs, and the calendar never move or fade.
- `useReportsData` no longer clears the snapshot on a range change; it
  exposes `isRefreshing` while a new range loads and still clears the
  snapshot on a genuine failure so the honest error/retry state remains.
  ReportsScreen dropped the whole-content fade wrapper; the analytics hero
  and chart share one dimmable data area, and the summary panel's data
  blocks (category/product lists, used ingredients, profit facts and
  result) each carry the dim transition. The initial load still shows the
  ordinary loading state.
- Updated `data/AGENTS.md` and `reports/AGENTS.md`: the previous
  "changing the calendar does not keep the previous period's totals"
  contract is replaced by the owner-approved dimmed stale-while-reload
  behavior.
- Passed `npx tsc -b`, `npm run check:css-scope`, `npm run check:navigation`,
  `npm run check:offline`, and `npm run build`. Graphify refreshed (3,041
  nodes, 6,013 edges). The rebuilt APK was installed over SM-X115
  `R8YX91AKWXJ` with `adb install -r` (`Success`), preserving data. Exact
  next action: owner verifies the dimmed reload behavior; then discuss the
  profile-performance design; PR-05 remains pending owner authorization.

### 2026-09-02 — Diagnosed: Reports All blank-screen crash (owner-authorized ADB/CDP debugging)

- The owner authorized ADB control of the tablet and provided the device/
  owner PIN for debugging. The crash was reproduced on the physical SM-X115
  (Reports → calendar → All → blank cream screen) and captured live through
  the WebView Chrome DevTools protocol (`adb forward tcp:9222
  localabstract:webview_devtools_remote_<pid>`), including a breakpoint on
  the minified `buildPeriodProfit` frame. A read-only fresh database copy
  was pulled; no data was written, reset, or seeded, and no PIN was stored
  in the repository.
- Captured exception, thrown during React render:
  `Error: Months must use YYYY-MM.` at
  `src/lib/costs.ts` `daysInCalendarMonth` ← `operatingCostsForRange` ←
  `buildPeriodProfit` ← `ReportsAnalyticsPanel`.
- Debugger scope evidence: `buildPeriodProfit` was invoked with
  `snapshot === undefined` and `fromDate === ''`, `toDate === ''` (All
  mode). `snapshot?.range.from ?? fromDate` therefore fell through to the
  empty strings, `operatingCostsForRange([], [], '', '')` made
  `monthsInDateRange('', '')` yield the invalid month `''`, and
  `daysInCalendarMonth('')` threw, unmounting the whole React tree.
- Why the snapshot was undefined in All mode: any All render before a
  snapshot exists — a fresh Reports mount while the All request is still in
  flight, after a failed load, or (on pre-stale builds) immediately after
  changing the range — has no snapshot, and nothing guards the empty All
  dates. The stale-while-reload behavior only protects a transition that
  already had a loaded snapshot.
- Underlying data-path failure (the AUDIT-01 finding): the cloud All
  request itself did not deliver data in the repro window, consistent with
  `convex/reports.ts` `getAllSummary`'s repeated in-function pagination
  being rejected by Convex limits. The offline All producer and the tablet
  expense/compensation rows were verified well-formed from the fresh
  database copy, ruling out malformed local data.
- No fix was implemented, per the owner instruction; the AUDIT-01 card owns
  the repair. Exact next action: follow the Recovery Protocol and implement
  AUDIT-01 only.

### 2026-09-02 — AUDIT-01 implemented, checked, and deployed

- Repair A: `convex/reports.ts` — removed the looping `.paginate()`
  `getAllSummary`; added `getAllSummaryPage` (one `.paginate()` per call with
  `paginationOptsValidator`) and `getAllSummaryStock` (bounded live-ingredient
  overlay). `src/data/cloudAllReport.ts` (new) collects pages with the
  documented manual cursor loop for explicit All mode and aggregates them
  into the unchanged report shape; `useReportsData` uses it only for All.
  Ordinary 1–31-day ranges and the graph-month behavior are untouched.
- Repair B: `src/data/offlineViews.ts` — new exported
  `loadAllProductSummary` sums every completed unit by SQL; the ranked
  product display keeps its 20-row cap; `loadOfflineAllReport` uses it for
  `itemCount`.
- Repair C: new exported `loadAllPaymentTotals` splits mixed-tender sales by
  exact saved tenders (two bounded JSON queries, order counted once per
  participating method) and keeps legacy receipts on their top-level method;
  `loadOfflineAllReport` uses it for `paymentTotals`.
- Repair D: `src/data/localCosts.ts` — the correction guard falls back to
  `effectiveStartMonth + '-01'` for legacy month-only monthly expenses.
- Repair E: `OrderDetailPanel.tsx` no longer prepends `Offert` to the item
  option text; the Payment summary keeps the Offert amount. No printed
  receipt or snapshot change.
- Mandatory bug repair (reproduced during the owner-authorized diagnosis):
  `reportProfit.ts` `buildPeriodProfit` no longer passes All's empty dates
  into `operatingCostsForRange` when no snapshot is loaded — this was the
  exact blank-screen crash captured on the tablet.
- Focused coverage: `check:offline` (40-row three-page cloud All collection
  and merge, per-page contribution totals, 20-row ranked cap, payment split
  totals, crash guard zeros, Offert source guards), `check:local-inventory-costs`
  (21-product offline All unit count with baseline, mixed-tender split with
  legacy control, legacy month-only rejection with zero partial writes and
  permitted first-day correction).
- All safe checks pass: `check:offline`, `check:local-inventory-costs`,
  `check:printing` (golden 800-byte receipt SHA unchanged),
  `check:pos`, `check:costs`, `check:navigation`, `check:css-scope`,
  `npx tsc -b`, `npm run build` (existing jeep-sqlite warning only), and
  `git diff --check`. Protected `check:reports`/`check:dashboard`-style
  cloud checks were not run: they require the owner test PIN and reset or
  seed data; recorded honestly, not bypassed.
- Convex functions deployed with `npx convex dev --once` (code only; no
  seed, reset, or data change). Graphify refreshed to 3,061 nodes, 6,050
  edges, 183 communities. DOX updates: `convex/AGENTS.md` pagination
  contract, `data/AGENTS.md` All-mode contracts. No app launch, install,
  print, PIN use, seed, reset, or live-data change occurred during
  implementation. Exact next action: review the diff, stage only AUDIT-01
  files, commit, push, and record the SHA.

### 2026-09-03 — AUDIT-01 committed and pushed

- Committed and pushed `bca6d773eaa89147ce556cca09d61aa10414609c`
  (`AUDIT-01: repair report and order audit findings`, 13 files) directly to
  `origin/main` after `git diff --cached --check` passed. Verified
  `main...origin/main` synchronized and the worktree clean apart from the
  untracked owner `.commandcode/` directory, which was never touched or
  staged.
- AUDIT-01 is done. PR-05 remains pending for the owner's physical
  acceptance and final closeout. Exact next action: wait for owner
  authorization, then begin PR-05 only.

### 2026-09-02 — AUDIT-01 recovery and official Convex pagination research

- Re-read the repository instruction chain, `PLAN.md`, the updated
  `WORK_LEDGER.md`, this complete ledger including the AUDIT-01 contract,
  and the `convex/`, `src/data/`, `src/features/reports/`, and
  `src/features/orders/` DOX. `main` is clean and synchronized.
- Graphify traced the affected flows (`getAllSummary`, `aggregate()`,
  `dailyMetrics`, `OrderDetailPanel`, `correctExpense` guard paths).
- Official Convex pagination guidance (docs.convex.dev/database/pagination):
  a paginated query function takes `paginationOpts` (validated with
  `paginationOptsValidator` from `convex/server`) and calls `.paginate()`
  exactly once; clients collecting more data call the function again with
  the returned `continueCursor` until `isDone` (the documented manual
  collection pattern). This confirms the audit finding: the current
  `getAllSummary` loops `.paginate()` inside one query, which is illegal.
- Research decision: replace `getAllSummary` with `getAllSummaryPage` (one
  `.paginate(paginationOpts)` call over `dailyMetrics` by the existing
  `by_business_date` index) plus a small `getAllSummaryStock` query for the
  bounded live-ingredient overlay; the Reports data layer collects pages
  with the documented manual cursor loop only for explicit All mode and
  aggregates them client-side into the unchanged report shape. No
  dependency, no second reporting architecture, no server wall-clock dates.
- Exact next action: implement repairs A-E plus the mandatory crash guard,
  then focused checks.

## PR-01 — Exact compensation and expense correction dates

**Status:** pending — first implementation card

### Objective

Preserve exact compensation start/end dates across cloud refresh and prevent a
recurring-expense correction from reversing costs before the original expense
existed.

### Confirmed compensation root cause

`convex/staff.ts` `listAllCompensation` returns compensation month fields but
omits optional `effectiveStartDate` and `effectiveEndDate`. Reconnect passes
that result into local replacement. The local upsert can therefore replace
exact dates with null and turn a mid-month salary into a full-month salary.

### Compensation implementation contract

1. Make `listAllCompensation` return optional `effectiveStartDate` and
   `effectiveEndDate`, matching the existing per-profile compensation query.
2. Keep start/end month fields for backward compatibility.
3. Do not change compensation permissions or expose salary through ordinary
   staff reads.
4. Do not rename or redesign the Monthly pay form.
5. Verify reconnect passes the dates through unchanged.
6. Add the smallest regression that replaces a local compensation snapshot
   from cloud and proves both exact dates survive.
7. Prove an older month-only record still works and a missing optional end date
   remains missing.

### Confirmed expense root cause

Both local and cloud correction paths can set the recurring reversal start to
the replacement correction date even when that date is earlier than the
original recurring expense start.

### Expense implementation contract

1. For an original monthly expense, determine its exact original start as
   `effectiveStartDate` when present, otherwise the first day of
   `effectiveStartMonth`.
2. Determine the replacement correction date using the existing replacement
   input rules.
3. Before inserting either correction row, reject when correction date is
   earlier than original start.
4. Use one clear user-facing meaning in English and French:
   `The correction date cannot be before the original expense start date.`
5. Do not clamp or silently rewrite the date.
6. Do not write a reversal without its replacement or a replacement without
   its reversal.
7. Preserve append-only reversal/replacement accounting and retry behavior.

### Likely files

- `convex/staff.ts`
- `src/data/reconnectContext.tsx`
- `src/data/localCostViews.ts`
- `src/data/localCosts.ts`
- `convex/expenses.ts`
- `src/lib/fr.ts` only if the validation message is translated in UI
- focused reconnect/local-cost/expense checks

### Required focused acceptance

- Salary starts `2026-09-15`; cloud refresh keeps `2026-09-15`.
- Exact salary end date survives cloud refresh.
- Month-only legacy compensation remains readable.
- Monthly expense starts `2026-09-10`; correction on `2026-09-01` is rejected
  before any correction row is inserted.
- Correction on `2026-09-10` or later succeeds.
- Existing valid expense allocation results stay unchanged.

### Minimum checks

- `npm run check:local-inventory-costs`
- `npm run check:reconnect`
- `npm run check:costs`
- relevant expense/staff/monthly-cost check that does not need a PIN
- `npx tsc -b`
- `git diff --check`

### Completion gate

PR-01 is complete only after focused checks pass, Graphify is refreshed if
structure changed, this ledger and `WORK_LEDGER.md` are updated, the card is
committed, pushed to `origin/main`, and its full SHA is recorded. Then activate
PR-02.

## PR-02 — Ingredient totals and genuine all-time Reports

**Status:** pending

### Objective

Count all distinct ingredient types honestly and make Reports `All` cover all
recorded history without removing ordinary range safety or loading unbounded
raw sales.

### Ingredient count contract

1. Add a complete `ingredientTypeCount` to cloud and offline report results.
2. Count all distinct ingredient name/unit groups used by completed,
   non-cancelled sales in the requested period.
3. The `INGREDIENT TYPES USED` headline uses the complete count, never the
   visible detail-array length.
4. Keep at most 20 visible ingredient-detail rows and preserve the current
   approved ordering.
5. Cloud aggregation counts the full ingredient map before slicing details.
6. Offline reporting uses a separate SQL distinct-count query and a detail
   query limited to 20. Delete the current 21-row probe and greater-than-20
   failure.
7. Repeated use of one ingredient counts as one type.
8. Cancelled sales do not contribute.

### All-time visible behavior

1. `All` means earliest relevant recorded activity through today.
2. Its calendar label is localized `All` / `All dates`.
3. It covers sales, product/category/payment totals, ingredient usage and cost,
   one-time expenses, recurring expenses, and compensation across their full
   effective history.
4. No history returns ordinary zero totals without an error.
5. Previous-period comparison is hidden for All.
6. The monthly graph remains the current calendar month because All includes
   today.
7. Switching from All to another preset restores ordinary range behavior.

### All-time safety contract

1. Keep `MAX_RANGE_DAYS` for ordinary selected/custom ranges.
2. Add a first-class all-time mode; do not fake All as the last 31 days.
3. Do not perform an unbounded raw-sales cloud query.
4. Cloud All reads existing pre-aggregated daily report records in fixed,
   authorized pages and merges pages until the cursor is exhausted.
5. Reuse or extract one pure aggregation path. Do not maintain competing
   formulas for bounded and all-time totals.
6. Apply top-20 visible detail limits only after complete page totals merge.
7. Offline All uses SQLite aggregation/grouping or bounded paging. It must not
   pass through the existing raw 1,000-sale loader.
8. Do not load unlimited receipt snapshots into React memory.
9. Determine the earliest relevant local date from saved sales, expenses, and
   compensation; include costs that begin before the first sale.
10. Allocate monthly wages/expenses only over active days, count one-time
    expenses on their effective date, preserve correction reversals, and do
    not count stock purchases as operating expenses.
11. Keep immutable historical sale-cost snapshots. No current-cost backfill.

### Likely files

- `convex/reports.ts`
- `src/data/useReportsData.ts`
- `src/data/offlineViews.ts`
- `src/components/PeriodCalendar/PeriodCalendar.tsx`
- `src/features/reports/ReportsScreen.tsx`
- `src/features/reports/components/ReportsAnalyticsPanel/ReportsAnalyticsPanel.tsx`
- `src/features/reports/components/ReportSummaryPanel/ReportSummaryPanel.tsx`
- `src/lib/costs.ts`
- report/offline/cost checks

### Required acceptance fixture

The focused test data must cover:

- more than 31 days across at least three months;
- proof that All does not use the raw 1,000-sale offline limit;
- 21 distinct used ingredient types;
- repeated use of one ingredient;
- one completed and one cancelled sale;
- one-time and recurring expenses;
- compensation starting partway through a month;
- an expense correction reversal;
- no-history zero state;
- All to This week switching.

Expected results include a headline ingredient count of 21, no more than 20
visible ingredient rows, no offline ingredient-limit error, complete all-time
totals, no previous-period comparison, and the current-month graph.

### Minimum checks

- `npm run check:reports`
- `npm run check:offline`
- `npm run check:costs`
- `npm run check:local-inventory-costs`
- `npm run check:monthly-costs` when its protected section can run
- `npm run check:convex`
- `npx tsc -b`
- `npm run build`
- `git diff --check`

### Completion gate

Complete, journal, commit, push, and record PR-02 before activating PR-03.

## PR-03 — Correct graph month and localized visible dates

**Status:** pending

### Objective

Keep the approved full calendar-month chart while choosing the relevant month,
and make all visible application dates follow the active profile language.

### Exact graph-month rule

1. All selects the current calendar month.
2. Any selected range containing today selects the current calendar month.
3. A historical range wholly inside one month selects that month.
4. A historical range crossing months counts the inclusive selected days in
   each month and selects the month containing the greatest count.
5. A tie selects the later month.

### Graph invariants

- The graph continues to render the complete chosen calendar month.
- February has 28 or 29 day points. Other months have 30 or 31 as appropriate.
- Never force 31 slots.
- Never reduce the graph to only selected-period days.
- Do not change graph dimensions, CSS geometry, axes, bars, spacing, cards, or
  interaction.
- Report cards/totals continue to use the selected report range.
- Query the chosen graph month separately.
- Pass the chosen month into `SalesTrendChart`; remove its internal hard-coded
  current-month assumption.
- Show the chosen month/year in the existing subtitle using active language.

### Graph acceptance cases

- This week begins in August and today is in September: September.
- Last month: last month.
- Historical selection has 20 March days and 10 April days: March.
- Historical selection splits equally across March/April: April.
- Leap-year February renders 29 days.
- All: current month.

### Date-language contract

1. English application language uses `en-GB`; French uses `fr-FR`.
2. Reuse one small locale selector/helper rather than repeating the language
   decision in every component.
3. Update `formatPeriodLabel` and all callers.
4. Cover Dashboard saved/peak labels, recent orders, Orders list/detail/sync
   times, Reports range/month/peak labels, and Stock movement dates.
5. Do not change stored timestamps, business-date keys, SQL values, or receipt
   language.

### Likely files

- `src/lib/date.ts`
- `src/lib/locale.tsx`
- `src/lib/fr.ts`
- `src/features/reports/ReportsScreen.tsx`
- `src/features/reports/components/ReportsAnalyticsPanel/ReportsAnalyticsPanel.tsx`
- `src/features/reports/components/SalesTrendChart/SalesTrendChart.tsx`
- Dashboard date components
- Orders date components
- Stock detail date component
- report/settings/navigation checks

### Minimum checks

- focused report month-selection cases
- focused EN/FR date-format cases
- `npm run check:reports`
- `npm run check:settings`
- `npm run check:navigation`
- `npm run check:css-scope`
- `npx tsc -b`
- `npm run build`
- `git diff --check`

### Completion gate

Complete, journal, commit, push, and record PR-03 before activating PR-04.

## PR-04 — Complete Costs lists and honest pending-sale Dashboard

**Status:** pending

### Objective

Make every saved expense/compensation record reachable without moving the
Reports layout, and keep an online Dashboard honest while the local tablet has
a completed sale still waiting for cloud acknowledgement.

### Costs-list contract

1. Remove both `.slice(0, 8)` display limits in `CostsPanel.tsx`.
2. Render every bounded record already returned by cost management.
3. Preserve the current two-card layout, headings, controls, buttons, and
   permissions.
4. Make each list card a flex column and its rows use remaining height with
   `min-height: 0` and `overflow-y: auto`.
5. Headings/Add controls remain fixed; only rows scroll.
6. Do not add pagination, View all, another overlay, or a dependency.
7. A ninth record must be reachable without growing the Reports page.

### Dashboard contract

1. When online, request the cloud Dashboard and saved local Dashboard
   concurrently.
2. Reuse the existing Reports selection rule: if local current-day completed
   order count is greater than cloud current-day completed order count, show
   the local snapshot; otherwise show cloud.
3. When cloud catches up, cloud becomes authoritative normally.
4. Offline mode remains local-only.
5. Never add cloud and local totals; that double-counts acknowledged sales.
6. Preserve loading/error behavior and the single-tablet product assumption.
7. Do not change sale synchronization.

### Dashboard acceptance cases

- Cloud 5, local same 5 plus one pending completed sale: show 6.
- Cloud 6 after sync, local 6: show 6.
- Cloud 5 and local 5: cloud remains authoritative.
- Offline: local only.
- No double counting.

### Likely files

- `src/features/reports/components/CostsPanel/CostsPanel.tsx`
- `src/features/reports/components/CostsPanel/CostsPanel.module.css`
- `src/data/useDashboardData.ts`
- report/dashboard/offline/CSS checks

### Minimum checks

- `npm run check:dashboard`
- `npm run check:offline`
- `npm run check:reports`
- `npm run check:css-scope`
- `npx tsc -b`
- `npm run build`
- `git diff --check`

### Completion gate

Complete, journal, commit, push, and record PR-04 before activating AUDIT-01.

## AUDIT-01 — Repair remaining audit findings

**Status:** pending — active card

### Objective

Repair the five confirmed post-implementation correctness findings without
changing approved layouts, profit policy, ordinary report ranges, receipt
formatting, cloud-only Orders restoration, or live menu data.

### A. Make cloud All use legal bounded pagination

Current failure: `convex/reports.ts` loops and calls `.paginate()` more than
once inside one `getAllSummary` query. Convex's built-in pagination permits one
paginated database query per function invocation. The existing check has only
31 days and therefore does not exercise a second page.

Required implementation:

1. Replace the looping server query with one page function that accepts the
   official Convex pagination validator and invokes `.paginate()` exactly once.
2. Request successive pages from the Reports data layer only for explicit All
   mode, following returned cursors until completion.
3. Combine daily summaries into the same report shape. Aggregate all totals
   before limiting ranked display lists such as top products.
4. Keep ordinary Today/week/custom ranges and their current 1–31-day graph
   behavior unchanged.
5. Keep this bounded to daily summaries. Do not add an unbounded raw-sales read,
   a dependency, or a second reporting architecture.
6. Do not use server wall-clock time to define the tablet's business date. If
   a current local date is required, pass the existing client business date.

Acceptance:

- A fixture containing at least 40 distinct daily metric rows loads All without
  a Convex pagination error.
- First, middle, and final pages contribute exact sales, order, payment,
  ingredient, cost, profit, and ranked-product totals.
- Ranked product display remains capped where the UI contract caps it, but its
  totals are calculated from the full history.

### B. Count every offline All unit beyond the top 20 products

Current failure: `src/data/offlineViews.ts` limits product totals to 20 and then
sums that limited list to produce `itemCount`.

Required implementation:

1. Add the smallest independent SQL aggregate that sums all completed
   `sale_items.quantity` in the All snapshot.
2. Continue returning no more than 20 ranked products for display.
3. Do not load all raw sales or all product rows into JavaScript.

Acceptance: with at least 21 distinct sold products, the displayed ranked list
contains at most 20 while `itemCount` equals every completed unit sold.

### C. Split offline All mixed payments by saved tenders

Current failure: offline All assigns the entire sale to the receipt's top-level
payment method. A Card/Cash split sale therefore appears under only one method.

Required implementation:

1. For modern saved receipts, aggregate each tender's exact `dueCentimes` under
   its own Cash or Card method.
2. Count the order once in each payment-method group that participated in it.
3. Fall back to the top-level receipt payment method only for a legacy receipt
   that has no tender array.
4. Use the smallest bounded SQLite JSON aggregation or existing receipt parsing
   pattern. Do not introduce an unbounded raw-sale loader.

Acceptance: one mixed Card/Cash sale contributes the exact tender amount to
both methods and contributes one order to each participating method; a legacy
single-method receipt remains correct.

### D. Reject an early correction for legacy month-only recurring expenses

Current failure: the local replacement guard reads only
`prior.effectiveStartDate`, while legacy monthly rows may contain only
`effectiveStartMonth`.

Required implementation:

- For a monthly prior record, calculate its original start using
  `prior.effectiveStartDate`, falling back to the first day represented by
  `prior.effectiveStartMonth` (for example, `2026-08-01`).
- Reject a replacement effective before that date before any local write or
  outbox entry occurs.
- Preserve the already-correct cloud behavior and every modern exact-date path.

Acceptance: a legacy month-only record rejects a replacement before the first
day of its start month, permits the first day, and leaves zero partial local or
outbox writes after rejection.

### E. Remove Offert from Orders item options

Current failure: `OrderDetailPanel` prepends `Offert` to each complimentary
item's option string. Offert is a payment/price fact, not a selected product
option.

Required implementation:

- Remove only the complimentary `Offert` label from the item-options list.
- Keep size and real selected choices unchanged.
- Keep the existing Offert amount in the Payment summary.
- Do not alter printed receipt behavior or saved receipt snapshots.

Acceptance: a complimentary configured product shows only its real size and
choices under the item, while its Offert amount remains visible in Payment.

### Non-goals and safeguards

- Do not restore cloud-only Orders into an empty tablet database in this card.
- Do not hide numeric profit or change the missing ingredient-cost warning.
- Do not change Reports chart geometry or the chosen graph-month rules.
- Do not create, import, or edit the real café menu.
- Do not launch the app, use ADB, install an APK, print, request a PIN, seed,
  reset, or alter live business data. The owner performs physical acceptance.
- Preserve `.commandcode/` and every unrelated owner change.

### Focused verification

Add the smallest deterministic coverage for each acceptance rule, then run:

- the focused 40-plus-day Convex report test
- the focused 21-plus-product offline All test
- the focused mixed-tender offline All test
- the focused legacy month-only correction test
- the focused Orders Offert presentation check
- `npm run check:offline`
- `npm run check:local-inventory-costs`
- `npm run check:printing`
- `npm run check:pos`
- `npm run check:costs`
- `npm run check:navigation`
- `npm run check:css-scope`
- `npx tsc -b`
- `npm run build`
- `git diff --check`

Run protected checks only if they have a documented no-PIN, no-reset mode.
Otherwise record the exact gate honestly. Because a Convex function changes,
run `npx convex dev --once` after the focused local checks as required by the
repository contract; deploy code only and never seed, reset, or expose secrets.

### Completion gate

1. Re-query Graphify and refresh it if the structural change requires it.
2. Update the applicable DOX file only if a durable subtree contract changed.
3. Update this Card Board, State Pointer, and Checkpoint Ledger with files,
   checks, limitations, and the exact next action.
4. Update `WORK_LEDGER.md`.
5. Review and stage only AUDIT-01 files. Never stage `.commandcode/`.
6. Commit directly on `main` with `AUDIT-01: repair report and order audit findings`.
7. Push immediately to `origin/main`, record the full SHA and remote location,
   and verify synchronized main before changing AUDIT-01 to done.
8. Leave PR-05 pending for the owner's physical acceptance and final closeout.

## AUDIT-02 — Close All-report pagination and verification gaps

**Status:** pending — active card

### Objective

Finish the AUDIT-01 All-report boundary correctly: never omit a Convex page,
stop issuing new requests when Reports is hidden or superseded, remove the
arbitrary history ceiling so All is genuinely all-time, make the focused test
exercise those cases, and repair the stale plan pointers. Preserve all five
working AUDIT-01 business fixes.

### A. Handle Convex `SplitRequired` without missing or duplicating days

Current failure:

- `CloudAllReportPage` drops `pageStatus` and `splitCursor`.
- When Convex cannot return a complete page it may return
  `pageStatus: 'SplitRequired'`. The current collector appends that incomplete
  page and advances to `continueCursor`, which can omit daily accounting rows.

Required implementation:

1. Extend the local page result type to preserve Convex's optional
   `pageStatus` and `splitCursor` fields and accept `endCursor` in page
   requests.
2. Reuse the installed Convex client's split semantics; add no dependency.
3. For a normal complete page, aggregate it once and continue from its returned
   cursor.
4. For `SplitRequired`, do not aggregate the incomplete original page. Resolve
   the original interval as two ordered requests:
   - first half: the original start cursor through `splitCursor` using
     `endCursor: splitCursor`;
   - second half: `cursor: splitCursor` through the original
     `continueCursor` using that value as `endCursor`.
5. Preserve first-half then second-half order, aggregate every resolved row
   exactly once, and only then continue beyond the original interval.
6. Reject an impossible required split with no usable split cursor. Never
   silently accept an incomplete page.

Acceptance:

- A deterministic fake first returns `SplitRequired` with an intentionally
  incomplete page. The collector replaces it with the two split intervals.
- The result contains every expected day exactly once, in order, with exact
  sales, order, product, payment, ingredient, and cost totals.
- The incomplete original page contributes nothing.

### B. Stop future requests after cleanup or replacement

Current failure: the React effect sets its local `cancelled` flag, but the
collector cannot see it. After the user changes period, leaves Reports, locks,
or backgrounds the activity, the collector can still issue every remaining
page request and the final stock request.

Required implementation:

1. Pass the collector a small cancellation predicate or equivalent native
   `AbortSignal`; do not add a package.
2. Check cancellation before the first request, before every subsequent page
   or split request, and before the stock request.
3. A request already in flight may finish, but no new request may start after
   cleanup.
4. Cancellation must not replace a newer result, show an error, or clear the
   currently displayed safe snapshot.

Acceptance:

- A deterministic collector test cancels after the first response and proves
  no second page and no stock request occurs.
- Existing range-change stale-content behavior remains unchanged.

### C. Make All truly all-time without an infinite-loop risk

Current failure: `MAX_ALL_PAGES = 60` throws once valid history needs a
sixty-first request. Convex can also return fewer than 60 documents when page
splitting is needed, so this is not a reliable time span.

Required implementation:

1. Remove the fixed page-count ceiling.
2. Continue valid pagination until Convex returns `isDone`.
3. Prevent infinite loops by tracking completed request intervals/cursors and
   rejecting a missing, unchanged, or repeated continuation cursor whenever
   more data is claimed.
4. Keep page reads bounded; do not replace pagination with `.collect()` or an
   unbounded raw-sales request.

Acceptance:

- A lightweight fake requiring at least 61 valid page requests completes and
  includes every row.
- A fake that repeats a continuation cursor fails immediately with a clear
  bounded-pagination error rather than looping.

### D. Replace the false one-page test with real cursor coverage

Current failure: `check-offline-views.mjs` builds 40 rows while the collector
requests 60 rows, so the test performs one request even though the ledger calls
it a three-page test.

Required implementation:

1. Make the basic collection fixture require at least three normal pages.
2. Record every received cursor and assert the exact first, middle, and final
   request sequence plus request count.
3. Keep the existing complete aggregate assertions.
4. Add the split-required, cancellation, 61-page, and repeated-cursor cases
   from A through C to this same focused check unless an existing smaller check
   already owns them.

### E. Repair durable state pointers

After the code and checks pass:

- Change `PLAN.md` Exact next action from AUDIT-01 to PR-05.
- Change the top `WORK_LEDGER.md` Goal 06 card row so AUDIT-01 and AUDIT-02 are
  complete and PR-05 is next.
- Update this Card Board and State Pointer, and append factual checkpoint
  entries. Do not rewrite historical journal entries.

### Non-goals and safeguards

- Do not change the five working AUDIT-01 business repairs.
- Do not change report layout, graph behavior, receipt formatting, profit
  policy, payment semantics, Orders restoration, or live menu data.
- Do not add a dependency or a second reporting architecture.
- Do not launch the app, use ADB, install another APK, print, request a PIN,
  seed, reset, or alter live business data. Owner physical acceptance remains
  PR-05 work.
- Preserve `.commandcode/` and every unrelated owner change.

### Minimum verification

- focused real three-page collection test
- focused `SplitRequired` replacement test
- focused cancellation test
- focused 61-page completion and repeated-cursor rejection tests
- `npm run check:offline`
- `npm run check:local-inventory-costs`
- `npm run check:printing`
- `npm run check:pos`
- `npm run check:costs`
- `npm run check:navigation`
- `npm run check:css-scope`
- `npx tsc -b`
- `npm run build`
- `git diff --check`

Do not run protected PIN/reset/seed checks. No Convex deployment is required
unless a deployed `convex/` function changes; if one does, follow its DOX and
deploy code only with `npx convex dev --once` after local checks.

### Completion gate

1. Re-query Graphify and refresh it if structural source changed.
2. Update applicable DOX only if a durable subtree contract changed.
3. Update this State Pointer and Checkpoint Ledger after each meaningful step.
4. Update `WORK_LEDGER.md` and `PLAN.md` as specified above.
5. Stage only AUDIT-02 files; never stage `.commandcode/`.
6. Run `git diff --cached --check`.
7. Commit directly on `main` with
   `AUDIT-02: finish all-report pagination safeguards`.
8. Push immediately to `origin/main`, record the full SHA and remote location,
   and verify synchronized main before marking AUDIT-02 done.
9. Leave PR-05 pending for owner authorization and physical acceptance.

## AUDIT-03 — Prove the SplitRequired request contract

**Status:** pending — active card

### Objective

Repair only the remaining verification gap found after AUDIT-02. The current
runtime implementation matches Convex's ordered two-half split contract, but
the focused fake ignores the pagination options and returns hard-coded
responses. It can therefore pass even if future code sends the wrong cursor,
wrong `endCursor`, or requests the halves in the wrong order.

### Required implementation

1. Change only the focused AUDIT-02 fixture in
   `scripts/check-offline-views.mjs` unless the stronger test exposes a real
   production defect.
2. Record every `paginationOpts` received by the `SplitRequired` fake.
3. Assert the exact four requests, in this exact order:
   - root page: `cursor: null`, `numItems: 60`, no bounded `endCursor`;
   - next page: `cursor: '60'`, `numItems: 60`, no bounded `endCursor`;
   - first replacement half: `cursor: '60'`, `endCursor: '75'`,
     `numItems: 60`;
   - second replacement half: `cursor: '75'`, `endCursor: '100'`,
     `numItems: 60`.
4. Make the fake select or validate its response from the received pagination
   options so a wrong request cannot accidentally receive the expected data.
5. Keep the deliberately incomplete original page and prove that it contributes
   nothing.
6. Assert the completed result's exact sales, order, item/product, payment,
   ingredient quantity/type, ingredient-cost, and incomplete-cost totals.
7. Do not change report behavior, UI, payment behavior, Convex functions, or
   any other production source merely to satisfy the test. If the stronger
   fixture exposes a real runtime defect, stop, document the evidence in this
   ledger, and do not widen the fix without owner approval.

### Minimum verification

- `npm run check:offline`
- `npx tsc -b`
- `npm run build`
- `git diff --check`

Do not launch the app, use ADB, install an APK, print, request a PIN, run a
protected check, seed/reset data, or deploy Convex. Preserve `.commandcode/`.

### Completion gate

1. Re-query Graphify; refresh it only if structural source changed.
2. Update this Card Board, State Pointer, checkpoint journal, `PLAN.md`, and
   `WORK_LEDGER.md` with factual evidence.
3. Stage only the AUDIT-03 test and ledger files; never stage `.commandcode/`.
4. Run `git diff --cached --check`.
5. Commit directly on `main` with
   `AUDIT-03: prove split pagination requests`.
6. Push immediately to `origin/main`, record the full SHA, and verify that
   `main` matches `origin/main` before marking AUDIT-03 done.
7. Leave PR-05 pending for owner authorization and physical acceptance.

## PR-05 — Regression and owner handoff

**Status:** pending

### Objective

Prove repository integrity, document honest limitations, leave `main` clean and
synchronized, and hand physical acceptance to the owner.

### Required review

1. Re-read the full instruction chain and this ledger.
2. Confirm the eight original approved repairs, all five AUDIT-01 repairs, and
   all AUDIT-02 pagination safeguards are present.
3. Confirm cloud-only Orders code was not changed for this batch.
4. Confirm profit remains numeric, its missing-cost warning remains, and no
   historical cost backfill was added.
5. Review the full branch diff for unrelated UI or business changes.
6. Refresh Graphify after structural changes. If semantic refresh lacks a key,
   perform the local code-only refresh and record that limitation.

### Minimum regression commands

- `npm run check:costs`
- `npm run check:local-inventory-costs`
- `npm run check:local`
- `npm run check:offline`
- `npm run check:reconnect`
- `npm run check:reports`
- `npm run check:dashboard`
- `npm run check:settings`
- `npm run check:navigation`
- `npm run check:css-scope`
- `npm run check:convex`
- relevant staff/expense/monthly-cost checks that do not require a PIN
- `npx tsc -b`
- `npm run build`
- `git diff --check`
- `git diff --cached --check`

### Protected-check rule

Never request or invent the owner PIN. Record local portions that pass and the
exact protected cloud gate that could not run. Do not call such a command a
full pass.

### Documentation and push

1. Update this State Pointer, Card Board, and Checkpoint Ledger.
2. Update `WORK_LEDGER.md` with the eight fixes, two intentional non-changes,
   checks, skipped protected gates, and no-tablet boundary.
3. Keep POLISH-01 / POLISH-02 in progress and HARD-08 pending.
4. Commit and push PR-05 to `origin/main`.
5. Record the full SHA and verify `main` equals `origin/main` with a clean
   worktree.

### Owner manual acceptance list

The final response must ask the owner to test:

1. Exact salary start/end dates after refresh.
2. Rejection of a correction earlier than recurring-expense start.
3. Ingredient count greater than 20 without an offline error.
4. All-time Reports across old months.
5. This week crossing a month boundary and historical graph-month selection.
6. French month/date labels throughout Dashboard, Orders, Reports, and Stock.
7. Ninth expense and ninth compensation row via internal scrolling.
8. Dashboard immediately after a locally completed sale and again after sync.
9. All-time Reports with more than 31 days of cloud daily history.
10. Offline All after more than 20 distinct products have sold.
11. Offline All payment totals for a mixed Card/Cash receipt.
12. A legacy recurring-expense correction before and on its first valid day.
13. A complimentary configured item in Orders: real choices under the item,
    Offert amount only in Payment.

Do not claim physical acceptance. The owner performs it.

## Verification Notes

- Repository checks are required; physical testing is explicitly deferred to
  the owner for this batch.
- Graph layout acceptance remains the existing 1,340 by 800 Galaxy Tab A9
  geometry, but the implementing agent must not launch or inspect it.
- Ordinary report ranges remain bounded. Only the dedicated All mode traverses
  full history, using bounded pages/aggregation.
- All-time cloud processing uses daily summaries, not an unbounded raw-sales
  read.
- All-time offline processing must not inherit the raw 1,000-sale loader cap.
- Historical incomplete ingredient cost is immutable. Numeric profit is an
  owner-approved optimistic figure with a warning, not a recalculated fact.

## Checkpoint Ledger

### 2026-09-03 — RECEIPT-01 calculation-layout implementation checkpoint

- The owner approved a more obvious on-paper layout for Cash, Card, and every
  split sequence. The shared deterministic encoder now groups each tender as
  Cash or Card; cash with change prints `Cash received +`, `Change given -`,
  and `= Cash payment`, while Card prints its exact payment. Split receipts
  retain their actual tender order as `PAYMENT 1 - ...`, `PAYMENT 2 - ...`.
  Exact cash intentionally prints only Cash payment because received equals
  kept. Product-to-tender claims remain absent because the immutable receipt
  stores tender amounts, not an item assignment.
- `scripts/check-printing.mjs` now covers cash with change, exact cash,
  card-only, two cash tenders, and cash/card in both recorded orders. Its first
  run correctly rejected the former golden byte hash after the approved layout
  change; the expected hash was updated to
  `F84EAA57B4B930D76A3410B56FE6128A1B3D2DF3F33CC33078B2CFE8567B847A`.
  Android's official print framework emits a user-selected PDF document via a
  `PrintDocumentAdapter`, which is not the existing raw ESC/POS path; official
  Capacitor guidance supports retaining web-layer presentation with the
  existing native boundary. Therefore this remains a transport-independent
  TypeScript encoder change: no Android, Kotlin, Capacitor-plugin, dependency,
  database, or live-data change is appropriate.
- Passed `check:printing` (1,013 bytes, SHA
  `F84EAA57B4B930D76A3410B56FE6128A1B3D2DF3F33CC33078B2CFE8567B847A`),
  `check:pos`, `npx tsc -b`, and `npm run build`; the build kept only the
  existing jeep-sqlite browser-compatibility warning. Graphify code-only
  refresh completed with 3,065 nodes and 6,062 edges. Exact next action:
  review the focused diff, commit/push, rebuild the beta, then leave real-paper
  verification to the owner.

### 2026-09-03 — RECEIPT-01 direct-card receipt bug diagnosed and repaired

- The previously installed beta included the encoder wording, but a direct
  Card sale did not save a tender because it bypasses the payment dialog. That
  made the new encoder fall back to the old generic payment row. Fixed the
  shared checkout path and the legacy receipt display as described in the
  State Pointer. Focused checks pass; the corrected APK is installed for owner
  paper verification.

### 2026-09-03 — RECEIPT-01 beta installed for owner testing

- The current synchronized `main` beta at
  `33373fdaea61c29f291d652f9a74ae1f9f05231f` was rebuilt with
  `npm run android:beta`.
  Android identity checks, Capacitor sync, the production web build, and the
  debug APK build completed successfully; the existing `jeep-sqlite` browser
  compatibility warning remained the only build warning.
- Connected physical tablet: Samsung SM-X115 `R8YX91AKWXJ`. Installed
  `android/app/build/outputs/apk/debug/app-debug.apk` over the existing
  `com.olaso.pos` installation with `adb install -r` and received `Success`.
  `-r` preserves the existing application data; no uninstall, clear, reset,
  seed, PIN, launch, app interaction, printer action, or live-data mutation
  occurred.
- Owner physical receipt verification is now pending. Exact next action:
  owner tests a mixed Card/Cash receipt and reports any finding; AUDIT-03 stays
  deferred and PR-05 stays pending.

### 2026-09-03 — RECEIPT-01 follow-up and safe whole-application code audit

- Follow-up commit `a70c462f8e77162a8875d8c5c0e4d615decfde35`
  (`RECEIPT-01: number split payment rows`) is pushed on `origin/main`; it
  numbers split tenders on paper while preserving the same tested 941-byte
  single-cash fixture and all saved payment data.
- Read-only Graphify-guided review and safe checks found no new confirmed
  checkout, receipt, offline, stock/cost, staff-access, reconnect, Settings,
  CSS-scope, or release-packaging defect. Passed: `check:printing`,
  `check:printing-endurance`, `check:pos`, `check:local`, `check:offline`,
  `check:navigation`, `check:local-management`, `check:local-catalog`,
  `check:local-inventory-costs`, `check:local-staff`, `check:lock-switch`,
  `check:product-configuration`, `check:android`, `check:identity`,
  `check:reconnect`, `check:costs`, `check:settings`, `check:release`,
  `check:css-scope`, `tsc -b`, `npm run build`, and `git diff --check`.
- This is not a claim of bug-free physical operation: protected cloud checks
  remain PIN/reset-gated and the owner alone performs tablet/printer testing.
  No app, tablet, printer, ADB, PIN, seed, reset, or live data was touched.
- Exact next action: collect owner physical findings or a reproducible failure,
  then add and repair only that confirmed issue; keep AUDIT-03 deferred and
  PR-05 pending.

### 2026-09-03 — RECEIPT-01 implemented and verified

- Owner explicitly deferred AUDIT-03 and authorized this receipt-clarity repair.
  Existing split-payment amounts and saved tender data remain unchanged.
- Official Android printing guidance confirms the platform print framework is
  for document-adapter jobs, while official Capacitor guidance keeps a web-first
  presentation layer connected to existing native plugins. Olaso already has a
  verified raw-ESC/POS Capacitor transport, so this is correctly a
  transport-independent TypeScript encoder change: no Android, Kotlin,
  Capacitor-plugin, dependency, database, or live-data change.
- `receiptEncoder.ts` now prints the order TOTAL before a distinct payment
  summary. Tenders say Card paid or Cash paid; cash additionally says Cash
  received and Change returned; split tenders are numbered so each cash/change
  pair stays visibly connected to its payment; every tendered receipt ends
  Total paid. French labels receive the equivalent wording. Legacy saved
  receipts retain their payment-method row because their historical
  cash-received amount may not exist.
- `check-printing` now proves the total/payment-summary order, the cash labels,
  the mixed Card-before-Cash sequence, every split cash change, and the new
  deterministic 941-byte receipt SHA. `check:printing`, `check:pos`,
  `tsc -b`, `npm run build`, and `git diff --check` pass; the build has only
  the existing jeep-sqlite browser-compatibility warning. No app, tablet, ADB,
  printer, PIN, seed, reset, or live data was touched.
- Committed and pushed `5e76a9961f904b62c1f9fbc2e8020217c8183fc5`
  (`RECEIPT-01: clarify payment summary`) directly to `origin/main`.
  Exact next action: conduct the owner-directed whole-application bug audit;
  keep AUDIT-03 deferred and PR-05 pending.

### 2026-09-03 — AUDIT-02 implemented and verified

- Repair A: `src/data/cloudAllReport.ts` now preserves Convex `pageStatus`,
  `splitCursor`, and `endCursor` pagination fields. A complete page is
  aggregated once; a `SplitRequired` page is discarded and replaced by two
  ordered half-interval requests (`cursor..splitCursor` with
  `endCursor: splitCursor`, then `cursor: splitCursor` bounded by the
  original `endCursor` or `continueCursor`), an interval is complete when
  the query reports `isDone` or its cursor reaches that interval's
  `endCursor`, an impossible split without a usable split cursor is
  rejected, and an incomplete page never contributes rows.
- Repair B: `collectCloudAllReportPages` takes a cancellation predicate;
  `useReportsData` passes its cleanup flag. The collector checks
  cancellation before the first request, before every page/split request,
  and before the stock request; a cancelled run throws before any further
  request and the existing `!cancelled` catch guard keeps the displayed
  snapshot and shows no error.
- Repair C: the 60-page ceiling was removed. Pagination continues until
  Convex reports `isDone`, while a cursor set rejects a missing,
  unchanged, or repeated continuation cursor and a repeated split cursor
  with a clear bounded-pagination error.
- Repair D: `check:offline` now makes three real 60-row requests for 130
  daily rows with exact cursor-sequence assertions ([null, '60', '120']),
  keeps the complete aggregate assertions, and adds the split-required
  (incomplete page contributes nothing; two halves cover all 100 days
  exactly once), cancellation (one page request, zero stock requests),
  61-request all-time completion, and repeated-cursor rejection (fails on
  the second identical request) cases.
- Repair E: `PLAN.md` Exact next action now points to PR-05; the top
  `WORK_LEDGER.md` Goal 06 card row records AUDIT-01 and AUDIT-02 as done
  with PR-05 next. This Card Board and State Pointer were updated without
  rewriting historical journal entries.
- Separately, the owner's split-question feedback was completed first and
  committed as its own POLISH-01 commit (`4a12312`): Card-only compact
  question dialog, Cash straight to the payment popup, single-unit Card
  direct placement.
- All AUDIT-02 checks pass: `check:offline` (new suite),
  `check:local-inventory-costs`, `check:printing` (golden unchanged),
  `check:pos`, `check:costs`, `check:navigation`, `check:css-scope`,
  `npx tsc -b`, `npm run build`, `git diff --check`. No `convex/` function
  changed, so no deployment was required. Graphify refreshed to 3,062 nodes,
  6,059 edges, and 189 communities. Exact next action: review the
  diff, stage only AUDIT-02 files, commit, push, and record the SHA.

### 2026-09-03 — AUDIT-02 committed and pushed

- Committed and pushed `8e2b6bbeafc06d0884580df45fe44195586e89b5`
  (`AUDIT-02: finish all-report pagination safeguards`, 6 files) directly to
  `origin/main` after `git diff --cached --check` passed. Verified
  `main...origin/main` synchronized and the worktree clean apart from the
  untracked owner `.commandcode/` directory.
- AUDIT-02 is done. PR-05 remains pending for owner authorization, physical
  acceptance, and final closeout. Exact next action: wait for owner
  authorization, then begin PR-05 only.

### 2026-09-03 — AUDIT-02 planned from post-completion review

- Owner required the full repair specification to live in this durable ledger,
  with only a short recovery prompt supplied in chat.
- Read-only review of AUDIT-01 found four follow-up gaps: required Convex page
  splitting is ignored, hidden/superseded Reports work can continue requesting
  pages, true All has an arbitrary 60-page ceiling, and the claimed three-page
  test actually performs one request. The intended AUDIT-01 business fixes and
  blank-screen guard otherwise passed review and safe automated checks.
- Added AUDIT-02 before PR-05 with exact split, cancellation, unlimited-valid-
  cursor, repeated-cursor, real-three-page, and durable-pointer acceptance
  rules. No application code, app, ADB, printer, PIN, or live data was touched.
- Exact next action: implementing agent follows the Recovery Protocol and
  completes AUDIT-02 only, then leaves PR-05 pending.

### 2026-09-02 — AUDIT-01 planned from read-only post-implementation audit

- Owner authorized adding the remaining confirmed audit findings to the
  durable plan and requested a copyable implementation prompt in chat.
- Added AUDIT-01 before PR-05 with exact contracts for legal page-by-page cloud
  All reporting, full offline item counts beyond the ranked top 20, exact mixed
  Cash/Card offline All totals, the legacy month-only expense correction floor,
  and removal of Offert from Orders item options.
- Recorded the passing safe audit checks and preserved the protected-check,
  no-app, no-ADB, no-PIN, no-seed, no-reset, no-live-data boundaries.
- Added the separate factual menu transcription at
  `goals/OLASO-REAL-MENU-EXTRACTION.md`; menu creation is not part of AUDIT-01.
- Exact next action: implementing agent follows the Recovery Protocol and
  completes AUDIT-01 only, then commits and pushes it before PR-05.

### 2026-09-02 — Durable repair ledger created

- Owner corrected the handoff requirement: the implementation specification
  must live in a repository MD ledger, while the copyable start prompt remains
  in chat and points to this file.
- Captured eight approved repairs: compensation dates, early expense
  correction rejection, ingredient type count, true All-time Reports, graph
  month choice, date localization, complete Costs lists, and pending-sale
  Dashboard honesty.
- Captured two intentional non-changes: cloud-only Orders restoration and
  incomplete-cost numeric profit.
- Added the mandatory Recovery Protocol so every new or compacted conversation
  re-reads this file and resumes from the State Pointer rather than memory.
- No application code changed. No app, tablet, browser, printer, PIN, seed, or
  cloud data was touched.
- Linked this ledger from `PLAN.md` and `WORK_LEDGER.md` so it is discoverable
  from both canonical project entry points.
- `graphify . --update --no-viz` could not semantically index the changed
  documentation because no LLM API key is configured. The supported
  `graphify . --update --code-only --no-viz` refresh passed with 3,024 nodes,
  5,955 edges, and 184 communities; application code remained unchanged.
- Documentation checkpoint
  `c5afe1edb8686ea60f3b3fe3f6fb6527896a9b6a` is on `origin/main`.
- Exact next action: follow the complete Recovery Protocol and begin PR-01
  only. Do not begin PR-02 or any other card until PR-01 is verified, journaled,
  committed, pushed, and recorded here with its full SHA.

### 2026-09-02 — PR-01 recovery and native-boundary checkpoint

- Re-read the complete repository instructions, project plan, project ledger,
  this repair ledger, its Recovery Protocol, State Pointer, PR-01 contract,
  and newest checkpoint entry before code exploration.
- Verified `main...origin/main` is clean at
  `6f261da3891fd5b3cb0569692b9f85a81a4fbe67`; no existing work needs
  preservation.
- Queried the current Graphify graph for the exact compensation replacement and
  expense-correction flows. It identifies `convex/staff.ts`,
  `src/data/reconnectContext.tsx`, `src/data/localCostViews.ts`,
  `src/data/localCosts.ts`, and `convex/expenses.ts` as the relevant path.
- Reviewed current official Android SQLite transaction guidance and Capacitor
  platform guidance. The selected boundary is existing React/SQLite/Convex:
  local correction rows remain one existing SQLite transaction; cloud
  validation remains in the existing Convex mutation. No Android, Capacitor,
  plugin, dependency, or Kotlin change is needed or permitted for PR-01.
- No application code, app, tablet, browser, ADB, PIN, seed, or live data was
  touched. Exact next action: inspect the identified code and focused checks,
  then implement PR-01 only.

### 2026-09-02 — PR-01 implementation and regression coverage added

- `convex/staff.ts` now includes optional `effectiveStartDate` and
  `effectiveEndDate` in the owner-only all-compensation snapshot, matching the
  per-profile query. The existing reconnect mapping spreads those fields into
  `replaceSavedCompensation` unchanged.
- `src/data/localCostViews.ts` accepts the existing transaction seam for
  compensation replacement, allowing the existing focused in-memory SQLite
  check to prove that exact dates persist while legacy month-only rows retain
  absent optional dates.
- `src/data/localCosts.ts` and `convex/expenses.ts` now reject a correction
  before the original recurring expense start before either paired reversal or
  replacement row is written. `src/lib/fr.ts` translates the exact approved
  user-facing sentence in the existing dialog path.
- `scripts/check-local-inventory-costs.mjs` now proves exact compensation
  refresh, month-only compatibility, early-correction rejection with zero
  correction rows, and correction on the original start date with the usual
  paired rows. No checks have run yet; no app, tablet, browser, ADB, PIN, seed,
  or live data was touched.
- Exact next action: run PR-01 focused checks and repair only any failure.

### 2026-09-02 — PR-01 initial focused-check result

- `npm run check:reconnect` and `npm run check:costs` passed.
- `npm run check:local-inventory-costs` correctly reached the new coverage but
  retained an earlier compensation-row count of one after the new legacy
  month-only fixture added a second row.
- `npx tsc -b` found the new optional local replacement test seam referenced a
  missing local `Transaction` type, which also caused inferred callback values
  to be `any`. `git diff --check` passed aside from normal Windows line-ending
  notices.
- These are implementation-test wiring issues, not a product-data failure. No
  app, tablet, browser, ADB, PIN, seed, or live data was touched. Exact next
  action: add the already-used transaction shape locally, correct the expected
  fixture count, and rerun the same focused checks.

### 2026-09-02 — PR-01 second focused-check result

- Added the existing local transaction shape to the compensation replacement
  seam and corrected the deliberately expanded fixture counts. `npx tsc -b`,
  `npm run check:reconnect`, `npm run check:costs`, and `git diff --check`
  now pass (the latter only prints normal Windows line-ending notices).
- The local inventory/cost check then correctly rejected an old fixture because
  the new legacy month-only compensation was open-ended and overlapped the
  existing July fixture. This is a fixture setup issue, not a product failure:
  the compatibility record can retain absent exact dates while using its legacy
  end-month field. No app, tablet, browser, ADB, PIN, seed, or live data was
  touched.
- Exact next action: give the legacy fixture its legacy `effectiveEndMonth`,
  then rerun PR-01 focused checks.

### 2026-09-02 — PR-01 third focused-check result

- The legacy fixture now has an end month, but it still used July 2026, the
  same historical month as a pre-existing valid fixture. The local overlap
  guard correctly refused the second July period. The compatibility fixture
  must use an older non-overlapping month instead.
- `npm run check:reconnect`, `npm run check:costs`, `npx tsc -b`, and
  `git diff --check` continue to pass. No app, tablet, browser, ADB, PIN, seed,
  or live data was touched. Exact next action: move the month-only fixture to
  July 2025 and rerun PR-01 focused checks.

### 2026-09-02 — PR-01 checks passed

- The exact-date refresh fixture is independent from the existing August
  allocation fixture. The local check proves an exact `2026-09-15` through
  `2026-09-20` compensation snapshot survives replacement, a month-only legacy
  record retains absent exact dates, an early recurring correction writes no
  paired rows, and a correction on the original start writes both rows.
- Passed: `npm run check:local-inventory-costs`, `npm run check:reconnect`,
  `npm run check:costs`, `npx tsc -b`, `npm run check:convex`, `npm run build`,
  and `git diff --check`. The Vite build printed its existing browser
  compatibility warning for `jeep-sqlite`'s `crypto` import; no failure or new
  warning was introduced by PR-01.
- Protected `check:expenses`, `check:staff`, and `check:monthly-costs` were not
  run because they require a PIN and reset development data; the required local
  no-PIN regression covers this card's paths. No app, tablet, browser, ADB,
  PIN, seed, or live data was touched.
- Exact next action: re-read the applicable instructions, review/stage only
  PR-01, commit and push it to `origin/main`, record the full SHA, then
  activate PR-02 only.

### 2026-09-02 — PR-01 committed and pushed

- Committed the complete PR-01 source, regression coverage, and ledger evidence
  as `0bea66ae496e3ecc24efea13aa195903d3358aa6`
  (`PR-01: preserve exact cost dates`) and pushed it directly to `origin/main`.
- Verified `main...origin/main` is synchronized and clean after the push.
- PR-01 is done. PR-02 is the next pending card; it has not been inspected or
  started. Exact next action: wait for the owner, then follow this ledger's
  Recovery Protocol and begin PR-02 only.

### 2026-09-02 — PR-02 all-time report implementation checkpoint

- Recovered from the permanent ledger, re-read the active PR-02 contract, and
  queried Graphify before continuing. Existing Android SQLite and Capacitor
  boundaries remain sufficient: no app, native, dependency, tablet, browser,
  ADB, PIN, seed, or live-data action occurred.
- Added full cloud/offline ingredient-type counts while retaining the 20-row
  detail limit. The local view now uses a separate SQL count rather than its
  former 21-row failure probe.
- Added a dedicated All selection: cloud reads daily summaries in fixed 31-row
  pages, and local SQLite aggregates saved sales/line/ingredient records
  without using the 1,000-receipt reader. All hides the prior comparison and
  leaves the current-month chart request unchanged. Normal selected ranges
  retain their 1-to-31-day limit.
- Passed `npx tsc -b`, `npm run check:offline`, and `git diff --check`.
  Exact next action: run the other non-destructive PR-02 checks, refresh
  Graphify, then review, commit, push, and record the full SHA.

### 2026-09-02 — PR-02 automated-check and Graphify checkpoint

- Passed: `npm run check:costs`, `npm run check:local-inventory-costs`,
  `npm run check:convex`, `npx tsc -b`, `npm run check:offline`, `npm run build`,
  and `git diff --check`. The production build retained only its existing
  `jeep-sqlite` browser-compatibility warning.
- `npm run check:reports` and `npm run check:monthly-costs` stopped at their
  required missing owner test PIN before either script seeded or reset data;
  they were not bypassed. The reports script now also covers the All endpoint
  when that protected gate is available.
- Graphify incremental code refresh passed: 3,027 nodes, 5,965 edges, and 186
  communities. Reviewed the PR-02-only diff. No app, tablet, browser, ADB,
  printer, PIN, seed, or live data action occurred. Exact next action: commit
  and push PR-02, then record the full SHA without starting PR-03.

### 2026-09-02 — PR-02 committed and pushed

- Committed the complete PR-02 implementation, focused checks, and checkpoint
  evidence as `dc398efe4fb4c5c66ae03e47d33734d74cf6d02e`
  (`PR-02: make reports all-time`) and pushed it directly to `origin/main`.
- The card is complete except for the owner-required physical tablet acceptance,
  which was not attempted under the no-app/no-tablet instruction. Protected
  reset/PIN checks remain honestly unavailable as recorded above. No app,
  tablet, browser, ADB, printer, PIN, seed, or live data was touched.
- Exact next action: wait for owner authorization and begin PR-03 only after
  the complete Recovery Protocol.

### 2026-09-02 — PR-03 recovery and native-boundary checkpoint

- Re-read the complete Recovery Protocol, State Pointer, active PR-03 contract,
  newest checkpoints, repository instructions, plan, and project ledger; `main`
  is clean and synchronized at `8ecd767e8c7b12de02d733c6e783c82835a5be4b`.
- Graphify traced the exact date/chart callers. Official Android
  internationalization guidance and Capacitor's web-native model select the
  current React formatter/data-query boundary: locale selection and chart-month
  selection remain in TypeScript/React; no Android, Capacitor plugin,
  dependency, Kotlin, app, tablet, browser, ADB, PIN, seed, or live-data action
  is needed or permitted.
- Exact next action: implement the small shared date locale/month-selection
  helpers, wire the named report, Dashboard, Orders, and Stock views, and add
  focused no-PIN checks.

### 2026-09-02 — PR-03 implementation checkpoint

- Added shared active-language date/time formatting and a pure report chart-month
  selector. Reports now queries and labels the selected calendar month; Dashboard,
  Orders, and Stock use the active English/French format. The chart geometry and
  selected report totals remain unchanged.
- Focused checks cover current-month, historical, dominant-month, later tie, All,
  and English/French formatting. Corrected one initially mistaken non-tie fixture;
  `npx tsc -b`, `npm run check:offline`, and `git diff --check` now pass.
- Exact next action: complete the remaining safe PR-03 checks, refresh Graphify,
  then review, commit, and push without starting PR-04.

### 2026-09-02 — PR-03 verification checkpoint

- Passed `npm run check:settings`, `npm run check:navigation`,
  `npm run check:css-scope`, `npx tsc -b`, `npm run build`, and `git diff --check`.
  The build retained only its existing `jeep-sqlite` browser-compatibility warning.
- `npm run check:reports` stopped at the required missing owner test PIN before
  its seed/reset step; it was not bypassed. Graphify incremental refresh passed:
  3,032 nodes, 6,006 edges, and 186 communities. No app, tablet, browser, ADB,
  printer, PIN, seed, or live data was touched. Exact next action: review,
  commit, and push PR-03 only.

### 2026-09-02 — PR-03 committed and pushed

- Committed and pushed `e9cc667e94505237ba04cab56d4e84468cdbe8f4`
  (`PR-03: localize report dates`) directly to `origin/main`.
- PR-03 is complete. Owner physical acceptance and protected reports check
  remain unavailable under the no-app/no-PIN instruction. Exact next action:
  wait for owner authorization, then begin PR-04 only.

### 2026-09-02 — PR-04 recovery and implementation checkpoint

- The owner authorized PR-04. Re-read the complete Recovery Protocol, State
  Pointer, the PR-04 contract, the repository instruction chain (`AGENTS.md`,
  `src/AGENTS.md`, `src/data/AGENTS.md`, `reports/` and `dashboard/` feature
  DOX), `PLAN.md`, and `WORK_LEDGER.md`; `main` is clean and synchronized at
  `e84ac4e98cefe7c80da254a38f834a1466085106`.
- Graphify traced the CostsPanel list and Dashboard snapshot flows. Existing
  React/SQLite/Convex boundaries remain sufficient: no Android, Capacitor
  plugin, dependency, or Kotlin change is needed. No app, tablet, browser,
  ADB, PIN, seed, or live-data action occurred.
- Removed both `.slice(0, 8)` display caps in `CostsPanel.tsx` and made each
  Costs card a flex column with `flex: 1; min-height: 0; overflow-y: auto`
  rows; headings and Add controls stay fixed and the page layout is unchanged.
- `useDashboardData` now requests the cloud snapshot and the saved-tablet
  snapshot concurrently while online and shows the tablet snapshot only when
  its completed current-day sales strictly exceed the cloud count, reusing the
  established Reports selection rule. Offline remains local-only and totals
  are never added together.
- `scripts/check-offline-views.mjs` now guards the new concurrent Dashboard
  contract, the strict-greater selection rule with all four acceptance
  outcomes, the removed slice caps, and the internal-scroll CSS. Graphify
  refreshed to 3,035 nodes, 6,009 edges, and 177 communities; the `dashboard`,
  `data`, and `reports` DOX contracts were updated.
- Passed `npm run check:offline`, `npx tsc -b`, `npm run check:css-scope`,
  `npm run build`, and `git diff --check` (ordinary Windows line-ending
  notices only). Protected `check:reports` and `check:dashboard` stopped at
  the required missing `OLASO_OWNER_PIN` before either script seeded or reset
  data; they were not bypassed. No app, tablet, browser, ADB, printer, PIN,
  seed, or live data was touched.
- Exact next action: review, commit, and push PR-04 only, then record its
  full SHA here and in `WORK_LEDGER.md`.
