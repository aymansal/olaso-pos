# Olaso Work Ledger

This is the durable progress memory for the active implementation goal. Read it
before continuing the goal and after context compaction or handoff.

Project rules and product decisions remain in `AGENTS.md`, `PRODUCT.md`,
`ARCHITECTURE.md`, `DESIGN.md`, and `BRAND.md`. This file records only execution
state.

## Ledger Rules

- Keep one active goal at a time.
- Use only `pending`, `in progress`, `done`, or `blocked` for task status.
- Keep at most one task `in progress`.
- Work through cards in dependency order unless the journal records why an
  independent card moved earlier.
- Update the checkpoint and journal after every meaningful completed step.
- Do not mark a card `done` until its verification passes, its commit is pushed,
  and the commit SHA and remote branch are recorded.
- Every card commit message starts with its card ID, such as
  `APP-02: seed Convex development data`.
- Do not commit secrets, local deployment credentials, signing keys, or
  `.env.local`.
- When a goal finishes, move its detailed ledger to `goals/` and retain a short
  link under Completed Goals.

## Active Goal

### Goal 02 — Functional Full Application Beta

**Status:** in progress — APP-01
**Objective:** Make the complete Olaso application operate on realistic
development data with local-first sales, synchronized management data, working
screens, and an Android beta build while preserving the approved design.

**Start prompt:** [`goals/GOAL-02-START-PROMPT.md`](goals/GOAL-02-START-PROMPT.md)

### Included

- A dedicated Convex development deployment.
- Typed Convex schema and bounded domain functions.
- Deterministic, repeatable development mock data.
- Live categories, products, modifiers, recipes, ingredients, stock movements,
  sales, sale lines, and saved report summaries.
- Working product, recipe, stock, order, dashboard, report, settings, and lock
  flows.
- Local SQLite data, migrations, sale transactions, and an outbox.
- Idempotent synchronization between the tablet data layer and Convex.
- Exact recipe-based stock deduction when a recipe exists.
- Saved sale and receipt snapshots plus on-screen receipt preview.
- Capacitor Android beta packaging and offline/restart verification.
- Focused domain, persistence, synchronization, and UI checks.

### Excluded

- ESC/POS commands, Bluetooth/USB printer transport, printer permissions, and
  physical receipt printing.
- Physical tablet/printer acceptance testing.
- Production signing and public distribution.
- Production menu, fiche technique, tax, receipt header, roles, or permissions
  that the owner has not confirmed.
- Multiple branches or simultaneous POS tablets.
- Google Play, delivery integrations, card-terminal integrations, accounting
  integrations, forecasting, or AI recommendations.

Printer work becomes a separate goal after the required receipt preparation and
hardware are available.

## Git Workflow

- Goal branch: `codex/goal-02-functional-app`.
- `APP-00` creates and pushes the branch with the completed Goal 01 baseline.
- Each later card gets at least one commit whose subject begins with its card
  ID.
- Push immediately after each successful card commit.
- Record the commit SHA and `origin/codex/goal-02-functional-app` in that card's
  completion evidence.
- Never stage `.env.local` or any credential.

## Task Board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| APP-00 | Establish the verified Goal 01 Git baseline and goal branch | done | `npm run check:pos` and `npm run build` passed; baseline commit `cade8a913cafebb91f571903820b8253236b841e` pushed to `origin/codex/goal-02-functional-app` |
| APP-01 | Bootstrap Convex development infrastructure, schema, DOX, and frontend boundary | in progress | Dev deployment connected; schema/codegen/checks pass; commit pushed |
| APP-02 | Add protected deterministic Convex development seed/reset data | pending | Internal seed runs twice safely; table counts/sample data verified; commit pushed |
| APP-03 | Make categories, products, modifiers, and recipe management functional | pending | Validated CRUD/archive/version flows and live Products UI; commit pushed |
| APP-04 | Make ingredients, stock balances, adjustments, and movement history functional | pending | Exact base-unit operations and live Stock UI verified; commit pushed |
| APP-05 | Add Capacitor, SQLite schema/migrations, operational cache, and outbox foundation | pending | Restart-safe local data checks and Android sync pass; commit pushed |
| APP-06 | Complete local-first sale saving, recipe deduction, receipt snapshots, and idempotent Convex sync | pending | Atomic/offline/retry/duplicate tests pass; POS checkout works; commit pushed |
| APP-07 | Connect bounded order history, detail, recovery, and permitted corrective actions | pending | Pagination/snapshots/sync states verified in Orders UI; commit pushed |
| APP-08 | Connect dashboard summaries, recent orders, and stock warnings | pending | Saved-summary reads and Dashboard states verified; commit pushed |
| APP-09 | Connect sales, product, and stock-usage report tabs and period controls | pending | Bounded report queries and all report tabs verified; commit pushed |
| APP-10 | Make settings, synchronization controls, and the designed lock flow functional | pending | Settings survive restart; lock/session behavior documented and verified; commit pushed |
| APP-11 | Produce and verify the Android beta without printer integration | pending | APK builds; offline startup, restart, migration, and upgrade checks pass; commit pushed |
| APP-12 | Run full-system regression, quota/security review, documentation closeout, and final push | pending | All checks/builds/QA pass; Graphify and docs current; final commit pushed |

## Task Contracts

### APP-00 — Baseline and branch

- Re-read the Goal 01 archive and verify its completion evidence.
- Run `npm run check:pos` and `npm run build`.
- Create `codex/goal-02-functional-app` without discarding the dirty working
  tree.
- Review and stage the intended completed-project files; do not stage secrets.
- Commit with `APP-00: establish functional app baseline` and push the branch.
- Record the commit SHA and remote branch here before marking the card done.

### APP-01 — Convex foundation

- Install the official `convex` package.
- Use `npx convex dev` to connect a development deployment; keep `.env.local`
  untracked.
- Add the schema and only indexes required by documented access paths.
- Create `convex/AGENTS.md` and add it to the root Child DOX Index.
- Keep functions split by business domain as required by `ARCHITECTURE.md`.
- Add one Convex client/provider and a dedicated application data boundary;
  leaf React components never import Convex.

### APP-02 — Development seed data

- Add an internal, development-only seed/reset function runnable through the
  Convex CLI.
- Make it deterministic and safe to rerun without duplicating records.
- Seed realistic categories, products, modifiers, recipes, ingredients, stock,
  sales, sale lines, movements, and daily metrics.
- Use integer centimes and integer ingredient base units.
- Include enough dated data for dashboard, orders, and all report tabs.
- Verify table counts and representative relationships through the CLI.

### APP-03 — Products and recipes

- Implement validated, authorized domain functions for categories, products,
  modifier groups/options, and recipe versions.
- Use archive/restore instead of destructive deletion when history may refer to
  a record.
- Batch related edits and version recipes after use.
- Connect the Products screen through feature actions/hooks while keeping
  components prop-driven.

### APP-04 — Stock

- Implement ingredients, low-stock thresholds, adjustments, balances, and
  append-only stock movements.
- Keep quantities in integer base units.
- Connect Stock metrics, list, filters, selection, detail, and adjustments to
  live data.
- Do not introduce theoretical-waste calculations.

### APP-05 — Local operational foundation

- Select the smallest maintained Capacitor-compatible SQLite package after a
  documented compatibility check.
- Add Capacitor Android and the local schema/migrations required by
  `ARCHITECTURE.md`.
- Persist the active operational menu, recipes, stock, sales, and outbox.
- Keep web development deterministic without inventing a permanent alternative
  database architecture.
- Add restart and migration checks.

### APP-06 — Sales and synchronization

- Commit one completed sale, its lines, recipe stock movements, local balances,
  and outbox entry in one local transaction.
- Save immutable product, price, modifier, and recipe snapshots.
- Clear the cart only after the local transaction commits.
- Synchronize with one idempotent Convex mutation using
  `deviceId + localSaleId`.
- Retry safely and never duplicate sales or stock movements.
- Save receipt data and provide on-screen preview only; do not add printer code.

### APP-07 — Orders

- Replace fixture orders with bounded/paginated data.
- Show saved snapshots, local/cloud sync state, and recovery information.
- Implement only corrective actions allowed by confirmed policy; otherwise
  expose a truthful unavailable state and record the pending owner decision.
- Never hard-delete sales or stock movements.

### APP-08 — Dashboard

- Read small saved daily summaries, current warnings, and bounded recent orders.
- Do not scan full history or subscribe to hidden screens.
- Preserve the approved dashboard geometry and required empty/loading/error
  states.

### APP-09 — Reports

- Connect Sales, Products, and Stock Usage tabs to saved summaries and bounded
  detail queries.
- Keep date/quick-period behavior and report charts aligned with the approved
  design.
- Do not add an analytics pipeline or unconfirmed export destination.

### APP-10 — Settings and lock

- Connect settings that are already confirmed: device identity, sync state,
  manual sync, and safe operational preferences.
- Implement the designed lock/session flow only to the level supported by the
  confirmed role/PIN decisions.
- Persist non-secret settings locally.
- Do not claim production authentication until roles and login policy are
  confirmed.

### APP-11 — Android beta

- Produce a reproducible Android beta build with the same application ID.
- Verify offline startup, local checkout, restart recovery, synchronization,
  schema migration, and install-over-upgrade behavior.
- Do not implement printer transport or request printer permissions.
- Do not commit signing material.

### APP-12 — Closeout

- Run domain, persistence, sync, UI, and production build checks.
- Inspect every screen at 1340 × 800 with a clean console.
- Review Convex functions for bounded indexed reads, safe retries, validation,
  authorization boundaries, and unnecessary calls.
- Confirm secrets are absent, docs and DOX are current, and Graphify is
  refreshed.
- Record remaining owner/hardware blockers without pretending they are done.

## Goal Completion Criteria

- APP-00 through APP-12 are done, verified, committed, and pushed.
- Every existing application screen reads and changes real development data
  through the documented boundaries.
- The Convex development deployment can be reset and reseeded deterministically.
- Valid sales work offline, persist atomically, deduct exact saved recipes, and
  synchronize idempotently.
- Dashboard, Orders, Products, Stock, Reports, Settings, and Lock flows are
  functional with honest pending-policy states.
- An Android beta builds and survives offline startup, restart, and migration.
- Receipt preview data is saved, but no printer transport or physical-print
  claim exists.
- Required checks pass, all screens preserve approved geometry, the console is
  clean, and documentation is current.

## Current Checkpoint

- Goal 01 is complete and archived at
  [`goals/GOAL-01-FUNCTIONAL-POS.md`](goals/GOAL-01-FUNCTIONAL-POS.md).
- Goal 01 checks and build passed at its closeout.
- The completed Goal 01 baseline is committed at
  `cade8a913cafebb91f571903820b8253236b841e`.
- The local goal branch tracks `origin/codex/goal-02-functional-app`; the
  recorded baseline commit is present on the remote branch and APP-00's ledger
  closeout is its current head.
- Official Convex package `1.42.3` is installed.
- Convex project `ayman-salmouni/olaso-pos` has a dedicated cloud development
  deployment `colorful-newt-937`; its deployment name and public Vite URLs are
  stored only in ignored `.env.local`.
- The typed schema is deployed and exposes 11 operational tables; generated
  bindings, Convex DOX, and the app-level provider boundary are verified.
- `npm run check:convex`, `npm run check:pos`, and `npm run build` pass.
- Browser smoke testing at 1340 × 800 confirms the provider-wrapped app mounts
  without overflow, console warnings, or console errors.
- Graphify's code graph is refreshed to 632 nodes and 763 edges.
- The remote is `origin` at `https://github.com/aymansal/olaso-pos.git`.
- APP-00 is done and APP-01 is the only card in progress.

**Exact next action:** Review and stage the APP-01 diff, verify no local
deployment credentials are staged, re-read the applicable DOX chain, then
commit and push APP-01 before recording its SHA.

## Decisions and Blockers

### Decisions

- Push every completed card and record its card-prefixed commit.
- Use a dedicated goal branch instead of pushing incomplete cards directly to
  `main`.
- Use Convex only as the development/cloud record; local-first checkout still
  follows the SQLite/outbox architecture.
- Use an internal CLI-run seed function for development mock data.
- Keep all receipt-printer and physical hardware work in a later goal.

### Blockers

- APP-01 may require the user to complete Convex login/project selection in the
  browser or terminal.
- Production tax, receipt, permission, role/PIN, fiche-technique, and hardware
  decisions remain owner-dependent; Goal 02 must represent them honestly.

## Journal

### 2026-07-28 — APP-01 started

- Re-read the applicable DOX chain and durable ledger, and retained the complete
  project authority documents from the uninterrupted Goal 02 context.
- Queried the existing Graphify graph for the current React entry point, package
  scripts, data boundary, and Convex architecture before source inspection.
- Confirmed APP-00 is done and marked APP-01 as the only card in progress.
- Corrected the checkpoint wording so the baseline commit is recorded as an
  ancestor of the remote branch head rather than incorrectly calling it the
  head after APP-00's ledger closeout.
- Installed official Convex package `1.42.3`; npm reported zero vulnerabilities.
- Created Convex project `ayman-salmouni/olaso-pos` and provisioned dedicated
  cloud development deployment `colorful-newt-937` through the CLI.
- Confirmed `.env.local` is ignored and contains only the generated deployment
  name plus public Vite client/site URL keys; no deploy key was created.
- Added the typed operational schema and real access-path indexes, Convex DOX,
  generated code boundary, one application-level Convex provider, and a
  repeatable `check:convex` script.
- Removed the generated Convex README because its unbounded `.collect()` example
  conflicts with this repository's bounded-read contract.
- Files changed so far: `package.json`, `package-lock.json`, `AGENTS.md`,
  `src/AGENTS.md`, `src/main.tsx`, `src/data/AppDataProvider.tsx`, and
  `convex/`.
- Generated typed bindings and deployed the schema with
  `npx convex dev --once --typecheck enable`; `npx convex data` lists all 11
  schema tables on the development deployment.
- Verification: `npm run check:convex`, `npm run check:pos`, `npm run build`,
  and `git diff --check` passed.
- Runtime verification at 1340 × 800 found a mounted app, exact viewport/body
  dimensions, no overflow, and no console warnings or errors.
- Refreshed Graphify's structural code graph to 632 nodes and 763 edges and
  queried the resulting `main.tsx` → `AppDataProvider` boundary.
- Exact next action: review/stage the APP-01 diff, scan it for secrets, re-read
  the DOX chain, then commit and push.

### 2026-07-28 — APP-00 complete

- Committed the verified Goal 01 project baseline with
  `APP-00: establish functional app baseline`.
- Pushed commit `cade8a913cafebb91f571903820b8253236b841e` to
  `origin/codex/goal-02-functional-app` and confirmed the remote branch resolves
  to the same SHA.
- Kept machine-local Graphify interpreter, scan, and cache state untracked;
  committed the portable graph, report, visualization, and manifest.
- Verification: `npm run check:pos` passed; `npm run build` passed;
  `git diff --check` passed; staged secret and sensitive-file scans were clean.
- Files changed for APP-00 closeout: `.gitignore`, `WORK_LEDGER.md`, and the
  reviewed completed Goal 01 baseline recorded by the baseline commit.
- APP-00 is done; APP-01 is pending and no card is in progress.
- Exact next action: start APP-01 with its DOX/ledger read and Convex
  development bootstrap.

### 2026-07-28 — APP-00 started

- Read the complete project authority documents, applicable DOX chain, active
  ledger, and Goal 01 archive.
- Queried the existing Graphify graph before inspecting the repository.
- Verified the Goal 01 archive records passing POS checks, production build,
  six-screen browser QA, approved Pencil geometry, and Graphify closeout.
- Marked APP-00 as the only card in progress.
- Application source code was not changed.
- Inspected the Git baseline: `main` and `origin/main` both point to the lone
  initial commit `6727dae`; the completed Goal 01 tree remains uncommitted and
  no goal branch exists.
- Verified no `.env` files are present and local environment files are ignored.
- Verification: `npm run check:pos` passed; `npm run build` passed;
  `git diff --check` found no whitespace errors.
- Created `codex/goal-02-functional-app` without altering the dirty Goal 01
  working tree.
- Staged the reviewed portable project baseline, including the authored
  Graphify graph/report/manifest; ignored Graphify interpreter, scan, and cache
  state that contains machine-local paths.
- Confirmed no `.env`, credential, signing-key, or printer-secret file is
  staged.
- Exact next action: commit and push the staged baseline, then record its SHA
  and remote branch before marking APP-00 done.

### 2026-07-28 — Goal 02 drafted

- Verified Goal 01 is complete in the ledger and current graph.
- Confirmed the completed work is still uncommitted on `main`.
- Confirmed Convex is not installed and no deployment is configured.
- Added the per-card commit/push workflow to root DOX.
- Protected `.env.local` and `.env.*.local` from Git.
- Archived the detailed Goal 01 ledger.
- Defined APP-00 through APP-12 with verification and push evidence.
- Explicitly excluded receipt printing and physical printer work.
- Added the exact prompt that starts Goal 02 in a fresh conversation.
- Application source code was not changed.

## Completed Goals

- [Goal 01 — Functional POS Interactions](goals/GOAL-01-FUNCTIONAL-POS.md)
