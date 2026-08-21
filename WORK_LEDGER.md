# Olaso Work Ledger

This file records the active implementation goal. Project rules and durable
product decisions remain in AGENTS.md, PRODUCT.md, ARCHITECTURE.md, DESIGN.md,
and BRAND.md. PLAN.md owns the remaining goal and card sequence.

## Active Goal

No active goal.

## Planned Goals

- [Production delivery plan](PLAN.md) — canonical remaining goal order, all
  card IDs, dependencies, and universal automated/browser/Android/physical
  tablet/printer completion gates.
- [Goal 03 — Production Checkout and Android LAN ESC/POS Printing](goals/GOAL-03-PRINTING-INTEGRATION.md)
  — next approved activation-ready goal; launch only with the reviewed
  [start prompt](goals/GOAL-03-START-PROMPT.md).
- [Goal 04 — Costs and Profitability](goals/GOAL-04-COSTS-PROFITABILITY.md)
  — approved and queued after printing; launch later with the reviewed
  [start prompt](goals/GOAL-04-START-PROMPT.md).
- [Goal 05 — Business Policy, Identity, and Permissions](goals/GOAL-05-BUSINESS-POLICY-IDENTITY-PERMISSIONS.md)
  — planned after costs; POLICY-01 requires explicit owner decisions before
  implementation behavior is changed.
- [Goal 06 — Production Hardening, Release, and Acceptance](goals/GOAL-06-PRODUCTION-HARDENING.md)
  — final goal containing measured startup, branded launch, recovery, signing,
  upgrade, security/quota, endurance, and owner acceptance.

## Current Planning Checkpoint

- No implementation goal or card is active.
- Goal 01 and Goal 02 already provide the functional POS and offline-capable
  Android beta; development is not restarting page by page.
- The canonical PLAN.md now orders the remaining work as printing, costs,
  policy/identity/permissions, then final startup/release hardening.
- Every implementation card requires focused checks and a card-specific smoke
  test on the connected physical Galaxy Tab A9. Printer cards also require real
  paper evidence. Pure documentation work does not reinstall an unchanged APK.
- D:\Olaso-escpos-lab remains the accepted standalone USB receipt source. Goal
  03 begins by preserving and checking it before adding LAN/native code.
- The verified transparent green startup wordmark exists at
  assets/brand/olaso-wordmark-operational-green-transparent.png but is not yet
  consumed by the application; HARD-02 owns that integration.
- Exact next action: the user explicitly activates Goal 03 with
  goals/GOAL-03-START-PROMPT.md; the goal then marks only PRINT-01 in progress.

## Planning Journal

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
