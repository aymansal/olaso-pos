# Olaso screen-by-screen polish ledger

Updated: 20 September 2026.

## Read this after every context compaction

This is the active ledger for the complete screen-by-screen improvement of
Olaso. Read this file **in full before resuming work after every compaction**, at
the start of a new conversation continuing this work, and before changing the
active screen. Do not rely on a chat summary instead of this file.

`SAAS_TRANSITION.md` retains the wider SaaS concerns and historical work.
This file owns the current UI sequence, decisions, research, checks and next
action. `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `BRAND.md` and the approved
Pencil frames still own their respective product and implementation contracts.

## Recovery protocol

1. Read root `AGENTS.md`, this entire ledger and the current direction in
   `SAAS_TRANSITION.md`. Read the deeper instructions for the active screen.
2. Read the State pointer, captured owner decisions and latest checkpoint below.
   An old screenshot, installed APK or earlier polish pass is not acceptance.
3. Open and read the actual required `SKILL.md` files below and their relevant
   referenced guidance. Reading this table or remembering a skill is not enough.
   Record which skills/sections were read for the current step.
4. Query Graphify before inspecting/changing code. Check the working tree and
   preserve unrelated work. Verify current device and app state when needed;
   do not assume the formerly used Samsung is still the connected tablet.
5. Resume only the active screen and its exact next action. Carry pending
   decisions forward without silently answering them. Update this file after
   meaningful work and before a handoff/compaction when possible.

## State pointer

- **Active screen: UI-01 — Dashboard.** Status: queued for a complete skills-led
  review; previous corrections exist but the complete screen is not accepted.
- **Current task: UI-00 — create this ledger and wire recovery instructions.**
  Documentation only. No new UI implementation or app testing in this task.
- **Exact next action:** read the required skills, then inventory the real
  Dashboard and every interaction it opens. Record evidence and the applicable
  skill rule for each proposed correction; bring unresolved visible/product
  choices to the owner before implementing those choices.
- POS option-row choice remains unanswered: plain rows with dividers and
  selection marks, or retained outlined options. Carry it into UI-02; it does
  not block Dashboard. Do not infer an answer from silence.
- Do not automatically jump to POS, ingredients, security or sync work.

## Owner rules — no personal design choices

- **0% personal aesthetic choices.** Do not invent styling, layouts, wording,
  animation or product behavior because the agent thinks it looks better.
  Every visible change needs a specific applicable skill rule or an explicit
  owner-approved decision, with its source recorded here.
- Skills are guidance, not an exact finished POS design. Never label an
  interpretation or preference as “Apple requires this” or “the skill says so.”
- Where guidance is broad, use an already approved Olaso pattern if it resolves
  the question. Otherwise show the owner concrete alternatives and wait for the
  decision before changing that part. Do not reopen decisions already recorded.
- Read all relevant skills, but do not apply all 281 installed skills to every
  screen. Select by the actual task. Website themes, cinematic effects and 3D
  skills are not instructions to decorate this operational app.
- Explicit owner decisions, security, data correctness and accessibility take
  precedence over a third-party skill default. When applicable skills conflict
  and those authorities do not resolve it, record the conflict and ask the
  owner; do not quietly choose a favorite. Continue independent work meanwhile.
- No decorative bouncing buttons or motion that slows repeated cashier work.
  Do not add scaling, blur, glass or other effects just because a skill contains
  an example. Preserve the approved brand until the owner approves a change.
- Use plain English with the owner. No new dependency, framework, speculative
  abstraction or broad rewrite just to follow an example in a skill.

## Required skills and how they work together

Installed skill root: `C:/Users/Ayman/.codex/skills/`. Each name below resolves
to `<root>/<name>/SKILL.md`. Read the named files, not just their descriptions.
If a required file is missing, report the gap; do not invent its instructions.

| When | Read | Role and boundary |
| --- | --- | --- |
| Every screen | `apple-design` | Foundation: clarity, hierarchy, familiarity, immediate feedback, restraint. Emil's adaptation of Apple talks, not an official Apple-authored specification. |
| Every screen | `better-interface`; its six owners: `better-accessibility`, `better-layout`, `better-writing`, `better-typography`, `better-colors`, `better-ui` | Inspect consistent controls, spacing, readable content, contrast and usable interactions. Follow the domain owners and avoid duplicate findings. |
| Every screen | `no-ai-design-slop`, `audit-ai-design-slop` | Challenge redundant labels, unnecessary containers and purposeless decoration using concrete evidence. Preserve useful information and approved identity. |
| Every screen | `emil-design-eng`; `review-animations` for affected motion | Decide whether motion is useful for the frequency of the action. Review transitions and feedback without assuming every control needs animation. |
| Every screen | `design-qa-checklist`, `error-handling-ux` | Verify the complete flow and recovery states, not just the opening screenshot. |
| Products and Stock, before proposing a simpler model | `jobs-to-be-done`, `information-architecture`, `teslers-law`, `form-design`, `user-flow-diagram` | Understand real café tasks, remove unnecessary decisions and explain relationships before designing forms or changing data. |
| When a specific issue calls for it | `design-token-audit`, `loading-states`, `data-visualization`, `localization-design`, `usability-test-plan` | Use the relevant specialist for evidenced inconsistency, state, chart, language or usability issues. |
| Future owner website, or an explicitly chosen prototype | `web-design-engineer` | Read when that task starts. Do not import a new website styling system into the Android POS. |

Keep Graphify and Ponytail at full intensity as required by `AGENTS.md`.
For every implementation step, also research current official guidance for the
specific problem, including Android/Capacitor guidance for affected device
boundaries. Record links, date checked, alternatives, applicable skill sections,
the justified change, its owner decision where needed, and intended checks.
Skills do not replace research or actual device verification.

## Screen queue

Dashboard first and Lock last are explicit owner requirements. The middle rows
are the working navigation order, adjustable by the owner. Work on one screen
at a time; finish its complete flow and obtain owner acceptance before advancing.

| Card | Screen | Required coverage | Status |
| --- | --- | --- | --- |
| UI-01 | Dashboard | Metrics, chart details, recent orders, stock attention, View all paths, shared menus/actions reachable here and all relevant states | Active next; not accepted |
| UI-02 | POS | Search/categories, products, cart, choices/extras, quantities, Offert, clear/remove, cash/card/split payments, validation and recovery | Queued; option appearance unresolved |
| UI-03 | Orders / Sales | Search/filters, lists, details, cancellation and reprint flows, confirmations and feedback | Queued |
| UI-04 | Products | Categories, product forms, sizes, choices/extras, ingredient/recipe links, create/edit/delete and validation | Queued; workflow simplification required |
| UI-05 | Stock | Ingredients, units, purchasing, stock corrections, low-stock states and the Product-to-Stock relationship | Queued; workflow simplification required |
| UI-06 | Reports | Every existing report tab, periods/calendars, charts/tables, details and supported actions | Queued |
| UI-07 | Settings | Every existing section, staff/profile management, printer, sync/status, About/update and their dialogs | Queued |
| UI-08 | Lock | Profile selection, PIN entry, keyboard, invalid/locked/offline/loading states and staff switching | Last; queued |

At the start of each card, inspect what actually exists and enumerate every
tab, popup, menu, confirmation and route it exposes. The table is a coverage
prompt, not proof that every listed feature exists. Add newly discovered
surfaces to the current card. Shared-control changes require checking all
affected screens; that check does not activate their separate redesign cards.

## Products and Stock: simplify the workflow before the appearance

The owner explicitly wants the product/ingredient/stock/choices/extras system
to become easier to understand and operate. This is more than spacing polish.

When UI-04 starts, map a real drink from creation through sizes, recipe,
optional extras, sale and resulting stock deduction. With the owner, explain
what each concept means and identify duplicate steps, confusing names and
decisions the software can safely handle. Propose a simpler complete flow with
concrete café examples; get agreement on unanswered business decisions before
changing the model. UI-05 must verify and finish the stock side of that flow.

Preserve correct prices, units/conversions, stock quantities, purchase costs,
required-choice rules and historical sales/recipe facts. Do not hide necessary
complexity, silently change defaults or migrate/delete old records to make a
screen look simpler. Record migration and verification needs before any data
change. Recheck affected POS behavior when product configuration changes.

## Per-screen working record and completion gate

Maintain one compact record per active card with:

- Scope inventory: every surface/state, role, language and relevant device.
- Findings: evidence, user impact and precise applicable skill/source section.
- Decisions: already approved, awaiting owner, or determined by an explicit
  applicable rule. Record conflicting instructions and how they were resolved.
- Research: current official links/date, alternatives, Android versus app/data
  responsibility, and planned verification before implementation.
- Changes: files and what changed, preserving unrelated work and café records.
- Verification: checks actually run, screenshots, failures, unverified states
  and limitations. Never convert “not checked” into “passed.”
- Publication: commit SHA and `origin/main`, plus installed APK/device evidence
  when applicable. Follow the repository's commit/push rules.
- Owner review, acceptance status and the exact next action.

Inspect real content at the 1340 × 800 browser reference size and on the actual
connected Redmi tablet (last observed WebView 1340 × 804; recheck, don't assume).
Check long names/amounts, English/French, scrolling, keyboard-open layouts,
loading, empty, error, disabled, selected, pressed and focus states where they
apply. Include close/cancel/back, validation, retry and data preservation.
Run the required build and focused checks after app changes; do not reset the
retained development café data just to run a destructive test fixture.

A screen is not complete because it compiles, has a nice screenshot, or has
been installed. Its scoped interactions must be checked, material issues
resolved or explicitly accepted by the owner, design authorities reconciled,
changes pushed and the owner must accept the screen before moving on.

## Captured decisions and honest starting point

- Recent orders: line 1 = number + amount; line 2 = time + service type. No
  item count or routine Completed label; cancellation stays clearly marked.
- Dashboard View all links are borderless. Previous corrections and selected
  POS control changes were installed and checked on Redmi; this is not a claim
  that either entire screen is finished.
- Prior evidence: `SAAS_TRANSITION.md`, SAAS-05; implementation `73fdcdb`,
  publication record `a8bd6cf`, both pushed to `origin/main`.
- Existing captures: `tmp/redmi-saas05-dashboard.png` and
  `tmp/redmi-saas05-choices.png`. They show the prior checkpoint, not future work.
- Pending: POS plain rows versus outlined options; complete screen/state review;
  Pencil reconciliation (desktop connection unavailable at the prior attempt).
- Known check limitation: the existing CSS scope scanner flags `from`/`to`
  animation steps in untouched App/Lock CSS. Record current results accurately;
  do not claim all automated checks passed or change unrelated files silently.
- Broader database/sync, security, SaaS isolation and update-distribution concerns
  remain in `SAAS_TRANSITION.md`. Record discoveries during screen work, but
  do not silently start the later architecture programme.

## Checkpoint ledger

### UI-00 — establish recovery and screen sequence — 20 September 2026

- Owner requested this file, mandatory rereading after compaction, actual skill
  reading, Dashboard-first/Lock-last coverage and no personal design choices.
- Created this ledger and linked it from root instructions, README and the
  SaaS record. Updated stale active-direction text so there is one UI sequence.
- Documentation only: no UI changes, app tests, device actions or data changes.
- Verification: read back the full ledger; checked all eight screen cards,
  all 25 named skill files, recovery links in AGENTS/README/SaaS, the owner-choice
  and compaction rules, and `git diff --check`. Passed. No app build is needed
  for documentation-only changes. Publication pending commit/push.
- Next: UI-01 Dashboard, starting with the recovery protocol and full inventory.
