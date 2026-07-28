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

**Status:** in progress — APP-08 in progress
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
| APP-01 | Bootstrap Convex development infrastructure, schema, DOX, and frontend boundary | done | Dev deployment `colorful-newt-937` connected; schema/codegen/checks/browser smoke pass; commit `5189a4eb6a52f363313b650be076a116864ff153` pushed to `origin/codex/goal-02-functional-app` |
| APP-02 | Add protected deterministic Convex development seed/reset data | done | Two resets and relationship checks passed; implementation commit `7b4530aa5791204aa9b75ed00c2dc4a6a49c8385` pushed to `origin/codex/goal-02-functional-app` |
| APP-03 | Make categories, products, modifiers, and recipe management functional | done | Management/UI/check/browser evidence passed; implementation commit `3438fae935aedbca8ec8709a508d5127f522ff19` pushed to `origin/codex/goal-02-functional-app` |
| APP-04 | Make ingredients, stock balances, adjustments, and movement history functional | done | Inventory/backend/UI/check/browser evidence passed; implementation commit `b4fd2a8de4306bd1e353ef0cfee2da037f909733` pushed to `origin/codex/goal-02-functional-app` |
| APP-05 | Add Capacitor, SQLite schema/migrations, operational cache, and outbox foundation | done | Compatibility, persistence, restart/migration, Android sync, and browser evidence passed; implementation commit `6f16c6e3c4b3e9ec830cfb68934d073e5bb5463a` pushed to `origin/codex/goal-02-functional-app` |
| APP-06 | Complete local-first sale saving, recipe deduction, receipt snapshots, and idempotent Convex sync | done | Atomic/offline/retry/duplicate checks, full regression, Graphify refresh, and visual QA passed; implementation commit `07db73f350f7e43c87b6f7b3497559d02a08cf42` pushed to `origin/codex/goal-02-functional-app` |
| APP-07 | Connect bounded order history, detail, recovery, and permitted corrective actions | done | Bounded history/detail, local fallback and retry, policy states, regression, Graphify, and visual QA passed; implementation commit `70c605365b6d242bb4000b033867db14eb42f9a9` pushed to `origin/codex/goal-02-functional-app` |
| APP-08 | Connect dashboard summaries, recent orders, and stock warnings | in progress | Saved-summary reads, bounded warnings/orders, Dashboard states, verification, and push evidence pending |
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
  recorded baseline and completed card commits are present in its history.
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
- APP-01 implementation commit
  `5189a4eb6a52f363313b650be076a116864ff153` is confirmed on
  `origin/codex/goal-02-functional-app`.
- The remote is `origin` at `https://github.com/aymansal/olaso-pos.git`.
- APP-00 through APP-07 are done; APP-08 is the only card in progress.
- APP-02's protected internal reset/seed and verification functions pass local
  Convex type generation and are deployed to `colorful-newt-937`.
- Two consecutive reset runs produced identical counts: 4 categories, 15
  products, 4 modifier groups, 8 modifier options, 14 ingredients, 15 recipe
  versions, 39 recipe items, 13 sales, 17 sale items, 65 stock movements, and
  7 daily summaries.
- Graphify is refreshed to 665 nodes and 799 edges. Convex type/deployment,
  seed verification, POS, production build, diff, bounded-read, and sensitive
  content checks pass.
- APP-02 implementation commit
  `7b4530aa5791204aa9b75ed00c2dc4a6a49c8385` is confirmed on
  `origin/codex/goal-02-functional-app`.
- APP-03's category, product, modifier, and recipe functions are deployed with
  bounded reads, runtime validation, role-gated management access, revision
  checks, retry identifiers, archive/restore behavior, and immutable recipe
  versioning. The CLI-driven integration check passes and restores the
  deterministic seed.
- The Products fixtures are removed. One application data hook now maps Convex
  records into plain feature types, while the existing catalog, editor, list,
  sidebar, modifier, and recipe components remain prop-driven. TypeScript and
  whitespace checks pass.
- Browser verification exercised search/filter/sort, category
  create/rename/archive/restore, product create/edit, modifier save, and recipe
  version creation against the development deployment. The seed was restored,
  and the clean 1340 × 800 pass has no clipping, overflow, console warnings, or
  console errors.
- Product, source, feature, Convex, and root DOX now describe the live boundary.
  Graphify is refreshed to 739 nodes and 992 edges. Convex codegen/deployment,
  management integration, seed verification, POS checks, TypeScript, production
  build, and diff checks all pass.
- APP-03 implementation commit
  `3438fae935aedbca8ec8709a508d5127f522ff19` is confirmed on
  `origin/codex/goal-02-functional-app`.
- APP-04 is complete. The Stock fixtures are removed; one application data hook
  connects the existing screen, inventory, table, detail, and icon boundaries
  to live Convex data.
- APP-04's bounded inventory list/detail queries, ingredient lifecycle
  mutations, and atomic receive/count adjustment mutation are deployed.
  `npm run check:inventory` verifies retry safety, stale revision rejection,
  exact integer balances, append-only signed movement history, and seed restore.
- Browser verification at 1340 × 800 exercises unit/status filters, pagination,
  selection, ingredient create/edit/archive/restore, receiving, physical count,
  and full movement history. The live Stock layout has no clipping or overflow,
  and browser diagnostics have no warnings or errors.
- The deterministic seed is restored to 14 ingredients and 65 movements. Stock,
  Convex, and root DOX describe the live inventory boundary, and Graphify is
  refreshed to 785 nodes and 1,132 edges.
- APP-04 verification passes: Convex codegen/deployment, management and
  inventory integrations, seed verification, POS checks, TypeScript,
  production build, and whitespace checks.
- Closeout review finds no unbounded inventory read, feature-level Convex
  import, tracked environment/key material, machine-local Graphify path, or
  printer implementation. The complete applicable DOX chain is re-read and its
  indexes remain current.
- APP-04 implementation commit
  `b4fd2a8de4306bd1e353ef0cfee2da037f909733` is confirmed on
  `origin/codex/goal-02-functional-app`.
- APP-05 is complete. Its compatibility review selected exact
  Capacitor core/CLI/Android `8.4.2` and
  `@capacitor-community/sqlite` `8.1.0`; their peer requirements align on
  Capacitor 8 and Node `24.11.0` satisfies the CLI requirement.
- The exact packages are installed with zero reported vulnerabilities. The
  generated Android platform uses application ID `com.olaso.pos`, discovers the
  SQLite plugin, and completes its initial Capacitor sync.
- The versioned SQLite schema, operational-cache/outbox helpers, deterministic
  browser WASM preparation, and restart/migration check are implemented.
- `sql.js` is pinned to `1.11.0` because `jeep-sqlite` `2.8.0` ships prebuilt
  glue for that WASM shape. The migration/restart check, TypeScript build, and
  clean 1340 × 800 web startup pass after the pin.
- Review completed the cache boundary: active product-modifier links and recipe
  versions now load with the other bounded operational data, refreshed recipe
  items replace stale active rows, and pending outbox work blocks stock cache
  replacement.
- Root, source, data, and Android DOX now own the new boundaries. Android
  signing material is ignored, the generated shell requests only Internet
  access, and no printer integration or permissions exist.
- `npm run check:local` and `npm run android:sync` pass after review. The sync
  builds the production web app and discovers only the SQLite native plugin.
- Graphify is refreshed to 1,771 nodes and 4,364 edges and traces the provider,
  shared local connection, migrations, transaction wrapper, operational cache,
  outbox, deterministic check, and Android activity.
- Final APP-05 verification passes: Convex codegen/deployment, management and
  inventory integrations, seed verification, POS checks, local restart and
  migration checks, TypeScript, production build, Android sync, and whitespace
  checks.
- The final clean browser reload mounts the POS at exactly 1340 × 800 with no
  body/document overflow and no new console warnings or errors.
- APP-05 implementation commit
  `6f16c6e3c4b3e9ec830cfb68934d073e5bb5463a` is confirmed on
  `origin/codex/goal-02-functional-app`.
- APP-06 implementation and review are complete. One trusted SQLite transaction
  now saves the sale, immutable lines and receipt, consolidated recipe
  movements, signed local stock deltas, and one outbox operation. Cart/customer
  state clears only after that commit.
- The bounded operational snapshot and single Convex sale mutation are deployed
  to `colorful-newt-937`. The mutation authoritatively revalidates revisions,
  modifiers, current recipes, prices, deductions, and real calendar dates, then
  writes all cloud effects once by `deviceId + localSaleId`.
- `npm run check:convex`, `npx convex dev --once --typecheck enable`,
  `npm run check:management`, `npm run check:inventory`,
  `npm run check:sales`, `npm run check:seed`, `npm run check:pos`,
  `npm run check:local`, `npx tsc -b`, `npm run build`, and
  `git diff --check` pass. The deterministic seed is restored to 13 sales,
  17 sale lines, 65 stock movements, and 7 daily summaries.
- The standard semantic Graphify update stopped because no LLM API key is
  configured. Its documented local AST merge path refreshed all 27 changed
  code files without importing Graphify into the app; the graph now has 1,819
  nodes and 4,447 edges and queries the local sale, outbox, POS hook, Convex
  acceptance, and receipt-preview paths.
- Final browser verification uses a fresh tab at exactly 1340 × 800. The body,
  document, and main frame are exactly 1340 × 800 with no overflow; the live
  four-category menu and required-modifier dialog render inside the approved
  full-bleed frame. The earlier complete checkout/retry pass had no console
  warnings or errors.
- Root, data, POS, and Convex DOX now describe the local-first checkout and
  trusted synchronization boundaries. Closeout scans find no feature-level
  Convex/SQLite import, unbounded Convex `.collect()`, printer transport/print
  invocation, tracked environment file, signing key, APK, or AAB.
- APP-07 now has a v4 local history index, bounded keyset SQLite reader, saved
  receipt parser, sync summary, and deliberate retry reset. One deployed
  `sales:listOrders` query pages the existing embedded receipt snapshots by the
  completed-time index with a validated maximum page size of 20.
- The Orders data hook performs one page request only while the screen is
  mounted, merges and deduplicates local/cloud records by
  `deviceId + localSaleId`, preserves offline local history, and retries the
  existing outbox mutation without polling or a second write path.
- Orders fixtures are removed. Search, status/date filtering, selection,
  pagination/load-more, immutable detail, sync/recovery state, and shared
  on-screen receipt preview are wired to live data. Cancellation, refund, and
  print controls remain truthfully unavailable.
- Controlled recovery verification completed a sale while cloud POS access was
  disabled, showed it from SQLite as `Needs sync`, restored access, retried it
  once, and confirmed the same order changed to `Completed · Synced` with a
  last-success time and no duplicate.
- APP-07 regression passes: Convex codegen/deployment, management, inventory,
  sales, order history/recovery, seed restore, POS, local restart/migration,
  TypeScript, production build, and whitespace checks. The deterministic
  cloud seed is restored to 13 sales, 17 sale lines, 65 movements, and 7 daily
  summaries.
- Graphify is refreshed to 1,854 nodes and 4,477 edges and queries the local
  page, merged Orders hook, cloud page, recovery, detail, and shared receipt
  preview paths.
- Final Orders verification at exactly 1340 × 800 covers the compact native
  date menu, two non-overlapping six-record pages, preserved selection,
  cancelled-state policy messaging, receipt preview, local fallback, and retry
  recovery. The full-bleed frame has no clipping or document overflow and the
  browser diagnostics are clean.
- Closeout review finds no unbounded Convex collection/database filter,
  feature-level backend/database import, printer transport or invocation, or
  tracked environment, signing, APK, or AAB material. The applicable DOX chain
  and indexes remain current.
- APP-07 implementation commit
  `70c605365b6d242bb4000b033867db14eb42f9a9` is confirmed on
  `origin/codex/goal-02-functional-app`.
- APP-08 starts from a fixture-driven Dashboard whose approved component/CSS
  regions already match the 1340 × 800 frame. The cloud schema already stores
  incrementally maintained indexed daily metrics, current ingredient
  quantities/thresholds, and completed sale snapshots.
- The APP-08 access path is one mounted-screen snapshot request: at most 12
  indexed daily summaries, 100 current ingredients to derive four warnings,
  and four recent indexed sales. It will not poll, subscribe while hidden, or
  scan sale/movement history.
- The deployed `dashboard:getSnapshot` query validates management access and
  business date, returns a 12-day zero-filled saved-summary series, today's
  pulse/best seller, at most four current low-stock warnings, and four recent
  sale snapshots in one call.
- One `useDashboardData` hook performs the request only while Dashboard is
  mounted. The existing three regions are prop-driven with live,
  loading, empty, and error/retry states; recent-order navigation opens Orders
  and fixture data is removed.
- `npm run check:dashboard` resets deterministic data and verifies the indexed
  12-day window, today's saved metrics, previous-day comparison, bounded
  warnings, descending four-order result, item totals, and invalid-date
  rejection. Convex codegen/deployment and TypeScript also pass.
- Full APP-08 regression passes: Convex codegen/deployment, management,
  inventory, sales, Orders, Dashboard, seed verification, POS, local
  restart/migration, TypeScript, production build, and whitespace checks. The
  deterministic seed remains restored at 13 sales, 17 sale lines, 65 movements,
  and 7 daily summaries.
- Browser verification at exactly 1340 × 800 shows the live 12-day chart,
  today's saved pulse/best seller, two current warnings, and four recent
  orders inside the approved regions. Body, document, and main are exactly the
  viewport with no outside element or overflow; `View all` opens Orders and
  browser diagnostics are clean.
- With only the development management override disabled, Dashboard renders
  its bounded unavailable/zero/alert states. Restoring that non-secret flag and
  pressing `Retry summary` returns the same saved live data without reload.
- The standard Graphify update could not perform semantic extraction without
  an LLM key. Its documented local AST merge refreshed the 12 changed code
  files with exact source pruning; the graph now has 1,865 nodes and 4,416
  edges and queries the complete query/hook/region path.
- Closeout review finds no unbounded Convex collection/database filter,
  feature-level backend/database import, printer transport or invocation, or
  tracked environment, signing, APK, or AAB material. The applicable root,
  source, feature, Dashboard, Stock, data, and Convex DOX chains and indexes
  remain current.

**Exact next action:** Stage only the reviewed APP-08 files, commit with the
card ID, push `codex/goal-02-functional-app`, and record the implementation SHA
and remote branch before marking APP-08 done.

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

### 2026-07-28 — APP-08 started

- Queried the refreshed Graphify graph first for Dashboard composition, daily
  summaries, current stock warnings, recent sales, and hidden-screen
  subscription risks.
- Re-read the complete current root/source/feature/Dashboard, data, and Convex
  DOX chains plus the APP-08 ledger, product, architecture, design, and brand
  contracts.
- Confirmed APP-00 through APP-07 are done and marked APP-08 as the only card
  in progress.
- Confirmed the existing Dashboard is entirely fixture-driven while
  `SalesPulse`, `StockAttentionPanel`, and `RecentOrdersPanel` already own the
  approved regions and CSS geometry.
- Chose one management-authorized snapshot request only while Dashboard is
  mounted. It will read at most 12 indexed daily summaries, 100 current
  ingredients to derive at most four warnings, and four recent indexed sales;
  no polling, raw-history scan, or second data path is needed.
- Added and deployed `dashboard:getSnapshot`. It validates the business date,
  reads only the implemented indexes and limits, zero-fills the 12-day
  saved-summary series, and returns today's pulse/best seller, four warnings,
  and four recent immutable sale summaries.
- Added one one-shot Dashboard hook and removed the fixture module. The
  existing three regions now render prop-driven live, loading, empty, and
  error/retry states, while `View all` navigates to Orders.
- Promoted the stock quantity formatter only after Dashboard became its second
  consumer; Stock keeps its established import surface and no formatting logic
  was duplicated.
- `npm run check:convex`, explicit Convex deployment, `npx tsc -b`, and the new
  `npm run check:dashboard` pass. The Dashboard check reseeds the dedicated
  development deployment and proves bounded summary, warning, order, and date
  validation behavior.
- Ran the full regression serially: Convex codegen/deployment, management,
  inventory, sales, Orders, Dashboard, seed, POS, local database, TypeScript,
  production build, and whitespace checks all pass. The deterministic seed is
  restored.
- Browser verification at exactly 1340 × 800 confirms the live saved metrics,
  12-day chart, two warnings, four recent orders, and Orders navigation fit the
  existing approved regions with no clipping or overflow.
- Disabled only the non-secret development management override and confirmed
  Dashboard exposes its unavailable alerts and explicit retry. Restored the
  flag and confirmed one retry returns the saved live snapshot; browser
  diagnostics contain no warnings or errors.
- The standard Graphify update stopped because no LLM API key is configured.
  Used its documented local AST merge with exact old-source pruning for all 12
  changed code files, refreshed to 1,865 nodes and 4,416 edges, and queried the
  new backend-to-region flow.
- Updated and re-read the owning DOX chains. Closeout scans find no unbounded
  backend query, feature-level backend/database import, printer
  implementation, or tracked environment/signing/package artifact.
- Exact next action: stage only the reviewed APP-08 files, commit with the card
  ID, push the goal branch, and record the implementation SHA and remote branch
  before marking APP-08 done.

### 2026-07-28 — APP-07 complete

- Pushed `APP-07: connect bounded order history` as
  `70c605365b6d242bb4000b033867db14eb42f9a9` and confirmed
  `origin/codex/goal-02-functional-app` resolves to the same SHA.
- Completion evidence: bounded local/cloud pagination, immutable receipt
  snapshots, offline local fallback, deliberate idempotent recovery, truthful
  corrective/print policy states, full regression, restored seed, refreshed
  Graphify, and clean 1340 × 800 Orders verification all pass.
- `.env.local`, credentials, deployment secrets, signing material, APK/AAB
  outputs, and printer implementation were not committed.
- APP-07 is done; APP-08 is pending and no card is in progress.
- Exact next action: query Graphify and re-read the Dashboard DOX/authority
  contracts before marking APP-08 in progress.

### 2026-07-28 — APP-07 started

- Queried the refreshed Graphify graph first for Orders composition, fixtures,
  paginated history, saved sale snapshots, local/cloud sync state, outbox
  recovery, and corrective-action boundaries.
- Re-read the complete root/source/feature/Orders, data, and Convex DOX chain
  from the uninterrupted closeout context plus the APP-07 product,
  architecture, design, brand, and durable ledger contracts.
- Confirmed APP-00 through APP-06 are done and marked APP-07 as the only card in
  progress.
- Confirmed the card contract: replace fixture history with bounded/paginated
  records, show immutable saved snapshots and local/cloud recovery state, never
  hard-delete sales or movements, and expose cancellation/refund/reprint as
  unavailable until owner policy and later printer work authorize them.
- Added local migration v4 for the implemented history and outbox recovery
  access paths. The keyset reader parses saved receipt snapshots, returns at
  most 20 records, reports per-order sync attempts/errors, and can deliberately
  make one failed sale available for an immediate retry.
- Added one indexed Convex order query with validated page size and opaque
  cursor. It returns only the sale and embedded immutable receipt snapshot
  needed by Orders; it does not fan out into sale-item queries.
- Added one Orders hook that requests pages only while the screen is mounted,
  merges local/cloud rows by the sale idempotency key, preserves local history
  when cloud reads fail, and reuses the existing sale-sync mutation for
  recovery.
- Removed Orders fixtures and connected search, sale-status and native date
  filters, list pagination, selection, saved detail, sync state, retry, and
  shared on-screen receipt preview. Printer and corrective controls are not
  exposed while those workflows remain outside the goal or owner policy.
- Promoted the now-two-feature receipt preview and money formatter to direct
  shared source modules instead of duplicating the POS implementation.
- `npm run check:convex`, explicit `npx convex dev --once --typecheck enable`,
  `npx tsc -b`, and the new `npm run check:orders` pass. The order check proves
  local keyset pages, failed-sync visibility, deliberate retry reset, two
  non-overlapping cloud pages, immutable snapshot data, and page-limit
  rejection.
- Controlled browser recovery completed a local sale while cloud POS access was
  disabled, showed the saved snapshot and recovery state in Orders, then
  synchronized that same record once after access was restored. The deterministic
  cloud seed was restored afterward.
- Full regression passes: `npm run check:convex`, explicit Convex deployment,
  management, inventory, sales, Orders, seed, POS, and local checks, TypeScript,
  production build, and whitespace review.
- Refreshed Graphify through its documented local AST merge path to 1,854 nodes
  and 4,477 edges, then queried the complete local/cloud history and recovery
  flow.
- Final browser verification at exactly 1340 × 800 covers date controls,
  pagination, selection, cancelled policy state, detail, preview, offline
  fallback, and retry recovery with no clipping, document overflow, console
  warning, or console error.
- Re-read the closeout DOX chain. Scans find no unbounded backend read,
  feature-level backend/database import, printer implementation, or tracked
  secret/signing/package artifact.
- Exact next action: stage only the reviewed APP-07 files, commit with the card
  ID, push the goal branch, and record the implementation SHA and remote branch
  before marking APP-07 done.

### 2026-07-28 — APP-06 complete

- Pushed `APP-06: complete local-first checkout` as
  `07db73f350f7e43c87b6f7b3497559d02a08cf42` and confirmed
  `origin/codex/goal-02-functional-app` resolves to the same SHA.
- Completion evidence: atomic SQLite sale/line/receipt/movement/outbox commit,
  exact modifier-aware recipe deduction, offline completion and retry,
  duplicate-safe Convex acceptance, immutable on-screen receipt preview, full
  card regression, refreshed Graphify code graph, and approved 1340 × 800 POS
  verification all pass.
- Exact next action: start APP-07 with its DOX/ledger/Graphify reads and replace
  order fixtures with bounded snapshot, sync-state, recovery, and
  confirmed-policy behavior.

### 2026-07-28 — APP-06 started

- Queried the refreshed Graphify graph first for the POS session/cart,
  local-first checkout contract, SQLite transaction boundary, outbox,
  `deviceId + localSaleId` idempotency, and Convex ownership.
- Re-read the complete root/source/data/feature/POS/Convex DOX chains and the
  full durable ledger.
- Re-read the POS completion, exact recipe deduction, immutable sale snapshot,
  offline retry, cloud mutation, failure, security, preview-only receipt, and
  approved interaction contracts in `PRODUCT.md`, `ARCHITECTURE.md`,
  `DESIGN.md`, and `BRAND.md`.
- Confirmed APP-00 through APP-05 are done and marked APP-06 as the only card in
  progress.
- Confirmed the card contract: one trusted local transaction saves the sale,
  lines, recipe movements, local balances, receipt snapshot, and outbox;
  cart clearing waits for commit; one validated Convex mutation is idempotent
  by `deviceId + localSaleId`; failed sync remains retryable; receipts are
  preview-only with no hardware or transport work.
- Completed the implementation inspection. The POS still uses temporary
  fixtures and a non-saving check action; the local schema already owns the
  transaction tables but needs category keys, modifier ingredient effects, and
  a local stock delta; the deployed schema already has the sale idempotency
  index, receipt snapshots, related-sale movements, and daily summaries.
- Chose a v3 `local_stock_delta` instead of rebuilding the released ingredient
  table. It preserves exact negative operational balances without weakening
  foreign-key migrations: cloud stock remains the cached base and each offline
  sale atomically changes the signed local delta.
- Required seeded modifier groups will be selected explicitly in one focused
  POS dialog. The implementation will not silently choose modifiers or trust
  client prices, totals, revisions, recipes, or deductions.
- Added ordered migration v3 for category keys, modifier ingredient effects,
  and the signed local stock delta. The restart/migration check passes and
  proves an exact negative derived balance survives without changing released
  migrations.
- Added the authoritative local sale preparation and commit. One transaction
  re-reads the local operational cache, validates required modifier counts,
  recalculates trusted prices and recipe effects, saves immutable snapshots,
  inserts consolidated movements, updates local balances, and queues one
  outbox operation.
- Added `npm run check:sales`. Its local section verifies the exact oat-milk
  recipe substitution, centime total, immutable revision/recipe/modifier
  snapshots, three consolidated movements, outbox creation, and full rollback
  when the final outbox insert collides.
- `npm run check:sales`, `npm run check:local`, and `npx tsc -b` pass after the
  local transaction implementation.
- Added an operational authorization helper and enabled its non-secret
  unauthenticated override only on dedicated development deployment
  `colorful-newt-937`.
- Added one bounded operational snapshot query and one sale-acceptance
  mutation. The server re-reads products, revisions, recipes, modifiers, and
  ingredients; recomputes prices and deductions; writes the sale, lines,
  consolidated stock movements, balances, recipe-use metadata, and daily
  summary in one Convex transaction.
- The mutation checks `deviceId + localSaleId` before any sale effects and
  returns the prior acknowledgement on retry. Reads are indexed and explicitly
  bounded; negative low-stock balances remain allowed as required by product
  policy.
- Extended `npm run check:sales` against the dedicated deployment. It resets
  deterministic data, submits the same Cappuccino/oat-milk sale twice, proves
  one cloud sale, one line, three exact movements, one stock deduction, and the
  same acknowledgement, then restores the seed.
- `npm run check:convex`, `npx convex dev --once --typecheck enable`, and the
  extended `npm run check:sales` pass.
- Added one application POS data hook. It hydrates from SQLite before network
  data is available, refreshes the bounded cloud snapshot only when no outbox
  work remains, completes sales through the local transaction, and retries
  pending sale operations through the single Convex mutation.
- Removed the POS menu fixtures. The approved category/product/card/receipt
  geometry now renders the four seeded categories and active local products;
  existing assets remain content and non-coffee items use their approved
  category artwork fallback.
- Added one explicit required-modifier dialog and one saved on-screen receipt
  preview. The POS now shows modifier-adjusted centime totals, uses the approved
  Place Order action, clears the cart and customer fields only after local
  commit, and never exposes a print action or printer transport.
- `npm run check:pos`, `npm run check:sales`, `npx tsc -b`, and `npm run build`
  pass after the live POS wiring.
- Browser verification at exactly 1340 × 800 selected Standard and Oat milk,
  saved a 21.00 MAD Cappuccino, cleared the committed cart, displayed the
  immutable local receipt preview, and confirmed the synchronized cloud record.
  The viewport, body, document, main, and preview all fit without overflow and
  the online pass had no console warnings or errors.
- Deliberately disabled only the development POS cloud override, reloaded the
  app from its SQLite menu, and completed a 15.00 MAD Butter Croissant sale.
  The cart cleared and receipt preview opened while cloud access was rejected.
  After restoring the override and reloading, the exact pending local receipt
  synchronized once; CLI inspection confirmed its cloud record. The
  deterministic seed was restored to 13 sales, 17 lines, 65 movements, and 7
  daily summaries.
- Replaced the raw Convex query error exposed by that failure pass with a short
  truthful saved-menu/retry message.
- Added server-side real-calendar-date rejection and confirmed missing required
  modifiers and impossible dates are rejected by the deployed mutation.
- Re-ran the full card regression serially against the dedicated deployment:
  Convex codegen/deployment, product management, inventory, atomic/idempotent
  sales, deterministic seed, POS, SQLite restart/migration, TypeScript,
  production build, and whitespace checks all pass.
- The standard Graphify semantic update stopped without an LLM API key. Used
  the documented serial AST extraction and old-graph-first prune/merge path for
  all 27 changed code files, re-clustered locally, and queried the refreshed
  1,819-node/4,447-edge graph for the APP-06 transaction and sync paths.
- Re-read the closeout DOX chain and corrected the stale root/POS status text so
  it now owns the implemented local-first checkout and preview boundary.
- Final fresh-tab browser verification at exactly 1340 × 800 confirms the body,
  document, main frame, live menu, and required-modifier dialog fit the approved
  full-bleed viewport without document overflow.
- Closeout review finds no feature-level backend/database import, unbounded
  Convex `.collect()`, printer transport or print invocation, tracked
  environment/signing/package artifact, or whitespace error.
- Exact next action: stage only the reviewed APP-06 files, commit with the card
  ID, push `codex/goal-02-functional-app`, and record the implementation SHA and
  remote branch before marking APP-06 done.

### 2026-07-28 — APP-05 complete

- Pushed `APP-05: add local operational foundation` as
  `6f16c6e3c4b3e9ec830cfb68934d073e5bb5463a` and confirmed
  `origin/codex/goal-02-functional-app` resolves to the same SHA.
- Completion evidence: exact compatible Capacitor/SQLite packages, Android
  sync, versioned local schema, bounded operational cache and outbox, protected
  stock refresh, restart/migration check, clean 1340 × 800 browser startup,
  current DOX/Graphify, and all existing domain/build checks pass.
- `.env.local`, credentials, deployment secrets, signing material, APK/AAB
  outputs, and printer implementation were not committed.
- APP-05 is done; APP-06 is pending and no card is in progress.
- Exact next action: start APP-06 with its DOX/ledger/Graphify reads and
  implement the atomic local-first sale plus idempotent Convex synchronization
  contract without printer transport.

### 2026-07-28 — APP-05 started

- Queried the refreshed Graphify graph first for the current application data
  provider, POS session, operational menu fixtures, and documented SQLite/outbox
  ownership.
- Re-read the complete applicable root/source/feature/POS DOX chain and the full
  durable ledger.
- Re-read the local-first, SQLite, outbox, data-boundary, failure, migration,
  and offline contracts in `ARCHITECTURE.md` plus the offline behavior in
  `PRODUCT.md`.
- Confirmed APP-00 through APP-04 are done and marked APP-05 as the only card in
  progress.
- Confirmed the contract: choose one maintained Capacitor-compatible SQLite
  package after a documented compatibility check; add Android plus the minimum
  local schema/migrations for active operational data, sales, stock, and outbox;
  keep web development deterministic without creating another production
  database architecture; verify restart and migration behavior.
- Selected exact Capacitor core/CLI/Android `8.4.2` and
  `@capacitor-community/sqlite` `8.1.0`. Capacitor Android requires core
  `^8.4.0`, the SQLite plugin supports core `>=8.0.0`, Node `24.11.0` satisfies
  the CLI's Node 22+ requirement, and both projects have current 2026 releases.
- Chose the MIT community plugin over the paid private-registry Capawesome
  package and a custom native bridge. Its Android and `jeep-sqlite` web
  implementations can run the same SQL/migrations without adding an ORM.
- Recorded the plugin's bundled-SQLCipher export-classification caveat in
  `ARCHITECTURE.md`; encryption remains an open production security decision.
- The workstation does not currently expose a JDK or Android SDK. This does not
  block Capacitor project generation/synchronization in APP-05, but APP-11 must
  install or locate the Android build toolchain before producing the APK.
- Installed the exact Capacitor and community SQLite packages; npm reports zero
  vulnerabilities.
- Added the Capacitor Android platform with application ID `com.olaso.pos`.
  The CLI discovered `@capacitor-community/sqlite@8.1.0`, copied the current web
  build, and completed the initial Android sync.
- Capacitor's TypeScript-config loader failed against the project's TypeScript 7
  module shape before creating Android. Switched the small config to supported
  JSON instead of downgrading TypeScript; the next scaffold attempt passed.
- Added two ordered SQLite migrations covering the active operational catalog,
  modifier and recipe data, ingredient balances, completed sales and lines,
  append-only stock movements, device settings, synchronization state, and a
  retryable outbox.
- Added bounded operational-cache/outbox helpers, one shared Capacitor SQLite
  connection, and a deterministic web WASM copy step. The app now waits for the
  local operational store before rendering.
- Added `npm run check:local`; it creates a version-1 database, inserts
  representative operational/sale/outbox data, closes and reopens it, upgrades
  to version 2, and verifies the data across another restart.
- Web initialization exposed a known `jeep-sqlite` `2.8.0` compatibility issue:
  its prebuilt JavaScript glue cannot instantiate newer `sql.js` WASM resolved
  by the package's broad range. Pinned the documented compatible `sql.js`
  `1.11.0`; no polyfill or alternate browser database was added.
- `npm run prepare:sqlite-web`, `npm run check:local`, and `npx tsc -b` pass.
  A clean reload reaches the POS at exactly 1340 × 800 with no new warning or
  error diagnostics and no body or document overflow.
- Reviewed the operational cache and closed its two unsafe gaps: cached
  product-modifier links and recipe versions are included in bounded reads,
  active recipe items replace stale rows, and any pending outbox work prevents
  cloud cache replacement from overwriting local stock.
- Added focused `src/data` and Android DOX files and updated both parent indexes.
  The Android shell keeps `com.olaso.pos`, ignores signing material, requests
  only Internet access, and contains no printer dependency, transport, or
  permission.
- `npm run check:local` and `npm run android:sync` pass after review. Dependency
  resolution confirms one exact `sql.js` `1.11.0`; the sync copies the current
  production build and discovers only
  `@capacitor-community/sqlite@8.1.0`.
- Refreshed Graphify to 1,771 nodes and 4,364 edges. Queries trace
  `AppDataProvider` through the local connection, migrations, transactions,
  bounded cache/outbox operations, restart check, and the generated Android
  `MainActivity`.
- Final verification passes: `npm run check:convex`, `npx convex dev --once
  --typecheck enable`, `npm run check:management`, `npm run check:inventory`,
  `npm run check:seed`, `npm run check:pos`, `npm run check:local`, `npx tsc
  -b`, `npm run build` through `npm run android:sync`, and `git diff --check`.
- Vite retains its chunk-size advisory and reports `jeep-sqlite`'s unreachable
  Node `crypto` fallback as browser-externalized; the library uses the browser
  `crypto.getRandomValues` path, and the exact 1340 × 800 runtime reload has no
  new warning or error diagnostics.
- The final web pass mounts the POS, shows no startup failure, and has exact
  viewport/body/document dimensions without overflow.
- Removed Capacitor's generated sample tests because they tested only arithmetic
  and a hard-coded sample package rather than Olaso behavior; the final graph
  refresh excludes them.
- Exact next action: review the final APP-05 diff and generated Android shell,
  scan the intended card files for secrets and excluded printer work, re-read
  the complete closeout DOX chain, then commit and push.

### 2026-07-28 — APP-04 complete

- Pushed `APP-04: connect stock management` as
  `b4fd2a8de4306bd1e353ef0cfee2da037f909733` and confirmed
  `origin/codex/goal-02-functional-app` resolves to the same SHA.
- Completion evidence: bounded authorized inventory functions, retry-safe exact
  integer adjustments, deterministic integration/seed checks, live prop-driven
  Stock management, exact 1340 × 800 layout, clean browser diagnostics, current
  DOX/Graphify, TypeScript, POS checks, and production build all pass.
- `.env.local`, credentials, deployment secrets, signing material, and printer
  implementation were not committed.
- APP-04 is done; APP-05 is pending and no card is in progress.
- Exact next action: start APP-05 with its DOX/ledger/Graphify reads and perform
  the required maintained Capacitor-compatible SQLite package compatibility
  check before adding the local operational foundation.

### 2026-07-28 — APP-04 started

- Queried the refreshed Graphify graph first for the Stock screen/component
  tree, ingredient schema, stock movements, and documented inventory access
  paths.
- Re-read the applicable root/source/feature/Stock/Convex DOX chain, the full
  durable ledger, and the Stock sections of `PRODUCT.md`, `ARCHITECTURE.md`, and
  `DESIGN.md`.
- Confirmed APP-00 through APP-03 are done and marked APP-04 as the only card in
  progress.
- Confirmed the contract: owner/manager management boundary, integer ingredient
  base units, explicit low-stock thresholds, append-only movements with
  reason/actor/time, and no theoretical-waste calculation.
- Confirmed the Stock workspace is fixture-driven but its screen,
  inventory/table, detail, and icon boundaries already match the approved
  geometry.
- Confirmed the schema already stores integer balances/thresholds and
  append-only reason/actor/date movements with ingredient/time indexes. APP-04
  will add only optional management retry metadata and the ingredient/client
  mutation index required for deliberate adjustment retries.
- Inventory valuation is omitted because no confirmed ingredient cost data
  exists; live summary cards will report exact record/movement counts instead.
- Added and deployed bounded inventory list/detail queries, ingredient
  create/edit/archive/restore, and one atomic receive/physical-count mutation.
  Optional retry metadata and only the two implemented access-path indexes were
  added to the existing schema.
- Added `npm run check:inventory`; it verifies create/retry/edit,
  archive/restore, receive/retry, physical-count correction, stale revision
  rejection, exact current balance, and three append-only signed movements,
  then restores the deterministic seed.
- `npm run check:convex`, `npx convex dev --once --typecheck enable`, `npm run
  check:inventory`, and `npm run check:seed` pass.
- Added one application inventory hook and replaced the Stock fixtures with
  live metrics, search, unit/status filters, pagination, selection, exact
  balance/detail display, ingredient lifecycle actions, receive/count actions,
  and append-only movement history.
- Kept the existing prop-driven component/CSS boundaries, added only the two
  focused dialogs required by the interactions, and omitted inventory valuation
  because no confirmed ingredient cost data exists.
- `npx tsc -b` passes after the UI wiring.
- Browser verification at 1340 × 800 exercises filtering, pagination,
  ingredient create/edit/archive/restore, stock receiving, physical-count
  correction, and full movement history. The tablet layout has no clipping or
  overflow, and browser diagnostics have no warnings or errors.
- Ran the protected reset after the UI mutations. `npm run check:seed` confirms
  the original 14 ingredients, 65 stock movements, and representative
  relationships are restored.
- The final clean post-reset screen is exactly 1340 × 800; body, document, and
  main have no page overflow, and browser diagnostics have no warnings or
  errors.
- Updated root, Stock, and Convex DOX for the live hook, plain feature
  contracts, exact adjustment dialogs, and inventory verification.
- Refreshed Graphify to 785 nodes and 1,132 edges and confirmed it includes
  `useInventoryManagement`, `IngredientDialog`, and `recordAdjustment`.
- Final verification passes: `npm run check:convex`, `npx convex dev --once
  --typecheck enable`, `npm run check:management`, `npm run check:inventory`,
  `npm run check:seed`, `npm run check:pos`, `npx tsc -b`, `npm run build`, and
  `git diff --check`.
- Closeout review found no unbounded inventory read, feature-level Convex
  import, tracked `.env.local` or key material, machine-local Graphify path, or
  printer implementation. The full applicable root/source/feature/Stock/Convex
  DOX chain was re-read and its parent/child indexes remain correct.
- Exact next action: stage only the reviewed APP-04 files, commit with the card
  ID, and push before recording the remote SHA.

### 2026-07-28 — APP-03 complete

- Pushed `APP-03: connect product management` as
  `3438fae935aedbca8ec8709a508d5127f522ff19` and confirmed
  `origin/codex/goal-02-functional-app` resolves to the same SHA.
- Completion evidence: validated role-gated bounded Convex functions,
  deterministic CRUD/archive/restore/version integration checks, restored seed,
  live prop-driven Products management, exact 1340 × 800 layout, clean console,
  current DOX/Graphify, POS checks, TypeScript, and production build all pass.
- `.env.local`, credentials, deployment secrets, signing material, and printer
  implementation were not committed.
- APP-03 is done; APP-04 is pending and no card is in progress.
- Exact next action: start APP-04 with its DOX/ledger/Graphify reads and make
  ingredient stock balances, adjustments, and movement history functional.

### 2026-07-28 — APP-03 started

- Re-read the applicable root, source, feature, Products, and Convex DOX chains
  plus the complete durable ledger.
- Queried the refreshed Graphify graph first for the current Products component
  tree, fixture boundary, app data provider, and Convex product-management
  schema.
- Confirmed APP-00 through APP-02 are done and marked APP-03 as the only card
  in progress.
- Confirmed the existing Products workspace is entirely fixture-driven while
  its component and CSS boundaries already match the approved geometry.
- Chose the documented fail-closed management boundary: authenticated
  `owner`/`manager` claims are required outside the dedicated development
  deployment; a deployment-scoped non-secret development override will keep
  the current beta testable without claiming production authentication.
- Management mutations will combine revision checks with client mutation IDs
  for stale-write rejection and retry safety; recipe saves will create and
  activate a new immutable version in one mutation.
- Added `categories.ts`, `products.ts`, `modifiers.ts`, `recipes.ts`, and the
  shared management guard/validation helper. Schema metadata now records the
  responsible actor and retry identifier without making existing seeded rows
  invalid.
- Added `npm run check:management`, which exercises create/retry/update,
  archive/restore, batched modifier options, two recipe versions, immutable
  supersession, and stale revision behavior against the dedicated deployment,
  then reseeds it.
- `npm run check:convex`, `npx convex dev --once --typecheck enable`,
  `npm run check:management`, and `npm run check:seed` pass.
- Temporarily disabled the development management override and confirmed an
  unauthenticated public query is rejected; restored the flag only on
  `colorful-newt-937`.
- Added one application-level product-management hook and replaced the Products
  fixtures with live categories, products, modifier groups/options, ingredients,
  and immutable recipe data.
- Connected search, availability and sort controls, category selection and
  lifecycle actions, product create/edit/status actions, batched modifier
  editing, and recipe version creation while retaining prop-driven child
  components and their existing CSS-module boundaries.
- Prevented query or parent rerenders from resetting in-progress product,
  modifier, and recipe drafts. `npx tsc -b` and `git diff --check` pass.
- Browser verification at 1340 × 800 exercised search/filter/sort, product
  create/edit and save feedback, modifier save, recipe version creation, and
  category create/rename/archive/restore.
- Replaced the unsupported native category prompt with a compact accessible
  in-app editor, kept reversible category lifecycle actions explicit, and
  corrected the modifier dialog so its footer is never clipped at tablet
  height.
- Ran the protected reset after the UI mutations. `npm run check:seed` confirms
  the original 4 categories, 15 products, 4 modifier groups, 15 recipe
  versions, and all representative relationships are restored.
- The final clean-tab layout is exactly 1340 × 800; body, app, catalog, and
  editor have no clipping or overflow, and the console has no warnings or
  errors.
- Updated the applicable root, Convex, source, feature, and Products DOX for
  the deployed management backend, application hook, plain feature types, and
  prop-driven component contracts.
- Refreshed Graphify to 739 nodes and 992 edges and confirmed the graph includes
  the management guard, product-management hook, category dialog, and editor
  flow.
- Final verification passes: `npm run check:convex`, `npx convex dev --once
  --typecheck enable`, `npm run check:management`, `npm run check:seed`, `npm
  run check:pos`, `npx tsc -b`, `npm run build`, and `git diff --check`.
- Corrected the final selection edge case found in diff review: empty categories
  clear unrelated product selection, and a new product defaults to the selected
  active category.
- Closeout review found no unbounded Convex collection/database filter, tracked
  secret-like file, machine-local Graphify path, committed environment file,
  deployment credential, signing material, or printer implementation. The
  complete applicable DOX chain was re-read and its indexes remain correct.
- Exact next action: stage only APP-03 files, commit with the card ID, and push
  before recording the SHA.

### 2026-07-28 — APP-02 complete

- Pushed `APP-02: seed Convex development data` as
  `7b4530aa5791204aa9b75ed00c2dc4a6a49c8385` and confirmed
  `origin/codex/goal-02-functional-app` resolved to the same SHA.
- Completion evidence: the protected internal reset ran twice with identical
  counts across all 11 tables; both relationship-verification reports matched;
  the disabled deployment flag rejected the reset; Graphify and all required
  checks passed.
- `.env.local`, deployment credentials, signing material, and printer secrets
  were not committed.
- APP-02 is done; APP-03 is pending and no card is in progress.
- Exact next action: start APP-03 with its DOX/ledger/Graphify reads and
  implement validated product, modifier, and recipe management.

### 2026-07-28 — APP-02 started

- Re-read the root and Convex DOX plus the durable ledger after context
  compaction.
- Queried Graphify first for the schema, generated function boundary, indexes,
  and development-seed requirements.
- Confirmed APP-00 and APP-01 are done and marked APP-02 as the only card in
  progress.
- Confirmed from current official documentation and the installed CLI that
  internal functions are CLI-runnable, deployment environment variables are
  available through `process.env`, and bounded `.take(n)` reads are appropriate
  for the reset guard.
- Added `convex/seed.ts` with an internal confirmation-gated reset mutation,
  deterministic cross-table fixtures, bounded single-transaction cleanup, and
  an internal relationship-verification query; added `seed:dev` and
  `check:seed` CLI scripts without a new dependency.
- `npm run check:convex` passes after the implementation.
- Enabled the non-secret `OLASO_ENABLE_DEV_SEED=true` flag only on the dedicated
  development deployment and deployed with `npx convex dev --once --typecheck
  enable`.
- Ran `npm run seed:dev` twice. Both runs returned identical counts across all
  11 tables: 4 categories, 15 products, 4 modifier groups, 8 modifier options,
  14 ingredients, 15 recipe versions, 39 recipe items, 13 sales, 17 sale items,
  65 stock movements, and 7 dated daily summaries.
- Ran `npm run check:seed` after both resets. Both reports matched and verified
  Cappuccino's three-item recipe, a two-line sale with three consolidated stock
  movements, the 2026-07-28 daily metric, and two low-stock fixtures.
- Temporarily disabled the deployment seed flag and confirmed the internal
  reset refused to run before any writes; restored the development flag and
  left the second verified seed intact.
- Refreshed Graphify to 665 nodes and 799 edges; the updated graph traces
  `resetAndSeed`, `verify`, their bounded helpers, generated API boundary, and
  CLI scripts.
- Final checks pass: `npm run check:convex`, `npx convex dev --once --typecheck
  enable`, `npm run check:seed`, `npm run check:pos`, `npm run build`, and
  `git diff --check`.
- Backend scans found no unbounded `.collect()` or database `.filter()` access;
  sensitive-content scans found no deployment keys, Vite deployment URLs,
  credentials, private keys, or machine-local Graphify paths in the card
  files. `.env.local` remains ignored.
- Exact next action: re-read the closeout DOX chain, stage the reviewed APP-02
  files, commit and push, then record the SHA and remote branch before marking
  the card done.

### 2026-07-28 — APP-01 complete

- Pushed `APP-01: bootstrap Convex foundation` as
  `5189a4eb6a52f363313b650be076a116864ff153` and confirmed the remote branch
  resolves to that SHA.
- Completion evidence: dedicated cloud development deployment connected; typed
  schema deployed; generated bindings and 11 tables verified; Convex, POS, and
  production checks passed; 1340 × 800 runtime smoke and console passed;
  Graphify structural code graph refreshed.
- `.env.local`, deployment configuration, credentials, and signing material
  were not committed.
- APP-01 is done; APP-02 is pending and no card is in progress.
- Exact next action: start APP-02 and implement the internal deterministic
  development seed/reset.

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
