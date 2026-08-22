# Goal 05 Plan — Business Policy, Identity, and Permissions

Project rules and durable decisions remain in AGENTS.md, PRODUCT.md,
ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns goal order. This file
owns only Goal 05 execution scope and card order.

## Status

**Goal:** Goal 05 — Business Policy, Identity, and Permissions

**Status:** active; POLICY-02 in progress

**Objective:** Replace temporary beta business rules and development-only
authorization with the owner's confirmed operating policy, production identity
and offline session behavior, enforced roles, protected sensitive data, and
append-only cancellation/refund correction workflows.

## Included

- A recorded owner decision matrix for the receipt header, tax, payment,
  language, receipt numbering, customer/table fields, stock blocking,
  cancellations/refunds, roles, login/PIN behavior, and profitability access.
- A production identity/session model suitable for one cafe and one tablet,
  including offline operation, lock, expiry, recovery, and audit identity.
- Validated and authorized Convex operations plus the minimum local identity
  state required for offline service.
- Owner, manager, and cashier permissions enforced in data functions,
  application operations, data return shapes, and UI affordances.
- Removal of development authorization bypass from production deployment and
  package paths.
- Confirmed tax, payment, receipt, customer/table, and language behavior.
- Authorized cancellation/refund corrections with immutable original records
  and exact sale, stock, cost, and report-summary reversals.
- Physical-tablet access, restart, offline, recovery, and security testing after
  every implementation card.

## Excluded

- Guessing owner policy or treating temporary 0 percent tax as permanent.
- Multi-branch, multi-tenant, multiple simultaneous POS tablets, SSO, social
  login, biometrics, payroll, tax filing, card-terminal integration, or remote
  owner web access unless separately approved.
- Using the terminal ID, printer address, device unlock, or local terminal lock
  as a substitute for user identity.
- Returning individual compensation through cashier, general staff,
  operational-cache, logs, or broad export paths.
- Rewriting or deleting completed sales and stock movements.
- Visual redesign, a new state library, or a generic authorization framework.
- Customer records and loyalty rewards; these are deliberately sequenced as
  Goal 06 after production staff identity and permissions are complete.
- Apple/Google Wallet, Google Smart Tap, payment-terminal reversal, and remote
  owner portals; each remains a separate later integration decision.

## Confirmed POLICY-01 matrix

- **Receipt and tax:** use the approved Olaso logo-only header until legal
  details are requested; no tax calculation or tax line exists anywhere in the
  first production policy. Receipts follow the selected French or English staff
  language and use `MMYY-0001` monthly numbers.
- **Payments:** cash and card only. Splits are sequential product-based
  checkouts: after a customer's selected products are paid, unpaid products
  remain for the next customer. No card-terminal/bank integration exists.
- **Service and stock:** only Dine-in / Sur place and Take-away exist; online,
  table selection, and customer fields are absent. Each ingredient has a
  configurable low-stock warning and required daily staff review; valid sales
  never block for stock.
- **Corrections:** a cashier may make an offline, same-calendar-day
  (Africa/Casablanca) whole-sale cancellation with a required reason, then
  enter a replacement sale. The original record stays immutable and card
  corrections are internal records only. Separate refund/discount behavior is
  unavailable until explicitly approved.
- **Roles and sessions:** permissions are cumulative cashier < manager < owner.
  Profitability, individual compensation, staff, Settings, and owner recovery
  are owner-only. Every staff member has an individual six-digit PIN; staff can
  switch on lock, restart returns locked, idle lock defaults to five owner-
  configurable minutes, and five failures lock locally for five minutes.
  Registered staff may work through a multi-day outage; revocations apply on the
  tablet's next synchronization. Verified support resets an existing owner
  identity without temporary profiles or plaintext PINs.
- **Explicit temporary policy:** physical tablet custody is the first-release
  lost-device control. Legal receipt details, discounts, dedicated refunds, and
  remote owner access remain unavailable rather than implied production
  behavior. Customer/loyalty remains unavailable during Goal 05 and is planned
  explicitly in Goal 06.

## Git workflow and card gate

- Goal branch: codex/goal-05-policy-identity-permissions.
- Keep one card in progress and unrelated work out of its commit.
- Every commit begins with its card ID and is pushed before the card is done.
- Every implementation card follows PLAN.md, including focused checks, Android
  packaging when affected, APK installation, and a card-specific physical
  Galaxy Tab A9 smoke test with clean console/logcat evidence.
- Never commit passwords, PINs, production tokens, salary exports, private
  customer data, signing material, or development bypass credentials.

## Task board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| POLICY-01 | Confirm and record the owner decision matrix | done | `eafe2d3e6603cbf5957c548b5e83473da05465df` pushed to `origin/codex/goal-05-policy-identity-permissions` |
| ID-01 | Define the production identity, offline session, lock, recovery, and threat model | done | `682f64d16f51a0276700eb16f2e6a4b9a07e3cc9` pushed to `origin/codex/goal-05-policy-identity-permissions` |
| ID-02 | Add production identity/session persistence and remove production authorization bypass | done | `f7f3aea090101e30ad09dba3d556a1aa3c58eadc` pushed to `origin/codex/goal-05-policy-identity-permissions` |
| PERM-01 | Enforce role permissions and sensitive-data return boundaries | done | `2ec1a0a4cbb5c6f0632347355e2c6bcb6a07aa7a` pushed to `origin/codex/goal-05-policy-identity-permissions` |
| POLICY-02 | Implement confirmed tax, payment, receipt, customer/table, and language policy | in progress | Confirmed matrix implementation pending |
| ORDER-01 | Implement authorized cancellation/refund corrections and reversals | pending | — |
| ID-03 | Verify offline session, lock, restart, recovery, and failed-access behavior | pending | — |
| POLICY-03 | Run policy, security, regression, tablet, documentation, and push closeout | pending | — |

## Card contracts

### POLICY-01 — Owner decision matrix

- Obtain explicit answers for every open product decision this goal can affect.
- Record confirmed decisions in the owning authority, including temporary or
  effective-date rules when the owner is not ready to make a permanent choice.
- Use example receipts and workflows to remove ambiguity around tax inclusion,
  split or supported payments, receipt numbers, table/customer fields,
  cancellation versus refund, and who may view profit and compensation.
- Change no behavior while a material decision remains unknown.

### ID-01 — Identity and session design

- Define who authenticates, what works offline, session lifetime, fast cashier
  switching if required, lock behavior, failed attempts, owner recovery, and
  audit identity for one physical tablet.
- Choose the smallest supported Convex identity boundary and local offline
  session representation after requirements are known.
- Threat-model lost tablet, shared PIN, offline restart, clock changes, local
  database access, revoked worker, and owner recovery.
- Update ARCHITECTURE.md before implementation if the selected boundary changes
  a locked technical decision.
- The selected boundary is an opaque per-device Convex session token held in
  Android Keystore-backed storage, paired with a protected local PIN verifier
  for offline authentication. See ARCHITECTURE.md for the complete model;
  ID-01 remains in progress until its documentation checks and commit are
  complete.

### ID-02 — Identity/session implementation

- Add only the schema, indexes, functions, migrations, and local state used by
  the confirmed identity/session workflow.
- Store credential verifiers and tokens using platform-appropriate protected
  storage; never store plaintext PINs or secrets in React or ordinary settings.
- Make production functions fail closed without authorized identity and remove
  the development override from production builds/deployments.
- Preserve offline service only within the confirmed session policy and expose
  an actionable locked/recovery state when identity cannot be trusted.

### PERM-01 — Permission enforcement

- Define one permission matrix for owner, manager, and cashier and apply it at
  Convex, application-operation, local-data-return, and UI boundaries.
- Recalculate trusted operation effects server-side; hiding a button is not
  authorization.
- Keep compensation and profitability details owner-only unless POLICY-01
  explicitly approves another role.
- Add negative tests for every sensitive query/mutation and ensure logs and
  caches do not leak restricted fields.

### POLICY-02 — Confirmed operating rules

- Replace temporary tax/payment/customer/table behavior only with confirmed
  rules using integer-centime calculations and deterministic tests.
- Define offline-safe receipt numbering without changing old receipt numbers.
- Apply confirmed receipt language/header and payment representation to saved
  sale snapshots and the existing printing boundary.
- Use ordered migrations and preserve all historical snapshots.

### ORDER-01 — Cancellation and refund corrections

- Preserve the original sale and add explicit authorized corrective records.
- Reverse the original saved stock, ingredient cost, money, and summary effects
  exactly once; never use current product price, recipe, or ingredient cost.
- Make retries idempotent and record actor, reason, time, and original reference.
- Keep unavailable offline/card-terminal actions honest and do not invent cash
  drawer or payment-provider integrations.

### ID-03 — Physical security and recovery QA

- Verify owner/cashier sign-in or PIN behavior, lock/unlock, app restart, tablet
  restart, offline operation, reconnect, session expiry, revoked staff, failed
  attempts, and owner recovery on the physical tablet.
- Attempt unauthorized product, stock, expense, compensation, report, refund,
  and settings access through both UI and direct development calls.
- Confirm salary and sensitive identity data are absent from cashier responses,
  operational caches, logs, and unapproved exports.

### POLICY-03 — Closeout

- Run all affected rule, persistence, sync, report, authorization, Android,
  TypeScript, build, browser, and physical-tablet checks.
- Review secrets, production overrides, indexes, query bounds, session cleanup,
  accessibility, audit history, and recovery documentation.
- Refresh Graphify after structural changes, update all authorities and ledger
  evidence, record pushed SHAs, and finish clean and synchronized.

## Goal completion criteria

- POLICY-01 through POLICY-03 and all intervening ID, PERM, and ORDER cards are
  done, verified, committed, pushed, and recorded.
- No temporary business rule is presented as confirmed production policy.
- Every protected operation enforces identity and permission outside the UI.
- Offline/restart behavior follows the confirmed session policy without
  exposing an unlocked terminal or blocking valid authorized service
  unnecessarily.
- Cancellation/refund retries are exactly-once corrections and historical sale
  snapshots remain immutable.
- Compensation and other sensitive data are absent from unauthorized reads,
  caches, logs, and exports.

## Current checkpoint

- Goal 05 is active on `codex/goal-05-policy-identity-permissions`. POLICY-01,
  ID-01, ID-02, and PERM-01 are pushed and recorded; POLICY-02 is the only
  active card.
- The confirmed matrix above replaces former temporary tax, service, payment,
  correction, role, and lock assumptions. Exact next action is implementing
  the documented protected-session boundary without starting loyalty work.

- ID-02 audit repair is in progress: strict fallback, monotonic local lockout,
  fail-closed startup, protected-operation device-bound token enforcement, and
  focused checks are implemented. The dedicated development deployment accepts
  a valid token and rejects wrong-PIN, mismatched-device, and revoked-token
  requests. SM-X115 APK evidence covers cold locked restart, 1340 × 800
  unclipped lock/POS geometry, and airplane-mode native-offline cached unlock;
  secure preferences/SQLite/source scans contain no plaintext PIN/session.
  Reconnected tablet PIN entry returns to the full POS screen without filtered
  crash/console errors; Graphify is refreshed to 2,671 nodes and 12,431 edges.
  ID-02 was committed as `f7f3aea090101e30ad09dba3d556a1aa3c58eadc`, pushed,
  and confirmed on the canonical branch. Exact next action: inspect and apply
  the confirmed permission matrix for PERM-01.

- PERM-01 is complete. One
  owner/manager/cashier matrix now gates Convex operations, local cache shapes,
  UI navigation, and direct routes. Cashiers retain only POS/Orders data;
  managers retain operational data and expenses but never staff, compensation,
  or profitability; owners retain all confirmed capabilities. SQLite migration
  10 converts legacy cached `worker` roles to `cashier`, and the Convex schema
  rejects the retired role. Focused permission/local/identity/Android checks,
  TypeScript, Convex typecheck, and production build pass. SM-X115 installed
  APK evidence shows a full 1340 × 800 owner POS without filtered crash/console
  errors; direct calls verify the negative authorization boundaries. Graphify
  refreshed to 2,691 nodes and 15,179 edges. Commit
  `2ec1a0a4cbb5c6f0632347355e2c6bcb6a07aa7a` is pushed to the canonical
  branch. Exact next action: implement POLICY-02 alone.

## Planning journal

### 2026-08-21 — Goal 05 sequenced

- Collected temporary business rules, production identity, role enforcement,
  sensitive compensation access, and cancellation/refund correction into one
  dependency-ordered goal.
- Kept the decision card ahead of code so the application does not guess tax,
  payment, receipt, or login behavior.
- Added per-card physical-tablet and negative-authorization testing.
- No application source code changed and Goal 05 remains inactive.

### 2026-08-22 — POLICY-01 decisions confirmed

- The owner confirmed the receipt, tax, cash/card product-split, French/English,
  monthly receipt-number, service, warning-only stock, whole-sale correction,
  role, PIN, offline-session, and support-recovery matrix.
- Loyalty/customer records, discounts, dedicated refunds, legal receipt fields,
  and remote owner access remain deliberately unavailable until separately
  approved. No application behavior changed in this decision card.

### 2026-08-22 — PERM-01 permission boundary completed

- Added a single cumulative owner/manager/cashier matrix across protected
  Convex operations, local operational caches, navigation, and direct routes.
  Legacy cached worker records migrate to cashier and the cloud schema no
  longer accepts the retired role.
- Direct owner, manager, and cashier checks prove the permitted operational
  access, protected staff/compensation/profitability boundaries, and a cashier
  cache without compensation fields. The SM-X115 installed beta retains the
  approved full 1340 × 800 POS geometry without filtered crash/console errors.

### 2026-08-22 — ID-01 identity/session design selected

- Selected opaque per-device Convex session tokens and Android Keystore-backed
  protected local credential material. This preserves multi-day offline PIN
  authentication while applying revocations at next sync, rather than treating
  the device or terminal lock as a user identity.
- Documented lock/switch/restart behavior, monotonic local lockouts, role and
  session enforcement, audit identity, support-mediated owner recovery, shared
  PIN, clock-change, local-database, lost-device, and revoked-worker limits in
  ARCHITECTURE.md. No schema, PIN, session, UI, or authorization code changed.

### 2026-08-22 — Loyalty separated into Goal 06

- Preserved the confirmed anonymous Goal 05 checkout policy and added no
  customer fields or loyalty behavior to active identity work.
- Recorded the client's customer-base and stamp-card request as a dedicated
  post-identity goal with QR-first instant lookup, opaque tokens, append-only
  progress/reward events, and optional NFC hardware proof.
- Apple/Google Wallet and Smart Tap remain deferred adapters rather than
  dependencies of the customer or loyalty data model.
