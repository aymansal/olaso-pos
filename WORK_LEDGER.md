# Olaso Work Ledger

This file records the active implementation goal or the most recently completed
goal between activations. Project rules and durable product decisions remain in
AGENTS.md, PRODUCT.md, ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns the
remaining goal and card sequence.

## Active Goal

### Goal 05 — Business Policy, Identity, and Permissions

**Status:** active

**Goal branch:** `codex/goal-05-policy-identity-permissions`

| Card | Status |
| --- | --- |
| POLICY-01 — Confirm and record the owner decision matrix | done — `eafe2d3e6603cbf5957c548b5e83473da05465df` on `origin/codex/goal-05-policy-identity-permissions` |
| ID-01 — Define the production identity, offline session, lock, recovery, and threat model | done — `682f64d16f51a0276700eb16f2e6a4b9a07e3cc9` on `origin/codex/goal-05-policy-identity-permissions` |
| ID-02 — Add production identity/session persistence and remove production authorization override | done — `f7f3aea090101e30ad09dba3d556a1aa3c58eadc` on `origin/codex/goal-05-policy-identity-permissions` |
| PERM-01 — Enforce role permissions and sensitive-data return boundaries | done — `2ec1a0a4cbb5c6f0632347355e2c6bcb6a07aa7a` on `origin/codex/goal-05-policy-identity-permissions` |
| POLICY-02 — Implement confirmed tax, payment, receipt, customer/table, and language policy | done — `2bab5512e5d7e9ccb6cfb54a13f79a0ed58654f8` on `origin/codex/goal-05-policy-identity-permissions` |
| ORDER-01 — Implement authorized cancellation/refund corrections and reversals | in progress |
| ID-03 — Verify offline session, lock, restart, recovery, and failed-access behavior | pending |
| POLICY-03 — Run policy, security, regression, tablet, documentation, and push closeout | pending |

## Most Recently Completed Goal

### Goal 04 — Costs and Profitability

**Status:** complete

**Goal branch:** `codex/goal-04-costs-profitability`

| Card | Status |
| --- | --- |
| COST-01 — Add exact cost primitives, schema/migration plan, indexes, and deterministic cost fixtures | done — `9750fbc299f9b9b1770fd021352a3708b29dd7ba` on `origin/codex/goal-04-costs-profitability` |
| COST-02 — Add retry-safe ingredient purchases and weighted-average inventory valuation | done — `6b2a0208254f03327cbb84aa6f5f9e36b4cdf018` on `origin/codex/goal-04-costs-profitability` |
| COST-03 — Connect package-based receiving, valuation, and purchase history to Stock | done — `bfe73a67062e95de0127fe0ea42b0a981bb15314` on `origin/codex/goal-04-costs-profitability` |
| COST-04 — Show complete/incomplete recipe and product costs, gross profit, and margin | done — `551856a3c3e35c057ca70d91e23667831a33c2a5` on `origin/codex/goal-04-costs-profitability` |
| COST-05 — Save and synchronize immutable offline sale-cost snapshots and correction reversals | done — `1e7b225ad57b4a69b8776b7f39f08c549115b73e` on `origin/codex/goal-04-costs-profitability` |
| COST-06 — Add staff profiles and owner-only effective compensation periods | done — `1c6e5e465e427ec8f3728dec73f257533ba00388` on `origin/codex/goal-04-costs-profitability` |
| COST-07 — Add validated one-time and recurring operating expenses | done — `850070d87a42e39a40ebc2e1b5b76ab61058c9df` on `origin/codex/goal-04-costs-profitability` |
| COST-08 — Add the bounded monthly Costs and Profitability report | done — `84307050515d65bc9d710f771dafdd734003d4ff` on `origin/codex/goal-04-costs-profitability` |
| COST-09 — Run full regression, security/quota review, tablet QA, documentation closeout, and final push | done — `0095c37a3916759388189897bdca132654198604` on `origin/codex/goal-04-costs-profitability` |

## Earlier Completed Goal

### Goal 03 — Production Checkout and Android LAN ESC/POS Printing

**Status:** complete

**Goal branch:** `codex/goal-03-printing-integration`

| Card | Status |
| --- | --- |
| PRINT-01 — Preserve and lock the accepted receipt laboratory baseline | done |
| PRINT-02 — Prove and document the physical LAN endpoint and failure behavior | done |
| PRINT-03 — Add minimal Android LAN transport, settings, and test print | done |
| PRINT-04 — Add the saved receipt model and deterministic WD8260 encoder | done |
| PRINT-05 — Add and verify one-time printer-resident logo provisioning | done |
| PRINT-06 — Connect post-commit first print and persisted print state | done |
| PRINT-07 — Add Orders reprint and restart/disconnect recovery | done |
| PRINT-08 — Run endurance, regression, hardware, documentation, and push closeout | done |

## Planned Goals

- [Production delivery plan](PLAN.md) — canonical remaining goal order, all
  card IDs, dependencies, and universal automated/browser/Android/physical
  tablet/printer completion gates.
- [Goal 06 — Customer Loyalty and Instant Identification](goals/GOAL-06-CUSTOMER-LOYALTY.md)
  — planned after Goal 05; reward, consent/data, card delivery, and hardware
  decisions remain for LOYALTY-01.
- [Goal 07 — Production Hardening, Release, and Acceptance](goals/GOAL-07-PRODUCTION-HARDENING.md)
  — final goal containing owner-led simplification, category artwork, app icon,
  measured startup, recovery, signing, upgrade, security/quota, endurance, and
  owner acceptance.

## Current Checkpoint

- Goal 05 is active on `codex/goal-05-policy-identity-permissions`; ORDER-01
  is the only card in progress. POLICY-02 commit
  `2bab5512e5d7e9ccb6cfb54a13f79a0ed58654f8` is pushed and recorded on the
  canonical remote branch.
- ID-02 audit repair is uncommitted: strict transport-only offline fallback,
  protected monotonic PIN lockout, fail-closed terminal startup, and
  device-bound token enforcement now cover protected Convex operations; no
  `OLASO_ALLOW_DEV_*` authorization bypass remains. The dedicated dev
  deployment typechecked, accepted a valid token, and rejected a revoked token,
  mismatched device, and wrong PIN without an offline bypass.
- SM-X115 installed-APK evidence: cold restart locks before POS; 1340 × 800
  lock and POS screenshots show no clipping or scrollbars; airplane-mode
  restart reports native validated-network absence and unlocks the cached
  owner session locally. `ACCESS_NETWORK_STATE` fixed the native connectivity crash. Focused
  identity/Android checks, production build, 140-task Android beta, and
  `git diff --check` pass. Reconnected-tablet PIN entry returned to the full
  POS screen with no filtered crash/console errors. Graphify refreshed to
  2,671 nodes and 12,431 edges. ID-02 is done. Exact next action: inspect the
  owner/manager/cashier matrix and current Convex/local/UI data paths for
  PERM-01 without changing policy behavior.
- PERM-01 is complete: one
  owner/manager/cashier matrix now protects Convex functions, navigation,
  routes, and cached operational data. Managers retain operating data and
  expenses but not staff, compensation, or profitability; cashiers retain only
  POS/Orders data and cannot call management functions. SQLite migration 10
  converts legacy cached `worker` roles to `cashier`, and the Convex schema no
  longer accepts the retired role. `npm run check:permissions`,
  `npm run check:local`, `npm run check:identity`, `npm run check:android`,
  `npx tsc -b`, `npx convex dev --once --typecheck enable`, and `npm run build`
  pass. The installed SM-X115 APK has a full 1340 × 800 owner POS screen with
  no filtered crash/console errors; direct permission checks reject cashier and
  manager protected requests. Graphify refreshed to 2,691 nodes and 15,179
  edges. Exact next action: implement the confirmed POLICY-02 operational
  behavior without expanding into loyalty or refunds.
- POLICY-02 is complete. New
  sales are limited to Dine-in/Take-away and Cash/Card, with no customer/table
  inputs; each local transaction allocates an offline-safe `MMYY-0001`
  counter in migration 11 and preserves all prior snapshots unchanged. Saved
  receipts carry their selected English/French language, logo-only printer
  header, Cash/Card tender, and no-tax representation. Online wrong-PIN
  responses are structured rather than thrown, so the app shows `Wrong PIN.
  Try again.` with no Convex/uncaught console entry. `npm run check:sales`,
  `check:permissions`, `check:identity`, `check:pos`, `check:printing`,
  `check:local`, `check:android`, TypeScript, production build, Android debug
  build, and `git diff --check` pass. SM-X115 APK evidence covers failed and
  successful owner PIN entry and an unclipped 1340 × 800 POS rail with only
  Dine-in/Take-away, Cash/Card, and No tax. Graphify refreshed to 2,711 nodes
  and 17,918 edges. Commit `2bab5512e5d7e9ccb6cfb54a13f79a0ed58654f8` is
  pushed to the canonical branch. Exact next action: implement ORDER-01 alone.

### 2026-08-22 — POLICY-02 checkout policy completed

- Completed the confirmed Dine-in/Take-away, Cash/Card, no-tax, anonymous-sale,
  bilingual receipt, and monthly receipt-number policy without changing prior
  immutable snapshots. Structured wrong-PIN responses prevent raw Convex errors
  from appearing in the app.
- Verified focused sales, permissions, identity, POS, printing, local migration,
  Android, TypeScript, Convex, production-build, and SM-X115 tablet evidence;
  pushed `2bab5512e5d7e9ccb6cfb54a13f79a0ed58654f8`. ORDER-01 is now sole active.
- Graphify was queried before resuming work. It confirms the existing saved
  receipt, Orders, and print-state paths that Goal 05 must preserve.
- POLICY-01 is fully confirmed. Its authority updates document logo-only
  temporary receipt headers, no tax, cash/card product-split payments,
  French/English selection, `MMYY-0001`, dine-in/take-away only, warning-only
  stock, same-day offline whole-sale corrections, cumulative roles, and the
  confirmed PIN/session policy. Exact next action: validate, commit, and push
  POLICY-01. It was committed and pushed as
  `eafe2d3e6603cbf5957c548b5e83473da05465df`; ID-01 is the only card in
  progress. The opaque protected-session identity boundary is documented; exact
  next action: implement protected credentials/session persistence and remove
  production authorization overrides in ID-02.
- Exact next action: obtain the owner's explicit POLICY-01 answers. No
  policy-dependent behavior, identity design, or authorization implementation
  will be selected before those decisions are recorded.
- Confirmed so far: receipts retain the approved Olaso logo; tax is not shown
  on receipts; supported tenders are cash and card with split payments allowed;
  the staff app is French/English; and receipt numbers should be compact. Legal
  header details, tax treatment, receipt language, the exact receipt-number
  format/reset rule, and all remaining POLICY-01 decisions are still open.
- Further confirmed: the temporary receipt header is logo-only; the application
  performs no tax calculation anywhere; a split is product-based sequential
  checkout, not a split-tender amount; and the receipt language follows the
  currently selected staff-app language. Receipt numbers use `MMYY-0001`, with
  the numeric sequence resetting monthly. All later POLICY-01 decisions remain
  open.
- Further confirmed: the only service modes are take-away and dine-in; online
  ordering is not part of the application. Ingredient-specific low-stock
  thresholds create a warning and daily staff review, never a checkout block.
  A completed sale may be cancelled only as an append-only correction with a
  required reason; card corrections are recorded only and never trigger a bank
  reversal. Dine-in has no table selection; customer details are deferred until
  the separate loyalty feature; any cashier may authorize a cancellation.
  Cashiers may make a whole-sale correction while offline, only on the same
  local business day, then re-enter a replacement sale. All identity/role
  decisions remain open except the confirmed cumulative cashier/manager/owner
  access hierarchy and owner-only sensitive information. Every owner, manager,
  and cashier has a separate six-digit PIN; the app locks for handoff/restart,
  auto-locks after an owner-configurable five-minute default, permits local PIN
  use throughout an outage, and locks out after five failed attempts for five
  minutes. The owner accepts physical custody as the first-release lost-tablet
  control. Owner recovery is support-mediated against the existing identity;
  the exact one-time reset procedure remains to be defined without a temporary
  privileged profile.
- Customer loyalty is planned as Goal 06 after identity/permissions. The
  first-release direction is QR-first instant lookup through an opaque revocable
  token and keyboard-style 2D scanner; optional NFC+QR reuses the same token only
  after reader proof. Wallet platforms are deferred. Exact reward, customer-data,
  delivery, redemption, and hardware rules remain for LOYALTY-01.
- Goal 04 is complete; COST-01 through COST-09 are pushed and its completion
  record is `8e7a981e2813cd768ebe70063fefc5c52d880d3d`.
- The owner requested that all current UI remain unchanged until the complete
  application can be reviewed in final hardening. Goal 06 now records an
  owner-led dislike/simplification list, concise Settings/operator cleanup,
  curated category artwork with a neutral fallback, a compact app icon, and an
  optional measured logo/light startup reveal. No application behavior or asset
  format was selected by this planning update.

- 2026-08-22: reconstructed Goal 04 from the repository after the unreliable
  continuation loop. `codex/goal-04-costs-profitability` and its remote are
  synchronized at `9504b833413b8fae75590cc211b930467a039bd7`; COST-01 through
  COST-04 are pushed and COST-05 is the sole active card.
- COST-05 now caches ingredient inventory value, cost status, and valuation
  revision for offline checkout; one local transaction saves immutable sale and
  line costs, stock cost effects, receipt snapshot, and outbox event. Cloud
  sync validates complete/incomplete cost consistency, recalculates and rejects
  tampered snapshots when cached valuation revisions still match, preserves
  stale/incomplete snapshots idempotently, and advances weighted-average
  inventory valuation. Cache refresh preserves negative cloud stock as a signed
  local delta so SQLite's non-negative base quantity constraint remains valid.
- Focused checks pass: `npm run check:sales`, `npm run check:local` (including
  10 repeated restart/migration runs), `npm run check:inventory`, `npx tsc -b`,
  `npm run check:convex`, `npm run build`, and `npm run android:sync`. The
  sales check proves complete local persistence, permitted incomplete offline
  checkout, server-side matching-revision recalculation, tamper rejection, and
  idempotent cloud preservation. The pre-existing
  `scripts/check-local-database.mjs` cleanup change was verified: it closes a
  retained SQLite handle defensively and makes Windows temporary-file cleanup
  retry-safe; it has not yet been committed.
- Blocker: this workstation has no Java runtime, Android SDK, or `adb` on PATH.
  `npm run android:beta` reaches Gradle then reports `JAVA_HOME is not set and
  no 'java' command could be found`; APK build/install, physical SM-X115 smoke,
  and logcat review are therefore unavailable. Graphify incremental refresh is
  also blocked because the installed graph has no usable manifest and requests
  an external semantic-extraction API key for the mixed corpus. Exact next
  action: provide/configure the existing Java 21 and Android SDK platform-tools
  paths (and Graphify semantic backend/key or a valid manifest), then finish
  COST-05 verification, refresh Graphify, commit, push, and continue COST-06.
- Resumed 2026-08-22 with the already-installed project-local toolchain:
  `D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10` and
  `D:\Olaso\tmp\android-toolchain\android-sdk`. Java 21, `adb`, and the
  connected Galaxy Tab A9 SM-X115 are verified. The beta rebuilt and installed;
  its awake foreground POS is the approved 1340 × 800 composition, an Espresso
  take-away sale completed locally with its saved receipt preview, and the
  foreground/post-sale log has no Capacitor console error, exception, or crash.
  The earlier `triggerEvent` error occurs only when Android pauses the app while
  the tablet is asleep before the Capacitor bridge is injected; it does not
  recur for the real foreground launch/sale path.
- Graphify's full incremental command still requires an unavailable semantic API
  key because its stale manifest marks the mixed corpus changed. The structural
  code graph was instead refreshed from the seven changed COST-05 code/check
  files without pruning unrelated semantic nodes: `graphify-out/graph.json`
  now contains 2,467 nodes and 5,592 edges, and a follow-up graph query returns
  the new `prepareSale`, `commitLocalSale`, `loadSaleSyncPayload`, and
  `sales.accept` paths. Exact next action: run final focused checks, commit and
  push COST-05, record the pushed SHA, then make COST-06 the only in-progress
  card.
- COST-05 implementation commit
  `1e7b225ad57b4a69b8776b7f39f08c549115b73e` is pushed and matches
  `origin/codex/goal-04-costs-profitability`. COST-06 is now the only card in
  progress. Exact next action: re-query Graphify, inspect the existing staff
  and authorization boundaries, then implement owner-only staff profiles and
  effective compensation periods.
- COST-06 now has bounded management staff-profile reads/writes with no salary
  fields, plus owner-only compensation history/creation. Compensation periods
  are integer centimes, append-only, retry-safe, and reject overlap. The new
  `staffProfiles.by_client_mutation` index protects create retries; focused
  staff, Convex, and TypeScript checks pass. The Settings DOX keeps Staff &
  access unavailable until the owner confirms role/login policy, so COST-06
  deliberately exposes no compensation UI or operational cache data. Exact next
  action: add deterministic staff/compensation seed coverage, then run the
  card's closeout checks before commit/push.
- COST-06 seed coverage and closeout pass: the deterministic reset now has two
  staff profiles and one July-2026 worker compensation period; staff, seed,
  Convex, TypeScript, production-build, Android beta, physical SM-X115 install,
  awake foreground Settings launch, and clean foreground logcat pass. Graphify
  structural refresh is 2,483 nodes and 5,545 edges. Exact next action: commit
  and push COST-06, record its SHA, then activate COST-07.
- COST-06 implementation commit
  `1c6e5e465e427ec8f3728dec73f257533ba00388` is pushed and matches
  `origin/codex/goal-04-costs-profitability`. COST-07 is the only in-progress
  card. Exact next action: re-query Graphify and inspect expense schema,
  validation, and report-boundary paths before implementation.

- Goal 04 is active and COST-01 is the only card in progress on
  `codex/goal-04-costs-profitability`, pushed from clean `main` before any
  branch changes.
- Graphify was queried before code inspection; it identifies the established
  inventory, recipes, local sales, sync, Stock, and Reports ownership paths.
- COST-01 is complete and pushed as `9750fbc299f9b9b1770fd021352a3708b29dd7ba`
  on `origin/codex/goal-04-costs-profitability`.
- COST-02 is complete and pushed as `6b2a0208254f03327cbb84aa6f5f9e36b4cdf018`
  on `origin/codex/goal-04-costs-profitability`.
- COST-03 is the only card in progress.
- COST-03 is complete and pushed as `bfe73a67062e95de0127fe0ea42b0a981bb15314`
  on `origin/codex/goal-04-costs-profitability`.
- COST-04 is the only card in progress.
- COST-04 is complete and pushed as `551856a3c3e35c057ca70d91e23667831a33c2a5`.
- COST-05 is the only card in progress.
- Verified: exact-cost check, SQLite migration/restart check, inventory seed
  fixture check, Convex typecheck/deploy, TypeScript, production build, and
  Capacitor Android sync. Graphify is refreshed to 2,441 nodes and 5,603 edges.
- Used the project-local OpenJDK 21 and Android platform tools to build the
  140-task debug beta, install it on SM-X115, and run a cold-launch/Stock smoke
  test. The real 1340 × 800 POS and Stock screens are unclipped; post-unlock
  logcat has no Capacitor-console errors, uncaught exceptions, or crashes.
- Exact next action: re-query Graphify and inspect the existing inventory
  mutation/history paths before implementing retry-safe package receiving and
  weighted-average valuation for COST-02.
- COST-03 will extend the existing Stock receive interaction with package math,
  purchase cost, carrying value, average cost, and append-only purchase/
  valuation history while retaining visibly distinct ordinary adjustments.
- COST-03 now returns bounded purchase history with each selected ingredient,
  maps valuation state through the Stock data boundary, presents carrying value
  and average cost/incomplete state in the existing detail panel, and opens a
  package-receipt dialog from the existing receive action.
- Graphify is refreshed to 2,457 nodes and 5,643 edges; focused TypeScript,
  inventory, and production-build checks pass.
- Exact next action: run browser interaction QA for the package dialog, then
  Android beta/install and a physical Stock package-receipt smoke test before
  committing COST-03.
- Browser QA at 1340 × 800 verified a 12-piece, 48 MAD package receipt changes
  stock 9→21, carrying value 36→84 MAD, average cost, status, and append-only
  purchase history. After deploying the updated query, no new browser errors
  occurred.
- Android beta built successfully; the current APK is installed on SM-X115. The
  unlocked physical Stock screen opens the complete package-receipt dialog with
  visible fields, package math, and no console/logcat errors. COST-03 is ready
  for final focused checks and commit/push.
- Exact next action: re-query Graphify and inspect the recipe/product management
  and cost helper paths before implementing current product costs and margin.
- COST-04 now has a deployed bounded `recipes.getCost` query. It returns active
  recipe cost completeness, exact centimes, named missing ingredient IDs, and
  per-modifier ingredient cost effects; Cappuccino's deterministic fixture is
  complete at 504 centimes with the checked modifier costs.
- Exact next action: map the cost result to the product editor and show price,
  direct cost, gross profit, margin, and explicit missing ingredients, then run
  focused/browser/Android verification.
- The product hook and editor now show selling price, current direct cost, gross
  profit, margin, and explicit incomplete/missing-cost state without allocating
  compensation or overhead. TypeScript and production build pass; Graphify is
  refreshed to 2,462 nodes and 5,639 edges.
- Exact next action: verify the complete and incomplete product-cost states at
  1340 × 800 and on SM-X115, then complete COST-04 checks and commit/push.
- PRINT-08 closeout commit
  `1c1a34706154b3e6b93e92f4a83f9cc1a10493d9` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-07 implementation commit
  `5e93dd7858d693867a6ed7482131eb202e598a18` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-06 implementation commit
  `9602fed94f5d49f552527275c5c704a2e21c6906` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-05 implementation commit
  `eb00d2f92094c60adbd6cdc68e877f1a9e790959` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-04 implementation commit
  `9c87c625a1f379e7307ec0c167b5002c0ec5e8dc` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-03 implementation commit
  `c41e29c75c1a340519c6d217e220ed7f84723f76` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-02 implementation commit
  `5cb5da399900f6d2aca22bd4ecd341844884d78c` is pushed to
  `origin/codex/goal-03-printing-integration`.
- PRINT-01 implementation commit
  `a1bca7fc2df4c0f2b718e7bf46956a2301ee75ea` is pushed to
  `origin/codex/goal-03-printing-integration`.
- `main` and `origin/main` were clean and synchronized at
  `deba73b1e2baf1b92d7ce6e7f030b7c23c655383` before activation.
- The accepted `D:\Olaso-escpos-lab` source was inspected without modification;
  its durable inputs and generated outputs were hashed before preservation.
- USB queues `POS-80C` and `80mm Series Printer(1)` report available. The
  physical Galaxy Tab A9 SM-X115 is connected through ADB.
- The previously observed printer address `192.168.123.100` did not answer the
  workstation reachability check. PRINT-02 still owns measured LAN discovery,
  raw-port proof, router policy, and tablet-to-printer testing.
- The accepted lab is preserved under `tools/wd8260-receipt-lab/` with isolated
  locked dependencies and reviewed golden receipt/logo bytes. Its focused
  checks, root build, Android sync/beta build, USB queue send, physical tablet
  install/launch, 1340 by 800 browser regression, console check, and structural
  Graphify refresh pass.
- The user correctly rejected the first physical-tablet QA claim: the shipped
  one-time `window.outerWidth` scale could sample the natural-orientation width
  before landscape settled, shrinking the app into one part of the screen. An
  intermediate `innerWidth` build instead exposed the fixed 1340-pixel meta
  viewport and was oversized; it was immediately replaced.
- The corrected APK scales from the CSS screen's stable long edge. Live WebView
  inspection reports screen `1007 by 601`, zoom `0.751493`, and document
  `1007 by 602` with no horizontal or vertical overflow across three consecutive
  cold starts. The Android check rejects both fragile width APIs.
- The user physically confirmed the corrected app fills the tablet without
  scrolling and the printed receipt preserves the accepted resident logo,
  layout, separators, MAD heading, bilingual footer, and partial cut.
- Exact next action: connect the WD8260 Ethernet port to the café router, read
  the router/tablet network, change the printer's static address/subnet/gateway
  to that network without hardcoding it in the application, then prove the raw
  TCP port with a physical diagnostic print.
- PRINT-02 measured the active network: tablet `192.168.11.225/24`, workstation
  Wi-Fi `192.168.11.222/24`, and router/gateway `192.168.11.1`. The printer's
  old static `192.168.123.100` is correctly unreachable while it remains off
  the Ethernet LAN.
- The existing WD8260 CD documentation and Printer Test V3.2 utility were
  inspected locally. The vendor MAC-based `Auto Set IP` flow can discover
  cross-subnet printers and writes IP, `255.255.255.0` mask, gateway, and port;
  its expected raw TCP port is 9100, which still requires a successful measured
  paper print before acceptance.
- The router admin page redirects to a self-signed HTTPS interface. Its DHCP
  pool/reservation policy remains unconfirmed; no certificate warning,
  credential prompt, or network setting was bypassed.
- Candidate `192.168.11.100` returned unreachable ping/ARP/service probes before
  assignment. This is collision evidence, not a router reservation guarantee.
- Using the existing Printer Test V3.2 utility with USB selected, the wired
  fields were changed from `192.168.123.100 / 255.255.255.0 /
  192.168.123.1` to `192.168.11.100 / 255.255.255.0 / 192.168.11.1` and the
  wired-only `Set above contents` action was sent. The tool showed no error but
  exposes no trustworthy readback; power-cycle self-test proof is pending.
- Added a development-only Node standard-library LAN probe with explicit
  IPv4/port/timeouts and honest byte-write-only results. Its local check proves
  exact golden-byte delivery, validation, and connection-refused behavior.
- The user confirmed the self-test IP is correct and moved the printer to the
  router. The printer's own HTTP page read back MAC `00-61-8D-86-B9-4B`, IP
  `192.168.11.100`, mask `255.255.255.0`, gateway `192.168.11.1`, and DHCP
  disabled.
- Workstation ping and TCP 9100/HTTP 80 succeed; the tablet has 0% ping loss and
  direct TCP 9100/80 connections succeed. The workstation LAN probe wrote all
  1,814 golden bytes in 6 ms after a 4 ms connect. A distinct 122-byte raw
  diagnostic was then sent directly from the Galaxy Tab with exit 0.
- Wrong address `192.168.11.101:9100` and wrong port
  `192.168.11.100:9101` both fail as bounded connect timeouts without reporting
  bytes written. Physical confirmation of the normal LAN receipt and labeled
  tablet diagnostic remains pending.
- The user confirmed the LAN paper printed. Raw TCP 9100 is therefore physically
  accepted, including the direct Galaxy Tab path; it is no longer merely a
  documented or socket-open assumption.
- With the router left on and printer powered off, its neighbor state became
  incomplete, the Windows TCP check failed after 21,127 ms, and the bounded LAN
  probe returned `CONNECT_TIMEOUT` in 500 ms with exit 1 and no byte-success
  claim.
- Exact next action: power the printer back on, measure reconnect time, and
  prove recovered paper output before testing router/link loss.
- After printer power-on, ping recovered in 149 ms and TCP 9100 was open in a
  539 ms Windows check. A tablet diagnostic using plain `nc -w 2` wrote input
  but timed out waiting for remote close; the corrected Toybox
  `nc -q 1 -w 2` close-after-EOF path exited 0. Physical recovery-paper
  confirmation remains pending.
- The user confirmed the labeled `OLASO LAN TABLET TEST` paper printed after
  power-on. Printer-off/restart recovery is physically accepted.
- With printer/router power retained and the Ethernet cable removed, ping
  returned `DestinationHostUnreachable`, neighbor state became unreachable,
  and the bounded probe returned `CONNECT_TIMEOUT` in 500 ms with exit 1 and no
  byte-success claim.
- Exact next action: reconnect Ethernet, prove endpoint recovery and paper, then
  decide the router-power-off evidence and static-address ownership.
- After Ethernet reconnection, ping succeeded in 55 ms, TCP 9100 connected in
  11 ms, and the correct MAC returned reachable. A 122-byte labeled diagnostic
  sent directly from the tablet exited 0 in 135 ms; physical paper confirmation
  is pending.
- The user confirmed the labeled paper printed after Ethernet reconnection.
  Cable-loss/reconnect recovery is physically accepted without tablet/app or
  printer reconfiguration.
- Exact next action: run a timed local monitor while the router is powered off
  for about 10 seconds and restored, then prove endpoint and paper recovery and
  record who owns exclusion/reservation of static `192.168.11.100`.
- The user declined an actual router power cycle because it would disconnect the
  household. The prepared monitor was stopped without changing router state.
  This limitation is recorded rather than hidden.
- Non-disruptive client-side outage substituted: tablet Wi-Fi off removed the
  WLAN route, ping failed, and TCP returned `Network is unreachable` with exit
  1. Wi-Fi restored `192.168.11.225/24` in 2,293 ms; ping/TCP then exited 0 and
  a labeled tablet print write exited 0. Physical paper confirmation remains.
- The user confirmed the Wi-Fi-recovery diagnostic printed on paper.
- Address policy: `192.168.11.100` is a home-lab endpoint only. At café
  deployment, the client/router administrator owns reserving or excluding the
  selected static printer address from DHCP and any future router changes. The
  application address remains configurable and never hardcodes this lab value.
- Exact next action: run PRINT-02 closeout checks/build/APK install/log review,
  commit and push the card, record its SHA, then activate PRINT-03.
- PRINT-02 closeout passes: receipt/golden/LAN probe checks, production build,
  Android identity/sync, 126-task Gradle beta build, physical APK replacement
  and cold launch, exact 1340 by 800 landscape bounds, clean WebView console,
  exact browser body/document bounds with no warning/error logs, Graphify
  2,228-node/5,128-edge structural refresh, and whitespace checks.
- Exact next action: query Graphify and inspect the Android plugin, terminal
  settings, Settings screen, and test/check ownership before implementing one
  bounded Kotlin TCP transport and persisted Test printer flow.
- PRINT-03 implementation now has Kotlin 2.3.21 with compatible AGP 8.13.2,
  registered `EscPosPrinterPlugin`, bounded `LanSocketWriter`, pure native socket
  unit tests, a generic Capacitor byte wrapper, deterministic non-sale
  diagnostic, validated/persisted IPv4 and port, and an enabled Settings Test
  printer panel. Checkout remains untouched.
- Native JVM tests, Settings persistence/validation/diagnostic checks, Android
  static checks, TypeScript, and production build pass. Browser QA verifies
  exact 1340 by 800 bounds, 44/52-pixel controls, restart persistence, precise
  invalid/unavailable feedback, no overflow, and clean console.
- Exact next action: run Android sync/beta with unit tests, install on the
  physical tablet, enter the measured lab endpoint, print the non-sale
  diagnostic, verify restart and wrong-address recovery, and inspect logcat.
- Full `android:beta` now runs 140 tasks including native unit tests and passes;
  the synced APK installed successfully on the SM-X115.
- On the physical Settings panel, `192.168.11.100:9100` saved and survived
  process restart. The in-app diagnostic wrote 103 bytes in 6 ms, returned
  `paperConfirmed:false`, displayed `Confirm paper`, produced no console/logcat
  warning/error, and the user confirmed paper.
- Changing to unused `.101` persisted the draft and produced a bounded 2-second
  `TIMEOUT` with actionable UI copy. Expected native failure now returns typed
  `ok:false` rather than a rejected Capacitor promise, keeping console/logcat
  clean. Correcting back to `.100` then wrote 103 bytes in 6 ms with `ok:true`;
  final recovery-paper confirmation is pending.
- The user confirmed the corrected-endpoint recovery diagnostic printed. A final
  process restart still shows `192.168.11.100:9100`; physical Settings geometry
  fills the 1340 by 800 tablet with no clipping or overflow.
- Final Graphify refresh contains 2,295 nodes and 5,269 edges. Settings,
  Android static, TypeScript, production build, native unit/assembly, browser,
  tablet, persistence, wrong-address, clean-log, and paper checks all pass.
- Exact next action: query Graphify and inspect saved receipt snapshots,
  checkout/order parsers, formatters, and accepted golden bytes before defining
  the smallest transport-independent receipt model and deterministic encoder.
- PRINT-04 now adds a pure snapshot-to-receipt model and WD8260 encoder with
  integer-centime reconciliation, Africa/Casablanca date/time, complete CP858,
  unsupported-character replacement, exact 30/5/13 item columns, wrapping,
  four 48-column separators, NV logo recall, double-width TOTAL/MERCI, feed, and
  partial cut. It remains disconnected from checkout/transport orchestration.
- New local snapshots preserve optional cashier name; existing snapshots remain
  valid, and local/cloud Orders map cashier into the transport-independent
  receipt shape without reading current product data.
- `check:printing`, sales, Orders, TypeScript, and whitespace checks pass across
  empty/64-character IDs, accents, unsupported scripts, long products/modifiers,
  quantity 100, large totals, optional fields, exact payment/change, and invalid
  reconciliation.
- Accepted fixture text matches the existing 48-column baseline. The 941-byte
  application encoder SHA-256 is
  `8C8C109B9A4F884D44819A55099C7D88FA7B005927FD5BB4767734E79EF6B1AE`;
  direct tablet LAN send exited 0. Physical paper comparison is pending.
- The user confirmed the new application-encoder paper matches the accepted
  laboratory receipt perfectly. This proves the independent production encoder,
  not a repeat of the receiptline lab. SHA
  `8C8C109B9A4F884D44819A55099C7D88FA7B005927FD5BB4767734E79EF6B1AE`
  is now frozen as the paper-approved application golden.
- Exact next action: run final printing/sales/orders/build/Android/tablet/log/
  Graphify checks, commit/push PRINT-04, record its SHA, then activate PRINT-05.
- Final receipt golden, sales, Orders, POS, local database, Settings,
  TypeScript, production build, 140-task Android beta, whitespace, and
  Graphify checks pass. The rebuilt APK is installed on the real SM-X115.
- Browser and physical-tablet Orders previews show the saved cashier cleanly;
  the tablet remains full-screen at 1340 by 800 with no clipping or internal
  preview overflow. Browser logs contain no warning/error, and no
  application-console or card-introduced Android log warning/error appeared.
- Graphify refreshed to 2,335 nodes and 5,332 edges. PRINT-04 was committed and
  pushed at `9c87c625a1f379e7307ec0c167b5002c0ec5e8dc`.
- Exact next action: inspect the accepted resident-logo payload, Settings
  ownership, and native asset/plugin contracts before adding the deliberate
  one-time PRINT-05 provisioning action.
- PRINT-05 packages the exact 2,441-byte accepted NV payload, SHA-256
  `D5D3B835800970D7F81BD188311EC766DCF4F0867F2E9B697C227AD9F9818C76`,
  as an Android raw asset. Static checks prove it matches the preserved fixture
  byte-for-byte and is present in the built APK.
- Settings now exposes deliberate Restore saved logo and Test printer actions.
  The restore action requires the native replacement warning and reports only
  byte/timing evidence. Browser layout, warning/cancel behavior, and clean logs
  pass without pretending the browser can print.
- The first installed-tablet restore wrote all 2,441 bytes in 9 ms with
  `paperConfirmed:false`. Two immediate accepted 16-byte recalls succeeded,
  followed by successful recalls after app restart (11 ms), full tablet restart
  (47 ms), and printer network-module restart (109 ms). The printer TCP path
  disappeared and recovered in 3,909 ms during that restart.
- The user caught an oversized launch while Android 16 ignored the existing
  landscape request. The first property/scale test appeared to pass after the
  display was already landscape, but a later physically portrait install
  disproved it; the API-35 target correction below is the accepted fix.
- Exact next action: physically inspect the emitted logo-only slips for the
  crisp horizontal OLASO wordmark, power-cycle the printer, send one final
  recall, then run PRINT-05 closeout/Graphify/commit/push.
- Final focused Settings/Android/printing/receipt-lab/sales/TypeScript checks
  pass. A fresh browser reports exact 1340 by 800 content, no panel overflow,
  and no warning/error; Graphify refreshed to 2,354 nodes and 5,365 edges.
- The user corrected the unnecessary pause and confirmed that the six logo
  recalls physically printed. PRINT-01 already accepted the exact preserved
  logo payload, horizontal orientation, ordinary recall, and survival across a
  true printer power cycle. PRINT-05 proves its bundled native asset is exactly
  that same 2,441-byte payload and that the installed app can provision and
  recall it across app, tablet, and printer-module restarts.
- PRINT-05 was committed and pushed at
  `eb00d2f92094c60adbd6cdc68e877f1a9e790959`. No further logo print is
  required.
- Exact next action: inspect checkout commit ownership, local migrations, POS
  submission state, and recovery boundaries before connecting one post-commit
  print attempt with persisted pending/printed/failed state.
- The later cold install from a physically portrait screen disproved the claim
  that the API-36 compatibility property alone forces landscape. Because this
  product is manually distributed and Google Play is excluded, the APK now
  compiles with SDK 36 but targets API 35. With system rotation locked portrait,
  the rebuilt physical APK opens at the complete 1340 by 800 layout; auto-rotate
  was restored afterward.
- Local schema version 5 adds pending/printed/failed state, attempt count,
  attempt time, bounded error code/message, and observed byte/total timing.
  Focused checks prove print failure/success updates never change sale, item,
  stock movement, or outbox counts.
- Browser unconfigured checkout committed and cleared its cart, opened the
  saved preview, marked print failed, and logged no warning/error.
- Physical offline checkout added exactly one sale, one item, two stock
  movements, and one outbox row; print state became failed/UNREACHABLE with one
  attempt. App restart preserved every count and made no new print call. Wi-Fi
  recovery synchronized the same sale to outbox zero while print stayed failed.
- One online physical checkout then added exactly one more sale/item and two
  movements, sent 787 receipt bytes in 6 ms, persisted printed/attempt 1, and
  the user confirmed paper output. A final app restart preserved both print
  states and all counts without printing again.
- Graphify refreshed to 2,388 nodes and 5,500 edges. PRINT-06 was committed and
  pushed at `9602fed94f5d49f552527275c5c704a2e21c6906`.
- Exact next action: inspect Orders data/detail ownership and connect reprint to
  the saved snapshot/current settings while exposing persisted print state and
  preserving all sale/item/stock/outbox counts.
- Orders now reads tablet-local print state alongside the immutable snapshot,
  preserves it when the matching cloud row arrives, disables cloud-only
  reprints, and exposes Reprint/View receipt/sync as three 50-pixel actions.
- Focused tests prove successful and failed reprints change only print state;
  sales/items/stock movements/outbox are invariant. Browser unconfigured
  reprint keeps recovery available with no console warning/error or overflow.
- Physical wrong-address reprint plus two rapid taps produced one TIMEOUT and
  advanced only attempt 1 to 2. App process restart and full tablet restart
  preserved failed state and counts 3/3/9/0 without any print call.
- Restoring `.100` and pressing Reprint once wrote the same 787 saved-snapshot
  bytes in 62 ms, moved only attempt 2 to 3 and failed to printed, and left
  sales/items/movements/outbox at 3/3/9/0. The exact receipt encoder and paper
  path were already physically accepted; no repeated paper gate was added.
- Existing accepted printer/router disconnect/power recovery from PRINT-02
  applies to the same transport, while current wrong-address/restart/repeated-
  tap recovery proves Orders orchestration. Graphify refreshed to 2,396 nodes
  and 5,523 edges.
- PRINT-07 was committed and pushed at
  `5e93dd7858d693867a6ed7482131eb202e598a18`.
- Exact next action: derive the PRINT-08 completion matrix, run full automated
  regression and bounded 20-sale/5-reprint endurance without unnecessary logo
  tests, inspect browser/tablet/log/database evidence, update all authorities,
  and finish with pushed clean synchronization.
- Added `check:printing-endurance`: 20 mixed atomic sales, 20 unique receipts,
  20 items, 47 exact stock movements, 20 outbox events, one printer failure/
  restart recovery, 26 total print attempts, and five immutable saved-sale
  reprints all reconcile; all 20 finish printed. Current product name/price
  mutation does not alter reprint bytes.
- Full POS/management/inventory/local/sales/Orders/Dashboard/Reports/Settings/
  Android/printing/receipt-lab/TypeScript/Convex/seed checks pass. The one
  Dashboard failure in the first parallel batch was an explicit Convex OCC
  collision with the concurrent Inventory mutation; the complete cloud suite
  passed sequentially afterward.
- Production build and 140-task Android beta pass. Root transitive
  brace-expansion/nanoid/postcss lockfile fixes reduce both root and receipt-lab
  audits to zero vulnerabilities without changing public dependencies.
- Fresh browser POS/Orders/date-picker/Reprint/Printer Settings checks report
  exact 1340 by 800 bodies, no panel overflow, and no warning/error. The final
  APK is installed on the physical SM-X115 at target API 35; POS, Orders, and
  Settings fill 1340 by 800, live WebView zoom is 0.751493, and app logs are
  clean.
- Final physical database remains 3 sales/3 items/9 movements/0 outbox with two
  printed states and no failed states; final install created no print. External
  accepted lab sources still match all five preserved source hashes.
- Graphify refreshed to 2,413 nodes and 5,559 edges. PRINT-08 was committed and
  pushed at `1c1a34706154b3e6b93e92f4a83f9cc1a10493d9`.
- Exact next action: push this final completion record, prove the branch is
  clean/synchronized, and leave Goal 04 inactive until explicit activation.

## Planning Journal

### 2026-08-22 — Customer loyalty added as Goal 06

- Added the client-requested customer base, digital stamp card, instant QR scan,
  optional NFC+QR hardware proof, opaque tokens, and append-only reward history.
- Kept Apple/Google Wallet and Smart Tap deferred, renumbered hardening to Goal
  07, and changed no application behavior.

### 2026-08-22 — Goal 05 activated; POLICY-01 started

- Confirmed the completed Goal 04 branch and remote at
  `92cc41f882743fcab9a447ef98e865fc5d1f4a5b`, created and pushed
  `codex/goal-05-policy-identity-permissions` from that state, then
  fast-forwarded and pushed `main` to the same completed baseline.
- Queried the current Graphify map before resuming. It identifies the existing
  saved-receipt, Orders, and print-state boundaries that Goal 05 must retain.
- Marked POLICY-01 as the sole in-progress card. Awaiting the owner's explicit
  legal-receipt, tax, payment, language, receipt-numbering, service, stock,
  correction, role, login, and sensitive-data policy decisions; no behavior is
  being inferred or changed before those answers.

### 2026-08-22 — POLICY-01 receipt and payment inputs received

- Confirmed the existing approved Olaso logo remains on receipts. The owner
  does not want a tax line printed on receipts.
- Confirmed cash and card as the only supported payment methods, with split
  payments allowed. The staff application is French/English.
- The receipt number should be small and date-scoped; its exact visible format,
  reset rule, offline behavior, legal header, tax treatment, and receipt
  language remain explicitly undecided. POLICY-01 stays in progress.

### 2026-08-22 — POLICY-01 receipt, tax, and product-split clarification

- The temporary receipt header is the approved Olaso logo only. Address and
  phone details are deliberately deferred until the owner/client requests them.
- Tax is not calculated anywhere in the app. The selected staff-app language
  determines the receipt language.
- A split means sequential product-based checkout: the cashier selects a
  customer's products from one order, records that payment, and leaves all
  unpaid products visible for subsequent customers. It is not a split-tender
  flow.
- Confirmed receipt number format: `MMYY-0001`, for example `0826-0001`.
  Its number increments without duplication during the month and resets to
  `0001` in the following month.

### 2026-08-22 — POLICY-01 service, stock, and correction inputs received

- Removed online from scope. The café uses only take-away and dine-in service;
  the small number of tables does not change that service distinction.
- Each ingredient has an operator-selected low-stock threshold. Low stock is a
  daily staff warning/review workflow, not a sale-blocking rule.
- A completed sale is never deleted. A cancellation records its reason as an
  append-only correction. Card corrections record the business correction only;
  no card-terminal or bank reversal is attempted.
- Dine-in is a service label only: the café's two-table setup does not use a
  table selector. Customer details remain unavailable until a separately scoped
  loyalty feature exists. Any cashier may cancel a completed sale with a reason.
- Cashiers can cancel while offline. A cancellation is whole-sale only and must
  occur on the same local business day; the cashier re-enters any replacement
  order. The correction remains append-only and reverses only the original
  saved effects, including its stock and cost snapshots.

### 2026-08-22 — POLICY-01 role hierarchy approved

- Roles are cumulative: manager includes all cashier abilities, and owner
  includes all manager and cashier abilities.
- Cashier: POS, product-based split checkout, reprint, same-day whole-sale
  correction, and low-stock warnings. Manager: cashier access plus products,
  stock, expenses, and operational sales reports. Owner: all manager/cashier
  access plus staff, identity recovery, profitability, and individual
  compensation. Sensitive owner-only data is never returned to lower roles.

### 2026-08-22 — POLICY-01 PIN and offline-session inputs received

- Every owner, manager, and cashier receives a separate six-digit PIN. A lock
  screen supports handoff to another staff member, and application/tablet
  restart always returns locked.
- Auto-lock defaults to five idle minutes and is owner-configurable in Settings.
  Five failed PIN attempts impose a five-minute local lockout.
- A registered staff PIN remains usable offline without a 24-hour reconnect
  deadline, including a multi-day outage. A remotely revoked worker therefore
  becomes blocked on the tablet's next successful synchronization; it cannot be
  revoked instantly while the tablet has no network.
- The owner accepts physical custody of the tablet as the first-release
  lost-device control and does not want a remote lost-device workflow. If an
  owner forgets a PIN, verified support resets the existing owner identity
  through the protected backend administration boundary; no temporary profile,
  plaintext PIN, or development authorization bypass is created.
- The owner requested a fast loyalty/customer-recognition experience. Apple and
  Google Wallet NFC passes are not assumed: their contactless protocols require
  platform entitlement/certification and compatible terminal setup. A dedicated
  loyalty scope is needed before selecting an NFC-card or QR-card design,
  customer-data policy, reward rule, or hardware integration.

### 2026-08-22 — POLICY-01 final approval

- The owner approved the remaining recommendations: visible `Dine-in` / `Sur
  place` labels, no customer/table fields before a separately approved loyalty
  feature, same-calendar-day corrections through 23:59 Africa/Casablanca, and
  the logo-only receipt header as an explicit temporary rule.
- Separate discounts and refunds remain unavailable rather than guessed. The
  confirmed supported correction is the cashier-authorized, offline,
  whole-sale cancellation with a required reason and no card/bank reversal.
- Updated PRODUCT, ARCHITECTURE, DESIGN, BRAND, PLAN, and Goal 05 ownership
  documents. POLICY-01 is ready for documentation validation and commit.

### 2026-08-22 — POLICY-01 complete; ID-01 started

- Committed `POLICY-01: record operating policy` as
  `eafe2d3e6603cbf5957c548b5e83473da05465df`, pushed it to
  `origin/codex/goal-05-policy-identity-permissions`, and verified the remote
  resolves to the same SHA. Documentation-only checks passed: `git diff --check`
  and all 32 local Markdown links.
- POLICY-01 is done. ID-01 is now the only card in progress; next, inspect the
  current staff/auth/terminal-lock boundaries and write the confirmed identity,
  offline-session, revocation, and recovery design before implementation.

### 2026-08-22 — ID-01 identity/session boundary designed

- Current inspection confirms the beta terminal lock is only a SQLite flag and
  existing Convex management/POS authorization has development overrides.
- Chose an opaque per-device server-session boundary with Android Keystore
  storage and protected local offline PIN verification. No raw PIN/token enters
  SQLite, React, logs, source control, or ordinary exports. Offline workers can
  continue through multi-day outages; revoked identity state arrives on next
  successful sync.
- Documented role/session enforcement, lock/switch/restart, five-minute
  monotonic idle and failed-attempt limits, audit identity, support recovery,
  and explicit shared-PIN/clock/database/physical-custody tradeoffs in
  ARCHITECTURE.md. ID-01 remains in progress pending documentation checks,
  commit, and push.

### 2026-08-22 — ID-01 complete; ID-02 started

- Committed `ID-01: define offline staff sessions` as
  `682f64d16f51a0276700eb16f2e6a4b9a07e3cc9`, pushed it to
  `origin/codex/goal-05-policy-identity-permissions`, and verified the remote
  resolves to the same SHA. `git diff --check` and all 32 local Markdown links
  passed.
- ID-01 is done. ID-02 is now the only card in progress. Next: inspect
  migrations, native protected-storage options, Convex function call sites, and
  existing focused checks before implementing the approved session boundary.

### 2026-08-22 — ID-02 protected-storage boundary started

- Added a minimal Android `SecureSession` Capacitor plugin backed by Android
  Keystore AES-GCM storage plus a TypeScript Android-only wrapper. It accepts
  bounded safe keys, stores encrypted values only, and is not yet wired to PIN
  or session flows; SQLite settings remain credential-free.
- Registered the plugin, added a native key-validation check, and updated the
  Android/data DOX contracts. Android static checks, TypeScript, production
  build, and Capacitor sync pass. The standalone Gradle beta build has started
  with the documented project-local Java 21/SDK paths but needs final completion
  evidence. Unrelated uncommitted Goal 06/07 file changes were found in the
  shared workspace and are preserved outside this card.
- Exact next action: finish native beta evidence, then implement the approved
  credential/session schema and fail-closed Convex boundary without staging the
  unrelated goal files.

### 2026-08-22 — ID-02 credential/session foundation implemented

- Added Convex staff-identity, opaque hashed-session, and per-device failed-PIN
  tables, plus an ordered SQLite migration that keeps only non-secret identity
  revision state locally. The staff role vocabulary now accepts `cashier` while
  retaining `worker` only for legacy migration.
- Added a Web Crypto PBKDF2 sign-in action, five-failure server lockout, opaque
  256-bit session issuance, and a server-secret-gated support PIN reset that
  revokes existing sessions instead of creating a temporary privileged profile.
  The matching client helper stores its session and offline PIN verifier only
  through the Android Keystore bridge.
- Convex typecheck/deploy, TypeScript, local migration checks, and production
  build pass. Exact next action: wire sign-in/lock flow and session use into the
  application, then replace the remaining development authorization overrides.

### 2026-08-22 — ID-02 staff cache and lock flow added

- Extended the bounded operational snapshot/local cache with active staff IDs,
  display names, roles, revisions, and non-secret identity revisions only.
- The lock screen now selects a cached staff profile, accepts a six-digit PIN,
  creates/saves an opaque online session through Android Keystore, and verifies
  the previously provisioned staff PIN locally during an outage. It fails closed
  when no provisioned identity exists.
- Convex typecheck/deploy, local migration checks, TypeScript, and production
  build pass. Exact next action: add startup/idle locking, test the Android
  session path with provisioned credentials, and remove the remaining production
  authorization overrides.

### 2026-08-22 — ID-02 Convex provisioning/sign-in verified

- Configured a rotated server-only recovery code on the active development
  Convex deployment. Provisioned the existing owner identity and verified an
  opaque-session sign-in through the CLI without printing a PIN, recovery code,
  or session token. The support reset invalidates prior owner sessions.
- Exact next action: install the current build, exercise the native PIN flow,
  then remove production authorization overrides and complete the negative
  authorization checks before closing ID-02.

### 2026-08-22 — Deferred owner polish recorded

- Added final-hardening cards for the owner's complete app-wide critique and
  the exact simplification pass that follows it; no screen was changed early.
- Recorded current Settings copy/icons/technical detail as review candidates
  while preserving required printer setup, validation, and recovery behavior.
- Added a bundled category-art gallery plus neutral fallback, compact app-icon
  approval, and optional measured startup motion. GIF, video, vector/CSS, and
  animated-image delivery remain candidates until physical startup evidence.
- Updated PLAN, Goal 06, PRODUCT, ARCHITECTURE, DESIGN, and BRAND only. Goal 05
  remains the exact next implementation goal.

### 2026-08-22 — Goal 04 activated; COST-01 started

- Created and pushed `codex/goal-04-costs-profitability` from clean synchronized
  `main` before making branch changes.
- Read the governing authorities and Goal 04 plan, queried the existing
  Graphify map, and marked COST-01 as the only card in progress.
- Next: read the applicable source and Convex DOX chain, then implement the
  cost foundation only.

### 2026-08-22 — COST-01 foundation implemented; Android gate blocked

- Added integer-centime BigInt allocation, valuation receive/consume,
  incomplete-cost propagation, margin, and monthly-recurrence primitives with
  the ten-carton milk fixture (`10,000 ml`, `20,000` centimes).
- Added ordered SQLite version-6 migration fields/tables/indexes and matching
  Convex cost, purchase, staff, compensation, and expense shapes/indexes.
  Existing local/unknown ingredient values migrate as explicitly incomplete.
- Extended deterministic development fixtures with complete valuation cases and
  an intentionally incomplete brioche case; focused cost/local/inventory/
  Convex/TypeScript/production-build checks pass and the Convex development
  deployment was updated.
- `npm run android:sync` passed, but `npm run android:beta` cannot invoke Gradle:
  no Java 21/JAVA_HOME is available. `adb` is also absent, preventing APK
  installation and required physical smoke/logcat evidence. COST-01 remains the
  only card in progress and is intentionally uncommitted/unpushed.
- Graphify refreshed after the structural change (2,441 nodes, 5,603 edges).
- Next: restore Java 21 and Android platform tools, complete the Android/Tablet
  gate, then record SHA/remote branch and advance to COST-02.

### 2026-08-22 — COST-01 Android/tablet gate passed

- Located the existing project-local toolchain at
  `tmp/android-toolchain`: Temurin OpenJDK `21.0.11+10`, Android SDK platform
  tools, and a connected Samsung SM-X115 (`R8YX91AKWXJ`).
- `npm run android:beta` passed all 140 Gradle tasks after Android sync; the
  debug APK installed successfully over the existing app.
- On the unlocked physical tablet, a cold app launch filled the exact 1340 ×
  800 activity and the Stock workspace rendered its inventory/detail panels
  without clipping or overflow. Focused post-launch and Stock logcat filtering
  found no Capacitor-console errors, uncaught exceptions, or crash records.
- COST-01 is ready for the required implementation commit and push; it remains
  the only card in progress until that SHA is recorded.

### 2026-08-22 — COST-01 complete; COST-02 started

- Committed `COST-01: add exact cost foundation` as
  `9750fbc299f9b9b1770fd021352a3708b29dd7ba`, pushed it to
  `origin/codex/goal-04-costs-profitability`, and verified the remote resolves
  to the same full SHA.
- COST-01 is done only after focused checks, production build, Android sync and
  beta build, physical SM-X115 install/Stock smoke, clean relevant logcat, and
  Graphify evidence passed.
- COST-02 is now the only card in progress. Next: inspect the established
  inventory mutation/history ownership and implement package receiving with
  append-only weighted-average valuation.

### 2026-08-22 — COST-02 implementation and verification complete

- Added an owner/manager package-receipt mutation that records package count,
  base-unit quantity per package, integer-centime package price, date, optional
  supplier/note, purchase history, stock movement, and valuation as one
  idempotent mutation.
- Added append-only correction reversal/replacement history and deterministic
  current-carrying-value effects. A correction cannot reverse stock no longer on
  hand; a repeated request returns its original result without duplicate effects.
- Physical-count losses consume current carrying value; known count increases use
  the current average, while ordinary unpriced receives and unvalued increases
  remain explicitly incomplete instead of claiming zero cost.
- Focused verification proves ten one-litre cartons at 20 MAD add 10,000 ml and
  20,000 centimes, retries remain single-effect, correction history is appended,
  and count effects reconcile. Convex/type/build/Android beta pass; the current
  APK installed on SM-X115 and POS/Stock cold-launch smoke at 1340 × 800 is clean.
- Graphify refreshed to 2,451 nodes and 5,623 edges. COST-02 remains in progress
  only until its commit is pushed and the SHA is recorded.

### 2026-08-22 — COST-02 complete; COST-03 started

- Committed `COST-02: add package valuation receipts` as
  `6b2a0208254f03327cbb84aa6f5f9e36b4cdf018`, pushed it to
  `origin/codex/goal-04-costs-profitability`, and verified the remote resolves
  to the same full SHA.
- COST-03 is now the only card in progress. Next: inspect the Stock component and
  application-data chain, then connect package receiving and valuation history
  without adding a second inventory screen.

### 2026-08-22 — COST-03 Stock workflow implementation started

- Extended the bounded ingredient detail query with indexed recent purchases;
  the Stock data hook maps valuation fields and purchase records into plain
  feature contracts.
- Added one `PurchaseDialog` under the existing Stock feature and routed the
  existing receive action to its retry-safe package-receipt mutation. The
  existing adjustment action remains separate.
- The selected-item panel now states complete/incomplete cost status and shows
  inventory carrying value plus average cost when known. TypeScript,
  inventory, production build, and structural Graphify checks pass.
- Next: inspect the interaction at 1340 × 800 and on SM-X115, then complete the
  card verification/commit/push sequence.

### 2026-08-22 — COST-03 complete; COST-04 started

- Committed `COST-03: add stock purchase workflow` as
  `bfe73a67062e95de0127fe0ea42b0a981bb15314`, pushed it to
  `origin/codex/goal-04-costs-profitability`, and verified the remote resolves
  to the same full SHA.
- Browser 1340 × 800 and unlocked SM-X115 package-receipt tests confirmed
  package math, inventory value, average cost, distinct purchase history, and
  clean relevant console/logcat output.
- COST-04 is now the only card in progress. Next: calculate and present current
  active-recipe/product cost, gross profit, margin, and missing-cost ingredients.

### 2026-08-22 — COST-04 domain calculation started

- Added and deployed one bounded active-recipe cost query that reads the current
  carrying value only, allocates direct ingredient cost deterministically, and
  returns explicit incompleteness rather than zero for missing cost inputs.
- Modifier additions/substitutions are returned as separate exact-cost effects;
  Cappuccino verifies at 504 centimes direct cost with checked option effects.
- Next: map the query into the existing product-editor presentation and verify
  the complete/incomplete margin states at browser and tablet reference sizes.

### 2026-08-22 — COST-04 product-cost presentation implemented

- Mapped the bounded active-recipe cost query into the existing Products data
  hook and editor. The editor now presents selling price, direct ingredient
  cost, gross profit, margin, and an explicit missing-cost count.
- No compensation, rent, utilities, or arbitrary overhead is included in the
  per-product measure. TypeScript and production build pass; Graphify refreshed
  to 2,462 nodes and 5,639 edges.
- Next: browser/tablet verification of complete and incomplete product-cost
  states, then COST-04 commit/push closeout.

### 2026-08-22 — COST-04 complete; COST-05 started

- Committed `COST-04: add product cost margins` as
  `551856a3c3e35c057ca70d91e23667831a33c2a5`, pushed it to
  `origin/codex/goal-04-costs-profitability`, and verified the remote SHA.
- Browser and unlocked SM-X115 Products evidence confirms complete direct cost,
  gross profit, margin, and no layout/logcat regression.
- COST-05 is now the only card in progress. Next: inspect local sale transaction,
  sync payload, and cloud acceptance boundaries for immutable cost snapshots.

### 2026-08-22 — Goal 03 handoff audited

- Independently re-ran the focused printing, endurance, POS, local, sales,
  Orders, Settings, Android, receipt-lab, management, inventory, Dashboard,
  Reports, Convex, production-build, Android-beta, and dependency-audit checks;
  all pass when shared Convex mutation checks run sequentially.
- Confirmed the completed Goal 03 branch is clean and synchronized, corrected
  the stale active-goal wording, and fast-forwarded `main` to the completed
  handoff without changing application behavior.
- Goal 04 remains inactive. Its reviewed start prompt is the exact next action
  after explicit user activation.

### 2026-08-21 — PRINT-08 and Goal 03 complete

- Committed `PRINT-08: complete printing closeout` as
  `1c1a34706154b3e6b93e92f4a83f9cc1a10493d9`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-08 and Goal 03 done only after full automated/cloud/build/audit/
  endurance/browser/tablet/printer/database/Graphify/documentation evidence
  passed.
- Next work is Goal 04, which remains inactive until explicit user activation.

### 2026-08-21 — PRINT-08 ready to push

- Completed 20-sale/5-reprint restart/failure endurance with exact receipt,
  stock, outbox, and print-attempt reconciliation in a real temporary SQLite
  database, avoiding unnecessary paper volume while retaining the accepted
  physical checkout/reprint paths.
- Passed every focused local/cloud/native/build check sequentially where shared
  Convex mutation isolation required it. Audits report zero vulnerabilities.
- Final browser and installed-tablet POS/Orders/Settings geometry and logs are
  clean; accepted lab hashes, Graphify, authorities, and evidence are current.
- PRINT-08 is ready for commit/push and final clean-worktree audit.

### 2026-08-21 — PRINT-07 complete; PRINT-08 started

- Committed `PRINT-07: add safe receipt reprinting` as
  `5e93dd7858d693867a6ed7482131eb202e598a18`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-07 done after invariant/browser/APK/wrong-address/rapid-tap/app-
  restart/tablet-restart/log/recovery evidence passed.
- Marked PRINT-08 as the only card in progress. It owns final regression,
  endurance, documentation, and clean synchronized closeout.

### 2026-08-21 — PRINT-07 recovery QA complete

- Added local print state to Orders without allowing cloud history to overwrite
  it, plus one saved-snapshot Reprint action that never enters checkout logic.
- Wrong address, rapid repeated taps, app restart, tablet restart, endpoint
  correction, and successful recovery all preserve sale/item/stock/outbox
  counts exactly. Only print attempt state changed.
- Browser and physical 1340 by 800 Orders layouts fit three actions cleanly;
  logs remain free of new warning/error. One recovery write reused the accepted
  787-byte receipt stream without additional logo testing.

### 2026-08-21 — PRINT-06 complete; PRINT-07 started

- Committed `PRINT-06: print committed sales once` as
  `9602fed94f5d49f552527275c5c704a2e21c6906`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-06 done only after focused/build/APK/browser/tablet/offline/
  restart/sync/log/database/paper evidence passed.
- Marked PRINT-07 as the only card in progress. Reprint will reuse the saved
  snapshot and current settings without entering checkout logic.

### 2026-08-21 — PRINT-06 checkout and recovery QA complete

- Added schema version 5 print state and one background post-commit attempt.
  Fixed the prior post-commit menu-reload hazard so no refresh/print/sync error
  can make a committed sale appear unsaved or leave a duplicate-retry cart.
- Browser configuration failure and physical offline/restart/Wi-Fi recovery
  preserve exactly-once sale, item, movement, and outbox effects.
- One online checkout wrote a 787-byte receipt in 6 ms and produced the single
  expected paper. Restart preserved printed/failed attempts without another
  print.
- Corrected the Android 16 landscape evidence by targeting API 35 while
  compiling with API 36; a truly locked-portrait physical launch now forces the
  approved full landscape layout.

### 2026-08-21 — PRINT-05 complete; PRINT-06 started

- Committed `PRINT-05: add resident logo setup` as
  `eb00d2f92094c60adbd6cdc68e877f1a9e790959`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-05 done from the accepted exact-payload physical baseline plus
  current byte identity, APK, setup, restart, tablet, browser, and log evidence.
- Marked PRINT-06 as the only card in progress. No more logo-only output will
  be sent; this card owns post-commit first printing and persisted state.

### 2026-08-21 — Incorrect PRINT-05 pause corrected

- The user correctly rejected the repeated logo printing and the decision to
  pause while they were away. Six bare recalls were excessive; one current
  app-path confirmation was sufficient because the exact payload, orientation,
  and power-cycle persistence were already accepted in PRINT-01.
- Accepted existing physical baseline plus exact byte identity and current
  installed-app setup/recall/restart evidence. No further logo print will be
  sent. Goal 03 is active and PRINT-05 is ready for closeout.

### 2026-08-21 — PRINT-05 blocked at physical printer gate

- This pause was later found unnecessary: it failed to reuse the already
  accepted exact-payload power-cycle/orientation baseline and over-weighted new
  bare recall repetition. The user corrected it before any partial commit or
  later-card work occurred.

### 2026-08-21 — PRINT-05 software, restart, and orientation QA reached

- Bundled the accepted pre-rasterized logo unchanged as one Android raw asset;
  no image dependency or runtime rasterizer was added.
- Added a warning-gated Settings restore action. The real tablet wrote 2,441
  setup bytes and repeated the exact 16-byte recall after app, tablet, and
  printer network-module restarts while remaining honest about paper/storage.
- Diagnosed the user's repeat oversized layout as Android 16 API-36 large-screen
  orientation override, not a receipt change. Added the official compatibility
  opt-out and reapplied the existing scale after resize/orientation changes.
  Forced-portrait-system launch and three cold-start measurements now pass.
- Physical logo-slip inspection and a true printer power cycle remain before
  PRINT-05 can close.

### 2026-08-21 — PRINT-04 complete; PRINT-05 started

- Committed `PRINT-04: add deterministic receipt encoder` as
  `9c87c625a1f379e7307ec0c167b5002c0ec5e8dc`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-04 done only after focused/build/Android/browser/tablet/log/
  Graphify checks and the user's exact paper comparison passed.
- Marked PRINT-05 as the only card in progress. Normal receipts remain a short
  resident-logo recall; this card owns only deliberate setup/restoration.

### 2026-08-21 — PRINT-04 closeout checks complete

- Re-ran receipt golden, sale, Orders, POS, local database, Settings,
  TypeScript, production-build, Android identity/sync/native-test/assembly, and
  whitespace checks successfully.
- Installed and cold-launched the rebuilt APK on the connected Galaxy Tab. The
  1340 by 800 POS still fills the screen, and the Orders receipt preview shows
  the saved cashier without clipping or internal overflow.
- Browser logs and application-generated tablet logs remain clean; Graphify
  refreshed to 2,335 nodes and 5,332 edges. PRINT-04 is ready to commit/push.

### 2026-08-21 — Application receipt paper accepted

- The user confirmed the 941-byte TypeScript-encoder receipt matches the
  previously accepted receipt perfectly on the WD8260.
- Clarified that this physical test validated a new production encoder without
  receiptline, rather than repeating the already-proven laboratory generator.
- Frozen SHA-256
  `8C8C109B9A4F884D44819A55099C7D88FA7B005927FD5BB4767734E79EF6B1AE`
  as the paper-approved application golden and strengthened no-raster/no-QR
  byte sequence checks.

### 2026-08-21 — PRINT-04 model and encoder reached paper QA

- Traced the immutable local/cloud snapshot and added only optional cashier
  preservation required by the receipt; no current menu/recipe lookup or
  checkout print call was introduced.
- Implemented pure validation/modeling plus deterministic WD8260 encoding with
  saved centimes, fixed café timezone, CP858, wrapping, exact columns, four
  separators, resident-logo recall, emphasis, footer, and partial cut.
- Added `check:printing` covering snapshot/totals/payment validation, maximum
  identifiers, optional context, long line/modifier wrapping, quantity 100,
  large totals, CP858 accents, unsupported replacement, absent QR/raster logo,
  and final cut bytes. Sales/Orders/TypeScript checks remain green.
- Matched the accepted baseline text columns and sent the 941-byte application
  stream from the physical tablet to TCP 9100; exit 0. Awaiting paper comparison
  before freezing its SHA as the reviewed application golden.

### 2026-08-21 — PRINT-03 complete; PRINT-04 started

- Committed `PRINT-03: add LAN printer settings test` as
  `c41e29c75c1a340519c6d217e220ed7f84723f76`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-03 done only after native unit/build, browser/tablet geometry,
  Settings persistence, first and recovery paper, restart, wrong-address,
  clean expected-failure/success console/logcat, Graphify, and documentation
  evidence passed.
- Marked PRINT-04 as the only card in progress. Checkout printing and print
  state remain untouched until the independent model/encoder is proven.

### 2026-08-21 — PRINT-03 physical QA complete

- The user confirmed paper after correcting the endpoint from `.101` to `.100`.
- Force-stopped and relaunched the final synced APK; the corrected endpoint and
  port remain persisted, and the Settings panel still fills the physical tablet
  without clipping or overflow.
- Final Graphify refresh reached 2,295 nodes/5,269 edges. Focused Settings,
  Android, native JVM, TypeScript, production build, checked beta assembly,
  browser, physical tablet, failure/recovery, clean console/logcat, and paper
  verification pass.
- PRINT-03 is ready for closeout review, commit, and push.

### 2026-08-21 — PRINT-03 physical native QA reached

- Synced, built, and installed the Kotlin-enabled APK after all 140 checked
  Gradle tasks passed.
- Entered the measured endpoint through the real tablet Settings UI. It
  persisted across force-stop/relaunch, and the first non-sale diagnostic
  returned 103 bytes/6 ms with honest paper-unconfirmed feedback; the user
  confirmed paper output.
- Wrong address `.101` returned a bounded connect timeout and clear operator
  message. The first implementation used a rejected native promise, which
  Capacitor logged as an expected console error; replaced expected failures
  with a resolved typed `ok:false` result and retained TypeScript error mapping.
- Rebuilt/resynced/reinstalled and re-ran the wrong-address path: UI feedback
  remained correct with no console/logcat warning/error. Correcting `.100`
  recovered to typed `ok:true`, 103 bytes in 6 ms, `paperConfirmed:false`.
- Awaiting the final recovery paper confirmation before Graphify/final checks
  and card commit/push.

### 2026-08-21 — PRINT-03 native transport and Settings implemented

- Added the officially compatible Kotlin 2.3.21/AGP 8.13.2 compiler pair and
  kept the implementation on standard sockets with no printer SDK/dependency.
- Added one registered Capacitor plugin plus bounded native writer. It validates
  IPv4/port/base64/timeouts/payload size, times connect/write, maps observable
  failure stages, and always returns `paperConfirmed: false`.
- Added pure JVM tests proving exact socket bytes and closed-endpoint mapping;
  the checked beta workflow now runs unit tests before APK assembly.
- Persisted validated printer IPv4/port through existing generic
  `device_settings`; no schema migration was needed. Added an Android-only
  non-sale Test printer action and actionable error copy.
- Browser QA at 1340 by 800 passed layout, touch-target, persistence,
  empty/invalid and Android-only states, overflow, and console checks.
- Checkout, saved receipts, logo provisioning, and order reprint remain outside
  PRINT-03. Exact next action is physical APK/native test and recovery QA.

### 2026-08-21 — PRINT-02 complete; PRINT-03 started

- Committed `PRINT-02: prove LAN printer endpoint` as
  `5cb5da399900f6d2aca22bd4ecd341844884d78c`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-02 done with the actual shared-router power-cycle limitation
  explicit and no home-lab address hardcoded into tooling or application code.
- Marked PRINT-03 as the only card in progress. Next action is complete
  ownership/caller inspection before adding the minimal native transport and
  Settings test action.

### 2026-08-21 — PRINT-02 closeout checks complete

- Re-ran the versioned receipt and LAN probe checks; all golden bytes,
  validation, connection-failure, and honest-result assertions pass.
- `npm run android:beta` passed Android identity, production build, Capacitor
  sync, and all 126 Gradle tasks using the existing Java 21/SDK 36 toolchain.
- Reinstalled the current APK on the connected SM-X115, cold-launched it at
  1340 by 800 landscape bounds, and found no WebView console warning/error.
- Browser regression reports viewport/body/document exactly 1340 by 800 and no
  warning/error logs. Graphify refreshed to 2,228 nodes and 5,128 edges;
  whitespace checks pass.
- PRINT-02 is ready for card commit/push. The shared-router reboot limitation
  remains explicit and is not represented as tested.

### 2026-08-21 — PRINT-02 physical path accepted

- The user confirmed paper after tablet Wi-Fi restoration, accepting client
  network-loss and recovery behavior.
- Recorded `192.168.11.100` as home-lab evidence, not a permanent production
  default. The client/router administrator owns reserving/excluding the chosen
  café printer address from DHCP and later router changes.
- Actual shared-router power-off remains explicitly untested because the user
  could not disrupt the connected household. Accepted separate printer cable
  loss and tablet Wi-Fi loss/recovery as the non-disruptive network-path proof.
- PRINT-02 remains in progress only until final checks, commit/push, and SHA
  recording complete.

### 2026-08-21 — Tablet network outage and recovery measured

- The user could not power-cycle the shared household router without disrupting
  everyone. Stopped the local router monitor and did not alter router state.
- Disabled Wi-Fi only on the physical Galaxy Tab. The local route disappeared,
  ping failed, and Android netcat returned `Network is unreachable`, exit 1.
- Re-enabled Wi-Fi; the tablet regained `192.168.11.225/24` in 2,293 ms, and
  printer ping plus TCP 9100 recovered with exit 0.
- Sent the same labeled tablet diagnostic after recovery; socket exit 0 and the
  temporary device file was removed. Paper confirmation is pending.
- This client-side outage plus the accepted printer Ethernet cable-loss cycle
  covers both sides of network-path interruption. Actual router power-off is
  explicitly untested due the user's household constraint.

### 2026-08-21 — Ethernet reconnect paper confirmed

- The user confirmed the post-reconnect `OLASO LAN TABLET TEST` paper printed.
- Accepted Ethernet cable loss, bounded failure, cable restore, socket recovery,
  and physical paper without restarting or reconfiguring the tablet/printer.
- Prepared an ignored ten-minute local ping/TCP monitor for the remaining
  router power-loss test so evidence survives the temporary Wi-Fi outage.

### 2026-08-21 — Ethernet link recovered

- The user reconnected the printer cable, resuming Goal 03.
- Measured ping, TCP 9100, and correct-MAC neighbor recovery without restarting
  the tablet or changing printer settings.
- Sent the labeled 122-byte diagnostic directly from the tablet using the
  verified close-after-EOF path; exit 0 in 135 ms. Awaiting paper confirmation.

### 2026-08-21 — PRINT-02 paused for Ethernet reconnection

- Ethernet link-loss behavior is measured and recorded, but the printer cable
  remained disconnected across the user-triggered test turn and two automatic
  continuations.
- TCP 9100 remains unreachable. PRINT-02 cannot prove reconnect/paper or proceed
  to router-off behavior until the physical cable is restored.
- Goal 03 is blocked without discarding the current worktree. Exact resume
  action: reconnect the printer Ethernet cable and report `cable in`.

### 2026-08-21 — Ethernet link-loss failure measured

- Detected the printer Ethernet link had been removed while both devices
  remained powered.
- Confirmed unreachable ping/neighbor state and a bounded 500 ms
  `CONNECT_TIMEOUT`, exit 1, with no false bytes-written or paper claim.
- Next action is cable reconnection, endpoint recovery timing, and one physical
  diagnostic print.

### 2026-08-21 — Printer restart paper confirmed

- The user confirmed the post-restart tablet LAN diagnostic printed on paper.
- Accepted the printer power-off, bounded failure, power-on, TCP reconnect, and
  physical paper recovery path.
- Next test isolates Ethernet cable loss while both devices remain powered.

### 2026-08-21 — Printer power-on recovery reached

- Detected the powered-on WD8260 without configuration change: ping returned
  and TCP 9100 reopened.
- The first Android netcat recovery write timed out only because it waited for
  the printer to close the socket. Toybox documentation confirmed `-q` is the
  close-after-EOF control; `-q 1 -w 2` then exited 0.
- Sent the same 122-byte labeled diagnostic from the tablet and removed the
  temporary device file. Awaiting user paper confirmation before router/link
  loss testing.

### 2026-08-21 — Printer-off failure measured

- The user powered off only the printer while leaving the router online.
- Confirmed ping loss, incomplete ARP neighbor state, and closed TCP path.
  Windows' default check took 21,127 ms; the product-oriented bounded probe
  stopped in 500 ms with `CONNECT_TIMEOUT`, exit 1, and no bytes-written claim.
- Resumed Goal 03 after the user's physical action. Next action is printer
  power-on, reconnect timing, and a labeled recovery print.

### 2026-08-21 — TCP 9100 paper confirmed

- The user confirmed physical paper output after the workstation golden receipt
  and direct-tablet diagnostic writes.
- Accepted `192.168.11.100:9100` as the measured WD8260 raw endpoint and the
  tablet-to-printer LAN path as proven.
- Printer-off/restart and router/link-off recovery remain before PRINT-02 is
  complete.

### 2026-08-21 — Router and tablet LAN path proven in software

- The user confirmed the self-test address and connected the WD8260 to the
  router. Direct device HTTP readback confirmed its MAC, static IP, mask,
  gateway, and disabled DHCP values.
- Measured successful workstation and tablet ping/TCP paths to
  `192.168.11.100:9100`; HTTP 80 is also reachable.
- Sent the exact accepted 1,814-byte receipt from the workstation LAN probe in
  6 ms total, while retaining honest `paperConfirmed: false` output.
- Pushed a 122-byte labeled diagnostic to the physical Galaxy Tab and sent it
  with Android's native `nc` directly to TCP 9100; the command exited 0 and the
  temporary tablet file was removed.
- Verified an unused wrong address and a wrong port each produce bounded
  connect timeouts with exit 1. Paper confirmation, printer-off/router-off
  recovery, and router address ownership remain before PRINT-02 closeout.

### 2026-08-21 — PRINT-02 paused for physical self-test

- Stored wired IP `192.168.11.100`, mask `255.255.255.0`, and gateway
  `192.168.11.1` were sent through USB without a software error, but the WD8260
  provides no trustworthy USB readback.
- The required power-cycle self-test values remained unanswered across the
  user-triggered configuration turn and two automatic continuations. Without
  that paper, the printer cannot safely be moved to the router or used to prove
  raw TCP 9100.
- Goal 03 is blocked without discarding the current PRINT-02 worktree. Exact
  resume action: provide the self-test IP/netmask/gateway/port (or a photo), then
  move the printer to the router and continue measured LAN tests.

### 2026-08-21 — Printer network values sent over USB

- The user corrected the physical workflow: retain USB locally, write the
  future Ethernet configuration, then disconnect and move the printer to the
  distant router. The vendor manual supports this stored configuration flow.
- Probed candidate `192.168.11.100`; no current ping, ARP neighbor, HTTP, or raw
  print service responded. Router reservation ownership remains open.
- Opened the existing vendor utility with USB and POS-80 selected, entered wired
  IP `192.168.11.100`, mask `255.255.255.0`, and gateway `192.168.11.1`, and
  pressed only the wired `Set above contents` action. No Wi-Fi fields were sent.
- The utility returned no error but provides no verified readback. Exact next
  hardware action: power-cycle with FEED held and inspect the self-test network
  values before moving the printer to the router.
- Added and passed the stdlib-only LAN probe check; it preserves all 1,814
  golden bytes, rejects invalid endpoints, records bounded timing, and never
  claims paper output from a socket write.

### 2026-08-21 — PRINT-02 network baseline measured

- Measured the connected Galaxy Tab A9 at `192.168.11.225/24`, the workstation
  at `192.168.11.222/24`, and the Orange router/gateway at `192.168.11.1`.
- Confirmed the printer's old `192.168.123.100` address is unreachable from the
  active network, as expected while Ethernet is not connected/configured.
- Located and read the existing WD8260 CD IP-configuration, TCP/IP-port, and
  Printer Test V3.2 manuals. They document self-test, MAC-based cross-subnet
  search, IP/mask/gateway configuration, restart/self-test verification, and
  raw TCP 9100 as the expected port.
- Extracted the already-downloaded unsigned Printer Test V3.2.0.1 utility to
  ignored `tmp/`, recorded SHA-256
  `881BE70C2AF3C6CE1AA3148089D2F9DB4ADEBDE8CA44A38D805330A29DD53393`,
  and did not run or install it before the Ethernet cable is connected.
- Exact next action: the user connects the printer Ethernet jack to a router LAN
  port while leaving USB available; then run MAC search, choose a collision-safe
  router-owned address, save/restart, self-test, and prove TCP with real paper.

### 2026-08-21 — PRINT-01 complete; PRINT-02 started

- Final receipt-lab, Android, production-build, Graphify, golden-hash,
  whitespace, staged-scope, forbidden-artifact, and local-queue checks passed.
- Committed `PRINT-01: preserve receipt baseline` as
  `a1bca7fc2df4c0f2b718e7bf46956a2301ee75ea`, pushed it, and confirmed the
  remote branch resolves to the same SHA.
- Marked PRINT-01 done only after the user confirmed both the corrected physical
  tablet layout and accepted USB paper receipt.
- Marked PRINT-02 as the only card in progress. No LAN port or permanent
  printer address is assumed; physical Ethernet/router setup comes first.

### 2026-08-21 — PRINT-01 physical confirmation received

- The user confirmed the installed corrected APK now fits the Galaxy Tab A9 as
  intended with no horizontal or vertical scrolling.
- The user confirmed the USB-printed receipt matches the accepted paper
  baseline, including the resident OLASO logo, layout, separators, MAD heading,
  bilingual footer, and partial cut.
- Restored Goal 03 to active. PRINT-01 remains in progress only until its final
  checks, commit, push, and SHA recording complete.

### 2026-08-21 — PRINT-01 paused for physical confirmation

- Automated receipt, golden-byte, build, browser, Graphify, Android, live
  WebView, repeated cold-start, USB spooler, and external-lab integrity evidence
  is complete.
- The card contract still requires inspection of actual paper. The same request
  for confirmation remained unanswered across three consecutive goal turns;
  starting PRINT-02 or committing PRINT-01 would violate the sequential card
  and physical-evidence gates.
- Goal 03 is blocked without discarding the current worktree. Exact resume
  action: the user confirms whether the installed app fills the tablet without
  scrolling and whether the printed receipt preserves the resident logo, four
  separators, one MAD heading, bilingual footer, and partial cut.

### 2026-08-21 — Physical tablet viewport QA corrected

- Corrected the earlier false claim that the first ADB capture represented a
  passing tablet layout. The user observed the app visibly shrunken with a large
  empty area; activity bounds alone were not valid visual evidence.
- Traced the failure to `ANDROID-01` commit `00b04bfb`: native zoom read
  `window.outerWidth` once before landscape orientation reliably settled. The
  existing Android check explicitly enforced that fragile implementation.
- Rejected `innerWidth` after a physical intermediate build proved it exposes
  the fixed 1340-pixel meta viewport and causes an oversized, scrollable app.
- Queried the live WebView through its debugging boundary: settled values are
  outer/screen `1007 by 601`, inner meta viewport `1340 by 801`, and device pixel
  ratio `1.33125`.
- Replaced the race with the orientation-independent long CSS-screen edge,
  updated the focused Android regression check and authority/DOX wording, built
  and installed the APK, and verified zoom `0.751493` plus document
  `1007 by 602` on three consecutive cold starts with no scroll overflow or
  WebView console warning/error.
- Refreshed the structural Graphify graph and re-ran receipt-lab, Android, build,
  sync, Gradle, and whitespace checks successfully. PRINT-01 remains in progress
  pending the user's visible tablet and paper confirmation.

### 2026-08-21 — Goal 03 and PRINT-01 activated

- Reconstructed the project from the complete DOX, ledger, plan, authority,
  completed Goal 01/02, Goal 03, and existing Graphify evidence before edits.
- Confirmed a clean synchronized `main`, inspected the external receipt lab
  without modifying it, recorded SHA-256 baselines, found both USB printer
  queues available, and confirmed the physical Galaxy Tab A9 is connected.
- Activated Goal 03 with only PRINT-01 in progress. No application, Android,
  checkout, printer-transport, or external-lab behavior changed.
- Preserved the accepted lab in isolated version-controlled tooling with exact
  receiptline/sharp/imagetracer versions, black logo inputs, USB RAW sender,
  resident-logo generator, and five reviewed golden fixtures.
- `npm run check:receipt-lab` regenerated all accepted binary/text fixtures
  byte-for-byte; the nested audit found zero vulnerabilities and no local queue
  name is versioned.
- `npm run android:beta` passed after supplying the existing project-local Java
  21/SDK 36 paths. All 126 Gradle tasks passed, the APK installed on the
  connected SM-X115, and the awake cold launch used a 1340 by 800 landscape
  activity with no WebView console warning/error introduced by the card.
- Browser QA at 1340 by 800 found exact body/document bounds, no overflow, and
  no warning/error console entries. `graphify update .` refreshed the code
  graph to 2,190 nodes and 5,090 edges; the mixed semantic command remains
  unavailable without an external model key.
- Sent the exact 1,814-byte accepted receipt through the available USB queue.
  The external lab hashes remain unchanged. PRINT-01 awaits only visual paper
  confirmation before commit and push.

### 2026-08-21 — Canonical production plan established

- Replaced the competing delivery-order notes with one root PLAN.md containing
  every remaining goal/card and one physical-device completion gate.
- Made production Android LAN ESC/POS printing Goal 03, kept the approved cost
  system as Goal 04, grouped business policy/identity/permissions into Goal 05,
  and moved measured startup work into the final Goal 06 hardening pass.
- Inspected the actual standalone receipt lab and preserved its accepted 48
  column CP858 layout, normal separators, bilingual footer, absent QR/example
  URL, partial cut, and power-cycle-surviving resident logo as Goal 03 inputs.
- Added the user's requirement that every implementation card be tested on the
  connected physical Galaxy Tab rather than waiting for final goal closeout.
- Created a 720 by 196 true-RGBA Operational Green wordmark derivative for the
  later cream startup surface. Pixel validation confirmed alpha 0 through 255,
  a single visible RGB value of 0/106/43, preserved source proportions, and
  SHA-256 `78D9AA90AFE0124D8BBCA298B9CC994A82FE05820116D4A0B00F5DF4154F120B`.
- Queried the existing Graphify graph before inspection. An incremental refresh
  after the documentation renames was attempted but the installed CLI requires
  an external semantic-extraction API key for this mixed code/document/image
  corpus; no structural application code changed, so the existing graph was
  retained and the new PLAN.md remains an explicit mandatory read.
- Verified every local Markdown link, removed stale goal references, passed
  `git diff --check`, and passed `npm run build`. The build retained its known
  jeep-sqlite browser-externalization and large-initial-chunk warnings; this
  planning/asset change added no application import or runtime behavior.
- No React, data, Convex, or Android application behavior changed and no goal
  was activated.

## Completed Goals

- [Goal 01 — Functional POS Interactions](goals/GOAL-01-FUNCTIONAL-POS.md)
- [Goal 02 — Functional Full Application Beta](goals/GOAL-02-FUNCTIONAL-APPLICATION-BETA.md)
- [Goal 03 — Production Checkout and Android LAN ESC/POS Printing](goals/GOAL-03-PRINTING-INTEGRATION.md)
