# Goal 03 Start Prompt

Use this only after the One UI update has completed and the physical Galaxy Tab
A9 is available for controlled measurements.

```text
/goal Complete Goal 03 — Startup Performance and Launch Quality as defined in
goals/GOAL-03-STARTUP-PERFORMANCE.md.

Before changing code:
1. Read the complete applicable AGENTS.md/DOX chain.
2. Read WORK_LEDGER.md, PRODUCT.md, ARCHITECTURE.md, DESIGN.md, and BRAND.md.
3. Query graphify-out/graph.json before manual inspection.
4. Mark Goal 03 active and PERF-01 in progress in WORK_LEDGER.md.
5. Create and push codex/goal-03-startup-performance without modifying main.

Execute PERF-01 through PERF-07 sequentially. Keep only one card in progress.
After every completed card, update its status, completion evidence, current
checkpoint, exact next action, and journal entry. Commit and push every card,
then record its full SHA and remote branch before marking it done.

Measure the unchanged APK first on the physical Galaxy Tab A9 using at least
five controlled force-stopped cold launches and five warm launches. Record
Android initial-display timing plus application-ready marks for SQLite, lock,
POS shell, and cached-menu readiness. Then fix only measured or unavoidable
startup defects: replace default Capacitor launch artwork with a continuous
Olaso cream surface, eliminate the empty React frame without exposing a locked
terminal, reduce proven eager screen work, right-size local assets, and defer
cloud work until the cached local POS is usable.

Preserve local-first checkout, lock restoration, ordered SQLite migrations,
transaction serialization, outbox recovery, idempotent synchronization, cart
navigation survival, approved 1340 × 800 geometry, accessibility, and existing
React/Vite/Capacitor/SQLite/Convex/Astryx/Phosphor/CSS Module boundaries.

Do not redesign screens, replace the stack, add a state library, service worker,
cache framework, splash dependency, native UI rewrite, or artificial splash
delay. Do not weaken safety or hide failures to improve a number. Printer,
costs, authentication, and distribution work remain outside this goal.

Finish only after every PERF card is done and pushed, the five-run median usable
cold start is at most two seconds and warm start is at most one second on the
physical tablet, no unbranded frame appears, offline/locked/migration/update
startup paths pass, all relevant checks and npm run build pass, browser and
physical-tablet QA are clean, Graphify is refreshed after structural changes,
documentation is current, and the worktree is synchronized and clean.
```
