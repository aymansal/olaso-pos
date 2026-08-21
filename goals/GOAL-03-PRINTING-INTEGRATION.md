# Goal 03 Plan — Production Checkout and Android LAN ESC/POS Printing

Project rules and durable decisions remain in AGENTS.md, PRODUCT.md,
ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns goal order. This file
owns only Goal 03 execution scope and card contracts.

## Status

**Goal:** Goal 03 — Production Checkout and Android LAN ESC/POS Printing

**Status:** active; PRINT-04 in progress

**Objective:** Connect each successfully committed local sale to the accepted
Olaso receipt through the Galaxy Tab A9 and WDLink WD8260 over Ethernet/LAN,
with honest failure state and safe reprint recovery that can never duplicate a
sale or stock deduction.

**Start prompt:** GOAL-03-START-PROMPT.md

## Verified starting facts

- The printer self-test identifies a WDLink WD8260-class 80 mm ESC/POS device
  with USB and 10/100 Ethernet, TCP/IP, a 72 mm / 576-dot printing width, Font A
  at 48 columns, CP858 page 19, a cutter, and stored-image support.
- The observed printer network configuration was 192.168.123.100 with DHCP
  disabled. That observation is evidence, not a hardcoded production address.
- The production APK will print through the router to a configurable printer IP
  address and raw TCP port. USB remains a desktop receipt-lab path only.
- D:\Olaso-escpos-lab contains the accepted receipt source, a deterministic
  receiptline-based preview/generator, focused checks, USB RAW printing, and the
  exact WD8260 resident-logo payload.
- The accepted paper layout uses 48 Font-A columns, CP858 page 19, four normal
  full-width separators, one MAD column heading, no QR or example URL, a French
  and English footer, and partial cut.
- The 300-dot OLASO wordmark was written to printer NV image slot 1, recalled
  correctly, and remained available after printer power-off and restart.
- Current application checkout already commits the sale, stock effects, and
  outbox entry locally before exposing receipt-preview feedback. Production
  printing is not implemented.

## Included

- Preservation of the accepted lab source and golden fixtures in Git without
  node_modules, Windows queue settings, generated clutter, or a production
  runtime dependency on the lab.
- LAN endpoint discovery and a physical tablet-to-printer proof.
- Configurable printer address and port, bounded connect/write timeouts, and a
  Settings test action.
- One minimal Capacitor-to-Kotlin printer plugin and raw TCP socket transport.
- A transport-independent saved receipt model and deterministic WD8260 encoder.
- Exact integer-centime totals, CP858-safe French/English copy, product-name and
  modifier wrapping, logo recall, feed, and partial cut.
- One-time resident-logo provisioning from a pre-rasterized bundled payload.
- Persisted print state, post-commit first print, Orders reprint, app/tablet
  restart recovery, disconnect recovery, and honest feedback.
- Real receipt, long-line, logo, cut, reconnect, paper replacement, reprint, and
  endurance testing on the supplied tablet and printer.

## Excluded

- USB or Bluetooth Android transport, speculative transport abstractions, or a
  proprietary SDK while raw LAN ESC/POS works.
- A receipt redesign, new font system, per-sale logo rasterization, or HTML
  printing.
- QR codes or example URLs without a real owner-approved destination.
- Arabic receipt output in this goal. The accepted initial receipt is
  French/English; unsupported-script bitmap work remains deferred until the
  owner asks for it.
- Printing before the local sale commits, cloud-dependent printing, duplicate
  sale creation, duplicate stock deduction, or pretending an unconfirmed paper
  or cutter status was detected.
- Costs/profitability, production authentication, tax-policy invention,
  production signing, launch optimization, or visual redesign.
- A state library, generic printer framework, background service, or additional
  dependency without measured necessity.

## Git workflow

- Goal branch: codex/goal-03-printing-integration.
- Keep one PRINT card in progress and unrelated work out of its commit.
- Every commit begins with its PRINT card ID.
- Push every successful card and record its full SHA and remote branch before
  marking the card done.
- Never commit production credentials, signing material, private business data,
  device secrets, or a fixed deployment-only printer address.

## Task board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| PRINT-01 | Preserve and lock the accepted receipt laboratory baseline | done | Versioned isolated lab and five golden fixtures regenerate byte-for-byte; corrected tablet viewport is stable across three cold starts; checks/build/Android/browser/Graphify and physical tablet/paper QA pass; commit `a1bca7fc2df4c0f2b718e7bf46956a2301ee75ea` pushed to `origin/codex/goal-03-printing-integration`. |
| PRINT-02 | Prove and document the physical LAN endpoint and failure behavior | done | Endpoint/MAC/paper and failure/recovery paths pass with shared-router reboot limitation explicit; configurable tooling and all checks pass; commit `5cb5da399900f6d2aca22bd4ecd341844884d78c` pushed to `origin/codex/goal-03-printing-integration`. |
| PRINT-03 | Add minimal Android LAN transport, settings, and test print | done | Kotlin plugin/writer/tests, persisted endpoint, Settings UI, build/browser/APK, in-app/recovery paper, restart, clean-log wrong-address recovery, Graphify/docs pass; commit `c41e29c75c1a340519c6d217e220ed7f84723f76` pushed to `origin/codex/goal-03-printing-integration`. |
| PRINT-04 | Add the saved receipt model and deterministic WD8260 encoder | in progress | Pure saved-snapshot model/encoder and edge checks pass; user confirms 941-byte paper perfectly matches accepted receipt; SHA frozen as application golden; build, Android beta, installed-tablet/browser preview, logs, and Graphify pass. Awaiting commit/push. |
| PRINT-05 | Add and verify one-time printer-resident logo provisioning | pending | — |
| PRINT-06 | Connect post-commit first print and persisted print state | pending | — |
| PRINT-07 | Add Orders reprint and restart/disconnect recovery | pending | — |
| PRINT-08 | Run endurance, regression, hardware, documentation, and push closeout | pending | — |

## Card contracts

### PRINT-01 — Preserve the accepted baseline

- Copy only the durable standalone lab sources, exact package versions, receipt
  template, black wordmark/vector inputs, resident-logo generator, and focused
  checks into a version-controlled development-tooling location in this
  repository. Exclude node_modules, generated previews/binaries unless used as
  reviewed golden fixtures, and the local Windows queue name.
- Preserve D:\Olaso-escpos-lab unchanged as the accepted external working copy
  until the versioned copy regenerates byte-for-byte equivalent fixtures.
- Keep receiptline and image tooling out of the production APK bundle unless a
  later measured implementation proves they are required.
- Verify 48 columns, CP858 page 19, four full separators, one MAD heading, no
  raster logo in ordinary receipts, no QR/example URL, resident-logo recall,
  and partial cut through focused checks.
- Rebuild and USB-print the unchanged accepted fixture once; compare the real
  paper with the previously accepted layout. This card changes no checkout
  behavior.

### PRINT-02 — LAN discovery and proof

- Confirm the actual raw TCP port from the printer/manual/network behavior; do
  not assume port 9100 without a successful measured print.
- Confirm the tablet and printer share the intended router network and record
  the address, subnet, gateway, DHCP/static or reservation decision, and who
  owns future changes.
- Prove reachability and a minimal raw receipt through the discovered endpoint
  without involving checkout or a saved sale.
- Record connect, write, disconnect, wrong-address, router-off, printer-off, and
  timeout behavior. A raw TCP write acknowledgement is not automatically proof
  that paper printed.
- Store only development evidence in the ledger; do not hardcode the observed
  address as a universal product default.

### PRINT-03 — Android LAN transport and Settings test

- Add one narrow Capacitor/Kotlin plugin that opens a bounded raw TCP socket,
  writes supplied receipt data, flushes, closes, and returns a small typed
  result. Do not create USB/Bluetooth branches.
- Keep ESC/POS receipt construction out of React components. Native code owns
  the LAN connection and printer-byte boundary defined by ARCHITECTURE.md.
- Persist validated printer host/address and port in the existing terminal
  settings ownership. An empty or invalid configuration cannot silently print
  elsewhere.
- Add a clear Test printer action that sends an unmistakable non-sale diagnostic
  and reports configuration, unreachable, timeout, write, and unknown failures
  honestly.
- Pass focused native checks, Android packaging, APK install, real tablet test
  print, restart, and wrong-address recovery without changing checkout.

### PRINT-04 — Receipt model and WD8260 encoder

- Build one transport-independent receipt model from the saved immutable sale
  snapshot; do not read current product names, prices, or recipes for reprints.
- Encode money from integer centimes with no floating-point arithmetic. Preserve
  the temporary explicit 0 percent tax policy until the owner confirms tax.
- Match the accepted 48-column receipt: centered stored logo, TÉTOUAN, order and
  date row, cashier and service context only when present, item/quantity/MAD
  columns, normal separators, subtotal/tax/total/payment/change, bilingual
  footer, feed, and partial cut.
- Add deterministic checks for empty/maximum identifiers, accents in CP858,
  long names, modifiers, multi-digit quantities, large totals, optional
  customer/table/service fields, and unsupported characters.
- Keep QR absent until a real URL and purpose are approved. Never reintroduce
  example.com or decorative data.
- Compare generated preview/bytes and real paper with the accepted lab receipt
  before replacing the mock application result.

### PRINT-05 — Resident-logo provisioning

- Bundle the already prepared monochrome 300-dot logo payload as a static native
  asset; do not rasterize or regenerate it for each receipt.
- Expose a deliberate owner/development printer-setup action that writes the
  logo to the verified WD8260 NV slot and warns that it replaces the device's
  stored image data when that is true.
- Normal receipts send only the short stored-logo recall command.
- Verify setup, ordinary recall, repeated recall, printer power cycle, app
  restart, tablet restart, and unchanged horizontal left-to-right orientation.
- If the printer cannot confirm storage status, say so and verify through a
  physical recall print rather than inventing a checksum response.

### PRINT-06 — Post-commit print and persisted state

- Attempt first printing only after the local checkout transaction succeeds.
  A local save failure keeps the cart and sends no printer data.
- Persist explicit pending, printed, and failed states plus bounded diagnostic
  information without storing secrets or claiming unobservable hardware state.
- Clearing the cart and showing sale success follow the committed sale, not
  printer success. Printer failure exposes recovery and never rolls back or
  recreates the sale.
- Retry/re-entry cannot create another sale, outbox item, receipt number, stock
  movement, or cost effect.
- Verify online/offline checkout, configured/unconfigured printer, printer off,
  timeout, app restart, sync retry, and successful paper output on the tablet.

### PRINT-07 — Reprint and recovery

- Add Reprint receipt to the existing Orders detail path using the saved sale
  snapshot and current printer configuration.
- Reprint updates only print-attempt state; it never repeats checkout or stock
  logic.
- Recover pending/failed print state after app process death and tablet restart.
- Verify router disconnect/reconnect, printer power cycle, wrong address fixed
  in Settings, paper replacement, repeated taps, and concurrent sync work.
- Treat paper-out as a generic failure or timeout unless the verified WD8260
  status protocol returns a trustworthy distinct condition.
- Keep cashier feedback short and actionable: sale saved, receipt printed,
  printer unavailable, or reprint available.

### PRINT-08 — Closeout

- Run all affected money, sale, stock, outbox, order, settings, Convex, Android,
  TypeScript, and production-build checks.
- Print the normal receipt, logo, longest supported item/modifier cases, maximum
  checked totals, optional fields, accents, cut, first print, and reprint.
- Run at least 20 sequential mixed receipts plus five saved-sale reprints,
  including one app restart and one printer/router recovery, and reconcile that
  each checkout produced exactly one sale and stock effect.
- Inspect affected screens at the 1340 by 800 browser viewport and on the
  physical Galaxy Tab A9. Require no clipping, overflow, console errors,
  console warnings, or Android logcat errors introduced by the goal.
- Refresh Graphify after structural changes, update every authority and ledger
  entry, record all pushed SHAs, and finish with a clean synchronized worktree.

## Goal completion criteria

- PRINT-01 through PRINT-08 are done, verified, committed, pushed, and recorded.
- A valid offline local sale is committed once and prints the accepted receipt
  over the real tablet-to-WD8260 LAN path without waiting for Convex.
- Disconnect, timeout, paper replacement, app restart, tablet restart, and
  printer restart preserve the sale and expose safe reprint recovery.
- Reprint never creates a sale, stock movement, outbox entry, or receipt number.
- The stored logo remains crisp and correctly oriented after power cycling and
  is recalled instead of retransmitted for every receipt.
- No QR/example URL, fake status, guessed tax, hidden permanent address, USB or
  Bluetooth production path, or printer protocol leaks into React components.
- All focused checks, npm run build, Android packaging, browser QA, physical
  tablet QA, physical paper QA, endurance, Graphify, documentation, and Git
  closeout pass.

## Current checkpoint

- Goal 03 is active and PRINT-04 is the only card in progress.
- PRINT-03 is complete and pushed at
  `c41e29c75c1a340519c6d217e220ed7f84723f76` on
  `origin/codex/goal-03-printing-integration`.
- PRINT-02 is complete and pushed at
  `5cb5da399900f6d2aca22bd4ecd341844884d78c` on
  `origin/codex/goal-03-printing-integration`.
- PRINT-01 is complete and pushed at
  `a1bca7fc2df4c0f2b718e7bf46956a2301ee75ea` on
  `origin/codex/goal-03-printing-integration`.
- The accepted standalone lab is present outside Git at D:\Olaso-escpos-lab.
- The app has saved-sale checkout and preview feedback but no production printer
  transport.
- The clean synchronized baseline is
  `deba73b1e2baf1b92d7ce6e7f030b7c23c655383` on `main` and `origin/main`.
- The versioned lab regenerates all accepted binary/text fixtures exactly and
  remains isolated from the root production dependencies and APK. The current
  APK build/install, physical-tablet launch, browser console, and structural
  Graphify refresh pass.
- The exact 1,814-byte normal receipt was sent through USB and the external lab
  remains unchanged. The user confirmed the printed paper matches the accepted
  receipt and the corrected APK fills the tablet without scrolling.
- The user rejected the initial tablet QA claim. The pre-existing one-time
  `outerWidth` zoom was a startup-orientation race; the intermediate
  `innerWidth` hypothesis was also rejected because it caused oversize and
  scrolling. The installed correction uses the stable long edge of the CSS
  screen and reports no overflow across three cold starts.
- Exact next action: inspect Graphify plus immutable receipt snapshot writers/
  readers and accepted golden bytes, then add the transport-independent model
  and deterministic WD8260 encoder without connecting checkout.
- Implemented the pure saved-snapshot model and deterministic WD8260 encoder;
  focused snapshot/totals/wrapping/CP858/byte checks pass without checkout or
  transport orchestration.
- Accepted fixture text matches; tablet sent the 941-byte application stream.
  Paper comparison remains before freezing the reviewed SHA.
- User confirmed perfect paper match; application SHA
  `8C8C109B9A4F884D44819A55099C7D88FA7B005927FD5BB4767734E79EF6B1AE`
  is now the reviewed golden.
- Final printing/sales/Orders/POS/local/settings/TypeScript/whitespace checks
  pass. The production build and 140-task checked Android beta build pass, and
  the APK is installed on the connected SM-X115.
- Browser and physical-tablet Orders previews show the saved cashier without
  clipping or internal overflow. The tablet remains full-screen at 1340 by 800;
  browser logs contain no warning/error, and the tablet emitted no
  application-console or card-introduced log warning/error.
- Graphify refreshed to 2,335 nodes and 5,332 edges. Exact next action is the
  PRINT-04 card commit/push, followed by SHA recording and PRINT-05 activation.
- Implemented the minimal standard-socket Kotlin plugin, persistence, and
  Settings diagnostic without checkout changes or new printer SDK/permission.
- Focused native/settings/Android/TypeScript/build/browser checks pass. Physical
  tablet test, paper, restart, wrong-address recovery, and logcat remain.
- Physical APK test confirms saved endpoint, restart persistence, in-app paper,
  bounded wrong-address timeout, corrected recovery, honest typed results, and
  clean expected-failure/success console/logcat. Final recovery paper remains.
- User confirmed recovery paper; final restart retains `.100:9100`. All focused,
  build, native, browser, tablet, log, Graphify, and paper checks pass.
- Measured tablet `192.168.11.225/24`, workstation `192.168.11.222/24`, and
  gateway `192.168.11.1`. The printer remains at old static
  `192.168.123.100` and is not yet on Ethernet.
- The existing vendor CD documents MAC-based cross-subnet `Auto Set IP`, full
  address/mask/gateway fields, restart/self-test confirmation, and expected raw
  TCP 9100. Port 9100 remains unaccepted until a measured print succeeds.
- Sent stored wired values `192.168.11.100 / 255.255.255.0 /
  192.168.11.1` through the USB vendor utility after confirming the candidate
  did not respond on the active LAN. The tool showed no error but self-test
  readback is still required.
- Added a dev-only configurable raw-TCP probe whose focused local check proves
  golden-byte identity, validation, bounded timing, and connection refusal
  without claiming paper status.
- After the user moved the printer to the router, its HTTP information page
  confirmed the stored static network fields and MAC. Workstation and tablet
  paths reach raw TCP 9100; the workstation sent the golden receipt and the
  tablet sent a distinct labeled diagnostic.
- Wrong address and wrong port probes time out within their configured bounds
  without a success claim. Actual paper and power/router recovery remain.
- The user confirmed the LAN paper output, accepting TCP 9100 and the direct
  tablet-to-printer path. Printer and router/link failure recovery remain.
- Printer-off produced incomplete neighbor state and a bounded 500 ms
  `CONNECT_TIMEOUT` with no bytes-written claim. Power-on recovery remains.
- Power-on restored ping/TCP; the tablet close-after-EOF diagnostic path exits
  0. Paper confirmation remains before accepting recovery.
- The user confirmed the post-restart labeled paper, accepting printer power
  recovery. Ethernet link/router failure remains.
- Ethernet cable loss with both devices powered produces unreachable network
  state and bounded 500 ms timeout without false success. Reconnect remains.
- Reconnected Ethernet restores ping, correct MAC, and TCP 9100; the tablet
  diagnostic exits 0. Paper confirmation remains.
- The user confirmed reconnect paper, accepting cable-loss recovery. Router
  power loss and static-address ownership remain.
- Actual router power-off was declined because it would disrupt the household.
  Tablet Wi-Fi off/on instead proved client-route failure and 2.293-second
  recovery; combined with physical cable loss, both ends of the LAN path are
  covered without claiming a router reboot occurred.
- The user confirmed paper after Wi-Fi recovery. `192.168.11.100` is a home-lab
  endpoint only; the café router administrator owns the final static
  reservation/exclusion and future changes, while the app remains configurable.
- Final receipt/LAN, build, Android sync/Gradle, APK install/cold launch,
  WebView/browser console, exact viewport, Graphify, and whitespace checks pass.

## Planning journal

### 2026-08-21 — PRINT-04 ready to push

- Re-ran receipt golden, sale, Orders, POS, local database, Settings,
  TypeScript, production-build, Android identity/sync/native tests/assembly,
  and whitespace checks successfully.
- Installed the rebuilt APK on the real Galaxy Tab and verified the 1340 by
  800 POS plus saved-cashier Orders receipt preview. Browser and tablet checks
  show no clipping, overflow, or new application warning/error.
- Refreshed Graphify to 2,335 nodes and 5,332 edges. The accepted paper remains
  exactly the frozen 941-byte stream; no additional paper approval is needed
  for this closeout.

### 2026-08-21 — PRINT-04 paper and golden accepted

- User confirmed the independent TypeScript encoder prints the accepted WD8260
  receipt perfectly.
- Froze the 941-byte SHA as the application golden and corrected byte-sequence
  assertions to genuinely detect raster-logo or QR commands.

### 2026-08-21 — PRINT-04 application receipt sent

- Added the transport-independent immutable model, exact centime/time/CP858/
  wrapping encoder, and comprehensive pure checks.
- Sent the 941-byte application receipt from the tablet over the verified LAN
  endpoint. Awaiting physical comparison with the accepted receipt before
  golden lock and closeout.

### 2026-08-21 — PRINT-03 pushed; PRINT-04 started

- Pushed the fully verified native LAN settings/test path as
  `c41e29c75c1a340519c6d217e220ed7f84723f76`.
- Marked PRINT-03 done and PRINT-04 as the only card in progress.
- Next work owns only immutable receipt modeling/encoding and golden/paper
  comparison; checkout integration remains PRINT-06.

### 2026-08-21 — PRINT-03 ready to push

- User confirmed corrected-endpoint recovery paper and final restart persistence.
- Final focused/build/native/browser/tablet/logcat/Graphify checks pass; card is
  ready for closeout review and commit/push.

### 2026-08-21 — PRINT-03 device and recovery QA reached

- Installed the Kotlin-enabled APK and tested through the real Settings UI.
- User confirmed the first marked non-sale paper; endpoint survives restart.
- Corrected expected native failures from rejected promises to typed resolved
  results so wrong-address timeout remains actionable without console errors.
- Wrong address and corrected endpoint now pass clean-log recovery; awaiting
  final recovery paper confirmation.

### 2026-08-21 — PRINT-03 implementation ready for device QA

- Added compatible Kotlin build support, registered bounded native LAN socket
  plugin/writer, and pure JVM exact-byte/failure tests.
- Added validated persisted endpoint and Android-only non-sale Test printer UI
  with honest success/failure semantics.
- Browser/build/focused checks pass; checkout remains untouched. Physical
  tablet/paper/restart/wrong-address/logcat QA is next.

### 2026-08-21 — PRINT-02 pushed; PRINT-03 started

- Pushed the verified LAN endpoint/tooling/failure evidence as
  `5cb5da399900f6d2aca22bd4ecd341844884d78c`.
- Marked PRINT-02 done and PRINT-03 as the only card in progress.
- Next work is the narrow Android TCP plugin, validated persisted endpoint, and
  non-sale diagnostic action; checkout remains untouched.

### 2026-08-21 — PRINT-02 ready to push

- Passed focused receipt/LAN checks, production build, Android identity/sync,
  126-task Gradle assembly, physical APK install/cold launch, exact tablet and
  browser bounds, clean consoles, Graphify refresh, and whitespace review.
- Card is ready for commit/push; actual shared-router power cycling remains
  explicitly untested rather than hidden.

### 2026-08-21 — PRINT-02 evidence accepted

- User confirmed paper after tablet Wi-Fi recovery.
- Recorded the lab-only address and assigned café reservation/exclusion
  responsibility to the client/router administrator.
- Shared-router power-off remains honestly untested; separate physical cable
  loss and tablet Wi-Fi loss/recovery provide the approved non-disruptive path.
- PRINT-02 awaits final checks, commit/push, and SHA recording.

### 2026-08-21 — Non-disruptive network recovery measured

- Did not power-cycle the shared router after the user explained the household
  disruption. Recorded the limitation explicitly.
- Disabled/re-enabled only tablet Wi-Fi. Verified immediate unreachable failure,
  restored address/ping/TCP in 2.293 seconds, and exit-0 diagnostic write.
- Awaiting paper and static-address ownership confirmation.

### 2026-08-21 — Ethernet reconnect accepted

- User confirmed labeled paper after cable reconnection.
- Accepted link-loss/reconnect recovery and prepared a local monitor for the
  final router power-loss test.

### 2026-08-21 — Ethernet reconnect reached

- User restored the cable; ping/TCP/correct-MAC reachability returned.
- Tablet recovery diagnostic exited 0 without restart or configuration change.
- Awaiting paper confirmation before the remaining router/address-policy gate.

### 2026-08-21 — PRINT-02 blocked on cable reconnect

- Link-loss failure is verified, but Ethernet remained disconnected across
  three consecutive goal turns.
- No later card was started. Resume by reconnecting the printer cable, then
  measure TCP/paper recovery.

### 2026-08-21 — Ethernet link loss verified

- Measured unreachable ping/neighbor state and bounded 500 ms probe failure
  after the printer Ethernet cable was removed.
- No print success was claimed. Cable reconnect and paper proof are next.

### 2026-08-21 — Printer restart recovery accepted

- User confirmed the labeled tablet diagnostic printed after printer restart.
- Accepted printer-off/restart recovery and moved to Ethernet link-loss testing.

### 2026-08-21 — Printer power recovery reached

- Measured ping and TCP return after printer power-on.
- Corrected the Android diagnostic client to close after input EOF rather than
  waiting for printer response; the recovered write exits 0.
- Awaiting paper confirmation before router/link loss testing.

### 2026-08-21 — Printer-off path verified

- With the router online and printer powered off, measured ping/ARP/TCP loss.
- The bounded probe failed in 500 ms with no success claim, versus a 21.1-second
  Windows default check. Next step is power-on reconnect and paper proof.

### 2026-08-21 — LAN paper path accepted

- The user confirmed paper printed from the measured TCP 9100 writes, proving
  the endpoint and direct Galaxy Tab path.
- Next test isolates printer power-off/restart while leaving the router online.

### 2026-08-21 — Physical LAN endpoint reached

- Confirmed the stored printer network configuration through its own HTTP page
  after router connection and measured workstation/tablet reachability.
- Sent the accepted receipt from the workstation and a labeled raw diagnostic
  directly from the Galaxy Tab to TCP 9100. Both socket writes completed; paper
  is still a separate user confirmation.
- Wrong-address and wrong-port tests produce bounded failures. Printer-off,
  router-off, reconnect, reservation ownership, and paper evidence remain.

### 2026-08-21 — PRINT-02 blocked on physical self-test

- USB configuration and all local probe checks are complete, but the printer's
  stored IP/mask/gateway/port cannot be confirmed in software.
- The self-test request remained unanswered across three resumed goal turns.
  PRINT-02 was not marked done and no later card was started.
- Resume with the power-cycle self-test values or photo, then move the printer
  to the router and prove TCP printing and failure behavior.

### 2026-08-21 — Stored Ethernet values sent over USB

- Used the user-confirmed USB-first workflow to enter the future router-network
  IP, mask, and gateway in the existing vendor utility and sent only the wired
  configuration action.
- No router or Wi-Fi setting changed. Printer self-test must confirm storage
  before the unit is moved to the router.
- Added and passed the development LAN probe's byte-identity, validation, and
  failure checks. The endpoint and port remain unaccepted until real paper
  prints over Ethernet.

### 2026-08-21 — PRINT-02 discovery started

- Measured the live router/tablet/workstation subnet and confirmed the old
  printer address is unreachable as expected before Ethernet setup.
- Inspected the local vendor CD manuals and prepared—but did not run—the
  existing unsigned Printer Test V3.2 utility. The documented MAC search can
  change a cross-subnet printer's IP, mask, gateway, and port.
- No router certificate warning was bypassed, no DHCP reservation was guessed,
  and no printer setting changed. Physical Ethernet connection is the next
  required step.

### 2026-08-21 — PRINT-01 pushed; PRINT-02 started

- Pushed the fully verified receipt baseline and tablet viewport correction as
  `a1bca7fc2df4c0f2b718e7bf46956a2301ee75ea` on the Goal 03 branch.
- Marked PRINT-01 done and PRINT-02 as the only card in progress.
- Confirmed PRINT-02 begins with physical Ethernet/router connection and
  compatible printer addressing; no LAN endpoint or port is assumed.

### 2026-08-21 — PRINT-01 physical QA accepted

- The user confirmed the corrected APK fills the Galaxy Tab A9 without
  horizontal or vertical scrolling.
- The user confirmed the USB receipt matches the accepted resident-logo,
  separator, MAD-heading, bilingual-footer, and partial-cut baseline.
- Resumed Goal 03 with PRINT-01 still in progress pending final checks,
  commit/push, and SHA recording.

### 2026-08-21 — PRINT-01 blocked on paper inspection

- All non-human PRINT-01 evidence is complete, including the corrected physical
  tablet viewport, repeated cold starts, USB spooler completion, and exact
  receipt/logo golden bytes.
- Physical paper inspection remained unanswered across three consecutive goal
  turns. The card was not marked done or committed, and PRINT-02 was not
  started.
- Resume when the user confirms the visible tablet fit and the printed resident
  logo, separators, MAD heading, bilingual footer, and partial cut.

### 2026-08-21 — Tablet viewport verification corrected

- Recorded the user's valid rejection of the first physical QA claim and did
  not mark PRINT-01 done.
- Traced `window.outerWidth` to prior tablet-fit commit `00b04bfb`; its one-time
  cold-start read raced landscape orientation. Live WebView inspection proved
  the correct settled CSS screen is `1007 by 601` while `innerWidth=1340` is the
  fixed meta viewport.
- Replaced the fragile read with the orientation-independent long CSS-screen
  edge, updated the focused Android check to reject both bad APIs, rebuilt and
  installed the APK, and measured zoom `0.751493` and document `1007 by 602`
  without overflow on three consecutive cold starts.
- Updated ARCHITECTURE, DESIGN, source DOX, and Graphify. The screen and paper
  still require user-visible confirmation before PRINT-01 can be committed.

### 2026-08-21 — Goal 03 activated

- Re-read the complete required project context and queried the existing
  Graphify graph before repository inspection.
- Confirmed clean synchronized Git state, inspected the standalone receipt lab
  without modifying it, hashed its durable and generated artifacts, confirmed
  available USB queues, and detected the connected physical Galaxy Tab A9.
- Marked only PRINT-01 in progress. No application, Android transport,
  checkout, or external-lab behavior changed.
- Preserved the accepted lab under `tools/wd8260-receipt-lab/` with a dedicated
  lockfile, exact source/assets, mandatory runtime USB queue, and reviewed
  golden receipt and resident-logo fixtures. No production dependency changed.
- Golden-byte checks, nested dependency audit, root build, Android sync/beta
  assembly, physical tablet install/launch, 1340 by 800 browser regression,
  clean WebView/browser consoles, and structural Graphify refresh pass.
- Sent the exact accepted receipt through USB. The spooler completed and the
  external lab hashes remain unchanged; paper inspection is the remaining
  PRINT-01 completion gate.

### 2026-08-21 — Goal 03 made activation-ready

- Replaced the earlier discovery-only brief with sequential PRINT-01 through
  PRINT-08 execution cards.
- Recorded Ethernet/LAN as the confirmed production direction and USB as the
  accepted standalone lab path.
- Inspected the actual lab source and checks rather than relying on receipt
  photographs or memory.
- Preserved the accepted normal separators, CP858 layout, bilingual footer,
  absent QR, partial cut, and power-cycle-surviving resident logo as invariants.
- Kept checkout idempotency, post-commit printing, honest failure state, and
  real tablet/printer testing as non-negotiable gates.
- No application source or Android printer code changed; Goal 03 remains
  inactive.
