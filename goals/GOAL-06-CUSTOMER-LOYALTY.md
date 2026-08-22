# Goal 06 Plan — Customer Loyalty and Instant Identification

Project rules and durable decisions remain in AGENTS.md, PRODUCT.md,
ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns goal order. This file
owns only the customer/loyalty scope and card order.

## Status

**Goal:** Goal 06 — Customer Loyalty and Instant Identification

**Status:** planned; not active; runs after Goal 05

**Objective:** Give Olaso an owner-controlled customer base and a fast,
local-first digital stamp-card workflow. A scan identifies a customer in
seconds, completed qualifying sales earn append-only progress, rewards redeem
exactly once, and staff never depend on Apple Wallet, Google Wallet, or a slow
name search during service.

## Confirmed direction

- Online ordering is not part of Olaso. The only service modes remain on-site
  (`Dine-in` / `Sur place`, final label still owner-confirmed) and take-away.
- The client wants a customer base and a stamp-card reward after a configurable
  number of qualifying visits or purchases. The reported threshold is roughly
  seven to nine, but the exact rule and free reward are not confirmed.
- Scan is the primary lookup. Name or phone search is a fallback for a lost or
  unavailable card, not the ordinary checkout path.
- The first production path is a generated QR loyalty card saved on the
  customer's phone or printed. A USB/Bluetooth 2D scanner that emits keyboard
  input avoids a camera workflow, proprietary SDK, and platform wallet account.
- An optional physical NFC+QR card may carry the same opaque token after one
  selected reader proves a standard keyboard/HID or minimal supported Android
  path. NFC is not required for the QR production path.
- QR and NFC data contain only a random revocable loyalty token. They contain
  no name, phone number, reward balance, visit count, authentication secret, or
  payment authority.
- Customer state and loyalty events are local-first for the single tablet and
  synchronize idempotently. A network outage cannot block recognition, earning,
  or an allowed redemption under the confirmed policy.

## Wallet decision

- Apple Wallet passes are not a free dependency for this release. Passes use a
  registered Pass Type ID and signing certificate, while Apple currently lists
  Developer Program membership at 99 USD per year.
- Google Wallet supports loyalty/generic passes, but its official setup requires
  a Wallet issuer, Google Cloud project, service account, and protected server
  credentials. Google Smart Tap NFC additionally requires a compatible certified
  terminal. Official documentation does not establish a per-pass fee, so cost
  is not the reason recorded for excluding it; operational complexity is.
- Wallet integrations may be reconsidered later. The loyalty data model must not
  depend on either platform, so a future pass can reuse the same customer and
  loyalty records without migration.

Official references:

- [Apple Developer Program membership](https://developer.apple.com/programs/whats-included/)
- [Apple Wallet pass signing](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html)
- [Google Wallet loyalty and generic passes](https://developers.google.com/wallet)
- [Google Wallet server authentication](https://developers.google.com/wallet/generic/getting-started/auth/rest)
- [Google Wallet Smart Tap requirements](https://developers.google.com/wallet/retail/offers/resources/faq)

## Decisions required before implementation

- What earns one stamp: a visit, completed sale, eligible drink, minimum spend,
  or another checked rule?
- Can a customer earn more than one stamp per sale or per local business day?
- Exact threshold, reward type, eligible products, maximum price, expiry, and
  whether redeeming a reward also earns progress.
- Whether a cancellation reverses an earned stamp and how a corrected/replaced
  sale affects progress.
- Which roles may create customers, merge duplicates, adjust progress, redeem a
  reward, revoke a token, or reissue a card.
- Minimum customer fields, consent wording, optional phone/name use, retention,
  deletion/anonymization, export, and duplicate handling.
- How the customer receives the QR: displayed for saving, shared as an image,
  printed, or issued on a physical dual QR/NFC card.
- Exact scanner and optional NFC reader models before hardware integration.

## Included

- Minimal customer records, explicit consent/status, bounded search fallback,
  and duplicate-safe management.
- Random opaque token issue, scan lookup, revocation, and reissue.
- A local/cloud append-only loyalty-event ledger linked to immutable completed
  sales, cancellation corrections, reward eligibility, and redemption.
- Retry-safe offline earning/redemption rules with deterministic reconciliation.
- Fast POS scan, customer confirmation, progress/reward display, and manual
  fallback without adding customer fields to every anonymous sale.
- QR card generation and physical scanner verification.
- One optional NFC reader/card proof using the same token boundary; failure to
  accept NFC does not invalidate the approved QR path.
- Browser, Android, physical-tablet, scanner/card, privacy, restart, offline,
  reconnect, lost-card, and endurance QA.

## Excluded

- Online ordering, a customer mobile app, Apple/Google Wallet integration,
  Google Smart Tap, payment cards, stored value, or bank/payment authority.
- Marketing automation, SMS/email campaigns, location tracking, birthday
  profiling, social login, or collecting data without explicit owner policy.
- PII, progress, or reward state inside QR/NFC data.
- Trusting a scanned token as staff/customer authentication or allowing a scan
  alone to redeem or modify value without the confirmed staff permission.
- Runtime AI, a generic hardware framework, or multiple loyalty providers.

## Git workflow and card gate

- Goal branch: `codex/goal-06-customer-loyalty`.
- Keep one LOYALTY card in progress and unrelated work out of its commit.
- Every commit begins with its card ID and is pushed before the card is done.
- Every implementation card follows PLAN.md, including focused checks, Android
  packaging when affected, APK installation, and a card-specific physical
  Galaxy Tab A9 smoke test with clean console/logcat evidence.
- Never commit customer data, issued real tokens, exports, credentials, or
  hardware secrets.

## Task board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| LOYALTY-01 | Confirm reward, consent, customer-data, correction, redemption, and hardware policy | pending | — |
| LOYALTY-02 | Add minimal customer records, opaque tokens, local cache, schema, indexes, and deterministic fixtures | pending | — |
| LOYALTY-03 | Add append-only local/cloud earn, redeem, reversal, and reconciliation events | pending | — |
| LOYALTY-04 | Add instant QR scan-and-confirm POS flow, card issue/revoke/reissue, and manual fallback | pending | — |
| LOYALTY-05 | Prove optional NFC input, offline/restart/recovery, privacy, endurance, tablet, documentation, and push closeout | pending | — |

## Card contracts

### LOYALTY-01 — Owner policy

- Obtain every open decision listed above using concrete coffee-shop examples.
- Record confirmed rules in PRODUCT.md and security/privacy boundaries in
  ARCHITECTURE.md before schema or UI implementation.
- If a material reward or customer-data rule is undecided, keep the related
  behavior unavailable rather than selecting an industry default.

### LOYALTY-02 — Customers and tokens

- Add only the customer fields approved by LOYALTY-01, with status, audit actor,
  creation/update metadata, and bounded indexed lookup.
- Generate high-entropy opaque token values, store only the necessary verifier
  or identifier form, and support active, revoked, and replacement state.
- Cache only the bounded active customer/token data required for offline scan on
  the single tablet. Keep customer records out of unrelated operational reads.
- Add ordered SQLite migrations, Convex schema/indexes, deterministic fixtures,
  and focused validation/privacy checks.

### LOYALTY-03 — Append-only reward ledger

- Earn progress only from a trusted completed sale that satisfies the confirmed
  rule; retries cannot earn twice.
- Record earn, cancellation reversal, manual authorized adjustment, reward
  eligibility, and redemption as immutable linked events.
- Redemption is exactly once and uses the staff actor/session from Goal 05.
- Preserve offline progress and outbox recovery, then reconcile deterministically
  at Convex without rewriting historical events.

### LOYALTY-04 — Fast service workflow

- Treat scanner input as one bounded opaque token followed by explicit customer
  confirmation; do not expose or search the full customer list on every sale.
- Attach the confirmed customer to the intended sale only. Anonymous checkout
  remains fast and supported.
- Show concise progress and reward availability without crowding the 320-pixel
  receipt rail or blocking product/category/cart interactions.
- Issue a QR card using the approved delivery method. Provide explicit lost-card
  revoke/reissue and a bounded manual name/phone fallback.

### LOYALTY-05 — Hardware and closeout

- Verify the selected 2D scanner on the physical tablet through its actual
  Android input path, including rapid repeated scans and malformed tokens.
- If the owner still wants NFC, verify one selected NFC+QR card and reader using
  the same token. Accept it only if it is fast, recoverable, and adds no fragile
  vendor dependency; otherwise record QR as the production choice.
- Test offline earning/redemption, app/tablet restart, reconnect, duplicate
  retries, cancellation reversal, lost/reissued card, unauthorized redemption,
  customer deletion/anonymization, and realistic service endurance.
- Run full domain, persistence, sync, authorization, privacy, browser, Android,
  tablet, documentation, Graphify, push, and clean-worktree closeout.

## Goal completion criteria

- LOYALTY-01 through LOYALTY-05 are done, verified, committed, pushed, and
  recorded.
- A scan identifies the correct customer quickly without exposing PII in the
  token or requiring routine name search.
- Qualifying sales, cancellations, adjustments, and rewards reconcile exactly
  across offline work, retries, restarts, and synchronization.
- Lost tokens can be revoked/reissued, unauthorized actors cannot modify or
  redeem progress, and customer privacy rules pass negative checks.
- The QR workflow passes on the real tablet and selected scanner. NFC is either
  physically accepted with the same boundary or honestly deferred.

## Current checkpoint

- Goal 06 is planned only; no LOYALTY card or goal branch is active.
- The exact reward/customer-data policy and scanner/NFC hardware remain open.
- Exact next action after Goal 05 completes: obtain LOYALTY-01 answers, then
  generate the current activation prompt and start only LOYALTY-01.

## Planning journal

### 2026-08-22 — Customer loyalty added before final hardening

- Recorded the client's customer-base and stamp-card requirement plus the need
  for instant scan recognition rather than routine name search.
- Selected a platform-independent QR-first architecture with an optional
  physical NFC+QR card using the same opaque token; no app behavior was changed.
- Deferred Apple/Google Wallet and Smart Tap because of membership, issuer,
  server-credential, and certified-terminal dependencies.
- Kept the reward threshold, qualifying rule, free item, customer consent/data,
  and hardware models explicitly open for owner confirmation.
