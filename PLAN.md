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
  goal file. Goal 06 continues card by card in normal collaboration, never as
  one autonomous `/goal`. The owner's manual screen review and UI polish are
  the final change phase, after functional and technical completion.
- Detailed card contracts live in the linked goal files. This file stays the
  single overview rather than duplicating every implementation detail.

## Card completion gate

No implementation card is done until all applicable evidence is recorded:

1. Before code, its official Android/Capacitor research checkpoint records the
   applicable native platform options, the selected native-versus-React/data
   boundary, rejected alternatives, and target-device implications. The card
   then follows that decision and proves it on the Galaxy Tab A9.
2. Its focused automated checks pass, including the smallest new check for any
   non-trivial business rule.
3. npm run build passes after source, theme, styling, or bundled-asset changes.
4. Native changes pass npm run check:android, npm run android:sync, and the
   appropriate APK build.
5. The current APK is installed on the connected physical Galaxy Tab A9 and a
   card-specific smoke test passes. UI cards also pass a focused 1340 by 800
   visual and touch check; printer cards also produce and inspect real paper.
6. Browser console and Android logcat contain no error or warning introduced by
   the card.
7. Offline, restart, retry, migration, security, or hardware recovery is tested
   when the card can affect it.
8. Graphify is refreshed after structural code changes, authorities and the
   ledger are current, and the exact next action is recorded.
9. The card commit is pushed directly to `origin/main` and its full SHA is
   recorded in WORK_LEDGER.md.

Pure planning or documentation-only cards validate their links, facts, and
assets but do not rebuild or reinstall an unchanged APK merely to manufacture
evidence. Every implementation card receives real physical-tablet testing.

## Verified baseline

- Goal 01 is complete: the approved POS interactions work.
- Goal 02 is complete as a beta: SQLite checkout/outbox, Convex synchronization,
  management screens, reports, settings, lock, and Android packaging exist.
  Later OFF-01 through OFF-06 proved offline identity/sales/reconnect and saved
  screen reads. Offline management writes remain the explicit LOCAL-01 through
  LOCAL-04 production gap; “offline-capable beta” never means they are done.
- The Galaxy Tab A9 has verified the complete 1340 by 800 composition, touch
  targeting, and cart survival across navigation.
- The separate D:\Olaso-escpos-lab has verified the accepted 80 mm WDLink
  WD8260 receipt through USB. It uses 48 Font-A columns, CP858 page 19, normal
  full-width separators, a single MAD column header, no QR/example URL, a
  bilingual French/English footer, partial cut, and a 300-dot printer-resident
  OLASO logo that survives printer power cycling.
- The production Android printer path is Ethernet/LAN through the router. USB
  remains a desktop laboratory path only. Raw TCP 9100 and the tablet path are
  physically verified; the café router administrator owns reserving/excluding
  the final configurable static address.
- The transparent Operational Green startup wordmark is preserved at
  assets/brand/olaso-wordmark-operational-green-transparent.png. It is not yet
  connected to the Android launch screen.

## Goal roadmap

| Goal | Outcome | Status | Detailed plan |
| --- | --- | --- | --- |
| Goal 01 | Functional POS interactions | done | goals/GOAL-01-FUNCTIONAL-POS.md |
| Goal 02 | Functional offline-capable Android beta | done | goals/GOAL-02-FUNCTIONAL-APPLICATION-BETA.md |
| Goal 03 | Production checkout and Android LAN ESC/POS printing | done | goals/GOAL-03-PRINTING-INTEGRATION.md |
| Goal 04 | Costs and profitability | done | goals/GOAL-04-COSTS-PROFITABILITY.md |
| Goal 05 | Business policy, identity, and permissions | done | goals/GOAL-05-BUSINESS-POLICY-IDENTITY-PERMISSIONS.md |
| Goal 06 | Complete offline management, smooth retained navigation, production hardening, final owner-led UI polish, and acceptance | active; LOCAL-01 in progress | goals/GOAL-06-PRODUCTION-HARDENING.md |

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

Goals 03 through 05 are complete. Goal 06 is planned next; no card is active.

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

POLICY-01 through POLICY-03 are complete.

## Goal 06 — Production hardening and acceptance

Goal 06 completes all functional, offline, performance, recovery, security, and
release-pipeline work first. Only after the application is fully functional and
technically stable does the owner manually review each real screen and prompt
the final UI polish. HARD-08 then verifies and accepts that finished product.
Goal 06 remains normal card-by-card collaboration, not one autonomous `/goal`.

| Card | Outcome |
| --- | --- |
| LOCAL-01 | Add the shared local-first management record, permission, audit, dependency, and outbox foundation. |
| LOCAL-02 | Make category, product, modifier, recipe, price, and availability management fully local-first and immediately visible in POS. |
| LOCAL-03 | Make ingredient, threshold, purchase, adjustment, expense, and compensation management fully local-first. |
| STAFF-01 | Add minimal owner-only staff profile and protected initial-PIN setup that works offline and synchronizes later. |
| CATALOG-01 | Add an offline category-artwork gallery, category-management selection, and a neutral fallback for any custom category. |
| LOCK-01 | Give every staff role a direct Lock / Switch staff action without exposing owner Settings. |
| LOCAL-04 | Prove all authorized management through flight mode, restart, ordered reconnect, duplicate retry, failure recovery, and role isolation. |
| HARD-01 | Establish repeatable five-run cold/warm startup, navigation, APK, WebView, bundle, and readiness baselines after functional work is stable. |
| NAV-01 | Preserve each visited authorized screen, keep saved content visible during refresh, and eliminate repeat page/image reconstruction. |
| HARD-02 | Finalize the app icon and continuous branded launch, with optional measured logo motion after an immediate static first frame. |
| HARD-03 | Consolidate safe SQLite/lock startup gating and remove empty intermediate rendering without exposing an unlocked POS. |
| HARD-04 | Optimize only measured eager modules, assets, decoding, and sync scheduling while preserving behavior and recording before/after evidence. |
| HARD-05 | Implement and rehearse documented export, backup, corrupt-data stop, restore, and support recovery paths. |
| HARD-06 | Add protected production signing, release automation, guided remote tablet updates, install-over-upgrade, rollback, and signing-key custody documentation. |
| HARD-07 | Complete security, privacy, secret, dependency, Convex quota/index, performance, and operational-support review. |
| POLISH-01 | Walk through the now fully functional app with the owner and record every disliked, verbose, redundant, or “AI-ish” element. |
| POLISH-02 | Apply and verify the owner's final changes one screen at a time before moving to the next screen. |
| HARD-08 | Run realistic service endurance, offline/reconnect, printer, upgrade, recovery, final owner acceptance, documentation, and release closeout. |

## First-production-release exit

The project is finished only when every remaining card is done and pushed and
the PRODUCT.md definition of done is satisfied: offline sales and every
authorized management operation are durable and retry-safe, stock and costs
reconcile, permissions protect sensitive data, previously visited screens
return immediately without image/full-page reload, the accepted receipt prints
and reprints on the real WD8260, launch meets its physical-tablet budget without
an unbranded frame, upgrades preserve data, backup/recovery is rehearsed, the
owner-approved simplification list is resolved, every role can lock or switch
staff, the client can install an approved remote update without WhatsApp APK
handling, custom categories always have suitable artwork or a neutral fallback,
and the owner accepts the production workflow.

## Exact next action

Complete LOCAL-01 as the only in-progress card on `main`: extend the existing
serialized SQLite/outbox/reconnect path with the smallest durable management
record, permission, audit, dependency, acknowledgement, and retry foundation.
Do not begin LOCAL-02 or any later card until LOCAL-01 is verified and pushed.
