# Olaso Work Ledger

This file records the active implementation goal. Project rules and durable
product decisions remain in AGENTS.md, PRODUCT.md, ARCHITECTURE.md, DESIGN.md,
and BRAND.md. PLAN.md owns the remaining goal and card sequence.

## Active Goal

### Goal 03 — Production Checkout and Android LAN ESC/POS Printing

**Status:** active

**Goal branch:** `codex/goal-03-printing-integration`

| Card | Status |
| --- | --- |
| PRINT-01 — Preserve and lock the accepted receipt laboratory baseline | done |
| PRINT-02 — Prove and document the physical LAN endpoint and failure behavior | in progress |
| PRINT-03 — Add minimal Android LAN transport, settings, and test print | pending |
| PRINT-04 — Add the saved receipt model and deterministic WD8260 encoder | pending |
| PRINT-05 — Add and verify one-time printer-resident logo provisioning | pending |
| PRINT-06 — Connect post-commit first print and persisted print state | pending |
| PRINT-07 — Add Orders reprint and restart/disconnect recovery | pending |
| PRINT-08 — Run endurance, regression, hardware, documentation, and push closeout | pending |

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

- Goal 03 is active and PRINT-02 is the only card in progress.
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

## Planning Journal

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
