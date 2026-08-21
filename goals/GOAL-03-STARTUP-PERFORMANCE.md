# Goal 03 Plan — Startup Performance and Launch Quality

Project rules and durable decisions remain in `AGENTS.md`, `PRODUCT.md`,
`ARCHITECTURE.md`, `DESIGN.md`, and `BRAND.md`. This file owns only Goal 03
execution scope and card order.

## Status

**Goal:** Goal 03 — Startup Performance and Launch Quality

**Status:** planned; not active; physical-tablet baseline waits for the One UI
update to finish and the tablet to reconnect

**Objective:** Make the Android APK present Olaso immediately and reach a usable
offline POS within a measured budget on the physical Galaxy Tab A9, without
weakening lock restoration, local persistence, synchronization, or the approved
1340 × 800 interface.

**Start prompt:** [`GOAL-03-START-PROMPT.md`](GOAL-03-START-PROMPT.md)

## Verified starting facts

- The native launch theme currently points to Capacitor's default white splash
  artwork with a blue mark rather than an Olaso launch surface.
- React waits for the SQLite connection before mounting the application.
- The application then performs a second terminal-settings database gate and
  renders an empty `main` while that gate settles.
- All major screens are eagerly imported into the startup bundle.
- The current production output contains approximately 738 KB of initial
  minified JavaScript and 249 KB of CSS before compression.
- POS product/category source images are 1408 × 768 despite substantially
  smaller rendered dimensions; included menu images account for several
  megabytes and unnecessary decode memory.
- The local POS already renders independently of successful cloud data, so the
  optimization must preserve and strengthen that local-first behavior.

These are investigation leads, not permission to change every item. PERF-01
measures the physical device first, and later cards change only demonstrated or
unavoidable defects.

## Included

- Repeatable cold/warm startup measurement on the physical tablet.
- Small startup timing marks for native first display, SQLite readiness,
  terminal-lock readiness, local POS shell, and cached-menu usability.
- Native Olaso launch artwork and a continuous cream native/WebView/React
  startup surface.
- One safe visible initialization flow with no empty intermediate render.
- Measured initial bundle reduction using native React/Vite loading boundaries.
- Right-sized local product/category assets and below-the-fold decode control.
- Local-POS-first scheduling of cloud synchronization.
- Offline, locked-state, migration, process-restart, visual, and Android
  regression verification.

## Excluded

- Visual redesign of any approved application screen.
- Replacing React, Vite, Capacitor, SQLite, Convex, or Astryx.
- A new state library, service worker, cache framework, native UI rewrite,
  speculative preloader, or permanent artificial splash delay.
- Weakening the local lock, skipping database migrations, hiding failures, or
  exposing the POS before safety state is known.
- Printer transport, costs/profitability, authentication, signed distribution,
  or unrelated feature work.
- Lowering the performance budget without measured hardware evidence and an
  explicit documented decision.

## Git workflow

- Goal branch: `codex/goal-03-startup-performance`.
- Keep one PERF card in progress and unrelated changes out of its commit.
- Every card commit begins with its card ID.
- Push after every successful card commit and record its full SHA and remote
  branch before marking the card done.
- Never commit device identifiers, logs containing private business data,
  credentials, signing material, or printer secrets.

## Task board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| PERF-01 | Establish repeatable physical-tablet startup baselines and timing marks | pending | — |
| PERF-02 | Replace the default native launch frame with continuous Olaso launch styling | pending | — |
| PERF-03 | Consolidate safe startup gating and eliminate the empty React frame | pending | — |
| PERF-04 | Reduce measured eager JavaScript/CSS work without changing navigation behavior | pending | — |
| PERF-05 | Right-size and schedule local image/font assets without visual regression | pending | — |
| PERF-06 | Prioritize cached local POS readiness before cloud synchronization work | pending | — |
| PERF-07 | Run full startup, offline, lock, migration, Android, visual, and documentation closeout | pending | — |

## Card contracts

### PERF-01 — Baseline and instrumentation

- Rebuild/install the unchanged baseline after the One UI update settles.
- Record at least five force-stopped cold launches and five warm launches on the
  physical Galaxy Tab A9.
- Capture Android time to initial display and application marks for database,
  lock, POS shell, and cached-menu readiness.
- Record exact APK/build identity, Android/WebView version, measurement method,
  median, minimum, and maximum. Do not optimize from one subjective launch.
- Add only the smallest development-safe timing support required to distinguish
  native, bundle, database, UI, image, and synchronization time.

### PERF-02 — Native launch continuity

- Use the platform splash mechanism already present in the Capacitor Android
  shell; do not add another splash dependency or activity.
- Replace the default white/blue asset with the approved cream surface and
  correctly proportioned Olaso artwork.
- Match system-bar and WebView backgrounds so rotation, cold launch, and handoff
  show no white or unrelated frame.
- Do not extend splash duration to conceal slow work.

### PERF-03 — Safe startup orchestration

- Present one branded startup state while SQLite and terminal-lock restoration
  settle.
- Remove the empty intermediate `main` without exposing the POS before lock
  state is known.
- Preserve explicit actionable failure behavior if local data cannot open.
- Keep initialization responsibilities in their current owning layers; do not
  create a generic boot framework or shared-state library.

### PERF-04 — Critical bundle

- Measure the module graph before changing it.
- Keep only the initial POS, required lock/startup path, and proven shared shell
  eager; load secondary screens on demand through React/Vite.
- Preserve navigation state, cart survival, error boundaries, and 1340 × 800
  behavior across every loading boundary.
- Record before/after initial JavaScript and CSS size plus startup timing. A
  split that does not improve the target device is removed.

### PERF-05 — Assets

- Produce checked local assets appropriate to actual category and 174 × 162
  product-card rendering while preserving the approved appearance.
- Reserve dimensions and defer only below-the-fold decoding; visible products
  must not pop, shift, or become blurry.
- Keep the APK self-contained and offline. Do not introduce cloud image storage
  or runtime image processing.
- Record APK/web-asset size, decoded dimensions, and visual comparison evidence.

### PERF-06 — Local readiness before sync

- Ensure cached local menu and cashier interaction become ready before Convex
  refresh and outbox retry compete for startup resources.
- Preserve eventual automatic synchronization, bounded retries, manual recovery,
  and idempotent sale acknowledgement.
- Profile SQLite bridge calls before removing or combining any operation; never
  bypass migrations, foreign keys, transaction serialization, or recovery.
- Verify offline startup is equal to or faster than connected startup and that
  no cloud failure blocks the POS.

### PERF-07 — Closeout

- Repeat the controlled cold/warm measurements and compare them with PERF-01.
- Require no unbranded frame, no console error/warning, no startup crash, and no
  visual or touch regression on the physical 1340 × 800 tablet.
- Verify unlocked, locked, offline, connected, process-restart, tablet-restart,
  schema-migration, and install-over-upgrade startup paths.
- Run all affected data, Android, TypeScript, and production-build checks.
- Refresh Graphify after structural changes and update all owning documentation.

## Goal completion criteria

- PERF-01 through PERF-07 are done, verified, committed, and pushed.
- Five-run median usable cold startup is at most two seconds and warm startup is
  at most one second on the physical Galaxy Tab A9.
- Native launch, WebView, and React startup form one continuous Olaso cream
  sequence with no default Capacitor or blank-white frame.
- POS startup never waits for the network, and cloud failure does not change
  local readiness.
- Lock restoration, SQLite migrations, offline checkout, synchronization,
  navigation, and approved screen geometry have no regressions.
- Before/after timing, bundle, asset, Android, browser, and physical-device
  evidence is recorded in the ledger.

## Current checkpoint

- Goal 03 is planned only; no PERF card is in progress and no goal branch
  exists.
- The tablet is updating One UI and is not connected, so the physical baseline
  cannot be captured yet.
- Exact next action after the update and explicit `/goal` activation: re-read
  the complete DOX chain and ledger, query Graphify, create and push
  `codex/goal-03-startup-performance`, mark PERF-01 in progress, rebuild the
  unchanged baseline, and measure it before changing startup code.

## Planning journal

### 2026-08-21 — Goal 03 drafted

- Traced Android launch through the native theme, WebView, React provider,
  SQLite connection, terminal settings, POS data hook, and initial assets.
- Recorded the default Capacitor splash, sequential database gates, literal
  empty React state, eager screens, and oversized assets as measured leads.
- Set a profile-first sequence and explicit physical-tablet budgets while
  protecting lock, offline, migration, and synchronization behavior.
- No application source code changed and Goal 03 remains inactive.
