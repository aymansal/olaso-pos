# Olaso Work Ledger

This file records the active implementation goal. Project rules and durable
product decisions remain in AGENTS.md, PRODUCT.md, ARCHITECTURE.md, DESIGN.md,
and BRAND.md. PLAN.md owns the remaining goal and card sequence.

## Active Goal

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
- [Goal 04 — Costs and Profitability](goals/GOAL-04-COSTS-PROFITABILITY.md)
  — approved and queued after printing; launch later with the reviewed
  [start prompt](goals/GOAL-04-START-PROMPT.md).
- [Goal 05 — Business Policy, Identity, and Permissions](goals/GOAL-05-BUSINESS-POLICY-IDENTITY-PERMISSIONS.md)
  — planned after costs; POLICY-01 requires explicit owner decisions before
  implementation behavior is changed.
- [Goal 06 — Production Hardening, Release, and Acceptance](goals/GOAL-06-PRODUCTION-HARDENING.md)
  — final goal containing measured startup, branded launch, recovery, signing,
  upgrade, security/quota, endurance, and owner acceptance.

## Current Checkpoint

- Goal 03 is complete; no card is in progress.
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
