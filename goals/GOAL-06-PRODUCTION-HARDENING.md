# Goal 06 Plan — Production Hardening, Release, and Acceptance

Project rules and durable decisions remain in AGENTS.md, PRODUCT.md,
ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns goal order. This file
owns only the final production-hardening scope and card order.

## Status

**Goal:** Goal 06 — Production Hardening, Release, and Acceptance

**Status:** planned; not active; runs after Goals 03 through 05

**Objective:** Measure and remove the remaining startup, recovery, security,
performance, packaging, upgrade, and operational risks in the near-final
application, then produce and accept a reproducible signed release for the real
tablet and printer.

## Sequencing decision

Startup quality remains required, but it is implemented here rather than before
printing and costs. This avoids optimizing and re-measuring the bundle before
major features are added. The branded transparent wordmark is prepared now;
actual launch integration and measured optimization happen against the
near-final APK.

## Verified starting leads

- The current native launch path can show default/unbranded white artwork before
  the application becomes visible.
- React waits for SQLite and then terminal settings, has an empty intermediate
  render, eagerly imports major screens, and includes oversized source images.
- The local POS already works independently of Convex success, so network work
  must never gate usable startup.
- The physical Galaxy Tab A9 and current WebView expose the approved full
  application through native scaling, but startup timing was not yet recorded
  through controlled five-run cold/warm tests.
- assets/brand/olaso-wordmark-operational-green-transparent.png is a verified
  720 by 196 RGBA derivative of the supplied artwork, colored Operational Green
  for use on the Cream Surface. It is not yet referenced by the app.
- Goal 02 proved debug install-over-upgrade and local migration. Production
  signing, protected key custody, release automation, backup restore, rollback,
  endurance, and owner acceptance remain incomplete.

## Included

- Repeatable physical-tablet startup baselines and ready marks.
- One continuous branded cream Android/WebView/React launch surface.
- Safe SQLite/lock startup gating and elimination of blank intermediate state.
- Profile-driven bundle, image, decode, and synchronization scheduling work.
- Export, backup, restore, corrupt-data stop, and support recovery rehearsal.
- Protected signing, versioning, GitHub Actions/Release flow, upgrade, rollback,
  and signing-key custody documentation.
- Security, privacy, dependency, secret, Convex quota/index, performance, and
  support readiness review.
- Realistic service endurance and final owner acceptance on the actual tablet
  and printer.

## Excluded

- Replacing React, Vite, Capacitor, SQLite, Convex, Astryx, or the approved UI.
- A state library, service worker, custom cache framework, native UI rewrite,
  splash dependency, artificial splash delay, or optimization without a trace.
- New product features, reports, printer transports, speculative scaling,
  Google Play distribution, multi-branch, or multi-tablet conflict machinery.
- Committing signing keys, credentials, production exports, device identifiers,
  or private owner recovery information.

## Git workflow and card gate

- Goal branch: codex/goal-06-production-hardening.
- Keep one HARD card in progress and unrelated work out of its commit.
- Every commit begins with its card ID and is pushed before the card is done.
- Every implementation card follows PLAN.md, including focused checks, APK
  installation, physical Galaxy Tab A9 testing, and clean console/logcat
  evidence. Printer-impacting work also receives real paper verification.

## Task board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| HARD-01 | Establish controlled startup, APK, WebView, bundle, and readiness baselines | pending | — |
| HARD-02 | Add continuous branded Android/WebView/React launch styling | pending | — |
| HARD-03 | Consolidate safe SQLite and terminal-lock startup gating | pending | — |
| HARD-04 | Optimize only measured modules, assets, decoding, and sync scheduling | pending | — |
| HARD-05 | Implement and rehearse export, backup, restore, and corrupt-data recovery | pending | — |
| HARD-06 | Add protected production signing, release, upgrade, and rollback workflow | pending | — |
| HARD-07 | Complete security, privacy, dependency, quota, and support readiness review | pending | — |
| HARD-08 | Run service endurance, final owner acceptance, and release closeout | pending | — |

## Card contracts

### HARD-01 — Baseline and instrumentation

- Rebuild/install the unchanged near-final baseline and record at least five
  force-stopped cold launches and five warm launches on the physical tablet.
- Record Android initial display and application ready marks for SQLite, lock,
  POS shell, and cached menu, plus exact APK, Android, and WebView identity.
- Record median, minimum, and maximum rather than optimizing from one subjective
  launch.
- Measure initial JavaScript/CSS, APK assets, image dimensions/decoding, and
  synchronization start without adding a permanent telemetry framework.

### HARD-02 — Launch continuity

- Use Android's existing platform splash mechanism, Cream Surface, and the
  verified green transparent wordmark; add no splash dependency or activity.
- Match system bars, WebView background, and the first React startup state so no
  white/default frame, jump, stretch, or incorrect logo orientation appears.
- Preserve original wordmark proportions and stable reserved dimensions.
- Do not hold the splash longer to disguise slow initialization.

### HARD-03 — Safe startup orchestration

- Show one branded startup state while SQLite and terminal-lock state settle.
- Remove empty intermediate rendering without exposing the POS before lock and
  database safety state are known.
- Keep actionable failure behavior when local data cannot open.
- Preserve ordered migrations, foreign keys, transaction serialization,
  outbox recovery, and local cart/session behavior.

### HARD-04 — Measured performance

- Keep only the initial POS, required lock/startup path, and proven shared shell
  eager; load secondary screens on demand only when traces show benefit.
- Right-size local product/category assets for their actual rendering, reserve
  dimensions, and defer only below-the-fold decoding without blur or layout
  shift.
- Start cloud refresh/outbox work after the cached local POS is responsive while
  preserving eventual automatic recovery and idempotency.
- Compare timing, bundle, APK, memory/decode, offline, and visual evidence after
  each measured change; remove changes that do not help the target tablet.

### HARD-05 — Backup and recovery

- Add the smallest documented export covering sales, products, recipes, stock
  movements, purchases, compensation periods, and expenses as required by
  ARCHITECTURE.md, with explicit inclusion and privacy rules.
- Rehearse export, restore, unsynced-sale preservation, corrupt/unrecoverable
  local-data stop, and owner/support recovery without unsafe checkout.
- Record Convex backup limitations and owner retention responsibility.
- Keep recovery instructions and private recovery locations outside public
  source where appropriate.

### HARD-06 — Signed release and upgrade

- Add protected CI/release configuration for the same application ID, increased
  version code/name, repeatable signed APK, and GitHub Release attachment.
- Keep keystore, passwords, and credentials in protected secret storage and
  document off-repository signing-key custody and recovery ownership.
- Test install-over-upgrade from the previous accepted APK, preserve SQLite and
  settings, then rehearse rollback using the known-good previous artifact and
  documented data constraints.
- Produce deterministic release notes, checksums, and installation steps.

### HARD-07 — Readiness review

- Search for secrets, production development overrides, unbounded Convex reads,
  database filters where indexes apply, sensitive data exposure, stale
  dependencies, and excessive function/I/O patterns.
- Re-run negative authorization and compensation isolation checks.
- Review Android permissions, network configuration, database encryption
  decision, export privacy, logs, crash/support evidence, and printer settings.
- Record first-production-week Convex and operational monitoring steps without
  adding speculative infrastructure.

### HARD-08 — Endurance and acceptance

- Repeat five cold and five warm startup runs. Require median usable cold start
  at most two seconds and warm start at most one second, with no network gate or
  unbranded frame.
- Run realistic service volume across ordering, printing/reprinting, stock,
  management, costs, identity, offline/reconnect, app/tablet/printer restart,
  sync recovery, and an install-over-upgrade.
- Reconcile sales, stock, costs, summaries, print states, and outbox state after
  the run; investigate every mismatch rather than normalizing it.
- Complete final browser and physical 1340 by 800 visual/touch/accessibility QA,
  real printer acceptance, owner workflow acceptance, documentation, Graphify,
  release tag, pushed SHAs, and clean worktree.

## Goal completion criteria

- HARD-01 through HARD-08 are done, verified, committed, pushed, and recorded.
- Android, WebView, and React present one immediate Olaso cream launch sequence
  and meet the physical-tablet startup budget without waiting for the network.
- Backup/export, corrupt-data stop, recovery, signed build, upgrade, rollback,
  and key custody are documented and rehearsed.
- Security, privacy, permissions, quotas, dependencies, logs, browser console,
  Android logcat, and hardware checks are clean.
- A realistic service run reconciles exactly and the owner accepts the final
  tablet, receipt, menu, policy, reports, and recovery workflow.

## Current checkpoint

- Goal 06 is planned only; no HARD card is active and no goal branch exists.
- The startup wordmark asset exists but is intentionally not consumed before
  HARD-02.
- Exact next action after Goal 05 completes: re-read the DOX chain, ledger,
  PLAN.md, and authorities; query Graphify; confirm the near-final APK and
  physical hardware are available; generate the current /goal prompt; create
  codex/goal-06-production-hardening; and start only HARD-01.

## Planning journal

### 2026-08-21 — Startup moved into final hardening

- Preserved the profile-first startup scope and physical cold/warm budgets while
  moving execution after feature work to avoid repeated premature optimization.
- Added backup/recovery, protected signing, upgrade/rollback, security/quota,
  service endurance, and owner acceptance to the same final release goal.
- Recorded the verified green transparent wordmark as the future launch asset
  without connecting it to the current application.
- Added physical-tablet evidence after every implementation card.
- No application source or Android launch code changed and Goal 06 remains
  inactive.
