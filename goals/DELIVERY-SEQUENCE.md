# Olaso Delivery Sequence

This document records execution order only. Product behavior remains owned by
`PRODUCT.md`; technical contracts by `ARCHITECTURE.md`; visual behavior by
`DESIGN.md`; brand assets by `BRAND.md`; and active progress by
`WORK_LEDGER.md`.

## Current baseline

- Goal 01 delivered the approved interactive POS.
- Goal 02 delivered the functional offline-capable application beta, including
  editable products and stock, local-first sales, synchronization, Orders,
  Dashboard, Reports, Settings, Lock, and a verified Android development APK.
- The physical Galaxy Tab A9 exposed a startup-quality problem: an unbranded
  native launch surface followed by sequential local-data gates before the POS
  becomes usable.
- The ESC/POS receipt layout and printer-resident logo have been proven
  separately on the WDLink-class printer, but Android application transport is
  not yet integrated or production-approved.
- Costs and profitability have an approved domain plan but are not active.

## Risk-ordered goal sequence

1. **Goal 03 — Startup Performance and Launch Quality.** Establish measured
   Android launch behavior and remove avoidable startup blocking before adding
   more application weight.
2. **Goal 04 — Android ESC/POS Printing Integration.** Complete the critical
   saved-sale-to-physical-receipt path and recovery behavior on the real tablet
   and printer. The goal becomes activation-ready only after transport
   discovery confirms the actual Android connection method.
3. **Goal 05 — Costs and Profitability.** Add weighted-average inventory cost,
   immutable sale-cost snapshots, staff compensation, operating expenses, and
   bounded monthly profitability reporting.
4. **Goal 06 — Business Policy, Identity, and Permissions.** Implement confirmed
   tax, payment, cancellation/refund, receipt-numbering, authentication, roles,
   and sensitive-data access rules. Owner decisions can be collected earlier,
   but application code never guesses them.
5. **Goal 07 — Production Release and Acceptance.** Add protected signing,
   backup/recovery, upgrade and rollback rehearsal, endurance testing, security
   and quota review, and final owner acceptance.

Goal numbers express dependency and risk order, not deadlines. A later goal is
not activated while an earlier production-critical goal remains incomplete,
unless the ledger records an explicit reason and the work is genuinely
independent.

## Development method

Build vertical slices, not disconnected pages and not a speculative complete
backend.

Every business capability follows this order when applicable:

1. Confirm the workflow, owner decisions, failure behavior, and definition of
   done.
2. Implement exact pure business rules with the smallest runnable checks.
3. Add ordered schema migrations, indexes, validation, and authorization.
4. Implement the local transaction and offline/retry behavior.
5. Add idempotent, bounded cloud synchronization and saved summaries.
6. Connect the existing screen and component system to the real operation.
7. Verify recovery, regression, performance, security, and target hardware.
8. Update authorities and ledger evidence, then commit and push the card.

This ordering finds domain and persistence mistakes before UI polish while
still delivering a complete, testable workflow in each goal. It avoids three
failure modes:

- Page-by-page work that leaves attractive screens connected to fake or
  inconsistent behavior.
- Backend-first work that invents unused abstractions and postpones real tablet
  and cashier feedback.
- Cross-application rewrites that make regressions hard to isolate.

## Quality gates

- Keep one goal card in progress and one business rule implementation for each
  responsibility.
- Preserve local-first checkout, integer-centime money, integer base-unit stock,
  idempotency, bounded reads, append-only history, and explicit incomplete
  states.
- Prefer existing React, Capacitor, SQLite, Convex, Astryx, Phosphor, Vite, and
  CSS Module capabilities. Add a dependency only with measured evidence.
- Require focused automated checks for non-trivial logic plus browser and
  physical-device evidence for visual, native, performance, and hardware work.
- Never mark a card done until its checks pass, its documentation and Graphify
  state are current, and its commit is pushed and recorded.
