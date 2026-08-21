# Goal 05 Plan — Business Policy, Identity, and Permissions

Project rules and durable decisions remain in AGENTS.md, PRODUCT.md,
ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns goal order. This file
owns only Goal 05 execution scope and card order.

## Status

**Goal:** Goal 05 — Business Policy, Identity, and Permissions

**Status:** planned; not active; owner decisions required

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
| POLICY-01 | Confirm and record the owner decision matrix | pending | — |
| ID-01 | Define the production identity, offline session, lock, recovery, and threat model | pending | — |
| ID-02 | Add production identity/session persistence and remove production authorization bypass | pending | — |
| PERM-01 | Enforce role permissions and sensitive-data return boundaries | pending | — |
| POLICY-02 | Implement confirmed tax, payment, receipt, customer/table, and language policy | pending | — |
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

- Goal 05 is planned only; no card is active and no goal branch exists.
- PRODUCT.md lists the owner decisions that remain open.
- The current local terminal lock is a safety convenience, not authentication.
- Exact next action when Goal 04 is complete: obtain POLICY-01 answers or
  explicitly activate POLICY-01 as a decision-only card. Generate the /goal
  prompt from this current file only after that choice.

## Planning journal

### 2026-08-21 — Goal 05 sequenced

- Collected temporary business rules, production identity, role enforcement,
  sensitive compensation access, and cancellation/refund correction into one
  dependency-ordered goal.
- Kept the decision card ahead of code so the application does not guess tax,
  payment, receipt, or login behavior.
- Added per-card physical-tablet and negative-authorization testing.
- No application source code changed and Goal 05 remains inactive.
