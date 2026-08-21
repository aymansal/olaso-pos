# Olaso Production Delivery Plan

This is the canonical roadmap from the current Android beta to the first
production release. PRODUCT.md owns product behavior, ARCHITECTURE.md owns
technical boundaries, DESIGN.md owns visual behavior, BRAND.md owns brand
assets, and WORK_LEDGER.md owns active progress. This plan owns only goal order,
card order, dependencies, and completion gates.

## How to use this plan

- Read the applicable AGENTS.md chain, WORK_LEDGER.md, and this file before
  starting or resuming a goal.
- Keep only one goal active and only one card in progress.
- The next step is always the first pending card in the first incomplete goal,
  unless WORK_LEDGER.md records an explicit dependency or blocker.
- When the user asks what comes next, answer from this plan and the relevant
  goal file. When the user asks for a /goal prompt, use the reviewed start
  prompt for that goal or generate it from the current goal file; do not
  improvise a different scope.
- Detailed card contracts live in the linked goal files. This file stays the
  single overview rather than duplicating every implementation detail.

## Card completion gate

No implementation card is done until all applicable evidence is recorded:

1. Its focused automated checks pass, including the smallest new check for any
   non-trivial business rule.
2. npm run build passes after source, theme, styling, or bundled-asset changes.
3. Native changes pass npm run check:android, npm run android:sync, and the
   appropriate APK build.
4. The current APK is installed on the connected physical Galaxy Tab A9 and a
   card-specific smoke test passes. UI cards also pass a focused 1340 by 800
   visual and touch check; printer cards also produce and inspect real paper.
5. Browser console and Android logcat contain no error or warning introduced by
   the card.
6. Offline, restart, retry, migration, security, or hardware recovery is tested
   when the card can affect it.
7. Graphify is refreshed after structural code changes, authorities and the
   ledger are current, and the exact next action is recorded.
8. The card commit is pushed and its full SHA and remote branch are recorded in
   WORK_LEDGER.md.

Pure planning or documentation-only cards validate their links, facts, and
assets but do not rebuild or reinstall an unchanged APK merely to manufacture
evidence. Every implementation card receives real physical-tablet testing.

## Verified baseline

- Goal 01 is complete: the approved POS interactions work.
- Goal 02 is complete: the offline-capable full application beta, SQLite
  checkout/outbox, Convex synchronization, management screens, reports,
  settings, lock, and Android package work.
- The Galaxy Tab A9 has verified the complete 1340 by 800 composition, touch
  targeting, and cart survival across navigation.
- The separate D:\Olaso-escpos-lab has verified the accepted 80 mm WDLink
  WD8260 receipt through USB. It uses 48 Font-A columns, CP858 page 19, normal
  full-width separators, a single MAD column header, no QR/example URL, a
  bilingual French/English footer, partial cut, and a 300-dot printer-resident
  OLASO logo that survives printer power cycling.
- The production Android printer path is Ethernet/LAN through the router. USB
  remains a desktop laboratory path only. The exact raw TCP port and final
  address-reservation policy still require a measured network check.
- The transparent Operational Green startup wordmark is preserved at
  assets/brand/olaso-wordmark-operational-green-transparent.png. It is not yet
  connected to the Android launch screen.

## Goal roadmap

| Goal | Outcome | Status | Detailed plan |
| --- | --- | --- | --- |
| Goal 01 | Functional POS interactions | done | goals/GOAL-01-FUNCTIONAL-POS.md |
| Goal 02 | Functional offline-capable Android beta | done | goals/GOAL-02-FUNCTIONAL-APPLICATION-BETA.md |
| Goal 03 | Production checkout and Android LAN ESC/POS printing | active; PRINT-05 in progress | goals/GOAL-03-PRINTING-INTEGRATION.md |
| Goal 04 | Costs and profitability | approved; queued | goals/GOAL-04-COSTS-PROFITABILITY.md |
| Goal 05 | Business policy, identity, and permissions | planned; owner decisions required | goals/GOAL-05-BUSINESS-POLICY-IDENTITY-PERMISSIONS.md |
| Goal 06 | Startup, release hardening, and final acceptance | planned; last | goals/GOAL-06-PRODUCTION-HARDENING.md |

## Goal 03 — Production checkout and printing

Goal 03 closes the most important remaining cashier path: a committed local
sale prints the accepted receipt through the tablet and can be recovered or
reprinted without duplicating the sale or stock movement.

| Card | Outcome |
| --- | --- |
| PRINT-01 | Preserve the accepted standalone receipt sources, profiles, logo payload, deterministic checks, and USB paper baseline in version-controlled development tooling. |
| PRINT-02 | Confirm the WD8260 LAN address, raw TCP port, router/address-reservation policy, reachability, timeout behavior, and tablet-to-printer network path. |
| PRINT-03 | Add the minimal Capacitor/Kotlin LAN socket transport plus validated printer settings and a physical Test printer action. |
| PRINT-04 | Add the transport-independent saved receipt model and WD8260 encoder with exact money, wrapping, CP858, logo recall, cut, and golden-byte checks. |
| PRINT-05 | Add one-time resident-logo provisioning from a bundled pre-rasterized payload and verify recall after printer power cycling. |
| PRINT-06 | Attempt printing only after the local checkout commit and persist honest pending/printed/failed state without duplicate sale or stock effects. |
| PRINT-07 | Add Orders reprint and recovery across printer/router disconnects, app restarts, tablet restarts, timeouts, and paper replacement. |
| PRINT-08 | Run full receipt, checkout, sync, recovery, endurance, browser, Android, tablet, printer, documentation, and push closeout. |

Goal 03 is active. Continue from the single in-progress card recorded in
WORK_LEDGER.md.

## Goal 04 — Costs and profitability

Goal 04 adds exact direct product cost, inventory valuation, compensation,
operating expenses, and monthly profit without double-counting stock purchases.

| Card | Outcome |
| --- | --- |
| COST-01 | Exact cost primitives, migrations, indexes, fixtures, and focused checks. |
| COST-02 | Retry-safe package purchases and weighted-average inventory valuation. |
| COST-03 | Stock receiving, purchase history, and valuation UI. |
| COST-04 | Complete/incomplete recipe and product cost, gross profit, and margin. |
| COST-05 | Immutable offline sale-cost snapshots and correction reversals. |
| COST-06 | Staff profiles and owner-only effective compensation periods. |
| COST-07 | Validated one-time and recurring operating expenses. |
| COST-08 | Bounded monthly Costs and Profitability reporting inside Reports. |
| COST-09 | Reconciliation, authorization, quota, regression, tablet, and documentation closeout. |

The reviewed activation prompt is goals/GOAL-04-START-PROMPT.md.

## Goal 05 — Business policy, identity, and permissions

Goal 05 replaces temporary beta policy and development authorization with the
owner's confirmed operating rules and a production identity boundary.

| Card | Outcome |
| --- | --- |
| POLICY-01 | Confirm and record the legal receipt header, tax, payments, language, customer/table, numbering, stock, cancellation/refund, roles, and profitability-access decisions. |
| ID-01 | Define the single-tablet production identity, offline session, lock, recovery, and threat model without treating device identity as a user. |
| ID-02 | Add production identity/session schema and remove the development authorization override from production builds. |
| PERM-01 | Enforce owner, manager, and cashier permissions at Convex, local operation, data-return, and UI boundaries. |
| POLICY-02 | Implement confirmed tax, payment, receipt-number, customer/table, and language behavior with exact tests and migrations. |
| ORDER-01 | Implement authorized cancellation/refund correction flows with append-only stock, cost, sale, and summary reversals. |
| ID-03 | Verify offline login/lock/restart/recovery, session expiry, failed access, salary isolation, and management protection on the tablet. |
| POLICY-03 | Run policy, identity, permission, security, browser, Android, tablet, documentation, and push closeout. |

Do not generate or run this goal's activation prompt until POLICY-01 inputs are
available or the user explicitly activates POLICY-01 as a decision-only card.

## Goal 06 — Production hardening and acceptance

Goal 06 measures and removes remaining release risk after the workflows are
stable. Startup performance is here intentionally: it will be optimized once
against the near-final application rather than repeatedly before every feature.

| Card | Outcome |
| --- | --- |
| HARD-01 | Establish repeatable five-run cold/warm startup, APK, WebView, bundle, and readiness baselines on the physical tablet. |
| HARD-02 | Connect the approved green transparent wordmark to one continuous cream Android/WebView/React launch surface with no default or white frame. |
| HARD-03 | Consolidate safe SQLite/lock startup gating and remove empty intermediate rendering without exposing an unlocked POS. |
| HARD-04 | Optimize only measured eager modules, assets, decoding, and sync scheduling while preserving behavior and recording before/after evidence. |
| HARD-05 | Implement and rehearse documented export, backup, corrupt-data stop, restore, and support recovery paths. |
| HARD-06 | Add protected production signing and GitHub Release automation, versioning, install-over-upgrade, rollback, and signing-key custody documentation. |
| HARD-07 | Complete security, privacy, secret, dependency, Convex quota/index, performance, and operational-support review. |
| HARD-08 | Run realistic service endurance, offline/reconnect, printer, upgrade, recovery, final owner acceptance, documentation, and release closeout. |

## First-production-release exit

The project is finished only when every remaining card is done and pushed and
the PRODUCT.md definition of done is satisfied: offline sales are exact and
recoverable, stock and costs reconcile, permissions protect sensitive data,
the accepted receipt prints and reprints on the real WD8260, launch meets its
physical-tablet budget without an unbranded frame, upgrades preserve data,
backup/recovery is rehearsed, and the owner accepts the production workflow.

## Exact next action

Continue Goal 03 from PRINT-05. Later cards remain pending until the preceding
card is verified, committed, pushed, and recorded.
