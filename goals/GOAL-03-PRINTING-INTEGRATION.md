# Goal 03 Plan — Production Checkout and Android LAN ESC/POS Printing

Project rules and durable decisions remain in AGENTS.md, PRODUCT.md,
ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns goal order. This file
owns only Goal 03 execution scope and card contracts.

## Status

**Goal:** Goal 03 — Production Checkout and Android LAN ESC/POS Printing

**Status:** planned; next; activation-ready; not active

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
| PRINT-01 | Preserve and lock the accepted receipt laboratory baseline | pending | — |
| PRINT-02 | Prove and document the physical LAN endpoint and failure behavior | pending | — |
| PRINT-03 | Add minimal Android LAN transport, settings, and test print | pending | — |
| PRINT-04 | Add the saved receipt model and deterministic WD8260 encoder | pending | — |
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

- Goal 03 is planned only; no PRINT card is active and no goal branch exists.
- The accepted standalone lab is present outside Git at D:\Olaso-escpos-lab.
- The app has saved-sale checkout and preview feedback but no production printer
  transport.
- Exact next action after explicit /goal activation: re-read the DOX chain,
  ledger, authorities, PLAN.md, and this file; query Graphify; create and push
  codex/goal-03-printing-integration; mark PRINT-01 in progress; then preserve
  and verify only the accepted lab baseline before touching Android transport.

## Planning journal

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
