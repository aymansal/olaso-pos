# Goal 06 Sale-Sync Ledger

**Status:** SYNC-01 through SYNC-05 done. Owner Manual Sync 29 Aug landed
0826-0001…0017 and the chained category delete; 0826-0018 auto-synced.
SYNC-06 through SYNC-09 remain latent; do not treat the drained queue as
proof they are gone.

**Purpose:** restore retry-safe upload of tablet sales into Convex, then fix
the outbox/reconnect defects that keep later tickets, Settings copy, and
online Dashboard/Reports dishonest even after `sales.accept` can succeed.

This is the working ledger for this topic. `PLAN.md` owns card order.
`WORK_LEDGER.md` owns status and the running journal. `PRODUCT.md` owns
operator behaviour. `ARCHITECTURE.md` owns persistence and sync boundaries.
Do not treat this file as a changelog of POLISH-01 UI work.

## Why this pauses POLISH-01

`PLAN.md` mandatory bug rule: a discovered daily-operation / synchronization
bug pauses the current card and overrides ordinary order. POLISH-01 stays
pending. HARD-08 cannot accept the application while tablet sales never land
in Convex.

One goal, one card at a time. SYNC-06 is next. Do not start SYNC-07 through
SYNC-09 until SYNC-06 is pushed.

## Diagnosis already done (do not repeat as a card)

Owner report: yesterday’s and today’s POS orders stay on Needs sync; Settings
shows a waiting count; Dashboard pulse / Reports look empty while the tablet
has tickets.

### How we investigated

1. Read the reconnect worker (`src/data/reconnectContext.tsx`), outbox
   (`src/data/outbox.ts`), local sale commit (`src/data/localSales.ts`),
   Convex `sales.accept` (`convex/sales.ts`), and `convex/schema.ts`
   `receiptLine`.
2. Read development Convex `sales` with the Convex data tool: **13 rows only**,
   all seed tickets `dev-sale-0001` … `dev-sale-0013`, business dates
   2026-07-22 … 2026-07-28. No tablet POS sale exists in cloud.
3. Read Convex failure logs for `sales:accept` from 27–28 Aug 2026: every
   call died on schema insert, extra field `choiceValueIds` on
   `receiptSnapshot.lines[0]`. Same failure for Latte (with choices), and for
   Cappuccino / Mocha / Matcha / Croissant with `choiceValueIds: []`.
4. First ADB attempt that turn showed `R8YX91AKWXJ unauthorized`. Next turn
   the same tablet was `device` / SM-X115. Pulled
   `/data/data/com.olaso.pos/databases/olaso_posSQLite.db` via
   `adb exec-out run-as com.olaso.pos cat …` into
   `D:\Olaso\tmp\tablet-db\olaso_posSQLite.db` (536 576 bytes, valid
   `SQLite format 3`). Queried with platform-tools `sqlite3`.

### Live tablet queue (29 Aug 2026 ~12:00 local)

| Layer | Fact |
| --- | --- |
| Outbox | **18** rows. Settings waiting count is `COUNT(*) FROM outbox`. |
| Sales 0826-0001 … 0826-0015 | `sale-completed` **failed**, 2 attempts, last error `Sale synchronization failed.`, last `available_at` 28 Aug 20:10. No `cloud_sale_id`. |
| Category delete | `management.category.delete` **pending**, 0 attempts, created 28 Aug 22:01, depends on failed sale 0826-0014. |
| Today 0826-0016, 0826-0017 | `sale-completed` **pending**, 0 attempts. Both depend on that category delete. **Never called** `sales.accept`. |
| `sync_state.last_success_at` | 28 Aug 22:01:27 (cache/other work, not a sale). `last_error` empty. |

Checkout is fine: tickets and receipts exist in SQLite. The worker did send
the 15 failed sales; Convex rejected the insert. Today’s two are stuck behind
the category-delete dependency (SYNC-02) after the parent sale failed on
SYNC-01.

## Non-negotiable rules

- Do not wipe, reseed, or uninstall the café tablet to make the queue look
  empty. Preserve 0826-0001 … 0826-0017 and the pending category delete until
  they synchronize or a recorded recovery says otherwise.
- Do not mark a sale synced because SQLite has it. Cloud `sales` must contain
  the row with a matching `deviceId` + `localSaleId`.
- Do not treat Settings “N waiting” as N unsynced tickets until SYNC-07.
- Do not skip sales forever because a later catalog/inventory op failed.
- Do not add a second outbox, WorkManager, or a cloud write from a React
  screen. Fix `sales.accept` / schema and the existing reconnect worker.
- Every implementation card installs the current APK on SM-X115 (`R8YX91AKWXJ`)
  and proves the card’s scenario. Compile alone is not done.

## Card order

| Card | What we are fixing | Status |
| --- | --- | --- |
| SYNC-01 | Cloud `sales.accept` writes size/choice onto `receiptSnapshot.lines`; schema `receiptLine` rejects those fields, so **no POS sale is saved in Convex**. | done — Convex has 0826-0001…0018; SHA `ecf8500465db6e4c434a60dc991b4a78dd5224db` |
| SYNC-02 | A sale (and later management) sets `depends_on` to the latest pending **or failed** catalog/inventory outbox row. The pending list hides children while that parent exists. | done — `d5c87b0e31f7be4c6933390568683f3d15179330` on `origin/main` |
| SYNC-03 | Reconnect `continue`s past `syncPendingSales` whenever staff/catalog/inventory `processed > 0`, including failures. | done — `31eb5fce8d7897b3525c5657b60f222a8d033fe8` on `origin/main` |
| SYNC-04 | Automatic reconnect only re-queues `last_error ===` the connection sentence. Schema and other business errors stay `failed`. | done — `8c656caeac92918404082975194d2196063e332e` on `origin/main` |
| SYNC-05 | Some Convex messages permanently **delete** the sale outbox row (`abandonSale`) and leave `sales.sync_state = 'failed'` with no retry. | done — regex unchanged; SHA pending |
| SYNC-06 | Orders retry resets only that sale’s outbox row. It cannot clear a failed management parent, so retry is a no-op for chained tickets. | pending |
| SYNC-07 | Settings waiting count is all outbox types; copy says “saved orders”. | pending |
| SYNC-08 | `perform()` returns success with `synced: 0` when Android internet is not validated, the WebView lacks focus, or the session is pending provision. Manual Sync looks like it ran. | pending |
| SYNC-09 | Online Dashboard/Reports read cloud `dailyMetrics` / recent cloud sales only. Unsynced local tickets do not appear in pulse/reports while the tablet is online. | pending |

## Work cards

### SYNC-01 — Make `sales.accept` persist size/choice receipt snapshots

**Status:** done — owner Manual Sync proved 0826-0001…0017 in Convex; 0826-0018 auto-synced

**Objective:** a locally committed POS sale must insert into Convex `sales`
(and related sale items / stock / daily metrics) instead of dying on schema
validation.

**Root cause:** OPTIONS-03 taught `convex/sales.ts` to store `sizeId`,
`sizeName`, and `choiceValueIds` on `receiptSnapshot.lines`. `convex/schema.ts`
`receiptLine` still allows only name, quantity, prices, and modifiers.
Convex rejects extra fields. Empty `choiceValueIds: []` is still sent because
the spread uses a truthy array.

**Evidence:** Convex logs 27–28 Aug; tablet outbox 15 failed `sale-completed`
rows with `Sale synchronization failed.`; cloud `sales` still seed-only.

**Do:**

1. Extend `receiptLine` (and any other snapshot validator that must match) so
   optional `sizeId`, `sizeName`, and `choiceValueIds` are legal. Keep
   `sales.accept` writing the same snapshot the cashier already saved locally.
2. Confirm `saleItems` insert does not add undeclared fields (it currently
   does not write size/choice; do not expand it unless a confirmed report
   needs those columns).
3. Add the smallest check that would have failed on the original extra-field
   insert (fixture snapshot with size + empty and non-empty choices).
4. Run `npm run check:sales`, `npx convex dev --once` (or the repo’s Convex
   schema deploy path used for schema changes), `npx tsc -b`, `npm run build`.
5. Install the APK on SM-X115. Manual Sync. Prove 0826-0001 … 0826-0015
   appear in Convex `sales` (or the first batch the worker sends) and that a
   new POS sale gets a `cloud_sale_id`. Today’s 0016/0017 may still wait on
   SYNC-02; record that honestly.

**Must not do:**

- Do not drop size/choice from the snapshot to “make schema happy” and lose
  receipt history.
- Do not wipe the tablet database.
- Do not “fix” Dashboard empty pulse by reading SQLite while online as a
  substitute for a successful `accept` (that is SYNC-09, after uploads work).

**Acceptance evidence:** at least one previously failed tablet receipt number
exists in Convex `sales` with matching `localSaleId`; `sales.accept` logs show
success; focused check covers the extra-field case; Graphify updated if
schema/AST changed; ledger SHA on `origin/main`.

**Next action:** none for this card. SYNC-02 is latent (failed parent forever),
not required for the 29 Aug queue that already drained.

### SYNC-02 — Stop failed management from hiding later sales

**Status:** done — failed parent no longer hides children or pins later work

**Objective:** a new sale must not wait forever on an unrelated or **failed**
catalog/inventory outbox row. A category delete must not wait forever on a
sale that cannot be abandoned without policy.

**Root cause (tablet):** category delete `4a8c0f7d…` depends on failed sale
0826-0014. Today’s 0826-0016 and 0826-0017 depend on that delete. Worker
`listPendingOutbox` requires the parent row to be **absent** from `outbox`.
Failed parents stay in `outbox`, so children are invisible. Also
`latestPendingManagementOperationIdFromDatabase` includes `state IN
('pending','failed')`, so every later sale chains onto the stuck delete.

**Do:**

1. Pin new sales only to **pending** operational management that must precede
   them, not to already-failed rows. Failed parents must not hide the child
   forever.
2. Keep real ordering: a sale of a product that still has a pending recipe
   save must still wait for that pending parent.
3. Decide the category-delete-after-failed-sale case: the delete should become
   eligible once the sale is acknowledged **or** once the sale is known
   failed/abandoned per existing deletion rules — do not leave it pinned to a
   `failed` `sale-completed` row that will never delete.
4. Smallest check: failed parent in outbox → child sale still listed as
   pending (or parent no longer blocks after fail). Existing
   `check:reconnect` / `check:local-management` / `check:sales` as applicable.
5. Physical: after SYNC-01, today’s two tickets and the category delete must
   either sync or show an honest operator error — not silent forever-pending.

**Must not do:** send a sale before a still-pending catalog change that the
sale actually used. Do not `DELETE FROM outbox` as a support wipe.

**Acceptance evidence:** `check:reconnect` lists a child while its failed
parent remains in `outbox`, and new work pins only to pending management /
pending sales. `check:local-management` and `check:local-catalog` pass.
0826-0016/0017 already left pending on SYNC-01 Manual Sync (parent succeeded,
not the failed-forever case). Café SQLite was not wiped or injected.
Install-over debug APK on SM-X115 `R8YX91AKWXJ` succeeded.

**Next action:** SYNC-03.

### SYNC-03 — Do not skip the sale drain because management failed

**Status:** done

**Objective:** one reconnect run must still attempt eligible sales even if a
staff/catalog/inventory item was processed (including failed) in that batch.

**Root cause:** `reconnectContext.tsx` `if (staff + catalog + inventory
processed > 0) continue;` skips `syncPendingSales` for that batch.
`processed` counts attempts, not successes. A single failing management op
can consume batches. Combined with SYNC-02, Manual Sync can spin on the
parent and never reach sales.

**Do:** continue to drain catalog/inventory **before** sales when those
parents are still **pending and eligible**, but do not skip sales solely
because something failed or because unrelated management was processed.
Keep the existing 10-batch cap. Smallest reconnect check. Physical: Manual
Sync with a failed catalog row still in outbox must still attempt eligible
sales after SYNC-01/02.

**Must not do:** process sales before a still-pending catalog op the sale
depends on. Do not add a second worker.

**Acceptance evidence:** `check:reconnect` asserts the processed-sum
`continue` is gone and `syncPendingSales` still runs inside the 10-batch
loop. Install-over debug APK on SM-X115 `R8YX91AKWXJ` succeeded. Café
SQLite was not wiped or injected; the 0826 queue was already drained.
Automated source check is the proof of the skip bug.

**Next action:** none for this card. SYNC-04 is next.

### SYNC-04 — Retry sale business failures on Manual Sync; classify schema noise

**Status:** done — `8c656caeac92918404082975194d2196063e332e` on `origin/main`; classified sentence `Cloud rejected this saved order. Use Sync now to retry.`

**Objective:** a sale that failed for a retryable reason must run again on
Manual Sync (already resets all failed). Automatic reconnect should retry
connection failures (already does) and must not leave operators with a
generic `Sale synchronization failed.` that never matches Convex logs.

**Root cause:** `describeSaleSyncFailure` maps the schema dump to the generic
fallback. `makeConnectivityFailuresAvailable` only resets that one connection
sentence. Automatic never retries the 15 failed tickets after the first
non-connection fail.

**Do:** keep automatic conservative (do not infinite-loop poison business
errors). After SYNC-01, schema should not happen. Persist a truncated **safe**
operator message that still distinguishes connection vs business (existing
500-char `last_error`). Optionally include a stable token from Convex
`INVALID_ARGUMENT` without storing raw schema dumps in SQLite. Smallest
check on classification. Physical: one forced connection failure retries
automatically; one business failure stays failed until Manual Sync.

**Must not do:** store full Convex schema dumps in SQLite or the UI. Do not
auto-retry permanent conflicts (SYNC-05 owns abandon policy).

**Acceptance evidence:** extra-field / `INVALID_ARGUMENT` fixture returns
exactly `Cloud rejected this saved order. Use Sync now to retry.` and is not
`CONNECTION_SYNC_FAILURE`. Receipt-number, permanent product-unavailable, and
secret ConvexError still pass. `check:reconnect` leaves that classified
sentence failed while Manual Sync would retry all failed. Orders failed
detail uses `syncError` when present. Settings already surfaces `last_error`.
Install-over debug APK on SM-X115 `R8YX91AKWXJ` succeeded. Café SQLite was
not wiped; no live connection/business fail was forced.

**Next action:** none for this card. SYNC-05 is next.

### SYNC-05 — Keep abandon only for true permanent sale conflicts

**Status:** done — regex unchanged; physical not reproduced

**Objective:** `abandonSale` must not drop a ticket that could succeed after
SYNC-01/04. Permanent messages (product gone, revision, newer recipe, cost
no longer matches, receipt-number format) may still drop the outbox row, but
the operator must still see Needs sync / an honest reason on the local sale.

**Do:** re-read `PERMANENT_SALE_SYNC_FAILURE` against current Convex
`conflict`/`invalid` copy. Confirm schema extra-field errors are **not**
permanent (they were generic fail, good). Do not expand abandon. Add a check
that a schema-like message does not abandon. Physical: only if a true
permanent conflict is reproduced; otherwise record “not reproduced, regex
reviewed.”

**Must not do:** abandon on generic `Sale synchronization failed.`

**Acceptance evidence:** `check:sales` asserts generic / SYNC-04 classified /
connection / extra-field classified sentences are not permanent, while
product-unavailable and classified receipt-number remain permanent. Regex
unchanged. Physical not reproduced; regex reviewed against `convex/sales.ts`.
Café SQLite not wiped. Install-over debug APK on SM-X115 `R8YX91AKWXJ`.

**Next action:** SYNC-06.

### SYNC-06 — Orders retry must unstick or honestly refuse chained sales

**Status:** pending — blocked on SYNC-02

**Objective:** Retry on an order whose outbox parent is a stuck management
row must either reset that blocking parent when policy allows, or tell the
operator the sale is waiting on another saved change — not silently no-op.

**Root cause:** `makeLocalSaleRetryAvailable` only flips that sale’s outbox
row to pending. `listPendingOutbox` still hides it while `depends_on` exists.

**Do:** smallest change in the shared retry path used by Orders (and do not
fork Settings Sync). After SYNC-02 the hide rule may already be enough; if
so, this card verifies Orders retry on a chained sale and records that
SYNC-02 covered it. If not, reset or clear the obsolete parent according to
SYNC-02’s rule.

**Must not do:** a separate Orders-only sync client.

**Acceptance evidence:** tablet Retry on a chained sale either uploads or
shows the waiting-on-change copy; check if logic changed.

**Next action:** SYNC-07.

### SYNC-07 — Honest Settings waiting count and copy

**Status:** pending

**Objective:** Settings must not say “N saved orders” when N is every outbox
row (sales + category delete + inventory + staff).

**Root cause:** `loadTerminalSettings` `SELECT COUNT(*) FROM outbox`.
`useSettingsData` interpolates that number as orders.

**Do:** count sale outbox rows separately from management, or change copy to
“N saved changes waiting” with a breakdown only if a single existing Settings
surface already has room. Prefer copy + one count of pending+failed sales if
that is enough. Smallest settings check. Physical: with 15 failed sales + 1
category delete + 2 pending sales, the sentence matches reality.

**Must not do:** a sync dashboard, progress bars, or technical operation IDs
in the cashier UI.

**Acceptance evidence:** `check:settings`; tablet Settings copy.

**Next action:** SYNC-08.

### SYNC-08 — Manual Sync must not look successful when it never ran

**Status:** pending

**Objective:** Settings Sync and post-checkout reconnect must not return a
quiet success when `available !== true`, `!foreground`, or pending staff
provisioning skipped all cloud work.

**Root cause:** `perform()` early-returns `{ synced: 0, pending: count }`
without throwing. Settings then shows last error or “N orders still need
synchronization” only if pending > 0 — which is easy to misread as “sync
ran and sales failed” rather than “sync did not start.” Checkout
`reconnect.run('automatic').catch` does not fire on that success path.

**Do:** return a distinct result or throw the existing connection/access
sentence when the worker did not start. Settings already has offline/error
copy — use it. Physical: with validated internet and focus, Sync still
runs. With the worker gated, the operator sees that sync did not start.

**Must not do:** sync while locked, while hidden, or while Android says
internet is not validated. Do not treat Wi-Fi association as online.

**Acceptance evidence:** `check:reconnect` / `check:settings`; tablet note.

**Next action:** SYNC-09.

### SYNC-09 — Online Dashboard/Reports vs unsynced local sales

**Status:** pending

**Objective:** after sales upload, online pulse/reports must include those
cloud daily metrics. Decide explicitly whether a **still-unsynced** local
sale should appear in online Dashboard/Reports.

**Current behaviour (not a substitute for SYNC-01):** online
`useDashboardData` / `useReportsData` call Convex snapshots. Offline they
aggregate SQLite. Seed `dailyMetrics` are July 2026; an August range is
zeros even if local August sales exist.

**Do:** prefer proving SYNC-01 first so cloud metrics update inside
`accept`. If the owner still needs online screens to show tablet-only
tickets that have not uploaded, use the existing `offlineViews` aggregations
as a documented fallback when outbox sale rows exist — do not invent a
second analytics pipeline. Physical: after SYNC-01, today’s synced sales
appear in Dashboard pulse and Reports for 2026-08-29.

**Must not do:** claim café-wide cloud totals from this tablet’s SQLite.
Do not poll. Do not unbounded scans.

**Acceptance evidence:** tablet Dashboard/Reports for the business date of
a freshly synced sale; `check:dashboard` / `check:reports` if behaviour
changed.

**Next action:** return to POLISH-01 unless another sync bug is found.

## Toolchain (same as tablet QA)

- Java 21: `D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10`
- Android SDK: `D:\Olaso\tmp\android-toolchain\android-sdk`
- ADB: `D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe`
- Tablet: `R8YX91AKWXJ` — SM-X115
- Package: `com.olaso.pos`
- Convex development deployment used for logs/data: colorful-newt-937

If `adb devices` shows `unauthorized`, do not skip the card: `adb kill-server`,
reconnect USB, unlock the tablet, accept the RSA prompt, then continue.

## Journal

### 2026-08-29 — SYNC-05 keep abandon only for true permanent conflicts

- Regex reviewed against every `conflict(` / `invalid(` string in
  `convex/sales.ts`. No card-listed phrase was missing. Regex not changed
  and not widened.
- Left non-permanent on purpose: selected-size unavailable, current-recipe
  unavailable, recipe-ingredient unavailable/missing, daily-summary
  duplicated/exceeds-limits, correction conflicts.
- `check-sales.mjs`: `isPermanentSaleSyncFailure` false for generic, SYNC-04
  classified, `CONNECTION_SYNC_FAILURE`, extra-field fixture; true for
  product-unavailable and classified receipt-number.
- `failSale` / `abandonSale` unchanged. Physical not reproduced. Café DB
  untouched. Install-over debug APK on SM-X115 `R8YX91AKWXJ`.
- Exact next action: SYNC-06.

### 2026-08-29 — SYNC-04 classify cloud sale rejects without auto-retry

- `describeSaleSyncFailure` now returns exactly
  `Cloud rejected this saved order. Use Sync now to retry.` for extra-field /
  validator / ArgumentValidation / `INVALID_ARGUMENT` rejects that are not
  the receipt-number case. Generic unknown ConvexError stays
  `Sale synchronization failed.` Automatic retry still only
  `CONNECTION_SYNC_FAILURE`.
- Orders failed `syncNote` uses `order.syncError` when non-empty.
- Checks: `check:sales` local half, `check:reconnect`, `npx tsc -b`.
  Install-over debug APK on SM-X115 `R8YX91AKWXJ`. Café DB untouched.
- Exact next action: SYNC-05. Pushed `8c656caeac92918404082975194d2196063e332e`
  to `origin/main`.

### 2026-08-29 — SYNC-03 sales run after management in the same batch

- Deleted `if (staffResult.processed + catalog.processed + inventory.processed > 0) continue`
  in `reconnectContext.tsx`. Fall through to `syncPendingSales`, then costs,
  then the existing empty-batch `break`. No extra yield; post-costs
  `setTimeout(0)` remains. SYNC-02 SQL untouched.
- `check-reconnect.mjs` source assertion: that processed sum is absent;
  `syncPendingSales` and `batch < 10` remain.
- Checks: `npm run check:reconnect`, `npx tsc -b`. Android: `android:sync`,
  debug beta BUILD SUCCESSFUL, `adb install -r` Success on SM-X115
  `R8YX91AKWXJ`. Café DB untouched.
- Exact next action: SYNC-04. Pushed `31eb5fce8d7897b3525c5657b60f222a8d033fe8`
  to `origin/main`.

### 2026-08-29 — SYNC-02 failed parents no longer hide later work

- `listPendingOutboxFromDatabase`: a parent blocks only while `state = 'pending'`.
- `latestPendingManagementOperationIdFromDatabase`: `state = 'pending'` only.
- `latestPendingSaleForRecordFromDatabase`: pending sale/correction rows only;
  failed/absent sale lets category/product/ingredient delete pin to pending
  management. Recursive descendants also stay pending-only.
- Callers of the management helper were not duplicated; they inherit pending-only.
- Checks: `check:reconnect`, `check:local-management`, `check:local-catalog`
  pass. `check:sales` local half pass; cloud half stopped at unset PIN.
  `npx tsc -b` pass. No Convex schema change.
- Android: install-over debug APK on SM-X115 `R8YX91AKWXJ` succeeded. Café
  outbox left untouched. 0826-0016/0017 already synced after SYNC-01.
- Pushed `d5c87b0e31f7be4c6933390568683f3d15179330` to `origin/main`.
- Exact next action: SYNC-03.

### 2026-08-29 — owner Manual Sync drained the 18-row queue

- Owner unlocked, Settings → Sync now. Convex colorful-newt-937 now contains
  tablet `0826-0001` … `0826-0018` on `device-9a9b0736-2f17-4923-af5f-c280c9d67bfa`.
- 0001–0017 plus the pending `management.category.delete` drained in one
  Manual Sync (`makePendingOutboxAvailable` retries every `failed` row).
  0014 succeeded, so the delete’s parent left `outbox`, then 0016/0017
  became eligible. 0018 (Cappuccino) auto-synced after a later checkout.
- The “0016/0017 still wait on SYNC-02” prediction assumed a parent that
  **stays failed**. This parent succeeded, so the chain was intended behavior,
  not a remaining blocker.
- Exact next action: POLISH-01 APK for Customize-order height. Keep SYNC-02
  as the latent failed-parent-forever case.

### 2026-08-29 — SYNC-01 schema + APK; Manual Sync blocked on PIN

- Extended `convex/schema.ts` `receiptLine` with optional `sizeId`, `sizeName`,
  and `choiceValueIds`. `sales.accept` still writes the cashier snapshot.
  `saleItems` insert unchanged (no size/choice columns).
- `scripts/check-sales.mjs`: assert stored snapshot size + empty
  `choiceValueIds`; second accept with a non-empty extra choice, then cancel.
- Checks: local half of `npm run check:sales` passed; cloud half stopped at
  `OLASO_OWNER_PIN` unset (did not run `supportSetPin`). `npx convex dev --once`
  deployed to colorful-newt-937 (dev). `npx tsc -b` pass. `npm run build` pass.
  `android:sync` pass. `node scripts/build-android-beta.mjs` BUILD SUCCESSFUL.
- Tablet R8YX91AKWXJ / SM-X115: `adb devices` showed `device`. `adb install -r`
  Success. Force-stop/start left the owner lock screen. Did not wipe, reseed, or
  uninstall. Did not change the owner PIN.
- After install, SQLite still 15 failed `sale-completed` (0826-0001…0015,
  `Sale synchronization failed.`), 2 pending (0826-0016/0017), 1 pending
  `management.category.delete`. No `cloud_sale_id`.
- Convex `sales` still only seed `dev-sale-0001`…`0013`. Manual Sync not run.
- Exact next action: set `OLASO_OWNER_PIN` in the current terminal, unlock
  owner, Settings → Sync now, prove a tablet receipt in Convex. Then mark
  SYNC-01 done and start SYNC-02.

### 2026-08-29 — owner: orders never leave the tablet

- Symptom: Needs sync on Orders; Settings waiting; empty online pulse/reports.
- Code path: local commit works; worker can call `sales.accept`; insert
  violates `receiptLine`.
- Convex: no tablet sales; repeated extra-field failures 27–28 Aug.
- ADB first pass unauthorized; second pass authorized; SQLite dump confirms
  15 failed accepts, 2 never-sent sales chained to a pending category delete
  that itself waits on failed 0826-0014.
- Exact next action: owner starts SYNC-01 (schema + accept snapshot). No
  implementation until that card is activated.
