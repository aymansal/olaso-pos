# Goal 06 Plan — Production Hardening, Release, and Acceptance

Project rules and durable decisions remain in AGENTS.md, PRODUCT.md,
ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns goal order. This file
owns only the final production-hardening scope and card order.

## Status

**Goal:** Goal 06 — Production Hardening, Release, and Acceptance

**Status:** planned; not active; runs after Goals 03 through 05

**Objective:** Let the owner simplify the complete working product, then measure
and remove the remaining startup, recovery, security, performance, packaging,
upgrade, and operational risks before accepting a reproducible signed release
for the real tablet and printer.

## Sequencing decision

Startup quality remains required, but it is implemented here rather than before
printing and costs. This avoids optimizing and re-measuring the bundle before
major features are added. The branded transparent wordmark is prepared now;
actual launch integration and measured optimization happen against the
near-final APK. The owner walkthrough also happens here, after workflows are
stable, so current screens remain unchanged until the owner provides one
complete, explicit critique list.

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
- Current Settings and hardware copy is technically explicit but may be too
  verbose for a small coffee-shop team. The owner will decide what to remove,
  shorten, hide, or retain after reviewing the complete application.
- New POS categories scroll correctly, but no management-owned artwork selector
  or neutral fallback exists for a category outside the initial four.
- The wide launch wordmark is not an app icon. A compact icon and the owner's
  proposed minimal wordmark/light-reveal startup concept remain unapproved; no
  GIF, video, vector, or other motion format is selected yet.

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
- One owner-led full-app critique before visual cleanup, followed by only the
  approved reductions in copy, icons, and visible technical information.
- A versioned category-artwork gallery with explicit category selection and a
  neutral fallback that never blocks an unfamiliar custom category.
- A final compact Android app icon plus an optional minimal branded startup
  motion that cannot delay the immediate static first frame.

## Excluded

- Replacing React, Vite, Capacitor, SQLite, Convex, Astryx, or the approved UI.
- A state library, service worker, custom cache framework, native UI rewrite,
  splash dependency, artificial splash delay, or optimization without a trace.
- New product features, reports, printer transports, speculative scaling,
  Google Play distribution, multi-branch, or multi-tablet conflict machinery.
- Runtime AI image generation, attempting to predict every possible category,
  or requiring a perfect artwork match before a category can be created.
- Preselecting GIF, MP4, or another startup format without bundle/decode/startup
  measurements; decorative motion never extends the splash duration.
- Removing required validation, failure recovery, printer setup, or safety
  actions merely to make a screen look simpler.
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
| POLISH-01 | Capture the owner's complete app-wide simplification and dislike list | pending | — |
| POLISH-02 | Apply the approved operator-facing simplifications without weakening recovery | pending | — |
| CATALOG-01 | Add curated category artwork selection and a neutral custom-category fallback | pending | — |
| HARD-02 | Finalize the app icon and continuous branded launch with optional measured motion | pending | — |
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

### POLISH-01 — Owner walkthrough

- Review every completed screen and important state on the physical tablet with
  the owner after Goals 04 and 05 are stable.
- Record exact keep, remove, shorten, rename, regroup, and hide decisions before
  making visual changes. Treat unnecessary icons, corporate-sounding guidance,
  duplicated status, and permanently visible technical detail as review targets.
- Separate operator-facing essentials from installation, support, recovery, and
  destructive actions that must remain reachable.
- Produce an owner-approved checklist; do not let an agent invent a redesign or
  silently interpret “cleaner” without concrete decisions.

### POLISH-02 — Approved simplification

- Apply only the POLISH-01 checklist using the existing geometry, components,
  Phosphor family, and Olaso tokens.
- Prefer short natural labels and progressive disclosure. Hide support detail
  until it is useful instead of removing the underlying recovery path.
- Simplify Settings and printer setup for a coffee-shop operator while retaining
  validation, test, logo restoration, failure recovery, and accessibility.
- Recheck every affected workflow and 1340 by 800 screen; visual cleanup cannot
  change persistence, authorization, printing, stock, or reporting behavior.

### CATALOG-01 — Category artwork

- Ship a small curated gallery for common café categories and let category
  management select an artwork key; do not bind artwork permanently to names.
- Provide one approved neutral Olaso illustration for any unfamiliar custom
  category so creation never depends on finding an exact match.
- Keep the gallery versioned in the APK, right-sized for the 234 by 120 cards,
  decorative to assistive technology, and expandable through later releases.
- Do not generate artwork at runtime, require network access, or use generic
  stock coffee imagery.

### HARD-02 — Launch continuity

- Use Android's existing platform splash mechanism, Cream Surface, and the
  verified green transparent wordmark; add no splash dependency or activity.
- Finalize a compact Android icon from owner-approved artwork; never crop the
  wide wordmark into an unreadable square or imply a provisional icon is an
  official brand master.
- Match system bars, WebView background, and the first React startup state so no
  white/default frame, jump, stretch, or incorrect logo orientation appears.
- Preserve original wordmark proportions and stable reserved dimensions.
- The first visible frame is always a static local cream/wordmark frame. A brief
  light or line reveal may run only afterward when initialization is still in
  progress, respect reduced motion, and use transform/opacity rather than layout.
- Compare the smallest viable static/vector/CSS/animated-image/video candidates
  on the real APK. Choose from measured bundle size, decode cost, frame quality,
  and startup time; GIF has no automatic preference.
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

- HARD-01 through HARD-08 plus POLISH-01, POLISH-02, and CATALOG-01 are done,
  verified, committed, pushed, and recorded.
- Android, WebView, and React present one immediate Olaso cream launch sequence
  and meet the physical-tablet startup budget without waiting for the network.
- The owner-approved critique list is resolved, the app icon is accepted, and
  every custom category renders selected gallery art or the neutral fallback.
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

### 2026-08-22 — Owner-led polish deferred to final hardening

- Preserved all current screens until the owner can critique the complete app
  instead of encouraging piecemeal AI-driven redesign during feature work.
- Added explicit owner-review and simplification cards, category-art gallery and
  fallback work, compact app-icon approval, and a measured optional launch-motion
  decision with an immediate static/reduced-motion path.
- Recorded GIF/video/vector/CSS as candidates rather than choosing a format
  without physical startup evidence. No application behavior changed.

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
