# DOX — Olaso POS

This repository uses hierarchical `AGENTS.md` files as living, local operating
instructions. A file is governed by this document and every more specific
`AGENTS.md` between the repository root and that file.

## Core Contract

- Read the complete instruction chain before editing.
- The deepest applicable instruction wins when rules conflict.
- Keep instructions current, concise, and operational. Do not use them as a
  changelog or duplicate longer project documents.
- After a meaningful change, update the owning `AGENTS.md` only when the
  subtree's purpose, ownership, contracts, workflow, or verification changed.
- When adding, moving, or deleting a child `AGENTS.md`, update its nearest
  parent's Child DOX Index in the same change.

## Project Authorities

Use the document that owns the decision:

1. `PRODUCT.md` — purpose, scope, workflows, and operational behavior.
2. `ARCHITECTURE.md` — persistence, sync, backend, printing, performance, and
   release behavior.
3. `DESIGN.md` — visual tokens, geometry, reusable UI, and interaction rules.
4. `BRAND.md` — brand assets, voice, confirmed facts, and provisional facts.
5. `untitled.pen` — approved visual frames; POS node `W26Y6` is the production
   POS authority.

Do not restate those documents here. Update the owning authority when a durable
decision changes.

## Repository Rails

### Graphify first

- Before inspecting, explaining, or changing the codebase, query
  `graphify-out/graph.json`.
- If the graph is missing, generate it with `/graphify .`.
- Refresh it with `/graphify . --update` after structural code changes.
- Graphify is development tooling only; never import it into the application or
  production bundle.

### Work ledger

- `PLAN.md` is the canonical remaining goal/card order and completion gate. Read
  it with the ledger before activating or resuming a goal; it does not override
  the project authorities.
- When `WORK_LEDGER.md` has an active goal, read it after the applicable
  `AGENTS.md` chain and before changing code.
- Re-read it after context compaction, task handoff, or resuming paused work.
- Update its task board, current checkpoint, and journal after every meaningful
  completed step and before pausing or finishing a turn with work in progress.
- Record verified facts, decisions, files changed, checks run, blockers, and the
  exact next action. Do not copy full specifications into the ledger.
- `WORK_LEDGER.md` tracks progress; it does not override `PRODUCT.md`,
  `ARCHITECTURE.md`, `DESIGN.md`, `BRAND.md`, or the applicable DOX chain.

### Main-only commits and pushes

- Work on one ledger card at a time and keep unrelated changes out of its
  commit.
- `main` is the only development and release branch. Do not create goal,
  feature, worktree, or handoff branches unless the owner explicitly reverses
  this decision.
- Before finishing a card, run its required checks, refresh Graphify after
  structural changes, and update the ledger with evidence and the exact next
  action.
- Commit messages start with the card ID and a concise imperative summary, for
  example `APP-03: connect product management`.
- Include the ledger update in the same card commit.
- Push `main` to `origin/main` immediately after every successful card commit.
- A card is not `done` until the commit is pushed and its commit SHA and remote
  location `origin/main` are recorded in the ledger.
- Follow-up commits for a card still start with that card ID.
- Never commit `.env.local`, credentials, deployment secrets, signing keys, or
  printer secrets.

### Implementation

- Use the smallest correct change and existing dependencies before adding code,
  abstractions, or packages.
- Before implementing every card, research the current official Android
  guidance and the official Capacitor/plugin guidance for any affected storage,
  lifecycle, background-work, networking, security, update, rendering, or
  hardware boundary. Record what belongs in native Android, what remains in the
  React/data layer, and why. Treat Olaso as an Android product, not a browser
  page, but do not add Kotlin or a native dependency when the existing native
  Capacitor boundary already provides the correct behavior.
- Keep each named reusable or independently interactive React component in its
  own `.tsx` file with a colocated `.module.css` when it owns styles.
- Keep screen layout in screen modules and child internals in child modules.
- Do not use barrel files, monolithic component files, monolithic CSS files, or
  speculative interfaces and repositories.
- Use Astryx when its primitive matches the required behavior, Phosphor for all
  interface icons, and the built Olaso theme for tokens.
- React components never contain database, sync, reporting-query, secret, or
  printer-protocol logic. Follow `ARCHITECTURE.md` when those layers arrive.
- The current repository includes a Convex development backend, live product,
  inventory, Orders, Dashboard, and Reports data, a verified Capacitor Android
  development beta, profile-owned local Settings and Lock flows, and
  local-first SQLite/outbox checkout with idempotent Convex synchronization.
  Goal 03 also includes a verified LAN endpoint plus a native printer
  settings/test boundary, deterministic receipt encoding, resident-logo setup,
  post-commit first-print state, and saved-snapshot Orders reprinting. Goal 05
  includes separate staff PIN identities, protected offline sessions, enforced
  roles, and same-day append-only whole-sale cancellation corrections; do not
  imply that discounts, refunds, bank reversals, or production release
  acceptance exist.
- Goal 06 LOCAL-01 adds SQLite schema 13 and the shared local-first management
  operation/outbox foundation with actor/role evidence, bounded non-secret
  payloads, parent dependencies, acknowledgement mapping, and safe retry state.
  Goal 06 LOCAL-02 adds schema 14/15 mappings and makes category, product,
  modifier, option, and immutable recipe management local-first with ordered
  acknowledgement and dependent sale translation. LOCAL-03 adds schema 16 and
  makes ingredient, purchase, stock-adjustment, expense, and compensation
  management local-first, with role-scoped saved Costs reporting and finance
  synchronization that cannot block sales. STAFF-01 adds owner-only offline
  staff creation, protected profile-scoped initial-PIN verification, and
  retry-safe server provisioning without placing the raw PIN in SQLite or the
  ordinary outbox. CATALOG-01 adds SQLite schema 17, explicit category artwork
  keys, a six-asset offline gallery, and a neutral fallback. Android connection
  truth plus foreground state closes idle Convex transports and prevents cloud
  reads/work while the activity is hidden or offline. LOCK-01 adds one shared
  role-safe profile menu; deliberate staff switching preserves an unfinished
  App-owned cart after confirmation without clearing protected profile access.
  LOCAL-04 adds SQLite schema 18 sale/correction actor IDs, dispatches queued
  writes with the originating profile's protected session, prunes stale
  replacement-cache rows while preserving pending/history rows, and requires
  both WebView visibility and window focus before cloud work.
- DELETE-01 adds SQLite schema 19 and real category, product, ingredient, and
  owner-authorized staff deletion. Immutable sale, recipe, ingredient, and
  compensation snapshots preserve historical names and facts; category removal
  leaves products uncategorized, ingredient removal repairs affected recipes,
  and earlier queued sales/staff work synchronize before live cloud deletion.

### Visual baseline

- The production app fills a 1340 × 800 Samsung Galaxy Tab A9 landscape
  viewport with the cream application surface.
- Never add a sage presentation backdrop, floating device shell, outer app
  radius, or app shadow.
- Preserve approved Pencil geometry and use `DESIGN.md` for component contracts,
  accessibility, and touch-target rules.

## Verification

- Every implementation card records its Android-native research decision and
  verifies the chosen boundary on the physical Galaxy Tab A9. Official research
  is a pre-implementation gate, not a substitute for device evidence.
- Run `npm run build` after source, theme, or styling changes.
- For visual changes, inspect the affected screen at 1340 × 800 and confirm no
  clipping, overflow, console errors, or console warnings.
- Add only the smallest check that protects new non-trivial business logic.

## Closeout

Before finishing a meaningful change:

1. Re-read the applicable instruction chain.
2. Confirm responsibility and behavior still match the docs.
3. Refresh Graphify after structural code changes.
4. Run the relevant verification.
5. Check parent and child DOX indexes when the hierarchy changed.

## Child DOX Index

- [`android/AGENTS.md`](android/AGENTS.md) — generated Capacitor Android shell,
  native configuration, and packaging safeguards.
- [`convex/AGENTS.md`](convex/AGENTS.md) — synchronized cloud schema, domain
  functions, reporting summaries, and development seeding.
- [`src/AGENTS.md`](src/AGENTS.md) — React application entry points, global
  styling, navigation, and source-level boundaries.
- [`tools/AGENTS.md`](tools/AGENTS.md) — version-controlled development-only
  laboratories and hardware fixtures excluded from the application bundle.
