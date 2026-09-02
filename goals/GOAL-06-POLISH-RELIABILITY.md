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
| PR-05 | Full regression, documentation, clean main push, and owner handoff | pending |

## State Pointer

**Active card:** none — wait for owner before `PR-05`

**Active status:** PR-04 complete and pushed

**Last completed step:** removed the Costs list caps and added honest pending-sale Dashboard selection

**Current facts:**

- `PR-03` is `e9cc667e94505237ba04cab56d4e84468cdbe8f4` on `origin/main`.
- PR-04 removed both `.slice(0, 8)` limits in `CostsPanel.tsx` and made each
  Costs card a flex column whose rows scroll internally (`min-height: 0`,
  `overflow-y: auto`) without changing the page layout.
- `useDashboardData` now requests the cloud Dashboard and the saved-tablet
  Dashboard concurrently when online and shows the tablet snapshot only when
  its completed current-day sales strictly exceed the cloud count; offline
  remains local-only; totals are never added together.
- Graphify was refreshed after the structural changes (3,035 nodes,
  6,009 edges, 177 communities). The `dashboard` and `data`/`reports`
  feature DOX contracts were updated to match the approved behavior.
- Protected `check:reports` and `check:dashboard` stopped at the required
  missing `OLASO_OWNER_PIN` before either script seeded or reset data; they
  were not bypassed.

**Exact next action:** wait for owner authorization; then follow Recovery
Protocol and begin PR-05 only.

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

Complete, journal, commit, push, and record PR-04 before activating PR-05.

## PR-05 — Regression and owner handoff

**Status:** pending

### Objective

Prove repository integrity, document honest limitations, leave `main` clean and
synchronized, and hand physical acceptance to the owner.

### Required review

1. Re-read the full instruction chain and this ledger.
2. Confirm the eight approved repairs are present.
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
