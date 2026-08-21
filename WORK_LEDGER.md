# Olaso Work Ledger

This file records the active implementation goal. Project rules and durable
product decisions remain in `AGENTS.md`, `PRODUCT.md`, `ARCHITECTURE.md`,
`DESIGN.md`, and `BRAND.md`.

## Active Goal

No active goal.

## Planned Goals

- [Delivery sequence](goals/DELIVERY-SEQUENCE.md) — risk-ordered roadmap and
  vertical-slice execution method.
- [Goal 03 — Startup Performance and Launch Quality](goals/GOAL-03-STARTUP-PERFORMANCE.md)
  — next approved goal; waits for the updated physical tablet; launch with the
  linked [start prompt](goals/GOAL-03-START-PROMPT.md).
- [Goal 04 — Android ESC/POS Printing Integration](goals/GOAL-04-PRINTING-INTEGRATION.md)
  — queued discovery brief; not activation-ready.
- [Goal 05 — Costs and Profitability](goals/GOAL-05-COSTS-PROFITABILITY.md)
  — approved implementation plan, rescheduled after runtime and receipt-path
  risk; launch later with the linked
  [start prompt](goals/GOAL-05-START-PROMPT.md).

## Current Planning Checkpoint

- No implementation goal or card is active.
- Goal 01 and Goal 02 already provide the functional POS and full offline-capable
  Android beta; development is not restarting page by page.
- Exact next action: finish the tablet's One UI update, reconnect it, explicitly
  activate Goal 03, and measure PERF-01 on the unchanged APK before modifying
  startup behavior.
- After Goal 03, complete Goal 04 transport discovery and write its execution
  cards before integrating printing. Goal 05 remains approved but queued.

## Planning Journal

### 2026-08-21 — Runtime-first delivery sequence recorded

- Journaled the observed white/default Android launch, sequential SQLite and
  terminal-setting gates, eager screens, and oversized menu assets into a
  profile-first startup-performance goal.
- Set explicit physical-tablet cold/warm budgets, branded launch continuity,
  offline readiness, lock safety, and before/after evidence requirements.
- Recorded vertical slices as the standard development method: business rules,
  checks, migrations, local/offline operation, idempotent cloud behavior, real
  UI, recovery, and physical QA in one bounded capability.
- Scheduled the production-critical receipt path before Costs and renumbered the
  unchanged cost plan to Goal 05. No application source code changed.

## Completed Goals

- [Goal 01 — Functional POS Interactions](goals/GOAL-01-FUNCTIONAL-POS.md)
- [Goal 02 — Functional Full Application Beta](goals/GOAL-02-FUNCTIONAL-APPLICATION-BETA.md)
