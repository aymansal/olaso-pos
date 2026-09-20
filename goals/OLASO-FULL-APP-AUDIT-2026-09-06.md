# Olaso full-app audit — 6 September 2026

## Recovery and scope

Historical audit only. Its repair authorization and sequence are retired;
findings have not been reverified by the documentation reset. Read root/applicable
AGENTS.md and SAAS_TRANSITION.md before any owner-selected investigation.
Historical context from 6 September: the owner initially requested only the
Add staff Role field height correction, then authorized fixing all findings
and the Products investigation, followed by fresh independent audit agents.
Repairs were underway at the time;
the original findings below remain the baseline until verified individually.
Preserve production data and existing business decisions. Do not create real
sales, change live PINs, reset databases, or alter stock to reproduce findings.
Use isolated fixtures for accounting, authentication races, and payment cases.
Update each finding with fix, regression evidence, tablet evidence, commit and
push status when implementation is authorized. Do not mark client readiness
complete while daily-operation bugs remain open.

Three parallel audits covered sales/orders/printing, reports/dashboard/costs,
and identity/settings/stock. Root reviewed the reported paths, Products loading,
and staff field geometry. This is not a guarantee that every bug is found.
P1 means high operational risk; P2 means a narrower or conditional failure.
“Isolated reproduction” means real application functions with synthetic inputs
or a fake database adapter, not a production-tablet transaction. “Source trace”
means the code path establishes the problem but its timing has not been
reproduced on the live tablet.

## Priority board

Repair checkpoint (supersedes original Open labels below): AUD-01–14 and
INVEST-01 have source repairs and focused regression checks. Integration/tablet
acceptance and push are in progress. The original rows remain the audit baseline;
do not interpret implementation as full client-release acceptance.

Fresh-review additions:

- AUD-15: finance synchronization's separate100-entry history ceiling. Repaired
  with role-protected cloud pages and complete local replacement; interrupted
  pagination never applies a partial snapshot.121 entries tested.
- AUD-16: a menu price/size change after one split payer pays can make remaining
  payments inconsistent with checkout, or a missing size can crash rendering.
  REPAIRED — owner approved original agreed prices. Private SQLite-derived quote
  survives lock, display receives a separate copy, final commit uses fresh stock
  valuations. Cloud accepts an exact live or server-archived configuration, not
  UI price overrides. Auth, bad totals and forged fingerprints still reject.
  Tests include price edit, deleted size/product/ingredient, replaced choices,
  retry idempotence and ID promotion before/after replacement. The final review
  caught the mapping-before-replacement stock-row mismatch; deduction now targets
  the actual local row (80→40 proven), not its not-yet-present cloud ID.
- AUD-17: stale staff-directory response could roll back identity revision and
  remove freshly updated offline access. Repaired with monotonic identity writes,
  credential-queue coordination for sign-in/directory/snapshot cleanup, and
  rejection of an older sign-in response before protected overwrite. Isolated
  old/equal/new/missing-profile and queued-interleaving regressions pass.
- AUD-18: paged local cost reads could interleave with writes, duplicating one
  expense and omitting a newly inserted expense. Repaired by holding the existing
  serialization queue over the whole snapshot. Actual101→102-row interleaving
  regression now yields a coherent total rather than10200 instead of10100/11000.
- AUD-19: long finance pagination could continue after background/offline/session
  change. Repaired with current-context checks per page and before replacement,
  including after waiting for its database transaction. No partial cache applied.

Independent reviewers: fresh_sales_review, fresh_identity_review and
fresh_reports_review. They did not author the first repair pass. The latter two
then fixed their demonstrated additional findings. Nested pagination splitting
was investigated but did not demonstrate an accounting failure; not counted.

Physical isolated SQLite evidence: tmp/native-audit-result.json. Actual tablet
database engine passed negative-stock receiving,10→30 recount with exact value,
1,002 monthly sales,121 expenses and a single-day owner overview. Test database
olaso_audit_20260906 was created separately and deleted with absence verified;
no production business writes. The initial harness invocation had a JavaScript
syntax-wrapper error before execution; corrected and rerun successfully.

Checks now include check:audit (stock/staff + reports) and check:local includes
the operational snapshot read/write regression. check:sales and check:orders
local portions passed; protected backend fixtures remain blocked on an absent
disposable restore PIN. Never substitute the live owner PIN. Current production
build/install and screen verification remain to be recorded below.

### Final repair verification

AUD-01–19 and the proven INVEST-01 cache-read race are repaired. Final production
build/native checks, endpoint validation and cloud deployment passed; APK installed
over existing tablet data. No real sale, stock, PIN or wage test mutations.
Original 5-minute inactivity lock restored the recorded10MAD card payment and
one remaining10MAD item; screenshot tmp/olaso-split-restored.png. Restored10-minute
preference. Synthetic draft cleared; production orders remain unchanged.
Final APK cash quote opening/cancellation and split quote opening pass. Dashboard,
Orders, Products, Stock, Reports and Settings load; final-session console empty.
Reports layouts inspected at1340x800; original current-month graph policy intact.
Graphify code graph refreshed (3504nodes), docs read separately. Focused
check:audit/pos/printing/local/css and prior identity/settings/reconnect checks
pass. Protected seeded-backend fixtures and physical paper acceptance are NOT
claimed. The intermittent startup delay has no quantified performance guarantee;
the proven intermediate-empty cache race has its own deterministic regression.
No further audit expansion, per owner's remaining quota request. Commit/push
evidence remains in the retired ledger in Git history. The table below is the ORIGINAL baseline,
not the current repair status.

| ID | Priority | Finding | Original status/evidence |
|---|---|---|---|
| AUD-01 | P1 | Lock loses already collected split-payment progress | Open; source trace |
| AUD-02 | P1 | PIN change can succeed against an obsolete pending profile | Open; source race trace |
| AUD-03 | P1 | Negative stock blocks receiving and physical recount | Open; isolated reproduction |
| AUD-04 | P1 | Costs and owner daily printing fail above 1,000 monthly sales | Open; isolated reproduction |
| AUD-05 | P1 | Missing operating costs become zero and apparently complete profit | Open; isolated reproduction |
| AUD-06 | P2 | Upward stock recount fails above twice existing quantity | Open; isolated reproduction |
| AUD-07 | P2 | Pending cancellation temporarily returns in cloud-backed totals | Open; selector reproduction |
| AUD-08 | P2 | Offline finite-period Reports lose incomplete-cost warning | Open; isolated reproduction |
| AUD-09 | P2 | Stock Usage list silently hides ingredients after ten | Open; source trace |
| AUD-10 | P2 | Manual Sync can claim success despite failed management writes | Open; source trace |
| AUD-11 | P2 | French receipt history loses language on reprint | Open; parser reproduction |
| AUD-12 | P2 | Valid negative-price choice breaks an Orders page | Open; parser reproduction |
| AUD-13 | P2 | Printed negative fractional profit has malformed money | Open; formatter reproduction |
| AUD-14 | P2 | More than twenty split tenders rejected only at final save | Open; source trace |
| UI-01 | P2 | Add staff Role field shorter than Name | Fixed; physical 36→48px |
| INVEST-01 | — | Intermittent Products first-open delay / false empty state | Owner report; exact symptom not reproduced |

## Findings and bounded repair directions

### AUD-01 — Split-payment progress disappears on lock

- `src/features/pos/components/PaymentDialog/PaymentDialog.tsx:110–112,149–155`
  owns remaining quantities and recorded tenders in dialog-local state.
  `src/App.tsx:194–205,307–310` unmounts POS on lock, retaining only the original
  App-owned cart, not that payment progress.
- After one friend pays, an inactivity lock can destroy the record of their
  payment. Unlock presents the original full cart, risking charging again or
  losing cash/card attribution.
- Repair: retain the unfinished payment session at an appropriate existing
  session owner, with explicit lifecycle and staff-switch rules. Do not bypass
  authentication or disable auto-lock. Process-death durability is a separate
  decision; do not claim it from an in-memory fix.
- Regression: record an initial cash/card tender in an isolated draft, lock and
  unlock, verify remaining quantities and paid amount survive once, then verify
  final tender totals. Use a non-production fixture for any committed sale.

### AUD-02 — PIN change versus offline-profile provisioning race

- `src/features/settings/components/StaffAccessPanel/StaffAccessPanel.tsx:37`
  retains the selected profile object. `src/data/useStaffManagement.ts:90–126`
  branches on that object's `pending` and `id` when saving a new PIN.
- Open Change PIN for a pending offline-created profile, then let reconnect
  provision/promote it while the dialog remains open. Save uses the obsolete
  pending identity, skips the cloud update, and can report “PIN changed” while
  the promoted profile still uses its old credential.
- Related ordering to inspect: `src/data/staffSync.ts:67` and
  `src/data/identitySession.ts:238`, credential upload versus protected verifier
  copying during promotion. No live profile/PIN was changed to test this race.
- Repair: resolve fresh identity/mapping and coordinate PIN save with provisioning
  so exactly one authoritative credential revision wins. Disabling only the
  dialog button does not resolve a worker already running.
- Regression: deterministic paused provisioning + PIN change, online/offline new
  PIN accepted and old PIN rejected, safe retry, no raw PIN in ordinary storage.

### AUD-03 — Negative stock cannot be repaired through normal operations

- `src/data/localInventory.ts:81` rejects negative effective quantity in valuation;
  receiving calls it around line163 and recount around line586. Sales can
  legitimately make stock negative (`src/data/localSales.ts:606`).
- Isolated actual-function calls with on-hand −10 and receive100 or count100
  throw “Stock quantity is invalid.” This matters with zero starting balances.
- Repair the shared valuation/recovery path, preserving unknown-cost semantics;
  do not invent costs or prevent the approved sale merely to avoid negative stock.
- Regression: negative→less negative, zero and positive with receiving/recount,
  known and unknown costs, outbox/cloud parity and historical cost preservation.

### AUD-04 — Monthly sales ceiling disables costs and daily owner printing

- `src/data/localCostViews.ts:114–123` reads monthly sales with `LIMIT 1001` and
  throws above1,000. `src/data/dailyOwnerReport.ts:136` calls this monthly reader
  even for one day's owner report.
- Isolated reader reproduced “Saved profitability data exceeds the local report
  limit.” Roughly34 sales/day reaches this ceiling in a month.
- Repair: aggregate required sales facts in SQL instead of loading every sale
  into a bounded configuration reader. Preserve exact cents and date semantics.
  Inspect the adjacent100 staff/compensation/expense ceilings separately; do not
  silently drop older records or merely increase a finite limit.
- Regression: month with1,001+ sales, selected single-day report and Costs page
  both work with correct totals and bounded result size.

### AUD-05 — Unavailable costs silently become zero

- `src/features/reports/reportProfit.ts:16–24` substitutes empty expense/wage
  lists for missing costs. `ReportSummaryPanel.tsx:31–38,185–191,249–264` does
  not gate displayed operating profit on the cost reader's loading/error state.
- Actual helper with100MAD revenue,20MAD ingredient cost and unavailable costs
  returns zero operating expenses,80MAD profit, `complete:true`.
- Repair: retain usable sales/gross-profit information but distinguish unloaded
  or failed operating costs from a successful empty list. Operating profit must
  not imply completeness while its required cost source is unavailable.
- Regression: loading, failed, successful-empty and successful-nonempty costs.
  Keep the owner's separate approved approximate ingredient-profit behavior.

### AUD-06 — Large upward stock recount fails

- `src/data/localInventory.ts:599` allocates from existing stock value using the
  added quantity; `convex/inventory.ts:868` repeats this bounded allocation.
-10 units valued at100centimes, recounted as30, throws “Allocated quantity cannot
  exceed the available quantity.” The20-unit increase exceeds the10-unit source.
- Repair: value an increase from the applicable unit cost rather than treating
  it as taking a share out of existing quantity; keep exact rounding and parity.
- Regression: increases below/equal/above original stock and zero-stock rules.

### AUD-07 — Pending cancellations lose to stale cloud totals

- `src/data/useReportsData.ts:21–26` and `useDashboardData.ts:44–47` prefer local
  only when its completed-order count is greater. A cancellation reduces count.
  `src/data/useOrdersData.ts:249–259` refreshes before asynchronous sync finishes.
- Selector reproduction: local1order/10MAD after cancellation versus stale
  cloud2orders/20MAD selects the stale20MAD snapshot.
- Repair: account for pending local corrections, not just added order counts.
  Do not unconditionally prefer a potentially partial local history over cloud
  records from other devices. Verify Dashboard and Reports together.
- Regression: cancellation pending/failed/acknowledged plus another-device sale.

### AUD-08 — Offline Reports drop incomplete ingredient-cost status

- `src/data/offlineViews.ts:56–60` omits `cost_status`; around251 the finite-period
  aggregate hardcodes `incompleteSaleCount:0`. All-time path handles it separately.
- Isolated aggregation of an incomplete sale returns zero incomplete sales,
  suppressing the warning in `reportProfit.ts:24` / ReportSummaryPanel.
- Repair: propagate stored cost completeness through the same date-range totals.
- Regression: mixed complete/incomplete sales for finite and All periods. Still
  display approximate profit as approved, with an honest warning.

### AUD-09 — Stock Usage silently truncates the visible list

- `src/features/reports/components/ReportSummaryPanel/ReportSummaryPanel.tsx:46`
  slices to10; lines126–147 render it without a Top10 label or a way to see more.
  Its `.full` style already provides scrolling.
- Eleven used ingredients can produce a total of11 while the eleventh cannot be
  inspected. Current data reader also has a20-entry limit; removing only the UI
  slice is not proof of complete reporting beyond20.
- Repair: define and implement honest complete-list behavior within the existing
  scrolling area; inspect data cap rather than changing totals to hide entries.
- Regression:11 and21 used ingredients, list and headline agree, no layout shift.

### AUD-10 — Manual Sync success ignores management failures

- `src/data/useSettingsData.ts:82` checks waiting sales, not the reconnect
  result's failed/refresh status. `src/data/reconnectContext.tsx:438,550–567,593`
  collects failures/skips refresh for pending management while general error clears.
- A failed product/ingredient operation with no waiting sale can therefore show
  an up-to-date message. Management successes are also called saved orders.
- Repair: report all operation outcomes honestly; separate waiting orders from
  other unsynchronized changes without exposing technical outbox details.
- Regression: failed/pending management only, mixed sales/management, offline,
  successful refresh and partial failure. No production fault injection performed.

### AUD-11 — French history receipt reprints in English

- `src/data/orderHistory.ts:171–226` reconstructs saved receipts without
  `receiptLanguage`; cloud mapping in `src/data/useOrdersData.ts:79–108` also
  omits it. Reprint at232–235 reaches `src/printing/receiptModel.ts:208` defaulten.
- Isolated parser confirmed a saved French receipt loses its language. This
  affects service wording and the newly approved footer as well as other copy.
- Repair: preserve/validate saved language across both mappings. Define legacy
  missing-language fallback consistently with receipt policy; do not guess.
- Regression: saved French/English receipts through local and cloud histories,
  byte encoding and approved two-line footer; owner verifies actual paper.

### AUD-12 — A valid negative modifier makes Orders fail

- Signed choice prices are allowed by `src/data/localProductConfiguration.ts:226`,
  `convex/productConfiguration.ts:164`, and ProductChoiceSectionDialog435–443.
  `src/data/orderHistory.ts:209–212` instead parses modifier price with nonnegative
  `money()`. Page mapping373–375 then fails as a whole.
- Isolated parser with a −1MAD choice on an otherwise positive-price sale throws
  “The saved receipt modifier price is invalid.” Affected order can break its
  entire current Orders page, not just the receipt button.
- Repair: validate modifier deltas as signed integer cents within existing bounds;
  retain nonnegative validation for fields that truly require it.
- Regression: positive/zero/negative modifiers and invalid/noninteger inputs,
  history load and reprint; do not remove legitimate discount choices.

### AUD-13 — Printed negative fractional profit is malformed

- `src/printing/receiptEncoder.ts:37–38` combines floor division with signed
  remainder. `src/printing/dailyReportEncoder.ts:132,135` uses it for profit.
- Actual formatter: −50centimes→`-1.-50`; −1250→`-13.-50`, rather than `-0.50`
  and `-12.50`. Stored calculations are not changed by this formatting bug.
- Repair shared formatting with an explicit sign and absolute magnitude.
- Regression: negative fractional/whole values, zero and positive money, printed
  alignment and byte snapshots. No need for a new formatting dependency.

### AUD-14 — Split payment limit is enforced after money may be collected

- `PaymentDialog.tsx:149–155` permits unbounded recorded partial tenders;
  `src/data/localSales.ts:130–133` rejects more than20 only at final persistence.
- With21 individual payments,20 can already have been taken before final save
  fails. No safe user-facing resolution is offered for the collected payments.
- Repair: respect the shared limit before accepting an impossible next split,
  retain recorded tenders, and explain the remaining payment requirement. Do not
  weaken checkout validation or silently discard/merge payment evidence.
- Regression: boundaries19/20/21 in isolated split workflow; no real payments.

## Explicit UI correction

### UI-01 — Add staff Role height

Measured on the physical1340×800 tablet: Name47.99px, Role36.00px. The shared
MenuSelect compact selector outweighed the form's intended48px rule. Scoped
the existing selector to `.form .roleSelect>button` in
`src/features/settings/components/StaffDialog/StaffDialog.module.css`.
Production-endpoint APK built and installed over existing data; Name and Role
both measure47.99px after installation. No staff record was submitted.
No reusable component contract or native behavior changed; no new dependency.

Official pre-change references: Android accessibility touch-target guidance
<https://developer.android.com/guide/topics/ui/accessibility/apps> and Capacitor
<https://capacitorjs.com/docs/>. This is WebView form geometry: existing CSS is
the correct boundary, no Kotlin/plugin change. Existing visual design retained.

## Products startup investigation — not closed

The owner reports occasional delayed first load followed by products, with a
false empty table beforehand. `useProductManagement` loads the full operational
cache; `loadOperationalCache` reads18 related collections, including image/config
data. ProductList does have a loading guard before its empty message. This does
not prove every refresh/race is safe or explain the reported delay.

A fresh installed-app first visit and a subsequent read showed the current79
products. Exact false-empty symptom not reproduced. Initial sampling based on
“0 products” and “Espresso” was invalid: Uncategorized legitimately has0products,
and the current sorted page contains Ube/Hojicha rather than Espresso. Retained
React Activity screens also mean the first `<main>` can be hidden. Do not use
those samples as timing evidence or call this fixed.

Next diagnostic: sample the visible Products table's loading/empty/row state
and local read duration across cold launch, unlock, and reconnect. Preserve
current filters/data; do not clear cache or mask empty states with arbitrary
delays. Only select a fix after establishing the failing sequence.

## Verification and exclusions

- Safe existing checks passed during this audit: settings, local-staff,
  css-scope, costs, offline, local-inventory-costs. Production build, Android
  package verification and native JVM checks passed for UI-01.
- Isolated reproductions protect production records but do not replace eventual
  physical acceptance of financial/identity fixes. No audit sales, stock changes,
  profile creation/deletion, live PIN changes or paper prints were performed.
- Production packaging redeployed unchanged backend through the standard script;
  application source change is only the staff CSS selector. Known toolchain
  warnings remain (WebView SQLite browser externalization/Gradle metadata).
- Intentionally month-anchored report graphs are not a new bug. Known missing
  Plus recipes and workbook quantities are in OLASO-MENU-RECIPE-AUDIT.md. Existing
  matching-local-order cloud-download restriction is not presented as a newly
  discovered defect. No promise of complete new-device historical recovery.
- Next action: owner approval for a bounded repair sequence starting with P1
  issues; keep this document as the audit source of truth and record evidence
  per finding rather than relying on conversation summaries.
