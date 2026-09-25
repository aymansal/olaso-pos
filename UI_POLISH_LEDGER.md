# Olaso screen-by-screen polish ledger

Updated: 24 September 2026.

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
3. Open and read every applicable listed skill's actual `SKILL.md` and required
   referenced guidance. Reading this table or remembering a skill is not enough.
   Record which skills/sections were read for the current step.
4. Query Graphify before inspecting/changing code. Check the working tree and
   preserve unrelated work. Verify current device and app state when needed;
   do not assume the formerly used Samsung is still the connected tablet.
5. Resume only the active screen and its exact next action. Carry pending
   decisions forward without silently answering them. Update this file after
   meaningful work and before a handoff/compaction when possible.

## State pointer

- **UI-03 accepted; active card: UI-02 — POS owner-requested scoped correction.**
  The owner accepted UI-03 Orders / Sales on 23 September 2026, after the plain
  French cancellation-copy correction (`477d432`, recorded by `1a49f2a`). All
  21 numbered individual skill passes for Orders are recorded below (`UI-03 —
  sequential pass 01` through `pass 21`), and the acceptance entry records the
  accepted scope and every retained limitation. Acceptance is not 100%: no
  limitation below became a pass. The owner then named one scoped UI-02 POS
  correction — the product-card outline feels too thin and faint and needs
  stronger definition.
- **UI-00 complete:** ledger and recovery instructions created and published.
  Dashboard was the first screen card; the current work is UI-03 Orders / Sales.
  No new UI implementation or app testing was performed during ledger creation.
- **Exact next action:** read-only discovery of the owner-requested UI-02 POS
  product-card outline correction (compare the current border width and contrast
  against the approved reference and all card states). No POS code or styling
  change is authorized until the owner approves one specific change from that
  packet. Do not advance to Products until that UI-02 decision is recorded.
- **Carried forward unchanged:** the owner retained the two faint shared text
  colours (`--olaso-text-meta`, `--olaso-text-placeholder`) and deferred their
  contrast finding to a later palette pass. TalkBack speech, enlarged OS text,
  RTL and long-expansion, a real cloud-outage transition and live reprint stay
  recorded verification limitations, not passes.
- **Erroneous detour, 23 September 2026:** the POS customization-popup
  screenshot exercise was not authorized Orders work. Those captures are not
  acceptance evidence for UI-02 or any screen, no POS file changed, and the
  UI-02 option-row appearance remains as documented in `DESIGN.md`.
- **Owner-directed side task, 23 September 2026:** the owner separately
  authorized a branded Android first frame plus a comet startup loader
  (`LAUNCH-01` below). It changes no POS screen and does not alter the UI-02
  next action, the screen queue, or UI-02's read-only status.
- **Owner-directed side task, 24 September 2026:** the owner supplied an
  accepted Atelika wordmark crop and asked for an asset-only replacement of the
  live logo (`LAUNCH-04` below). It changes no screen layout and does not alter
  the UI-02 next action or the screen queue.
- **Owner-directed screen trial, 24 September 2026:** the owner approved one
  POS-only background preview (`POS-BG-01` below): a full-width dark teal header
  behind the existing cropped Atelika logo, plus a soft light non-white POS body
  that keeps the white product/cart cards distinct. Trial-only, not propagated
  to other screens, no palette rule declared. It awaits owner visual acceptance
  and does not alter the UI-02 next action or the screen queue.
- **Owner-directed screen trial, 24 September 2026 (POS-BG-02):** the owner then
  asked to see the whole POS screen background in the same dark teal as the top
  bar, POS screen only ('POS-BG-02' below). Provisional, reversible and
  POS-scoped; it preserves the cropped logo pixels, the white cards/receipt, the
  layout and every other screen, and only corrects the on-canvas text/control
  contrast the dark field requires. It awaits owner visual acceptance and does not
  alter the UI-02 next action or the screen queue.
- **Owner-confirmed correction, 24 September 2026 (POS-BG-02):** on the Redmi's
  1340 x 804 viewport the fixed 800 px POS shell left a six-physical-pixel cream
  strip at the bottom; the page-surface token now follows the POS trial in
  `src/globals.css`. See 'POS-BG-02 — correction' below. Still provisional and
  awaiting owner acceptance; does not alter the UI-02 next action.
- **Owner-directed screen trial, 24 September 2026 (BRAND-COLOR-01):** the
  owner then asked for one POS-only brand-action colour trial that replaces
  operational green where it meant selection or action with a brand mapping
  (dark teal selection, mint selected category, one orange Place order). See
  'BRAND-COLOR-01' below. Provisional, reversible and POS-scoped; it awaits
  owner visual acceptance and does not alter the UI-02 next action or the
  screen queue.
- **Owner-directed screen trial, 24 September 2026 (BRAND-COLOR-01 follow-up):**
  the owner then asked for three scoped changes to that same POS trial: a less
  rounded POS navigation pill, the selected category on the trial's action
  orange with dark text and the white knockout artwork instead of mint, and the
  brand teal tint on the unselected category artwork. See 'BRAND-COLOR-01
  follow-up' below. The owner rejected this follow-up on visual review; its
  three CSS changes were reverted to the earlier BRAND-COLOR-01 trial. That
  earlier trial is still provisional, not accepted. See the rollback entry.
- **Owner-approved screen trial, 24 September 2026 (BRAND-COLOR-01 follow-up 2):**
  the broad orange preview was installed, then rejected by the owner. The
  assistant had incorrectly broadened the brief to the top nav, Current order
  selectors, profile ring and language selector. Follow-up 3 below narrows the
  POS trial to the category, product-card/plus accents and Place order; all
  other interactive controls stay teal. No palette is accepted yet.
- **Owner-directed screen trial, 24 September 2026 (POS-BG-03):** the owner asked
  for one bounded POS-only trial: white top navigation/header background like the
  supplied Atelika tablet reference, keeping a visible narrow pale-teal workspace
  strip between the header's bottom edge and the Search products field. See
  'POS-BG-03' below. Provisional, reversible, POS-scoped; it awaits owner visual
 acceptance and does not alter the UI-02 next action or the screen queue.
- **Owner-directed correction, 25 September 2026 (POS-BG-03 capsules):** the owner
  asked for the `Report` button and the whole profile control to become 46px white
  rounded secondary capsules with a thin teal outline and dark-teal ink, and for
  the selected category fill to stay the exact `#01363E` shared by the top nav,
  Dine In and Cash. See the 25 September entry under 'POS-BG-03'. Provisional,
  POS-scoped; it survived an interrupted worker and awaits owner visual acceptance.
  The owner then rejected the trial's selected-category artwork shrink, which is
  reverted, so the selected card's greener reading than the nav/Dine In/Cash fills
  stays open. No 3D or shadow change is made while that is discussed.
- **Owner-approved change, 25 September 2026 (TOPBAR-01):** the owner approved
  making the current POS top bar the single persistent top bar on every screen
  that shows it — Dashboard, POS, Orders, Products, Stock, Reports — by reusing
  the one shared `Header` already mounted in `App.tsx`. Settings is explicitly
  excluded and keeps its previous bar; Lock and the startup states never mount
  it. See 'TOPBAR-01' below. Provisional and reversible; it awaits owner visual
  acceptance and does not alter the screen queue.

- **Owner-directed palette trial, 25 September 2026 (DASH-PALETTE-01):** Dashboard
  is the current active trial — the canvas moves to the POS pale mint-grey, the
  nonsemantic green becomes the accepted dark teal through role-scoped aliases, and
  the chart ramp becomes a teal ladder anchored by `#01363e`, while semantic
  success/amber/danger and every other screen body are preserved. See
  'DASH-PALETTE-01' below. After owner visual acceptance the Dashboard sequential
  21 skill passes restart in the ledger's numbered order, one screen at a time, with
  Settings last. The earlier POS findings remain open and provisional; this does not
  supersede them.
- **Root-cause fix, 25 September 2026 (NAV-PALETTE-01):** the owner reported that
  leaving POS for Dashboard made the outgoing POS revert to legacy green/cream
  during the transition. PROVEN CAUSE: the POS palette hung off the shell and was
  gated on `activeScreen`, which `openScreen` sets urgently outside
  `startTransition`, while the outgoing screen stayed painted through the 150 ms
  fade. Each screen now owns its palette for its whole visible lifetime (POS via
  `[data-pos-palette]` on its screen root and the two portalled POS dialogs;
  Dashboard already did this), and the 4 px strip follows the visible frame. See
  'NAV-PALETTE-01' below. The 150 ms transition is unchanged; the Dashboard 21-skill
  sequential rerun stays paused until the owner accepts this fix.
- **Owner-approved screen trial, 24 September 2026 (POS-CAT-01):** the owner
  approved one POS-only two-state category mapping: unselected cards keep the
  light surface with teal (#01363e) artwork and text, selected cards are solid
  #01363e with the same artwork and text in mint (#b5efd3). Orange leaves category
  styling only. See 'POS-CAT-01' below. Provisional and POS-scoped; it awaits
 owner visual acceptance and does not alter the UI-02 next action or the queue.
- **Owner-approved screen trial, 24 September 2026 (POS-CARD-01):** the owner
  then approved product-card outlines moving from orange to the POS teal
  (#01363e) with every plus button staying orange, and the workspace canvas
 lightening from #e6f9f3 to the more neutral #f0f7f3. See 'POS-CARD-01' below.
 Provisional and POS-scoped; it awaits owner visual acceptance and does not
 alter the UI-02 next action or the queue.
- **Owner-approved screen trial, 24 September 2026 (POS-NAV-01):** the owner
  approved unifying the active top-navigation pill with the deep teal already used
  by the selected Dine In and Cash segments. Inspection showed those segments
  paint with `var(--olaso-green)` and the pill used a separate `#0e5360`; the pill
  now reads the same declaration and the extra token is gone. See 'POS-NAV-01'
  below. Provisional and POS-scoped; it awaits owner visual acceptance.
- **Owner-directed Orders palette pass, 25 September 2026 (ORDERS-PALETTE-01):** the owner
  asked to move to Orders now for a bounded palette step, not the 21-skill Orders sequence.
  Orders now owns a screen-scoped palette (`[data-orders-palette]`) that takes the accepted
  canvas `#f0f7f3` and the accepted dark teal `#01363e` for nonsemantic green controls, copy,
  focus rings, pager, filter, date control and icon accents, keeps the real Completed /
  Synced / Last sync chips green, keeps amber and danger, keeps the existing table-head,
  metadata and selected-row fills, and adds no tint or orange. Reprint is teal. The two
  Orders-opened portalled surfaces (PeriodCalendar and CancellationDialog) inherit the same
  scoped palette; every other PeriodCalendar caller is unchanged. Provisional, awaiting owner
  visual acceptance; the Dashboard 21 skill passes are still pending. See ORDERS-PALETTE-01
  below.
- Do not automatically jump to Products, ingredients, security or sync work.

## Owner rules — no personal design choices

- **Text selection, owner decision 21 September:** interface text is not
  selectable. Apply this screen by screen, covering the full screen, buttons,
  dates/times, menus, popovers, dialogs, chart details and all UI states.
  Editable input/textarea/contenteditable text must retain normal selection,
  copy, cut and paste; preserve platform password protections. Do not block
  pointer events, keyboard focus, scrolling, accessibility or clipboard events.
  Check overlays separately, including portals outside the screen container.
  Dashboard and the shared Header/profile menu were the first implementation;
  POS now applies the same rule to its body and portal dialogs.
- **0% personal aesthetic choices.** Do not invent styling, layouts, wording,
  animation or product behavior because the agent thinks it looks better.
  Every visible change needs a specific applicable skill rule or an explicit
  owner-approved decision, with its source recorded here.
- **Sliding-selection rule, owner decision 21 September:** when a control has a
  sliding selected pill or sliding indicator, do not add a second gray pressed
  highlight to the same control. The sliding indicator is the selected and
  immediate-feedback state. Apply this to navigation tabs, segmented filters,
  table selection indicators, service/payment controls, language controls and
  any later control using the same pattern.
- Skills are guidance, not an exact finished POS design. Never label an
  interpretation or preference as “Apple requires this” or “the skill says so.”
- Where guidance is broad, use an already approved Olaso pattern if it resolves
  the question. Otherwise show the owner concrete alternatives and wait for the
  decision before changing that part. Do not reopen decisions already recorded.
- Read the relevant skills, but do not apply the entire installed collection to every
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
- The combined screen report must explain in plain English what the skills asked for,
  what was found, exactly what changed (or why nothing needed changing), what
  was actually verified, and what remains. Preparation is not a completed
  review; no-change alone is not evidence of compliance.

## Required skills and how they work together

Latest owner clarification, 21 September, confirms the one-skill-at-a-time rule:
**one screen, each applicable listed skill completed sequentially in numbered
order, then one combined report and owner acceptance before the next screen.**
Each skill gets its own checklist, screen review, justified corrections,
verification and ledger status. When a later skill repeats a requirement already
fixed by an earlier skill, verify that fix against the later skill and reuse its
evidence; do not make the same change twice. Overlap deduplicates implementation,
not skill passes. Continue to the next skill without waiting for permission unless
an unresolved owner choice blocks that skill; continue independent work meanwhile.
The original 14 skills plus seven agreed specialists form the 21 coverage rows below.
A skill need not force a change. A restart resets review status, not approved
layout, working corrections or café data.

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
| Specialists within each screen review | `critique-visual-hierarchy`, `critique-information-density`, `critique-affordance`, `design-token-audit`, `data-visualization`, `mobile-native`, `localization-design` | Review attention, clutter, visible interactivity, consistency, charts, tablet behavior and languages; merge overlaps with domain checks. Explain when a skill has no applicable surface. |
| When a specific issue calls for it | `loading-states`, `usability-test-plan` | Additional focused work only when needed; record it separately, never silently expand the active pass. |
| Future owner website, or an explicitly chosen prototype | `web-design-engineer` | Read when that task starts. Do not import a new website styling system into the Android POS. |

Keep Graphify and Ponytail at full intensity as required by `AGENTS.md`.
For every implementation step, also research current official guidance for the
specific problem, including Android/Capacitor guidance for affected device
boundaries. Record links, date checked, alternatives, applicable skill sections,
the justified change, its owner decision where needed, and intended checks.
Skills do not replace research or actual device verification.

### Skill sequence and Dashboard progress

Numbers define required pass order, not separate owner handoffs. Read each skill
and its required references before that skill's pass. Existing results below are
retained evidence, not automatic fresh passes.

| Step | Skill | Dashboard status |
| --- | --- | --- |
| 01 | `apple-design` | Closed by owner; recorded verification gaps carried forward |
| 02 | `better-interface` | Scope/routing complete; domain verdict waits for steps 03–08 |
| 03 | `better-accessibility` | Closed by owner with fixed-layout exception; speech/dialog and other recorded checks remain unverified |
| 04 | `better-layout` | Reviewed; unchanged geometry verified; fixed-layout exception retained |
| 05 | `better-writing` | Recovery instructions corrected and checked in EN/FR |
| 06 | `better-typography` | Role text corrected to 12px; enlarged-text gap retained |
| 07 | `better-colors` | Chart contrast finding awaits owner appearance choice |
| 08 | `better-ui` | Reviewed; approved controls retained; frame/dialog gaps carried |
| 09 | `no-ai-design-slop` | Reviewed; no further decoration removal justified |
| 10 | `audit-ai-design-slop` | Reviewed with row 09; no duplicate redesign |
| 11 | `emil-design-eng` | Reviewed; existing owner motion/selection exceptions retained |
| 12 | `review-animations` | Existing verified duration/interruption reused; full frame study unverified |
| 13 | `critique-visual-hierarchy` | Reviewed; existing summary-first hierarchy retained |
| 14 | `critique-information-density` | Reviewed; approved two-line rows and three regions retained |
| 15 | `critique-affordance` | Reviewed; shared recovery finding corrected; chart contrast still open |
| 16 | `design-token-audit` | Scoped audit complete; two existing primary-text token mappings corrected |
| 17 | `data-visualization` | Accurate geometry/details evidence reused; chart color finding open |
| 18 | `mobile-native` | Reviewed on Redmi; fixed viewport/selection exceptions and speech gap retained |
| 19 | `localization-design` | French daily-period wording corrected; EN/FR fit verified |
| 20 | `error-handling-ux` | List and language recovery corrected; native dialog gaps retained |
| 21 | `design-qa-checklist` | Combined evidence recorded; not full-screen approval |

Better Interface is an umbrella skill: row 02 routes findings to rows 03–08;
its orchestration is not another full inspection of the same requirements.
Review-only skills supply findings. Implement justified fixes under this owner's
screen-polish authorization and the relevant implementation guidance; keep
review evidence distinct from evidence that a correction actually works.
Information Architecture and Form Design remain required for Products/Stock
alongside their other workflow skills above; they are not Dashboard steps.

### Sequential review, overlap deduplication and screen handoff

1. Start with the first applicable numbered skill. Read its actual `SKILL.md`
   and required references completely. Inventory the screen, popups, menus and
   states that skill covers. Create that skill's checklist before editing.
2. Record each finding against the active skill's exact section and observed evidence.
   Each correction must also fit an existing owner decision or approved Olaso
   pattern. If the skill leaves a design choice unresolved, ask the owner;
   never invent a preference or attribute a personal choice to the skill.
3. Research each distinct problem before implementation; fix its root cause
   once. Complete the active skill's review, corrections and verification, then
   record its status before moving to the next numbered skill.
4. A later skill must still receive a complete pass. When it repeats a requirement,
   confirm the earlier correction and evidence still apply, then reference them
   instead of editing or testing the same cause twice. Touch access, keyboard
   access and spoken output, for example, are different checks and cannot be
   collapsed merely because they all concern accessibility.
5. Record each item as verified, failed, unverified, not applicable with a
   reason, or an explicit owner exception. An exception is not compliance.
   Reading a skill, compiling, or viewing one screenshot does not prove a pass.
6. Say “Dashboard — Apple Design polishing: 100% complete for the applicable
   checklist” only when every applicable item is verified, with no unresolved
   findings, unverified items or exceptions. This is a scoped completion claim,
   not Apple certification or a claim that all Dashboard skills are complete.
   Otherwise say “incomplete” or “complete with owner-approved exceptions” and
   name exactly what remains. Never rename an untested requirement as N/A.
7. Keep visual polish, accessibility, app behavior and physical hardware results
   separate. Printer output is not a visual-polish failure; a popup's appearance
   and recovery are still UI scope. Accessibility requirements actually named
   by the active skill remain in that skill's checklist.
8. After every numbered skill pass is recorded, give one plain-English screen
   report: what each skill asked for, findings, changes or justified no-change,
   checks, reused evidence and limitations. The final report combines results;
   it does not replace the individual passes. Update and publish the ledger under
   repository rules, then stop for owner acceptance before the next screen.

Later changes must preserve earlier verified results. Reopen affected checks
and record that regression work; do not silently undo an approved decision or
restart the entire checklist merely because another skill covers the same topic.

## Screen queue

Dashboard first and Lock last are explicit owner requirements. The middle rows
are the working navigation order, adjustable by the owner. Work on one screen
at a time; finish its complete flow and obtain owner acceptance before advancing.

| Card | Screen | Required coverage | Status |
| --- | --- | --- | --- |
| UI-01 | Dashboard | Metrics, chart details, recent orders, stock attention, View all paths, shared menus/actions reachable here and all relevant states | Combined review checkpoint delivered; the owner retained the existing chart shades without an outline; recorded gaps remain |
| UI-02 | POS | Search/categories, products, cart, choices/extras, quantities, Offert, clear/remove, cash/card/split payments, validation and recovery | Combined review delivered; owner acceptance pending; the 23 September popup screenshot exercise was an erroneous detour, not acceptance evidence. Owner requested one scoped correction on 23 September 2026: stronger product-card outline definition (border feels too thin/faint). Read-only discovery only; no code change authorized |
| UI-03 | Orders / Sales | Search/filters, lists, details, cancellation and reprint flows, confirmations and feedback | Owner-accepted 23 September 2026; all 21 numbered individual skill passes recorded and all known limitations retained; closed and published to `origin/main` |
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

- Owner confirmed Olaso is always light mode. There is no dark-mode Dashboard
  and no dark-mode work requested. The earlier clarification was an agent
  misunderstanding, now resolved; preserve the existing cream appearance.
- Owner explicitly requires the Dashboard layout to remain unchanged. Use
  realistic café names in previews (for example Iced Matcha Latte and Oat Milk).
  The agent's exaggerated long-name fixture is not a real reported café problem
  and does not authorize expanding rows or adding name-detail interactions.
  Withdraw the best-seller wrapping/popover choice; keep the existing row.
- Owner scope decision, 21 September: TalkBack speech, enlarged OS text/200%
  zoom, increased-contrast settings, native report/lock dialog focus details,
  slow-motion frame analysis and the full offline/role device matrix are not
  required for Dashboard UI polish. They remain historical limitations labelled
  **out of scope for this screen**, not claimed test passes.
- Owner chart-color decision, 21 September: the existing green shade ramp is
  visibly clear against the white chart surface. Do not add a dark outline or
  replace the existing shades with one uniform color. The measured contrast
  finding is an owner-approved exception for this Dashboard polish scope.
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

### UI-PUBLISH-01 — owner-authorized consolidated publish of all pending project work, 25 September 2026

#### Why this is one commit instead of one card per commit

- The owner explicitly instructed a single consolidated publish of every pending project change,
  including provisional and not-yet-accepted work, and to stop asking about accepted versus
  provisional. The pending changes are already intertwined inside shared files (`src/globals.css`,
  `src/App.tsx`, `src/lib/fr.ts` and this ledger each carry hunks from several cards), so a strict
  one-card-per-commit split is not possible without hunk-level staging that would risk splitting a
  single card's own hunks. The owner authorized this consolidation; the one-card-per-commit and
  one-card-per-push rule resumes with the next card.
- No card below becomes `done` through this publish, and no 21-skill UI pass is started or
  completed for any screen. Orders / Sales (UI-03) and POS UI-02 remain the only owner-accepted
  cards; every other card is committed as provisional or as an explicitly rejected trial.

#### Included cards and their honest status

| Card | Publish content | Status |
| --- | --- | --- |
| LAUNCH-01 | branded first frame and comet loader (`index.html`, `CometSpinner`, `StartupDots` removed, Android first-frame assets) | provisional; recorded limitations stand |
| LAUNCH-02 | visible logo artwork swap | provisional |
| LAUNCH-03 | visible Olaso to Atelika rebrand in copy, aria labels and receipt fixtures | provisional |
| LAUNCH-04 | accepted Atelika wordmark re-derivation (brand assets plus Android `drawable-nodpi`) | owner-accepted, asset-only |
| NAV-PALETTE-01 | each screen owns its palette for its whole visible lifetime, plus the frame strip token | implemented and device-verified; still awaits owner acceptance |
| TOPBAR-01 | the shared top bar on every screen that shows it | provisional |
| POS-BG-01/02/03 | POS dark-teal header, soft body, white top bar and capsule corrections | provisional; several owner corrections folded in |
| BRAND-COLOR-01 and follow-ups | POS brand-action colour trials | provisional; follow-up 1 and the broad orange preview were owner-rejected and reverted |
| POS-NAV-01 | active nav pill unified with the selected segment teal | owner-approved |
| POS-CARD-01 | 2px product-card outline and neutral workspace canvas | owner-approved |
| POS-CAT-01 | POS two-state category mapping | owner-approved |
| UI-01 | Dashboard chart comparison and locale corrections | partial checkpoint, not whole-screen approval |
| UI-02 | 2px product-card outline | owner-accepted |
| UI-03 | Orders / Sales sequential 21-skill passes | owner-accepted, with retained limitations |
| DASH-PALETTE-01 | Dashboard palette trial | provisional |
| DASH-ORANGE-01 | Dashboard orange Net Sales value | provisional trial |
| ORDERS-PALETTE-01 | Orders palette first pass and its two corrections | provisional |
| ORDERS-ORANGE-01 | full orange enabled Reprint action | provisional trial |
| PRODUCTS-PALETTE-01 | Products palette trial | provisional |
| PRODUCTS-SELECT-01 | list/editor selection synchronization, the category-change first-row rule and the editor-seeding correction | provisional; no colour change |
| PRODUCTS-ORANGE-01 | orange selected category | OWNER-REJECTED and reverted; only the approved orange token pair remains, for the CTA |
| PRODUCTS-ORANGE-02 | orange Add product CTA with dark action ink | provisional trial |

#### Publish hygiene

- The malformed three blocks this worker accidentally wrote into this ledger (139 lines carrying a
  stray leading `+`) were repaired by stripping only that accidental character; every other line,
  heading and table is unchanged and the file length is identical.
- `SAAS_TRANSITION.md` had disappeared from the working tree during the audit. It was confirmed
  absent, confirmed present in `HEAD`, and restored from `HEAD` with `git restore --source=HEAD`.
  The working tree file is content-identical to `HEAD` (an earlier uncommitted edit of about
  114 added and 6 removed lines had already been destroyed by that deletion before this worker
  saw the file, and is not recoverable from git because it was never staged).
- Excluded from the publish and left untracked: machine-local agent state `.codex/`,
  `.commandcode/` and `.freebuff/`, plus the ignored build and cache directories (`dist/`,
  `node_modules/`, `tmp/`, `graphify-out/`, `android/**/build/`, generated theme files). No
  secrets, credentials, `.env` files, signing keys or local database files exist in the staged
  set; a name scan found none anywhere in the tree.
- Included per the owner's instruction even though no source references them: the untracked art
  and output working directories `output/` (239 files, about 435 MB including five `.zip`
  archives), `product-images/` (11), `croissant-images/` (9) and `croissant-crops/` (9). The
  largest single file is `output/matcha-transparent-images.zip` at about 41 MB, under GitHub's
  100 MB per-file limit.
- Verification recorded with this publish: `npm run build` passed on the published source, and the
  navigation, Products selection, local catalog and product configuration checks passed. No data
  was written, and no sale, print, cancellation or reseed was performed.
- Tablet evidence is unchanged from each card's own entry; this publish makes no new device
  claim and does not restate provisional work as verified.

#### Status and exact next action

- Consolidated publish authorized by the owner. Commit and push `origin/main` are recorded in the
  follow-up entry below, which carries the commit SHA required by the ledger rule.
- Exact next action: resume the one-card-at-a-time sequence at the owner's next named card; the
  queued Products orange CTA trial stays provisional and unaccepted until the owner judges it.

#### Publication

- One consolidated commit `a3bc76f` (`UI-PUBLISH-01: publish all pending Olaso project work as
  one owner-authorized snapshot`) was pushed non-force to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; the remote moved from `eb54a21` to `a3bc76f` with no
  divergence and no force push.
- Contents: 357 files changed, 5,542 insertions and 309 deletions, including the untracked art
  working directories the owner asked to include. Left untracked: `.codex/`, `.commandcode/`,
  `.freebuff/` and every ignored build/cache path.
- This follow-up commit records the SHA, as the ledger's main-only rule requires. Provisional and
  trial status is unchanged by the publish, and no card was marked done.

### PRODUCTS-ORANGE-02 — Products Add product CTA orange trial (owner-requested, reversible), 25 September 2026

#### Owner override and constraints

- After seeing the orange selected category, the owner rejected it and replaced the request with
  the opposite placement: the selected category returns to dark teal exactly, and the full
  `Add product` call to action becomes the approved action orange `#e06a00` with the dark action
  ink `#1c211b` on both its label and its plus glyph. Not icon-only, no other orange, no shared
  component change.
- Reversible and Products-only. Every other screen, the shared Header, the semantic success,
  amber and danger colours, the selected product row, geometry, artwork and data are untouched.
- Provisional: a visual TRIAL, not accepted, and still not the numbered UI-04 21-skill pass.

#### Research gate, 25 September 2026

- Same boundary and the same recorded research as the rejected category trial: W3C/WAI
  *Understanding SC 1.4.3 Contrast (Minimum)* for the 4.5:1 small-text rule and *Understanding
  SC 1.4.11 Non-text Contrast* for the plus glyph, plus the Android Material 3 brand-accent
  versus status-role point. The CTA label is 9px / 700, so it is normal text and needs 4.5:1: the
  dark-ink pair measures 4.86:1 while white on the same orange would be 3.37:1 and fail. No new
  source, no new colour and no new token; the pair is the existing `--olaso-trial-action` and
  `--olaso-trial-action-ink` already declared in the Products palette block.
- Boundary: web-layer only - two declarations inside one existing rule. No Kotlin, plugin,
  package, data or lifecycle change.

##### Change (1 file for this trial, no new file)

- `src/features/products/components/ProductCatalogPanel/ProductCatalogPanel.module.css:43-46` -
  `.addProduct` now reads `color: var(--olaso-trial-action-ink, var(--olaso-white))` and
  `background: var(--olaso-trial-action, var(--olaso-green))`. The fallbacks keep the previous
  teal/white, and the label and the plus glyph share the same ink.
- `scripts/check-navigation.mjs` - the rejected category assertions are replaced with the reverted
  pill and ink plus the new `.addProduct` pair assertion, with a `doesNotMatch` guard that the
  category sidebar no longer mentions the trial token.

#### Measured pairs (computed from the declared values)

| Surface | Fill | Ink | Ratio | Threshold |
| --- | --- | --- | --- | --- |
| Add product CTA (label and plus glyph) | `#e06a00` | `#1c211b` | 4.86:1 | 4.5:1 text, 3:1 glyph - pass |
| selected category pill (reverted) | `#01363e` | `#ffffff` | 13.14:1 | unchanged |
| Save changes (unchanged) | `#01363e` | `#ffffff` | 13.14:1 | unchanged |

#### Browser evidence at exactly 1340 x 800 (real components)

- `All`, `Coffee` and `Uncategorized`: the CTA renders background `rgb(224,106,0)` with label and
  plus glyph `rgb(28,33,27)` (**4.86:1** each); the selected category pill renders `rgb(1,54,62)`
  with white ink; Save changes stays `rgb(1,54,62)`; canvas `rgb(240,247,243)`; 1340 x 800 with
  no overflow; the CTA is never disabled on this screen.
- Hover, pressed and focus were forced through the devtools protocol: hover and `:active` keep the
  same `rgb(224,106,0)` / `rgb(28,33,27)` pair with no `filter` applied, and `:focus-visible` adds
  the browser default `1px auto rgb(16,16,16)` ring, well above 3:1 on the orange.

#### Device evidence (installed build, 1340 x 804, Redmi 22081283G)

- The CTA renders background `rgb(224,106,0)` with label and plus glyph `rgb(28,33,27)`; the
  selected category pill renders `rgb(1,54,62)` with ink `rgb(255,255,255)`; Save changes stays
  `rgb(1,54,62)`; canvas `rgb(240,247,243)`; 1340 x 804 with nothing clipped; console empty.

#### Captures

- Device: `tmp/products-orange/fix2-all-to-coffee.png`, `fix2-all-to-matcha.png`,
  `fix2-all-to-cold.png`, `fix2-all-to-uncategorized.png`, `fix2-coffee-to-all.png`,
  `fix2-matcha-to-all.png`, `fix2-cold-to-all.png`, `fix2-uncategorized-to-all.png`,
  `fix2-all-page2.png`, `fix2-final-all-page1.png`.
- Browser: `tmp/products-orange/browser-1340x800-cta-{All,Coffee,Uncategorized}.png`.

#### Limitations (not acceptance)

- Trial only; the orange CTA is not accepted and the 21-skill pass has not started.
- The `Add product` control is never disabled, so a disabled state cannot be measured for it;
  every other Products control's disabled appearance is unchanged.
- FR and owner-versus-manager roles were not exercised. The crossfade edge was not re-measured
  because this trial adds no canvas or frame token.

#### Status and exact next action

- Reversible, owner-requested ORANGE TRIAL on the Add product CTA only. Not accepted, screen not
  done, no commit or push.
- Exact next action: the owner reviews the CTA captures and either accepts the orange CTA or asks
  to revert it - reverting is the one `.addProduct` pair plus the token pair in the Products
  palette block.

### PRODUCTS-ORANGE-01 — reversible Products-only orange selected-category trial (owner-requested), 25 September 2026

#### Owner authorization and constraints

- Queued by the owner after the PRODUCTS-SELECT-01 editor-sync correction, which finished first.
  A Products-only orange visual TRIAL: the SELECTED category pill/background turns orange;
  `Add product` (and `Add category`) stay dark teal; unselected categories, the selected product
  row, every semantic status, other screens, layout/geometry and artwork are untouched.
  Reversible, with no new dependency, abstraction or colour.
- The owner explicitly chose which side carries the orange: the highlighted category, not
  `Add product`. The selected category name, count and icon take the existing dark action ink
  `#1c211b` because white on the orange measures 3.37:1 and fails the 4.5:1 small-text rule; the
  dark pair measures 4.86:1.
- Provisional: this is not the numbered UI-04 21-skill pass; Products is not marked done or
  accepted, and the Dashboard 21-skill passes remain pending.

#### Research gate, 25 September 2026

- This exact boundary (a small label and icon on the approved action-orange fill) was already
  researched and recorded the same day in DASH-ORANGE-01 and ORDERS-ORANGE-01 (including its
  correction), and it is still current: W3C/WAI *Understanding SC 1.4.3 Contrast (Minimum)*
  (4.5:1 normal text, 3:1 large text) and *Understanding SC 1.4.11 Non-text Contrast* (3:1 for
  the graphic parts that identify a control or its state). Android's Material 3 guidance that
  brand-accent roles must not be confused with status roles also applies: orange is used only as
  the selected-brand indicator on a category, and category selection is not a
  success/warning/danger state. No new source was needed because the pair, the threshold and the
  decision are identical to the recorded cards; re-sourcing would repeat the same citation.
- Boundary: web-layer only - one token pair inside an existing palette block plus CategorySidebar
  declarations. No Kotlin, plugin, package, data or lifecycle change; the Capacitor Android
  boundary is unchanged.

##### Changes (3 files, no new file)

- `src/globals.css:215-216` - the already-approved action-orange pair is declared inside the
  existing `[data-products-palette]` block (`--olaso-trial-action: #e06a00`,
  `--olaso-trial-action-ink: #1c211b`), never at `:root`. That block is carried by the Products
  screen root and all five portalled Products dialogs, so the pair reaches only Products.
- `src/features/products/components/CategorySidebar/CategorySidebar.module.css` - `.indicator`
  background (line 60) and `.uncategorizedActive` background (line 148) read
  `var(--olaso-trial-action, var(--olaso-green))`; `.categoryActive` colour (line 94) and
  `.categoryActive strong` / `.categoryActive small` (lines 134, 138) read
  `var(--olaso-trial-action-ink, var(--olaso-white))`. Every declaration keeps its previous
  teal/white value as the fallback. `.addCategory` (line 164) and the `Add product` button are
  NOT touched and stay `var(--olaso-green)`.
- `scripts/check-navigation.mjs:187-194` - assertions for the token pair, the two pill
  backgrounds, the three active-ink declarations and the unchanged `.addCategory` teal.

#### Measured pairs (computed from the declared values)

| Surface | Fill | Ink | Ratio | Threshold |
| --- | --- | --- | --- | --- |
| selected category pill / Uncategorized | `#e06a00` | `#1c211b` | 4.86:1 (name, count, icon) | 4.5:1 text, 3:1 glyph - pass |
| unselected category | sidebar `#e9eff0` | `#283029` / `#59645b` | 11.70:1 / 5.32:1 | unchanged |
| Add category / Add product | transparent / `#01363e` | `#01363e` / `#ffffff` | unchanged teal | unchanged |

#### Browser evidence at exactly 1340 x 800 (real CategorySidebar, dev-only fixture)

- `All` and `Coffee`: the sliding pill renders `rgb(224,106,0)` and the active name, count and
  icon render `rgb(28,33,27)`, each measured **4.86:1**. `Uncategorized` renders no pill and
  instead `rgb(224,106,0)` on `.uncategorizedActive`, same ink and ratio.
  `--olaso-trial-action` resolves `#e06a00` and `--olaso-trial-action-ink` `#1c211b` on the
  screen root, while the `documentElement` value of `--olaso-trial-action` is empty, proving no
  `:root` promotion.
- Unchanged and confirmed: unselected name/count `rgb(40,48,41)` / `rgb(89,100,91)`,
  `Add category` ink and `Add product` fill `rgb(1,54,62)`, canvas `rgb(240,247,243)`, sidebar
  and column head `rgb(233,239,240)`, Available `rgb(232,243,230)` and unavailable
  `rgb(255,240,238)` chips; 1340 x 800 with no overflow.
- Hover / focus / pressed: CategorySidebar has no author `:hover`, `:focus` or `:active` rule, so
  those states keep the same orange fill and dark ink (**4.86:1**). Keyboard focus uses the
  browser default ring: with `:focus-visible` forced through the devtools protocol it computed
  `outline: 1px auto rgb(16,16,16)`, near-black on the orange fill and well above 3:1. The
  missing author ring is pre-existing for every category button and was neither introduced nor
  worsened by this trial.

#### Device evidence (installed build, 1340 x 804, Redmi 22081283G)

- Read-only category walk (category filters only): `All products`, `Coffee`, `Matcha & Tea`,
  `Cold & Sweet` and `Bakery & Savoury` each render the pill `rgb(224,106,0)` with name, count
  and icon `rgb(28,33,27)` (**4.86:1**); `Uncategorized` (0 products) renders
  `rgb(224,106,0)` on the active row with the same ink and shows the existing empty table and
  empty editor. `Add category` ink and `Add product` fill stay `rgb(1,54,62)`.
- Unchanged on device: canvas `rgb(240,247,243)`, sidebar/column head `rgb(233,239,240)`,
  selected-row band `rgb(228,236,236)`, Available/Linked `rgb(232,243,230)` with the
  `rgb(55,165,99)` dot, amber recipe `rgb(245,240,228)` and unavailable `rgb(255,240,238)`; one
  highlighted row on each non-empty category and none on the empty one; the WebView console was
  empty; 1340 x 804 with nothing clipped.
- The shared `PeriodCalendar`, Header, Settings, POS and Dashboard were not opened or changed by
  this trial; only the two Products-scoped tokens were added.

#### Checks

- `npm run build` 0. `npm run check:navigation` 0 with the new assertions.
  `npm run check:products-selection` 0. `npm run check:local-catalog` 0.
  `npm run check:product-configuration` 0. `npm run check:css-scope` still reports only the four
  pre-existing App/Lock keyframe findings (exit 1 is the recorded baseline).
- Built CSS carries `._indicator_*{background:var(--olaso-trial-action,var(--olaso-green));...}`,
  the `.categoryActive*` ink rule and
  `.uncategorizedActive{background:var(--olaso-trial-action,...)}`, with an untouched
  `.addCategory{...color:var(--olaso-green)}` and `.addProduct{...background:var(--olaso-green)}`.
- Install: `node scripts/build-android-beta.mjs` with `JAVA_HOME` set to the toolchain JDK 21
  built the APK (140 tasks); `adb install -r --no-streaming` succeeded (`firstInstallTime`
  unchanged at 2026-09-24 22:17:12, `lastUpdateTime` 2026-09-25 20:30:43), so data was
  preserved. APK SHA-256
  `A05B30B66C94560403E8509FB09CC3356293AA578536491323DC01DE7BF3B076`. No product save/delete,
  sale, print, cancellation, reseed or other data write was performed.

#### Captures

- Device: `tmp/products-orange/redmi-1340x804-orange-{all,coffee,matcha-tea,cold,bakery,uncategorized}.png`.
- Browser: `tmp/products-orange/browser-1340x800-orange-selected-{All,Coffee,Uncategorized}.png`
  and `tmp/products-orange/browser-1340x800-orange-focus-ring.png`.
- Raw device reads: `tmp/products-orange/device-run.log` (the unlock value is redacted there and
  was never logged, stored or printed by the tooling).

#### Limitations (not acceptance)

- This is a palette TRIAL only; the colour is not accepted. The owner must judge the orange
  against the teal table and the white cards on the device. Products is still not done and the
  numbered UI-04 21-skill passes have not started.
- The crossfade edge was not re-measured this turn because the trial adds no canvas or frame
  token; the frame strip still comes from the recorded NAV-PALETTE-01 / `frameMint` mechanism,
  which already covers Products and is unchanged.
- CategorySidebar has no author focus ring (pre-existing, unchanged). FR and owner-versus-manager
  roles were not exercised.

#### Status and exact next action

- Reversible, owner-requested orange TRIAL on the Products selected category only. Not accepted,
  screen not done. No commit or push.
- Exact next action: the owner reviews the Redmi All / Coffee / Matcha & Tea / Uncategorized
  captures and either accepts the orange selected-category look or asks to revert it. Reverting
  is the two `--olaso-trial-action*` declarations plus the five CategorySidebar reads.

#### Owner rejection and revert, 25 September 2026

- **Owner decision:** the owner saw the orange selected category and rejected it. The selected
  category returns to its exact previous appearance: `.indicator` and `.uncategorizedActive`
  backgrounds are `var(--olaso-green)` again and `.categoryActive` plus its `strong` and `small`
  are `var(--olaso-white)` again, with no trial token left in that stylesheet.
- The two `--olaso-trial-action` / `--olaso-trial-action-ink` declarations stay in
  `[data-products-palette]` because the replacement CTA trial below consumes the same approved
  pair; nothing of the rejected look remains in `CategorySidebar.module.css`, which is guarded by
  a `doesNotMatch` assertion.
- The approved Products palette, the selection fix, the editor-sync correction and every
  unrelated dirty change are preserved. Provisional, reversible and not accepted.

### PRODUCTS-SELECT-01 — Products selection/highlight synchronization (root-cause fix, provisional), 25 September 2026

#### Owner contract

- The owner reported that `All products` opens with no row visibly highlighted while other
  categories highlight the last row (Coffee, Matcha & Tea) or the first (Cold & Sweet,
  Bakery & Savoury), and asked for one global root-cause fix covering existing, newly created
  and Uncategorized categories with no per-category special cases.
- Contract: the selected product, the editor and the visibly highlighted row must stay
  synchronized. On the first loaded display and on every category, search, availability, sort
  and page change, keep the current selection only while it is still on the displayed page;
  otherwise select the first displayed row. With zero rows, clear the selection and show the
  existing empty editor. A category switch must not select through the raw
  `management.products` order. Retained state must still be preserved when it is consistent on
  return (DESIGN.md 'Interaction and State'), together with every filter, pagination,
  add/delete/manager flow and draft-safety behaviour, and there must be no transient
  previous-page row or empty-editor flash during the page reset if that is avoidable.
- No colour or orange change in this card; the owner decides that separately after seeing the
  bug fix. Provisional: still not the numbered UI-04 21-skill pass, and Products is not done.

#### Research gate, 25 September 2026

- Official current React guidance: *You Might Not Need an Effect* (https://react.dev/learn/you-might-not-need-an-effect)
  - a value that can be calculated from existing props or state should be derived during
  render rather than stored and synchronized in an Effect, because the Effect form renders
  once with the stale value and only then corrects it; `useEffect` is for synchronizing with
  external systems and user-action state belongs in the event handler. `useState`
  (https://react.dev/reference/react/useState) documents *adjusting state during render*:
  store the previous value in state, compare during render, call the setter only under a
  condition that eventually becomes false, and React "discards the current JSX output and
  immediately retries rendering with the updated state, before rendering children" - the docs
  explicitly prefer it to an Effect for synchronously adjusting state from newly rendered
  values. *Preserving and Resetting State* (https://react.dev/learn/preserving-and-resetting-state)
  - state persists while a component keeps its position, and `key` is the reset mechanism.
  The `useRef` reference (https://react.dev/reference/react/useRef) notes that a ref does not
  trigger a re-render, so it is unsuitable for a value that drives what is displayed.
- Diagnosis this replaces: the page reset lived in a ref plus an Effect and the first
  selection in a second one-shot Effect whose `|| selectedProductId` guard then blocked every
  later correction. Device evidence reproduced both symptoms and proved the indicator itself
  is correct, so the defect is purely which product gets selected.
- Alternatives considered: keeping the Effects (rejected - commits and paints one frame with
  the stale page and an off-page selection, which the owner forbade); doing it in `useMemo`
  (rejected - memoization caches a value and is not a state-synchronization mechanism);
  resetting the editor with `key` (rejected - fixes the wrong component and would discard the
  draft on every selection change); clearing the selection on category switch (rejected -
  contradicts the Products DOX rule that list selection and editor content stay synchronized);
  and deriving the selection with no state at all (impossible here - `useProductManagement`
  is called before `visibleProducts` exists, so the displayed id cannot come from the hook's
  own output in one pass).
- Decision: derive the page and the on-page test during render and use the documented
  render-phase state adjustment only for the two state writes, so React retries before any
  paint. Boundary: web-layer React only; no Kotlin, plugin, package, data or lifecycle change.

##### Changes and verification - Products selection

- **Change (2 source files + 1 new check, no new abstraction):**
  - `src/features/products/ProductsScreen.tsx` — the `filterKey` ref-plus-Effect page reset and
    the one-shot first-selection Effect are replaced by one exported pure rule and two
    render-phase adjustments. `resolvePageSelection(pageProducts, selectedProductId)` returns
    the selection when it is on the displayed page, otherwise that page's first row, and
    `undefined` for an empty page. During render, a changed `filterKey` resets the page and the
    rule corrects the selection, so React retries before any paint instead of committing a
    stale frame. `requestedPage = filtersChanged ? 0 : page` means the current render already
    slices the first page while the state catches up. The category handler is now
    `onSelectCategory={setSelectedCategoryId}`, so a switch never selects through the raw
    `management.products` order. `useEffect` and `useRef` are no longer imported there.
  - `scripts/check-products-selection.mjs` and the `check:products-selection` npm script — a
    behaviour test that lifts the real rule out of the source (the same
    `stripTypeScriptTypes` technique `check-orders.mjs` uses) and exercises the matrix below.
- **Behavioural check matrix (all passing, `npm run check:products-selection`):** zero rows ->
  `undefined` for both a set and an absent selection; one row -> that row for a matching,
  non-matching and absent selection; many rows -> every on-page selection retained;
  off-page, unknown and absent selections -> the first displayed row; a category switch -> the
  new category's first row; page two -> an on-page selection kept, a page-one selection
  replaced by page two's first row; a dynamic/empty category -> cleared, then its first row
  once populated; and idempotence, so the render-phase adjustment converges rather than loops.
- **Device evidence (installed build `6984495A…`, 1340 x 804), read-only navigation only:**

| Case | Before the fix | After the fix |
| --- | --- | --- |
| All products, fresh | pressed **none**, indicator **absent**, editor **Espresso** (page 2) | pressed **Hojicha Latte** (row 1), indicator at index 0 (top 257), editor **Hojicha Latte** |
| Coffee (9) | pressed **Espresso** (row 7), index **6**, top 647 | pressed **Caramel Mac** (row 1), index 0, top 257 |
| Matcha & Tea (2) | pressed **Ceremonial Matcha** (row 2) | pressed **Hojicha Latte** (row 1) |
| Cold & Sweet (2) | pressed Sparkling Lemonade (row 1) | pressed **Sparkling Lemonade** (row 1), unchanged |
| Bakery & Savoury (2) | pressed Butter Croissant (row 1) | pressed **Butter Croissant** (row 1), unchanged |
| Uncategorized (0) | no rows, no indicator, editor empty | no rows, no indicator, editor empty, unchanged |
| All products page 2 | (not previously reachable with a highlight) | pressed **Cappuccino** (row 1), index 0, editor Cappuccino |
| All products page 3 | - | pressed **Brioche** (only row), index 0, editor Brioche |

- **Retention (DESIGN.md 'state the operator left it'):** Coffee with Caramel Mac on page 1 was
  left for Dashboard (confirmed the live screen actually changed) and returning to Products
  restored Coffee, Caramel Mac and page 1 exactly.
- **Flash measurement:** a rAF sampler recorded every animation frame across three switches
  (All -> Coffee, Coffee -> Uncategorized, Uncategorized -> All; 353 frames). Frames with
  visible rows but no highlighted row: **0**. Frames with a highlighted row and a mismatched
  editor: 2, both of which were the editor panel's own local form-seeding lag
  (`ProductEditorPanel.tsx:89-107` sets `name` in an Effect after render, so its identity label
  renders the `{name || t('New product')}` fallback for one frame). That lag is pre-existing,
  is unchanged by this card, and is not the list-highlight divergence; the one-line remedy is
  the same render-phase adjustment inside that component (a `key` on the panel would remount it
  and close any open sub-dialog, so it is not the smallest fix).
- **Checks:** `npm run build` 0; `npm run check:products-selection` 0; `npm run check:navigation`
  0; `npm run check:css-scope` still only the four pre-existing App/Lock keyframe findings;
  `npm run check:local-catalog` 0; `npm run check:product-configuration` 0. No check needed a
  PIN or secret and none was bypassed.
- **Install:** `npm run android:beta` passed (140 tasks); `adb install -r --no-streaming`
  returned Success; `firstInstallTime` unchanged at 2026-09-24 22:17:12 and `lastUpdateTime`
  2026-09-25 20:06:37, so data was preserved. No product save or delete, sale, print, reseed or
  data write was performed.
- **Captures:** `tmp/products-palette/fix-products-initial-all.png`, `-Coffee.png`,
  `-Matcha-Tea.png`, `-Cold-Sweet.png`, `-Bakery-Savoury.png`, `-Uncategorized.png`,
  `-all-page2.png`, `-all-page3.png`.
- **Limitations:** paging now moves the selection to that page's first row, which is what the
  owner's contract specifies; the editor follows, and it already re-seeds its form on a product
  change, so no draft is silently kept. The one-frame editor label lag above remains. FR,
  owner-versus-manager roles and a category with products spread over several pages were not
  exercised on device beyond All products.
- **Status:** the reported divergence is fixed and verified; the palette is untouched and no
  colour or orange decision was made. Provisional: still not the numbered UI-04 21-skill pass,
  Products is not done, and the UI-04 workflow simplification remains queued.
- **Exact next action:** the owner reviews the by-category captures and either accepts the
  selection fix or names further behaviour; then decides the editor label lag, and only after
  that the orange-accent question.

#### Correction, 25 September 2026 - editor form seeding, closing the last one-frame mismatch

- **Why:** the rAF evidence above showed the highlighted row changing on the first committed
  frame while `ProductEditorPanel` rendered `New product` for one frame, because its local form
  values were seeded in an Effect that runs after paint.
- **Change (1 source file plus the existing check):** `ProductEditorPanel.tsx` exports two pure
  rules - `productFormIdentity(product, defaultCategoryId)`, the identity that decides when to
  re-seed, built from exactly the previous Effect's dependencies (product id, revision, photo,
  default category), and `productFormSeed(product, defaultCategoryId, categories)`, the name,
  category, price, availability and photo values with the previous default-category fallback
  chain. The seeding Effect is replaced by a render-phase previous-identity adjustment so React
  retries before any paint. No `key` remount: that would also discard this panel's own
  Sizes/Choices/Recipe dialog state and its save message. The separate message-clearing Effect
  is deliberately untouched so a save confirmation still paints.
- **Behavioural check:** `check:products-selection` now also lifts those two rules from the real
  source and asserts the seeding matrix - a selected product seeds its own name, category,
  price, availability and photo; a zero price stays an empty field; an unavailable product is
  not marked available; with nothing selected the category falls back to the operator default,
  then the first active one, then empty, with the other fields empty (the existing empty and
  new-product flows); and the identity changes only for a different product, revision, photo or
  default category, so an unrelated re-render cannot discard a draft.
- **Device evidence (rAF, every animation frame, installed build `44553F19...`):** All->Coffee
  (123 frames), Coffee->Uncategorized (127), Uncategorized->All (126), page 1->2 (131), 2->3
  (133), 3->1 (133). Every transition committed in exactly two states, the before and the after.
  Frames with visible rows but no highlighted row: **0**. Frames where the editor identity
  differed from the highlighted row: **0**. Frames where the name field differed from the
  highlighted row: **0**, with the price and category label tracking the row in every state
  (32/Matcha & Tea for Hojicha Latte, 27/Coffee for Caramel Mac, 17/Coffee for Cappuccino,
  18/Bakery & Savoury for Brioche). The earlier `New product` frame is gone.
- **Checks:** `npm run build` 0; `npm run check:products-selection` 0; `npm run check:navigation`
  0; `check:css-scope` unchanged; `check:local-catalog` 0; `check:product-configuration` 0.
  Install preserved data (`firstInstallTime` unchanged, `lastUpdateTime` 2026-09-25 20:19:09).
- **Limitations:** the editor still clears its save message on a product change through its own
  Effect (unchanged; clearing it during render would wipe the confirmation before it paints).
  FR and owner-versus-manager roles were not exercised.
- **Status:** the list/editor synchronization is complete for the inspected flows. Provisional;
  palette and orange untouched; no commit or push.

#### Correction 2, 25 September 2026 - a real category change always restarts at the destination's first row

- **Owner counterexample:** `All products` to `Coffee` selected Caramel Mac (Coffee's first row),
  but returning to `All products` incorrectly kept Caramel Mac because that product is also on the
  All page (it was All's third row). `Matcha & Tea` selected its second row and returning to `All`
  kept it too. Required invariant: on every actual category change - including to and from `All`,
  a future category and `Uncategorized` - the destination page's first row is selected, or the
  selection clears when that page has no rows, even when the previously selected product exists in
  the destination. The raw `management.products` order must never decide what is highlighted.
- **Change (`ProductsScreen.tsx`):** `resolvePageSelection` takes a third `categoryChanged`
  argument and returns the page's first row immediately when it is set. The component tracks the
  applied category in its own `appliedCategoryId` state using the same render-phase
  \"adjust state during render\" pattern already used for the filter key, so a sidebar click or a
  programmatic move after create or delete counts as a real change while paging, search,
  availability and sort keep the previous retain-while-displayed rule. Within an unchanged
  category an explicit product selection is still retained. `saveProduct` marks its destination as
  applied so saving a product into another category still selects the product that was just
  written instead of jumping to that category's first row.
- **All paths that set the category were traced:** the sidebar `onSelectCategory`, the product
  save (destination category), the category save (a new id, or the same id on rename) and the
  category delete (back to `all`). No path special-cases a category by name; `Uncategorized` and
  any newly created category go through the same rule because an empty destination page clears the
  selection.
- **Regression check (`scripts/check-products-selection.mjs`):** added the owner's exact cases -
  the previously selected product present on the destination page still yields the first row,
  populated and empty `Uncategorized`, a dynamic new category, a name-sorted destination, page two
  of a category change, retention and pagination while the category is unchanged, and idempotence
  so the list and the editor converge on the same product.
- **Device evidence (installed build, 1340 x 804, read-only):** every transition was sampled across
  requestAnimationFrame frames and reported `rowsWithoutHighlight: 0`, `editorVsRow: 0` and
  `nameVsRow: 0`, committing in two states (the previous and the new one). `All -> Coffee` landed
  on Caramel Mac; `Coffee -> All` landed on Hojicha Latte (All's first row) instead of keeping
  Caramel Mac; `All -> Matcha & Tea` landed on Hojicha Latte; `Matcha & Tea -> All`, `Cold &
  Sweet -> All` and `Uncategorized -> All` all landed on All's first row; `All -> Uncategorized`
  cleared the highlight and the editor to the existing empty state; re-clicking the same category
  with Caramel Mac selected retained Caramel Mac in a single state; page one to page two selected
  Cappuccino. Console empty.
- **Checks:** `npm run build` 0; `npm run check:products-selection` 0; `npm run check:navigation`
  0; `npm run check:local-catalog` 0; `npm run check:product-configuration` 0.
- Captures: the `fix2-*` device set listed under PRODUCTS-ORANGE-02.
- **Status:** provisional, not the numbered UI-04 pass, and this correction itself changes no
  colour or orange.

### PRODUCTS-PALETTE-01 — Products-only palette trial (provisional), 25 September 2026

#### Owner authorization and constraints

- The owner authorized the Products page as the next screen in the same owner-led staged
  process as Dashboard and Orders, and chose DeepSeek as the route. Scope is a bounded palette
  TRIAL, not the UI-04 workflow simplification: canvas to the accepted pale mint-grey
  `#f0f7f3`; white panels and cards unchanged; the accepted dark teal `#01363e` for formerly
  nonsemantic green actions and selection; neutral light tints using only already-accepted
  values; the catalog, sidebar, table and editor covered; shared dropdowns reached through a
  Products ancestor scope only; and the five portalled dialog roots carrying the same scope.
  No cream or old-green flash at the navigation edge, using the existing `frameMint` mechanism.
- Preserved deliberately: the semantic green Available / Active / Recipe-linked chips, amber
  recipe and warning states, red unavailable / delete / error, all functionality, artwork
  scale, layout, data and unrelated dirty work. No orange accent on Products until the owner
  has seen the base palette. No shared `MenuSelect` edits and no broad global override.
- Contrast requirements: the table column labels and the category count / placeholder must
  stay at or above 4.5:1 on the chosen tints, and the selected, hover, pressed, focus and
  disabled states must stay legible.
- Provisional: this is not the numbered UI-04 21-skill audit, no skill pass was started, and
  the screen is not marked done or accepted.

#### Research gate, 25 September 2026

- Official guidance checked for this exact problem: W3C/WAI *Understanding SC 1.4.11 Non-text
  Contrast* - inactive components are exempt from the 3:1 requirement, but a component that is
  being navigated to is operable, so an author-styled focus indicator must still reach 3:1
  against its adjacent colours; it does not require the focused and unfocused states to differ
  by 3:1 (that is SC 2.4.13, AAA). *Understanding SC 1.4.3 Contrast (Minimum)* - normal text
  4.5:1 and large text 3:1, with 14 pt bold about 18.5-18.66 CSS px, and an explicit warning
  that 4.499:1 must not be rounded up. Android's Material 3 guidance (*Create an accessible
  and personalized theme and brand*) - `primary`/`secondary`/`tertiary` are brand-accent roles
  while `error` is a status role, and reusing a status colour as branding can make ordinary UI
  appear to report a problem; the test is whether removing the colour changes the meaning from
  brand/action to problem/status.
- Inheritance and portal boundary reused from the recorded ORDERS-PALETTE-01 gate (MDN *Using
  CSS custom properties*, React `createPortal`, Capacitor's Android package model) rather than
  re-sourced: a custom property inherits only to descendants of its declaring element, and a
  portal renders into `document.body`, so it keeps the React tree but not the CSS inheritance
  tree. The search limit was reached on that query, so no new source was added for that half.
- Decision from the guidance: re-point only accent roles (the canvas, the brand green and the
  neutral surface tokens), never `error`, `warning` or `success`; keep every author-styled
  focus ring at or above 3:1; and hold every small label at or above 4.5:1 without rounding.
  Alternatives rejected: re-pointing `--olaso-success` / `--olaso-green-icon` would erase the
  Available / Active / Recipe-linked meaning, exactly the status-as-branding mistake the
  Material guidance warns about; editing `MenuSelect.module.css` would reach its 13 other
  importers across Reports, Settings and Stock; and a `:root` override would leak into every
  other screen and the transition, the failure already proven in NAV-PALETTE-01.
- Boundary: web-layer only. No Kotlin, plugin, package, data or lifecycle change.

##### Changes and verification - Products

- **Change (6 files, no new file):**
  - `src/globals.css` — one `[data-products-palette]` block: `--olaso-canvas: #f0f7f3`,
    `--olaso-green: #01363e`, `--olaso-green-soft: #e9eff0`, `--olaso-table-head: #e9eff0`,
    `--olaso-product-head: #e9eff0`, `--olaso-table-selected: #e4ecec`,
    `--olaso-product-art: #e4ecec`. `--olaso-success`, `--olaso-green-ink`,
    `--olaso-green-icon`, `--olaso-gold*` and `--olaso-danger*` are deliberately not
    re-pointed. The four neutral surface tokens are re-pointed once instead of at each of
    their 15 use sites.
  - `src/features/products/ProductsScreen.tsx:137` — `data-products-palette` on the screen `<main>`.
  - `src/features/products/components/CategoryDialog/CategoryDialog.tsx:47`,
    `ProductDialog.tsx:63`, `SizesEditorDialog.tsx:38`, `RecipeEditorDialog.tsx:123` and
    `ProductChoiceSectionDialog.tsx:242` — `data-products-palette` on each overlay root.
  - `src/App.tsx:391` — `frameMint` now also covers `Products`, so the 4px strip follows it.
  - Four small labels take the existing darker `--olaso-text-service` token because the tints
    pushed them below 4.5:1: `ProductList.module.css` `.columns span` (the column labels,
    4.22:1 before the trial and 3.95:1 on the tint, now 5.32:1), `CategorySidebar.module.css`
    `.category small` (category count, 3.33 -> 5.32), `CategorySidebar.module.css`
    `.sidebar p` (menu-group hint, 3.54 -> 5.32) and `ProductEditorPanel.module.css`
    `.option small` (choice-chip detail, 3.54 -> 5.32).
  - `ProductEditorPanel.module.css` `.optionSelected` background now reads the re-pointed
    `--olaso-table-selected`, so the selected choice chip is teal ink on the accepted
    teal-gray rather than on the preserved success green.
  - `scripts/check-navigation.mjs` — assertions for the block, the screen root, all five
    portals, the frame strip and the four corrected labels.
- **Measured pairs (computed from the declared values):** white on `#01363e` 13.14:1 (every
  filled button and selected chip); teal on white 13.14:1; `--olaso-text-dark-soft` on the
  tinted chips 11.70:1; the four corrected labels 5.32:1 each; teal on `#e4ecec` 10.95:1 (the
  active product icon); teal on `#e9eff0` 11.30:1; `--olaso-green-ink` on `--olaso-green-icon`
  5.57:1 and `--olaso-gold` on `--olaso-status-gold` 4.51:1, both preserved and unchanged.
- **Browser evidence at exactly 1340 x 800** (real panes and two real dialogs with sample
  props): canvas `rgb(240,247,243)`; tokens `--olaso-green #01363e`, `--olaso-green-soft
  #e9eff0`, `--olaso-green-icon #e8f3e6` (preserved), `--olaso-table-head`/`--olaso-product-head
  #e9eff0, `--olaso-table-selected`/`--olaso-product-art` #e4ecec, `--olaso-success #37a563`,
  `--olaso-danger #ff6863`, `--olaso-gold #886923`; sidebar and column-head `rgb(233,239,240)`;
  the hint, category count and column labels `rgb(89,100,91)`; the row band and active icon
  `rgb(228,236,236)` with a `rgb(1,54,62)` glyph; the Available / Linked chips still
  `rgb(232,243,230)` with `rgb(46,107,67)` ink and the unavailable chip `rgb(255,240,238)`
  with `rgb(255,104,99)`; Add product and Save `rgb(1,54,62)` with white ink; `:root`'s own
  `--olaso-green` still `#006a2b` and `html`/`body` still cream, so the palette never leaks;
  `documentElement` 1340 x 800 with nothing clipped.
- **Device evidence (installed build, 1340 x 804):** the same token set and the same rendered
  values on the live catalog and editor, plus all five dialogs opened for real and never
  saved — each reported `data-products-palette="true"` on its overlay root, `--olaso-green
  #01363e`, `--olaso-table-head` #e9eff0, `--olaso-green-icon` #e8f3e6 preserved, a white card
  and a teal Save with white ink. The artwork picker's selected swatch resolved
  `border-color rgb(1,54,62)` with `background rgba(0,0,0,0)` — see the finding below. The
  page surface read `rgb(240,247,243)` while Products was visible, proving the frame strip
  follows the screen and no cream edge appears; the WebView console was empty and the final
  state returned to the catalog with no dialog open.
- **Verified unchanged:** Available, Active and Recipe-linked chips; the amber recipe chip;
  the red unavailable chip and the Delete action; artwork scale and the unchanged artwork
  files; every panel's geometry; the shared Header and nav; the shared `MenuSelect` module
  and its other 13 importers. No `MenuSelect.module.css`, `:root` or global override was
  touched, and no orange was introduced.
- **Findings reported, not changed:** the artwork picker's `background: var(--olaso-soft-green)`
  at `CategoryArtworkPicker.module.css:38` references a token defined nowhere in `globals.css`,
  the theme source or the built CSS, so the declaration is invalid at computed-value time and
  the selected swatch falls back to transparent — verified on the device. Selection is still
  carried by the teal border and the artwork, so no change was needed for this trial; a
  one-line fix would be `var(--olaso-table-selected)`. Separately, the shared
  `MenuSelect.module.css` `.selected` rule is inert: `.menu button` (0,2,1) outranks it
  (0,1,0) for colour, background and weight, so the chosen option is never visually
  distinguished — a pre-existing defect in a component the owner scoped out of this pass.
  The `--olaso-green-soft` re-point is therefore inert today but prevents a pale-green fill
  should that specificity ever be corrected.
- **Checks:** `npm run build` 0; `npm run check:navigation` 0 with the new assertions;
  `npm run check:css-scope` still reports only the four pre-existing App/Lock keyframe
  findings; `npm run check:local-catalog` 0 (local-first catalog and recipe transaction
  checks passed); `npm run check:product-configuration` 0 (resolver and product cost range
  checks passed). No check required a PIN or secret, and none was bypassed. No save, delete,
  sale, print, reseed or data write was performed; every dialog was closed with its own close
  control.
- **Install:** `npm run android:beta` passed (140 tasks). `adb install -r --no-streaming`
  returned Success (the streamed install hangs on this MIUI device); `firstInstallTime`
  unchanged at 2026-09-24 22:17:12 and `lastUpdateTime` 2026-09-25 19:28:29, so data was
  preserved. APK SHA-256
  `AF252A0BDC630DB1AB93596206FDFB1B0B57522453417743E5503A20B56103D2`; the APK's own CSS
  carries the `[data-products-palette]` block.
- **Captures:** `tmp/products-palette/redmi-1340x804-products-catalog.png`, `-product-dialog.png`,
  `-category-dialog.png`, `-sizes-dialog.png`, `-choices-dialog.png`, `-recipe-dialog.png`,
  `-final.png`; browser
  `tmp/products-palette/browser-1340x800-products-catalog.png`, `-category-dialog.png`,
  `-product-dialog-menu.png`.
- **Limitations:** the selected-row band and the selected choice chip were read in the browser
  fixture but the retained development data had no selected product row or selected choice
  value, so those two surfaces are proven by computed style and source rather than on device.
  FR, manager-vs-owner role differences and the cashier case (which never mounts Products) were
  not exercised. The red remove glyph in the recipe and choice dialogs sits at 2.44:1 on the
  tinted surface, down from 2.60:1 before the trial on the previous fill; it was already below
  the 3:1 graphic threshold and the red was preserved as instructed rather than darkened to
  `--olaso-danger-ink` (which measures 4.31:1 there and is the one-line remedy if the owner
  wants it). The browser fixture reproduces the panes and two dialogs rather than the live
  app, and the browser `html`/`body` stay cream because the fixture has no app shell.
- **Status:** palette TRIAL only. It is not the numbered UI-04 21-skill audit, no skill pass
  was started, and Products is not marked done or accepted. The UI-04 workflow simplification
  requirement is untouched and still queued.
- **Exact next action:** the owner reviews the catalog, editor and the five dialogs on the
  Redmi and accepts the base palette or names changes, then decides whether to (a) darken the
  red remove glyph to `--olaso-danger-ink`, (b) fix the undefined `--olaso-soft-green` to
  `--olaso-table-selected`, and (c) whether any orange accent should follow on Products.
  Commit and push only after that acceptance.

### DASH-ORANGE-01 — Dashboard-only orange brand emphasis on the Net Sales value (provisional), 25 September 2026

#### Owner authorization and constraints

- The owner approved the exact two-part orange-accent trial we recommended and asked for
  sequential delivery, Dashboard first then Orders. For Dashboard, ONLY the large Net Sales
  numeric value takes the already-approved POS action orange `#e06a00`; its own label, the
  three summary metrics, badges, semantic colours and all geometry stay unchanged. The tint
  is a brand emphasis, not a positive/negative status. If the value does not qualify as
  large/bold text against its real fill, the colour must not be forced and Dashboard stays
  as it is.
- Provisional: this is not the Dashboard 21-skill review and Dashboard is not marked
  complete. The sequential 21-skill passes remain paused as the State pointer records.

#### Research gate and measured decision, 25 September 2026

- Official guidance re-read for this exact boundary: W3C/WAI *Understanding SC 1.4.3
  Contrast (Minimum)* - 4.5:1 for normal text and 3:1 for large text, large text being at
  least 14pt (18.66px) bold or 18pt (24px); W3C/WAI *Understanding SC 1.4.11 Non-text
  Contrast* - 3:1 for the parts of a graphic needed to identify a control or its state, with
  the note that an icon accompanied by visible text which already identifies the control is
  not required to satisfy it independently, and that inactive controls are excluded. The
  Android/Capacitor boundary is unchanged: CSS plus one class name in the React layer, no
  Kotlin, plugin, package or lifecycle change.
- Existing orange token choice: the app already carries the owner-approved action orange as
  `--olaso-trial-action: #e06a00` (`globals.css`, declared inside `[data-pos-palette]`), the
  deepened logo orange first sampled in BRAND-COLOR-01. It is not declared at `:root`, so it
  does not resolve in Dashboard or Orders scope; the smallest reuse is to declare that same
  existing token in each screen's own palette block rather than invent a new token or repeat
  a literal. No new token, no new colour.
- Measured on the live Redmi at 1340 x 804 before any change: the Net Sales value
  `.netValue` renders **44px / weight 700** in `rgb(16,22,17)` on the `.panel` fill
  `rgb(255,255,255)`. 44px bold is far above the 18.66px bold large-text threshold, so the
  3:1 threshold applies, and the measured orange-on-white pair is **3.37:1**, which passes.
  The value qualifies, no resize is needed, and the intervention proceeds.
- Explicitly not a status colour: orange is not one of the app's semantic colours (green
  success, amber warning, red danger), and no metric value, badge or comparison chip changes.

##### Changes and verification - Dashboard

- Change (3 files, no new file): `DashboardScreen.module.css` adds `--olaso-trial-action:
  #e06a00;` to the `.screen` palette block so the existing approved orange resolves in
  Dashboard scope and is never promoted to `:root`; `SalesPulse.module.css` adds one rule
  `.netValueBrand { color: var(--olaso-trial-action, var(--olaso-text)) }`; `SalesPulse.tsx`
  applies that class only when a value is present, so the loading/unavailable placeholder
  dash keeps the normal text colour.
- Device evidence (installed build): the Net Sales value renders `rgb(224,106,0)` at 44px/700
  on the white panel fill `rgb(255,255,255)`; the NET SALES label and the 4px accent stay
  `rgb(1,54,62)`; all three metric values stay `rgb(16,22,17)` at 22px; the comparison chip,
  badges, chart and geometry are unchanged; `--olaso-trial-action` resolves `#e06a00`;
  viewport 1340 x 804 with no overflow.
- Browser parity at exactly 1340 x 800 (real components): the same values, plus a
  like-for-like before/after pair made by reverting only the brand colour in the same DOM
  (`rgb(16,22,17)` before, `rgb(224,106,0)` after) with every other measured value identical.
  Loading and error states render the neutral dash at `rgb(16,22,17)`; the loaded `empty`
  state shows `0,00 MAD` in orange.
- Checks: `npm run build` 0; `npm run check:navigation` 0 with the new assertion;
  `npm run check:css-scope` still reports only the four pre-existing App/Lock keyframe
  findings.
- Captures: `tmp/orders-verify/orange-before-dashboard.png` and `orange-after-dashboard.png`
  (same device, previous and current build); `tmp/orange-trial/
  browser-1340x800-dashboard-before.png` and `-after.png`.
- Status: provisional and not owner-accepted; the Dashboard 21-skill passes remain paused.
- Exact next action: owner reviews this Dashboard pair; the Orders half is recorded below.

### ORDERS-ORANGE-01 — Orders-only orange printer glyph in the Reprint action (provisional), 25 September 2026

#### Owner authorization and constraints

- Second half of the same approved two-part trial, delivered after Dashboard: ONLY the printer
  glyph inside the enabled Reprint button takes `#e06a00`. The button fill stays the dark teal,
  its label stays white, and Cancel, the Completed/Synced chips, warning and danger colours do
  not change. The disabled Reprint must not show an orange glyph. Scoped to the Orders Reprint
  action only, not the shared printer icon, the Header Report action or Reports. No layout or
  click-behaviour change, and no new token or dependency.

#### Research gate and measured decision, 25 September 2026

- Same official guidance as DASH-ORANGE-01, both sections re-read for this boundary, with the
  directly relevant note that an icon accompanied by visible text already identifying the
  control is not required to satisfy SC 1.4.11 independently, and that inactive controls are
  excluded - which is why the disabled state is deliberately left with its existing grey.
- Measured before any change on the live Redmi: the Reprint button renders fill
  `rgb(1,54,62)`, label `rgb(255,255,255)` and a `rgb(255,255,255)` glyph, enabled
  (`disabled: false`). Orange on that teal fill measures **3.90:1** (>=3:1), and the
  unchanged white label on teal stays **13.14:1**. The existing disabled glyph pair
  (`--olaso-disabled` on `--olaso-readonly`) already measures 2.52:1 and is left untouched;
  it is a pre-existing inactive-control state excluded by SC 1.4.11, and tinting it orange
  would be exactly the misleading active signal the owner forbade.

##### Changes and verification - Orders

- Change (3 files, no new file): `globals.css` adds `--olaso-trial-action: #e06a00;` to
  `[data-orders-palette]`; `OrderDetailPanel.module.css` adds one rule
  `.reprint:not(:disabled) svg { color: var(--olaso-trial-action, var(--olaso-white)) }` so
  only the enabled button's glyph changes and the fill and label are untouched;
  `scripts/check-navigation.mjs` gains assertions for both trials.
- Device evidence (installed build): the enabled Reprint renders fill `rgb(1,54,62)`, label
  `rgb(255,255,255)` and glyph `rgb(224,106,0)`; Cancel stays `rgb(255,104,99)` on a
  transparent fill; the Orders-opened calendar still carries `data-orders-palette="true"`
  with `rgb(233,239,240)` in-range days and teal endpoints; the cancellation dialog still
  carries the attribute with its `rgb(255,104,99)` confirm; the shared Header report glyph
  stays `rgb(40,48,41)`, proving the change did not reach the shared printer/report icon;
  the WebView console was empty; viewport 1340 x 804.
- Browser parity at exactly 1340 x 800 (real components): the same enabled values, plus the
  disabled state forced in the DOM - button `rgb(248,250,247)` and glyph `rgb(154,161,155)`,
  so a disabled Reprint shows NO orange - and a before/after pair made by reverting only the
  glyph colour (`rgb(255,255,255)` before, `rgb(224,106,0)` after).
- Checks: `npm run build` 0; `npm run check:navigation` 0; `npm run check:css-scope` only the
  four pre-existing findings; `npm run check:orders` passed its historical receipt and
  signed-option assertions and then stopped at its protected `OLASO_OWNER_PIN` restore gate -
  protected and unrun, not a pass.
- Install: `npm run android:beta` passed (140 tasks, BUILD SUCCESSFUL). The streamed
  `adb install -r` hung on this MIUI device (the vendor behaviour already recorded in the
  ledger), so the APK was installed with `adb install -r --no-streaming`, which returned
  Success; `firstInstallTime` unchanged at 2026-09-24 22:17:12 and `lastUpdateTime`
  2026-09-25 18:52:34, so app data was preserved. The APK's own CSS carries
  `--olaso-trial-action:#e06a00` in the Dashboard chunk, twice in the index chunk (the POS and
  Orders scopes) and
  `._reprint_*:not(:disabled) svg{color:var(--olaso-trial-action,var(--olaso-white))}` in the
  Orders chunk.
- Captures: `tmp/orders-verify/orange-before-orders.png`, `orange-after-orders.png`,
  `orange-after-orders-cancel-dialog.png`, `orange-after-orders-final.png`;
  `tmp/orange-trial/browser-1340x800-orders-before.png`, `-after.png`, `-disabled.png`.
- Limitations: the disabled Reprint could not be produced on the live tablet because the
  retained sale is already printed, so that state is proven in the real-component browser
  render and by the CSS guard rather than on device. FR, the cashier role and a real print
  were not exercised. Provisional and not owner-accepted; no 21-skill pass was started and
  neither screen is complete.
- Exact next action: owner reviews both screens' captures and accepts the two orange accents
  or names changes, then commit and push. Do not start the 21-skill passes.

#### Correction, 25 September 2026 - the full orange enabled Reprint button replaces the icon-only trial

Supersedes this card's 'Exact next action' above.

- **Owner decision:** replace the icon-only orange with a full orange enabled Reprint action.
  Background is the existing accepted action orange `#e06a00`; both the label and the printer
  glyph take the existing POS orange-action dark ink `#1c211b`. That exact pair measures
  4.86:1. Dashboard's approved orange Net Sales trial is unchanged.
- **Change (3 files, no new file):** `globals.css` adds `--olaso-trial-action-ink: #1c211b;`
  to `[data-orders-palette]` beside the orange; `OrderDetailPanel.module.css` sets `.reprint`
  `color: var(--olaso-trial-action-ink, var(--olaso-white))` and
  `background: var(--olaso-trial-action, var(--olaso-green))`, and the icon-only
  `.reprint:not(:disabled) svg` rule was DELETED rather than layered over;
  `scripts/check-navigation.mjs` swaps its assertion for the new button rules and the
  ink-token declaration. No new token, colour or dependency; no layout or behaviour change.
- **Pressed state, measured not assumed:** the previous `filter: brightness(0.88)` would dim
  both sides of the new pair and drop the label to 4.02:1, below the 4.5:1 small-text
  threshold. The pressed rule now swaps the two existing action tokens instead
  (`background: --olaso-trial-action-ink`, `color: --olaso-trial-action`), which is the same
  4.86:1 pair inverted, so the press cue is kept without a contrast loss.
- **Contrast in every reachable visual state** (computed from the declared values):

| State | Fill | Label / glyph | Ratio | Threshold |
| --- | --- | --- | --- | --- |
| enabled default | `#e06a00` | `#1c211b` | 4.86:1 | 4.5:1 text, 3:1 glyph - pass |
| enabled pressed (token swap) | `#1c211b` | `#e06a00` | 4.86:1 | pass |
| enabled focus-visible | unchanged `#e06a00` / `#1c211b` | teal ring `#01363e` | 4.86:1; ring 13.14:1 on the white panel and 3.90:1 against the orange | pass |
| disabled (unchanged) | `#f8faf7` | `#9aa19b` | 2.52:1 | inactive control, excluded by SC 1.4.11 |

- **Device evidence (installed build):** the enabled Reprint renders background
  `rgb(224,106,0)` with label and glyph `rgb(28,33,27)`; the disabled state renders background
  `rgb(248,250,247)` with label and glyph `rgb(154,161,155)`, so no orange; Cancel stays
  `rgb(255,104,99)`; the detail Completed chip stays `rgb(232,243,230)` and the metadata band
  `rgb(233,239,240)`; the shared Header report glyph stays `rgb(40,48,41)`; Dashboard still
  shows the orange Net Sales value at 44px; the WebView console was empty; viewport
  1340 x 804.
- **Browser evidence at exactly 1340 x 800 (real components):** the same default values; the
  pressed state forced with the CDP `:active` pseudo-class read background `rgb(28,33,27)`
  with label and glyph `rgb(224,106,0)`; focus forced read the unchanged pair with the teal
  ring `rgb(1,54,62)`; disabled read the neutral pair; and a revert injection reproduced the
  previous teal/white button for the like-for-like pair.
- **Checks:** `npm run build` 0; `npm run check:navigation` 0; `npm run check:css-scope` only
  the four pre-existing App/Lock keyframe findings; `npm run check:orders` passed its
  historical receipt and signed-option assertions then stopped at its protected
  `OLASO_OWNER_PIN` gate - protected and unrun, not a pass. The built `dist` carries
  `._reprint_*{color:var(--olaso-trial-action-ink,var(--olaso-white));background:var(--olaso-trial-action,var(--olaso-green));border:0}`
  and `._reprint_*:active:not(:disabled){...}` with no `svg` rule.
- **Install:** `npm run android:beta` passed (140 tasks). `adb install -r --no-streaming`
  returned Success (the streamed install hangs on this MIUI device); `firstInstallTime`
  unchanged at 2026-09-24 22:17:12 and `lastUpdateTime` 2026-09-25 19:04:25, so data was
  preserved. APK SHA-256
  `FE7C2D48C26DC0025D0E418C6B8CA0DFB2FF73E7F89F26B258F3A51D0D19D3C3`; the APK's own
  OrdersScreen chunk carries both corrected rules and no `svg` override. No sale, reprint,
  cancellation, reseed or data write was performed.
- **Captures:** `tmp/orders-verify/orange-full-after-orders.png` (enabled),
  `orange-full-after-orders-disabled.png`, `orange-full-after-dashboard.png`,
  `orange-full-after-orders-final.png`; browser
  `tmp/orange-trial/browser-1340x800-orders-full-orange.png`, `-active.png`, `-disabled.png`,
  `-before.png`.
- **Limitations:** the pressed state is proven in the browser with a forced `:active` and by
  the computed token swap, not by a physical held press - deliberately, because a held press
  that releases on the button would fire a real reprint, which the owner forbade. FR, the
  cashier role and a real print were not exercised. POS `.place` keeps its own
  `brightness(0.88)` pressed filter and the same measured 4.02:1 consequence; that is a
  pre-existing, out-of-scope condition recorded here for the owner.
- **Status:** provisional and not owner-accepted; no 21-skill pass was started and neither
  screen is complete.
- **Exact next action:** owner reviews the enabled and disabled captures and accepts the full
  orange Reprint or names changes, then commit and push.

### ORDERS-PALETTE-01 — Orders-only palette first visual pass (provisional), 25 September 2026

#### Owner authorization and constraints

- The owner asked to move to Orders now and implement a bounded Orders-only palette
  step, not the 21-skill Orders sequence: the Orders canvas becomes the already accepted
  pale mint-grey `#F0F7F3`; nonsemantic legacy operational green in controls, copy,
  focus rings, pager, status filter, date control and icon accents becomes the already
  accepted dark teal `#01363E`; white cards, borders, typography and table geometry are
  unchanged; Reprint is teal because it is a management action, not the POS orange.
- Preserve semantics: the real Completed / Synced / Last sync success chips stay green,
  warning amber and cancellation danger stay as they are, and the success green tokens
  are not re-pointed to teal. Keep the existing table-head, metadata-band and
  selected-row neutral fills for this first pass and add no new tints. No orange. Shared
  Header and Settings unchanged; no POS, Dashboard or other screen body change.
- The in-page Orders root owns the palette for its whole visible lifetime, the app frame
  strip follows a visible Orders screen, and the Orders-opened PeriodCalendar and
  CancellationDialog inherit an Orders-only scoped palette through the smallest existing
  portal pattern while every other PeriodCalendar caller stays unchanged.
- The owner explicitly recorded that the Dashboard 21 sequential skill passes remain
  pending and must not be described as complete.

#### Research gate, 25 September 2026

- Sources checked 25 September 2026: MDN *Using CSS custom properties* — a custom
  property is inherited by the declaring element's descendants and is not available to
  siblings, so declaring it on the screen root cannot reach another screen and `:root` is
  what makes it app-wide; official W3C/WAI *Understanding SC 1.4.11 Non-text Contrast* —
  a custom focus indicator must reach at least 3:1 against its adjacent colour(s);
  Capacitor's Android documentation — the web layer is bundled into the APK, so a CSS-only
  change is delivered by the normal web build plus `cap sync` and needs no Kotlin, plugin
  or native configuration change.
- Choice: reuse the accepted NAV-PALETTE-01 / DASH-PALETTE-01 mechanism exactly — declare
  the palette once on `[data-orders-palette]` in `globals.css` and put that attribute on
  the Orders screen root and on the two portalled Orders surfaces. A React portal renders
  into `document.body`, so it keeps the React tree but not the CSS inheritance tree and
  cannot inherit from the screen root; that is why both portalled surfaces need the
  attribute themselves instead of a `:root` rule, which would tint the app during the
  crossfade (already rejected in NAV-PALETTE-01).
- Android/Capacitor boundary verified as web-layer only: no Kotlin, plugin, storage,
  lifecycle, networking or database code changed, so `android/AGENTS.md` needed no update.
  The installed APK carries the new declaration (checked below).

#### Changes (9 files, no new file)

- `src/globals.css` — one `[data-orders-palette]` block re-pointing only
  `--olaso-canvas: #f0f7f3`, `--olaso-green: #01363e` and `--olaso-copy-green: #01363e`.
  `--olaso-success`, `--olaso-green-ink`, `--olaso-green-soft`, `--olaso-green-icon`,
  `--olaso-gold*`, `--olaso-danger*`, `--olaso-panel-border`, `--olaso-line*` and the
  table tokens are deliberately not re-pointed.
- `src/App.tsx` — `frameMint` is now also true for `frameScreen === 'Orders'`, so the 4px
  strip below the 800px shell follows a visible Orders screen.
- `src/features/orders/OrdersScreen.tsx` — `data-orders-palette` on the screen `<main>`.
- `src/features/orders/components/OrdersListPanel/OrdersListPanel.module.css` — the
  `.today` chip glyph is pinned to `--olaso-green-ink` so the semantic Last-sync chip
  stays wholly green while the accent token moves; `.retry` becomes an accent-outline
  recovery control (`color: var(--olaso-green)`, `background: transparent`) and its
  pressed state reuses the file's existing `rgb(0 0 0 / 8%)` neutral layer instead of a
  success-green fill.
- `src/features/orders/components/OrdersTable/OrdersTable.module.css` — `.emptyAction:active`
  uses `filter: brightness(0.88)` like `.reprint`, so the pressed state no longer flips to
  a success-green fill under the accent.
- `src/features/orders/components/CancellationDialog/CancellationDialog.tsx` —
  `data-orders-palette` on the portalled overlay root (this component is Orders-only).
- `src/components/PeriodCalendar/PeriodCalendar.tsx` — one optional `ordersPalette` prop
  that puts `data-orders-palette` on the portalled overlay root; no other behaviour,
  markup or style changes, and every other caller keeps the legacy green calendar.
- `src/features/orders/components/OrdersListPanel/OrdersListPanel.tsx` — passes
  `ordersPalette` to the Orders-opened calendar.
- `scripts/check-navigation.mjs` — assertions that `[data-orders-palette]` declares the
  palette exactly once with those three values, does not re-point success/danger/amber,
  the Orders screen root and both portalled Orders surfaces carry the attribute, and
  `frameMint` follows Orders.

#### Measured pairs, 25 September 2026 (computed from the declared values)

| Pair | Contrast | Threshold | Result |
| --- | --- | --- | --- |
| accent `#01363e` on the white panel | 13.13:1 | 4.5:1 text | pass |
| accent `#01363e` on the mint canvas `#f0f7f3` | 12.07:1 | 3:1 focus ring | pass |
| preserved Last-sync chip `#2e6b43` on `#edf5eb` | 6.44:1 | 4.5:1 text | preserved, unchanged |
| preserved attention `#886923` on `#f4f0e5` | 4.51:1 | 4.5:1 text | preserved, unchanged |
| preserved danger `#b63e3a` on `#fff0ee` | 5.07:1 | 4.5:1 text | preserved, unchanged |
| mint canvas against the white card | 1.09:1 | n/a | tint boundary only, same as the accepted POS/Dashboard canvas |

#### Verification actually run, 25 September 2026

- `npm run build` exit 0. The built `dist` CSS carries
  `[data-orders-palette]{--olaso-canvas:#f0f7f3;--olaso-green:#01363e;--olaso-copy-green:#01363e}`
  and no success/danger/amber token inside that block.
- `npm run check:navigation` exit 0 with the new assertions. `npm run check:css-scope` still
  reports only the four pre-existing App/Lock keyframe `from`/`to` findings; the new rule
  added none. `git diff --check` clean apart from the pre-existing CRLF notices.
- Protected and unrun: `npm run check:orders` passed its static local-history, receipt,
  pagination, reprint and retry assertions and then stopped at its protected
  `OLASO_OWNER_PIN` restore gate; `npm run check:dashboard`, drawn only as a no-regression
  probe, stopped at the same missing-PIN gate **before** its destructive `seed:dev` step, so
  no reseed or data write occurred. Neither is a pass. No sale, print, cancellation or
  inventory write was performed at any point.
- Real-component browser render at exactly 1340 x 800 (the real `OrdersListPanel`,
  `OrderDetailPanel`, `CancellationDialog` and `PeriodCalendar` in the real theme; untracked
  tooling in `tmp/orders-palette/`), palette ON: canvas `rgb(240,247,243)`;
  `--olaso-green` and `--olaso-copy-green` `#01363e`; the status-filter pill, date icon,
  pager current, Reprint fill, empty-state Clear-filters fill, Retry border and every focus
  ring `rgb(1,54,62)`; the Last-sync chip glyph and ink `rgb(46,107,67)` on `rgb(237,245,235)`;
  the detail Completed chip `rgb(46,107,67)` on `rgb(232,243,230)`; the table head
  `rgb(243,246,241)`; the selected-row band and metadata band unchanged; Cancelled and
  Needs-sync chips `rgb(182,62,58)` on `rgb(255,240,238)`; the attention chip
  `rgb(136,105,35)` on `rgb(245,240,228)`; the payment dot `rgb(55,165,99)`. `documentElement`
  was 1340 x 800 in every state with no console errors or warnings.
- Portal scoping proven in the same render: the Orders-opened calendar overlay reported
  `data-orders-palette=true` with a teal selected preset and day, and the cancellation-dialog
  overlay reported `data-orders-palette=true`; the same calendar rendered without the prop
  (simulating Reports/Products/Stock/Settings) reported no attribute and stayed the legacy
  operational green `rgb(0,106,43)`.
- No leak proven: with Orders showing teal, `documentElement`'s own `--olaso-green` was still
  `#006a2b` and the `html`/`body` background still `rgb(248,247,234)`, so the palette never
  reaches `:root`. The same render with the attribute off returned the full legacy state
  (canvas `rgb(248,247,234)`, indicator and Reprint `rgb(0,106,43)`).
- APK and install: `npm run android:beta` passed with the repository JDK 21 (140 tasks,
  BUILD SUCCESSFUL). APK `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
  `622CB3AB643EE66612B1268F2786AB3B68767B20B3E0FF3F02C335C49A190212`, 27830073 bytes.
  `adb install -r` on the connected Redmi 22081283G (serial XOPFAQGYNNGYVGPR) returned
  Success with no uninstall; `versionCode 11`, `firstInstallTime` unchanged at
  2026-09-24 22:17:12, `lastUpdateTime` 2026-09-25 17:21:21, so app data was preserved. The
  APK's own `assets/public/assets/index-CwxpyicY.css` contains the `[data-orders-palette]`
  declaration, so the installed build carries the change.
- Graphify queried before touching code (3,137 nodes / 6,442 edges; the Orders screen,
  PeriodCalendar, OverlayPortal and CancellationDialog all present). Not refreshed: this
  pass adds no file, symbol or edge.

#### Limitations (not acceptance)

- Provisional first visual pass only; it is not the Orders 21-skill review and Orders is not
  accepted. No design, brand or architecture authority was updated, so `DESIGN.md` still
  records the earlier contract that the Orders status pill uses the green pill, which this
  provisional pass contradicts until the owner accepts or rejects it.
- The physical Redmi capture could not be repeated for this pass: the app had auto-locked to
  its PIN-protected Lock screen and no owner PIN is available in this session, so no PIN was
  guessed and no bypass was attempted. The fresh pre-change Orders capture from the discovery
  step (`tmp/orders-discovery/redmi-orders-or-current.png`) remains the last physical Orders
  evidence; the after-state proof is the real-component browser render at 1340 x 800 plus the
  installed-APK CSS check. There is therefore no physical before/after pair, and the
  POS -> Orders and Orders -> other-screen live crossfade was not photographed.
- The crossfade itself was verified by the unchanged NAV-PALETTE-01 mechanism, the
  source-level `frameScreen = visibleLeaving ?? visibleContent` derivation and the new
  `frameMint` assertion, not by a fresh device frame study.
- Retained pale-green fills that were not in the owner's convert list are deliberate for this
  pass because re-pointing the shared `--olaso-green-soft` / `--olaso-green-icon` tokens would
  also flip the real semantic chips: the first-item icon disc (`rgb(232,243,230)`) and the
  calendar in-range day fill stay as they are. Breaking that shared-token coupling, or tinting
  those surfaces, is an owner decision for a later pass and needs a tint value the owner has
  not yet approved.
- The payment-method label is now accent teal while its paid dot stays success green, and the
  fixture's default selected order was in the needs-sync state, so the green Completed chip was
  proven both by its unchanged tokens and by rendering the completed order
  (`browser-1340x800-detail-completed.png`).
- TalkBack speech, enlarged OS text, RTL and long expansion remain unverified; the `.ready`
  status rule in `OrdersTable.module.css` is dead code and was left as found.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty work
  (including the pre-existing PeriodCalendar CSS, Dashboard, POS, brand and ledger edits) is
  preserved untouched, and the temporary preview tooling lives under the gitignored `tmp/`.

#### Exact next action

- Owner reviews the Orders palette on the real components
  (`tmp/orders-palette/browser-1340x800-live.png`, `browser-1340x800-detail-completed.png`,
  `browser-1340x800-calendar.png`, `browser-1340x800-cancel-dialog.png`,
  `browser-1340x800-empty.png`, `browser-1340x800-error-retry.png`,
  `browser-1340x800-french.png`, `browser-1340x800-palette-off.png`) and on the unlocked
  tablet, and accepts it or names changes — the retained pale-green first-item icon disc and
  calendar in-range fill, the payment-label/dot split and the teal Reprint are the visible
  open items. Then commit and push; do not start the 21-skill Orders sequence or the Products
  card, and leave Settings and the pending Dashboard passes untouched.

#### Correction, 25 September 2026 — every Orders-owned surface adopts the palette

Supersedes the ORDERS-PALETTE-01 'Exact next action' above.

##### Owner instruction

- Every Orders-owned component and pop-up must adopt the new palette, not only the static
  body. Remove the remaining *nonsemantic* green-family fills using only the two
  already-approved teal-grays `#e9eff0` and `#e4ecec`, without recolouring true
  success/sync/warning/danger states and without touching geometry. Choose the lighter
  `#e9eff0` for table head / metadata band / calendar range and the slightly stronger
  `#e4ecec` for the selected row and item disc if contrast works. Scope through
  Orders-owned variables with a fallback so a PeriodCalendar opened by
  Reports/Products/Stock/Settings is unchanged.

##### Research reused, not repeated

- The card's recorded official research already covers this exact CSS boundary, so no new
  source was required: MDN *Using CSS custom properties* (a custom property inherits to the
  declaring element's descendants and is not available to siblings, which is what makes the
  fallback pattern screen-scoped), W3C *Understanding SC 1.4.11 Non-text Contrast* and
  *SC 1.4.3 Contrast (Minimum)*, and the Capacitor Android package model. The only new work
  was measuring the specific new pairs, done below with the recorded method (compute from the
  declared values, never estimate).

##### Change (5 files, no new file)

- `src/globals.css` — `[data-orders-palette]` gains two Orders-scoped custom properties:
  `--orders-tint: #e9eff0` (the POS `--olaso-green-soft` / Dashboard `--dashboard-tint`
  value) and `--orders-tint-strong: #e4ecec` (the POS `--olaso-green-icon` value). No new
  colour value was invented.
- `src/features/orders/components/OrdersTable/OrdersTable.module.css` — `.indicator`
  (selected table row) now reads `var(--orders-tint-strong, var(--olaso-table-selected))`;
  the unused `.ready` rule was deleted.
- `src/features/orders/components/OrderDetailPanel/OrderDetailPanel.module.css` —
  `.metadata` (detail metadata band) reads `var(--orders-tint, var(--olaso-table-head))`;
  `.itemIconActive` (first-item icon disc) reads
  `var(--orders-tint-strong, var(--olaso-green-icon))`.
- `src/components/PeriodCalendar/PeriodCalendar.module.css` — `.inRange` reads
  `var(--orders-tint, var(--olaso-green-icon))`.
- `scripts/check-navigation.mjs` — regression assertions that the two tints are declared
  once in the Orders block and that all four fallback declarations keep their original token.

##### Contrast measured before implementing (WCAG 2.2, text 4.5:1 / graphic 3:1)

| Element on the new fill | Fill | Before | After | Result |
| --- | --- | --- | --- | --- |
| Selected-row order number / total `#101611` | `#e4ecec` | 16.69:1 | 15.29:1 | pass |
| Selected-row service `#59645b` | `#e4ecec` | 5.62:1 | 5.15:1 | pass |
| Selected-row count `#283029` | `#e4ecec` | 12.37:1 | 11.33:1 | pass |
| Selected-row time `#758078` | `#e4ecec` | 3.74:1 | 3.42:1 | already below AA; carries the owner-deferred `--olaso-text-time` finding |
| Detail metadata value `#101611` | `#e9eff0` | 16.83:1 | 15.78:1 | pass |
| Detail metadata icon `#01363e` | `#e9eff0` | 12.05:1 | 11.30:1 | pass (3:1 graphic) |
| Detail metadata label `#748078` | `#e9eff0` | 3.78:1 | 3.54:1 | already below AA; carries the owner-deferred `--olaso-text-meta` finding |
| Calendar day `#101611` | `#e9eff0` | 16.07:1 | 15.78:1 | pass |
| Calendar out-of-month day `#8a938c` | `#e9eff0` | 2.77:1 | 2.72:1 | already below AA; decorative out-of-month days |
| First-item icon glyph `#01363e` | `#e4ecec` | 11.51:1 | 10.95:1 | pass (3:1 graphic) |

##### Table-head row deliberately held

- The requested tint cannot be applied to `OrdersTable` `.head` without creating a new
  failure. `--olaso-table-label` `#68736a` measures **4.53:1** on the current
  `--olaso-table-head` `#f3f6f1` (passes AA) and **4.25:1** on `#e9eff0` (fails), and
  `#e4ecec` is worse at **4.12:1**. The head fill was therefore left as-is rather than
  cross from pass to fail. Two bounded options for the owner: (a) tint `.head` and move the
  Orders header label to the existing `--olaso-text-service` `#59645b`, which measures
  5.32:1 on `#e9eff0`, at the cost of a slightly heavier header; or (b) tint `.head` and
  accept 4.25:1 as an explicit exception.

##### Evidence, installed build, 25 September 2026

- APK `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
  `DFEDAD16C5A29A12CA2DCBA579766D67C367A25F246D89709DFCBC2295E9FBD0`, 27830073 bytes,
  built by `npm run android:beta` (140 tasks, BUILD SUCCESSFUL) with the repository JDK 21.
  `adb install -r` on the Redmi 22081283G (serial XOPFAQGYNNGYVGPR) returned Success with no
  uninstall; `firstInstallTime` unchanged at 2026-09-24 22:17:12, `lastUpdateTime`
  2026-09-25 18:12:43, so app data was preserved. The APK's own
  `assets/public/assets/index-Ctlnr4qO.css` carries
  `--orders-tint:#e9eff0;--orders-tint-strong:#e4ecec`.
- Live computed styles on the installed build (`main[aria-label="Atelika orders"]`,
  `data-orders-palette="true"`): `--orders-tint #e9eff0`, `--orders-tint-strong #e4ecec`,
  canvas `rgb(240,247,243)`; selected table row `rgb(228,236,236)`; detail metadata band
  `rgb(233,239,240)`; first-item icon disc `rgb(228,236,236)` with a `rgb(1,54,62)` glyph;
  status-filter pill, pager current and Reprint `rgb(1,54,62)`.
- Semantics unchanged on the same reads: Last-sync chip `rgb(237,245,235)` with
  `rgb(46,107,67)` ink; detail Completed chip `rgb(232,243,230)`; paid dot `rgb(55,165,99)`;
  table `Completed · Synced` chip neutral; filter track `rgb(241,243,239)`.
- A full element scan of the live Orders subtree (visible elements only, across the normal,
  calendar-open and cancel-dialog states) found exactly three legacy green-family fills and
  no legacy cream surface and no legacy brand-green text: the Last-sync chip (semantic), the
  detail Completed chip (semantic), and the held table-head row. Nothing accidental remains.
- Calendar: the Orders-opened calendar overlay reported `data-orders-palette="true"`, and the
  in-range days rendered `#E9EFF0` (pixel-sampled `rgb(233,239,240)`) against the teal
  selected endpoints. The captured calendar is visibly open with the 21-25 September
  multi-day band (`corr-1340x804-orders-calendar-open.png`).
- Crossfade re-verified on the device for Orders -> POS, POS -> Orders, Orders -> Dashboard
  and Dashboard -> Orders: 100-102 frames each, 8-12 samples with the outgoing slot still
  visible, `offenders: []` (no visible screen ever showed `rgb(248,247,234)` or `#006a2b`),
  the frame strip stayed mint and the nav pill stayed `rgb(1,54,62)` in every frame. The
  WebView console was empty.
- Other PeriodCalendar callers proven unchanged in a real-component render: with the Orders
  palette the overlay carried the attribute and `--orders-tint` `#e9eff0`; the same calendar
  rendered without the prop reported no attribute, an empty `--orders-tint`, and its original
  fills (`rgb(232,243,230)` in-range days, `rgb(0,106,43)` selected preset/day).
- Checks: `npm run build` exit 0; `npm run check:navigation` exit 0 with the new assertions;
  `npm run check:css-scope` still reports only the four pre-existing App/Lock keyframe
  findings; `git diff --check` clean. `npm run check:orders` passed its historical receipt
  and signed-option assertions and then stopped at its protected `OLASO_OWNER_PIN` restore
  gate - protected and unrun, not a pass. No sale, print, cancellation or data write was
  performed; the cancellation dialog was opened and closed with Keep order.
- Captures: `tmp/orders-verify/corr-1340x804-orders-full.png`,
  `corr-1340x804-orders-calendar-open.png`, `corr-1340x804-orders-cancel-dialog.png`,
  `corr-1340x804-orders-final.png`.
- Graphify was queried before the change (3,137 nodes / 6,442 edges; Orders screen,
  PeriodCalendar, OverlayPortal and CancellationDialog present). Not refreshed: this
  correction adds no file, symbol or edge.

##### Limitations (not acceptance)

- Provisional; still not the Orders 21-skill review and Orders is not accepted. No design,
  brand or architecture authority was updated, so `DESIGN.md` still records the earlier
  green-pill contract.
- The table-head row is the one requested target not changed, for the measured AA reason
  above; it needs an owner choice between the two bounded options.
- The selected-row time and the metadata band's small label were already below AA before this
  change and stay below it (3.74 -> 3.42 and 3.78 -> 3.54); both carry the owner's previously
  deferred faint-token finding and are disclosed rather than silently accepted.
- Physical coverage is the EN owner role on one tablet; FR, the cashier role, live
  cloud-outage/loading transitions and a real print were not exercised on device, and the
  crossfade sampler runs on the JS thread beside React rather than a hardware vsync trace.

##### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty work is
  preserved untouched.

##### Exact next action

- Owner reviews the four captures and decides the table-head row: tint it and move the
  Orders header label to `--olaso-text-service` (5.32:1), tint it and accept 4.25:1, or leave
  it as it is. Then commit and push; do not start the 21-skill Orders sequence, the Products
  card, or the pending Dashboard passes.

#### Correction 2, 25 September 2026 — no accessibility regression on any Orders surface

Supersedes the previous correction's 'Exact next action' above.

##### Owner instruction

- The table-head row was the sole remaining nonsemantic legacy green-family fill and had to
  adopt the palette with no accessibility regression: tint `.head` with the existing Orders
  `--orders-tint` and a safe fallback, then take only the table-head small labels to the
  existing darker `--olaso-text-service` (`#59645b`, measured 5.32:1 on `#e9eff0`) rather
  than accept 4.25:1. The two small-text regressions the earlier tints caused - the
  selected-row time and the detail metadata small label - were corrected with the same
  existing token. Every other colour, geometry, semantic and screen stays untouched.

##### Change (3 files, no new file)

- `src/features/orders/components/OrdersTable/OrdersTable.module.css` - `.head` reads
  `var(--orders-tint, var(--olaso-table-head))`; `.head > span` (column labels) and
  `.when span` (row time) read `var(--olaso-text-service)`.
- `src/features/orders/components/OrderDetailPanel/OrderDetailPanel.module.css` - one added
  rule `.metaItem small { color: var(--olaso-text-service) }` for the tinted metadata band.
  `.itemCopy small` (the item option line, which sits on the white card) deliberately keeps
  `--olaso-text-meta`.
- `scripts/check-navigation.mjs` - assertions for the tinted head and the three corrected
  labels, and removal of a stray `+` prefix an earlier ledger patch had written before the
  final `console.log` (valid `+expr`, so it ran, but wrong).

##### Measured contrast (WCAG 2.2 SC 1.4.3, computed from the declared values)

| Element | Fill | Before | After | Result |
| --- | --- | --- | --- | --- |
| Table-head label `#68736a` -> `#59645b` | `#e9eff0` | 4.25:1 | 5.32:1 | pass |
| Selected-row time `#758078` -> `#59645b` | `#e4ecec` | 3.42:1 | 5.15:1 | pass |
| Metadata band label `#748078` -> `#59645b` | `#e9eff0` | 3.54:1 | 5.32:1 | pass |
| Same token in the palette-off fallback | `#f3f6f1` / `#f0f6ed` | - | 5.67:1 / 5.62:1 | pass |
| Item option line (token unchanged, white card) | `#ffffff` | 4.12:1 | 4.12:1 | unchanged, pre-existing owner-deferred `--olaso-text-meta` finding |

##### Evidence, installed build, 25 September 2026

- APK `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
  `C2273ABD802554337C5E8645423568F8EBA52285818AD6A34DDE5FCFA53461E2`, 27830073 bytes,
  built by `npm run android:beta` (140 tasks, BUILD SUCCESSFUL) with the repository JDK 21.
  `adb install -r` on the Redmi 22081283G (serial XOPFAQGYNNGYVGPR) returned Success with no
  uninstall; `firstInstallTime` unchanged at 2026-09-24 22:17:12, `lastUpdateTime`
  2026-09-25 18:26:37, so app data was preserved. The APK's own
  `assets/public/assets/OrdersScreen-Bc3_xqW2.css` carries
  `._head_*{background:var(--orders-tint,var(--olaso-table-head));height:40px}`,
  `._head_* >span{color:var(--olaso-text-service)...}` and
  `._metaItem_* small{color:var(--olaso-text-service)}`.
- Live computed styles on the Redmi at 1340 x 804: head fill `rgb(233,239,240)`; head label,
  row time and metadata label all `rgb(89,100,91)`; item option line still `rgb(116,128,120)`;
  selected row `rgb(228,236,236)`; metadata band `rgb(233,239,240)`; item disc
  `rgb(228,236,236)`; canvas `rgb(240,247,243)`; Last-sync chip `rgb(237,245,235)`; detail
  Completed chip `rgb(232,243,230)`; paid dot `rgb(55,165,99)`; Reprint `rgb(1,54,62)`.
- An element scan across the normal, calendar-open and cancel-dialog states now returns TWO
  legacy green-family fills and nothing else - the Last-sync chip and the detail Completed
  chip, both intentional semantic success - with no cream surface and no legacy brand-green
  text. The table-head entry the previous scan reported is gone.
- Calendar: the Orders-opened overlay reported `data-orders-palette="true"` with five
  in-range cells rendering `rgb(233,239,240)` and teal selected endpoints, captured visibly
  open with the 21-25 September band.
- Crossfade re-verified on device for Orders -> POS, POS -> Orders, Orders -> Dashboard and
  Dashboard -> Orders: 100-103 frames each, 9-10 with the outgoing slot still visible,
  `offenders: []` (no visible screen showed `rgb(248,247,234)` or `#006a2b`), the frame strip
  mint in every frame; WebView console empty.
- Browser parity at exactly 1340 x 800 with the real components: the same head fill, the
  same `#59645b` labels, band, row and disc values. A calendar rendered without the Orders
  palette still reported no overlay attribute and its original fills (`rgb(232,243,230)`
  in-range, `rgb(0,106,43)` selected), so other PeriodCalendar callers remain unchanged.
- Checks: `npm run build` 0; `npm run check:navigation` 0 with the new assertions;
  `npm run check:css-scope` still reports only the four pre-existing App/Lock keyframe
  findings; `node --check scripts/check-navigation.mjs` clean; `git diff --check` clean;
  `npm run check:orders` passed its historical receipt and signed-option assertions then
  stopped at its protected `OLASO_OWNER_PIN` gate - protected and unrun, not a pass. No sale,
  print, cancellation or data write; the cancellation dialog was opened and closed with
  Keep order.
- Captures: `tmp/orders-verify/final-1340x804-orders-full.png`,
  `final-1340x804-orders-calendar-open.png`, `final-1340x804-orders-cancel-dialog.png`,
  `final-1340x804-orders-final.png`, and the browser
  `tmp/orders-palette/final-browser-1340x800-orders.png`.
- Graphify was queried before the change (3,137 nodes / 6,442 edges). Not refreshed: this
  correction adds no file, symbol or edge.

##### Limitations (not acceptance)

- Provisional; still not the Orders 21-skill review and Orders is not accepted.
- Out-of-month calendar days inside a range keep `--olaso-text-faint` (2.72:1 on `#e9eff0`).
  They were already below AA before any tint and the token is shared app-wide, so they are
  reported rather than changed.
- The item option line still measures 4.12:1 on the white card; that is the pre-existing,
  owner-deferred `--olaso-text-meta` finding, left as instructed.
- Physical coverage is the EN owner role on one tablet; FR, the cashier role, live
  loading/outage transitions and a real print were not exercised on device, and the
  crossfade sampler runs on the JS thread beside React rather than a hardware vsync trace.

##### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty work is
  preserved untouched.

##### Exact next action

- Owner reviews the four device captures and the browser capture and accepts the Orders
  palette or names changes. Then commit and push; do not start the 21-skill Orders sequence,
  the Products card, or the pending Dashboard passes.

### BRAND-COLOR-01 — POS-only brand-action colour trial (provisional), 24 September 2026

#### Owner authorization and constraints

- Owner asked for one reversible POS-only colour trial that keeps the accepted
  dark teal POS background, the exact cropped Atelika logo, the white
  nav/cart/category/product surfaces and all geometry, and replaces operational
  green where it means selection or action: dark teal for the selected top-nav
  pill, mint + dark teal for the selected category on the dark canvas, and one
  orange Place order action with dark readable text. Every remaining POS green
  usage was to be assigned deliberately to brand-interactive versus
  success/availability, never to warning or danger. Candidate values may be
  provisional and documented; no final global palette may be declared.

#### Research gate, 24 September 2026

- Official guidance recorded before implementing: W3C WCAG 2.2 SC 1.4.3
  Contrast (Minimum) AA — 4.5:1 normal text, 3:1 large
  (https://www.w3.org/TR/WCAG22/#contrast-minimum); SC 1.4.11 Non-text
  Contrast AA — 3:1 for the parts of a control needed to identify it or its
  state (https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html);
  SC 1.4.1 Use of Color — colour is never the only cue
  (https://www.w3.org/WAI/WCAG22/understanding/use-of-color.html); Material 3
  colour roles: surface vs onSurface vs primary, every pair checked
  (https://m3.material.io/styles/color/roles).
- Android/Capacitor boundary unchanged from POS-BG-01/02: this is CSS values
  plus scoped aliases in the React layer. No Kotlin, no new plugin, no new
  package; Capacitor serves the built stylesheet
  (https://capacitorjs.com/docs).
- Skills read in full for this pass: graphify (query before exploring),
  better-colors (measure the rendered pair then report; one colour one meaning;
  fill exactly one action per view; name primitives by hue and roles by role),
  color-system (AA/AAA thresholds; do not rely on colour alone), design-token
  (alias layer, no raw values in components), better-accessibility (non-text
  and focus contrast; colour is never the only cue), and Ponytail at full
  intensity.

#### Source colour sampling (measured, not invented)

- Logo mint, from `assets/brand/atelika-wordmark-transparent.png` (1139 x 359):
  dominant opaque letter colour rgb(180, 240, 213) = `#B4F0D5`.
- Logo accent orange, same asset: dominant rgb(252, 117, 1) = `#FC7501`.
- Category artwork: all six `assets/category-art/*.webp` are flat
  rgb(0, 106, 43) = `#006A2B` opaque.
- Teal `#01363E` is reused from the accepted POS canvas (POS-BG-01).

#### Exact trial-only values (extending the POS-BG-02 scope)

| Role | Value | Note |
| --- | --- | --- |
| POS selection / interactive | `#01363E` | `--olaso-trial-select`; also re-points the green family below |
| Selected category fill | `#B4F0D5` | `--olaso-trial-mint`; the measured logo mint |
| Selected category ink + artwork | `#01363E` | `--olaso-trial-mint-ink` |
| Primary action (Place order) | `#E06A00` | `--olaso-trial-action`; deepened from logo orange `#FC7501` |
| Primary action ink | `#1C211B` | `--olaso-trial-action-ink` |
| Success / availability feedback | `#006A2B` | `--olaso-trial-success-ink`; semantics unchanged |
| Re-pointed green family | `--olaso-green`/`--olaso-border` -> `#01363E`; `--olaso-green-soft` `#E9EFF0`; `--olaso-green-icon` `#E4ECEC` | POS scope only |
| Artwork colouring filter | `invert(94.9%) sepia(97.4%) saturate(300.9%) hue-rotate(152.7deg) brightness(32.4%) contrast(145.7%)` | solves the flat `#006A2B` artwork to `#01363E` exactly |

#### Changes (7 files, no new file)

- `src/App.tsx` — one derived flag `posBrandColorTrial = activeScreen === 'POS'`
  and a `data-pos-brand-trial` attribute on the existing shell, alongside the
  POS-BG-02 `data-pos-trial` attribute.
- `src/globals.css` — one `:root:has([data-pos-brand-trial='true'])` block with
  the role aliases and the green-family re-point. `:root` scope is required so
  the portalled payment and customization dialogs inherit the roles; the block
  matches only while POS is the active screen. No primitive token edited and no
  other screen affected.
- `src/features/pos/components/CategoryCard/CategoryCard.module.css` — active
  border and fill read the mint alias; active status/name/count read the
  mint-ink alias; active illustration reads the art-filter alias.
- `src/features/pos/components/PrimaryAction/PrimaryAction.module.css` —
  `.place` fill and ink read the action aliases.
- `src/features/pos/components/ReceiptRail/ReceiptRail.module.css` — `.success`
  reads the pinned success ink so availability feedback stays green.
- `src/features/pos/components/SearchField/SearchField.module.css` — the
  hardcoded `#086A35` outline now reads the select alias with its original
  value as the fallback.
- `src/features/pos/components/TopNavigation/TopNavigation.module.css` — the
  nav item focus ring reads the select alias with its previous value as the
  fallback.
- Built CSS confirms `:root:has([data-pos-brand-trial=true])` carries all seven
  aliases and the four re-pointed tokens.

#### Role mapping (every audited POS green usage)

| POS usage | Baseline | Trial value | Assigned role |
| --- | --- | --- | --- |
| Selected top-nav pill (`.indicator`) | `#006A2B` | `#01363E` | brand-interactive: selection |
| Nav item focus ring | `#0B6B36` | `#01363E` | brand-interactive: focus |
| Selected category fill + border | `#006A2B` | `#B4F0D5` | brand-interactive: selection on the dark canvas |
| Selected category ink + artwork | white | `#01363E` | brand-interactive: selection ink |
| Service segments (Dine In / Take Away) | `#006A2B` | `#01363E` | brand-interactive: selection |
| Payment segments (Cash / Card) | `#006A2B` | `#01363E` | brand-interactive: selection |
| Product add button and product/chip/cart/field outlines | `#006A2B`/`#0B6B36` | `#01363E` | brand-interactive: add action + control outline |
| Search field outline | `#086A35` | `#01363E` | brand-interactive: control outline |
| Offert toggle ON | `#006A2B` | `#01363E` | brand-interactive: selection |
| Focus rings on white surfaces | `#006A2B` | `#01363E` | brand-interactive: focus |
| Pressed tints (green-soft / green-icon) | `#EDF5EB`/`#E8F3E6` | `#E9EFF0`/`#E4ECEC` | brand-interactive: pressed tint |
| Place order (`.place`) | `#006A2B` + white | `#E06A00` + `#1C211B` | primary action: the single hero action |
| Dialog primary/add (payment confirm, customization Add to order) | `#006A2B` | `#01363E` | brand-interactive: add/confirm action |
| Dialog selected option, option upcharge, checkbox accent | green | `#01363E` / teal tint | brand-interactive: selection |
| Payment quick amount and split method pressed | `#006A2B` | `#01363E` | brand-interactive: selection |
| Receipt success feedback (`.success`) | `#006A2B` | `#006A2B` | success / availability: unchanged |
| Warning/danger (`.warning .status`, `.remove`, clear cart, error) | `#FF6863` | unchanged | danger: unchanged |

#### Measured rendered contrast (device framebuffer, no estimates)

| Pair | Baseline | Trial | Requirement |
| --- | --- | --- | --- |
| Selected nav pill fill vs white nav | 6.78:1 | 13.14:1 | >= 3:1 |
| Nav pill text vs its fill | 6.78:1 | 13.14:1 | >= 4.5:1 |
| Selected category fill vs canvas | 1.94:1 (fail) | 10.24:1 | >= 3:1 |
| Selected category text vs fill | 6.78:1 | 10.24:1 | >= 4.5:1 |
| Selected category artwork vs fill | 6.78:1 | 10.61:1 | >= 3:1 |
| Selected category fill vs unselected card | 6.78:1 | 1.28:1 | visual separation (weak) |
| Service/payment selected text vs fill | 6.78:1 | 13.14:1 | >= 4.5:1 |
| Place order ink vs fill | 6.78:1 | 4.86:1 | >= 4.5:1 |
| Place order fill vs white rail | 6.78:1 | 3.37:1 | >= 3:1 |
| Payment confirm text vs fill | 6.78:1 | 13.14:1 | >= 4.5:1 |
| Quick-amount selected text vs fill | 6.78:1 | 13.14:1 | >= 4.5:1 |

The baseline green selected category sat at only 1.94:1 against the accepted
teal canvas; the mint fill lifts it to 10.24:1. The trial's one weak pair is the
selected-vs-unselected category card at 1.28:1 (mint vs white), which is carried
by the fill sweep, the ink/artwork flip and `aria-pressed` rather than colour
alone. The raw logo orange `#FC7501` measured 2.73:1 against the white rail, so
the deepened `#E06A00` is used instead.

#### Verification actually run, 24 September 2026

- `npm run build` passed (tsc + vite). `npm run check:pos` passed. `npm run
  check:css-scope` reports only the same four pre-existing App/Lock keyframe
  `from`/`to` findings; the new rules added none.
- Packaging: `npm run android:beta` passed (Gradle assembleDebug). APK
  `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
  `72F9A58436508AF1BC28F5B396765011253BB44D18A2A8FD875C90DFB5F177B8`, 27219593
  bytes.
- `adb install -r` over the connected Redmi 22081283G (XOPFAQGYNNGYVGPR)
  succeeded with no uninstall and no data clear; the cold start shows the
  Atelika Lock screen. The owner app-Lock PIN was used only to unlock, and is
  never printed or logged (the harness redacts six-digit values).
- Live render at 1340 x 804 CSS, 2000 x 1200 framebuffer. Computed styles on
  POS: `--olaso-green`/`--olaso-border` `#01363e`, `--olaso-trial-mint`
  `#b4f0d5`, `--olaso-trial-action` `#e06a00`; selected category fill
  rgb(180, 240, 213); Place order fill rgb(224, 106, 0) with ink
  rgb(28, 33, 27).
- States captured in both the trial and the green baseline from the same live
  DOM by adding/removing `data-pos-brand-trial`: default POS with a filled cart,
  selected category, empty search, customization dialog, cash payment dialog
  with a given amount, and disabled Place order on an empty cart. Captures:
  `tmp/colortrial/m2-pos-{after,before}.png`, `m2-payment-{after,before}.png`,
  `m2-modifier-{after,before}.png`, plus the wider set
  `tmp/colortrial/*-{after,before}.png`.
- POS-only scoping checked live: Dashboard reported
  `data-pos-brand-trial=null`, `--olaso-green` `#006a2b` and canvas `#f8f7ea`;
  returning to POS restored the trial (`tmp/colortrial/scope-dashboard.png`,
  `scope-pos.png`).
- Header/TopNavigation touch check: all six screens were opened on the device
  (`Dashboard`, `POS`, `Orders`, `Products`, `Stock`, `Reports`); only POS
  carried the trial. Each other screen reported `data-pos-brand-trial=null`
  with `--olaso-green` `#006a2b`, and none showed clipping. Captures
  `tmp/colortrial/sweep-*.png`.
- No WebView console errors or warnings (the 60-message ring was empty) and a
  filtered logcat read for chromium/Console/Capacitor produced no entries. No
  clipping seen in any captured state.
- No sale created: Place order opened the cash dialog, the dialog was
  cancelled, the cart cleared, and the existing order history was unchanged.
- Reversibility: removing `data-pos-brand-trial` returns the exact green
  baseline with no rebuild; the attribute is set only while POS is active.
- Graphify was queried before code inspection (POS screen colour tokens:
  selection, canvas, category, navigation, place order). It was not refreshed:
  this pass adds no file or module edge.

#### Limitations (not acceptance)

- Verified on the Redmi at 1340 x 804 CSS (the active session's viewport); the
  browser at exactly 1340 x 800 was not separately re-photographed.
- The inactive category artwork stays operational green. It is content, not a
  selection/action colour, so the trial left it; it now sits beside the teal
  selected card and is the most visible open item. A one-line candidate exists
  (apply the same art filter to the unselected `.illustration`) if the owner
  wants it.
- The selected category is only 1.28:1 from an unselected white card; selection
  is carried by the sweep, the ink/artwork flip and `aria-pressed`, not colour
  alone. A stronger difference is an owner choice.
- The action orange is the deepened `#E06A00`, not the raw logo `#FC7501`
  (2.73:1 on the white rail). Whether to keep the raw logo value is an owner
  choice.
- `npm run check:sales` was not run: it needs the owner PIN as a test-restore
  secret and drives real sales, which the owner's "do not complete a sale"
  instruction excludes. No checkout, persistence or sale logic changed in this
  pass, so `npm run check:pos` plus the CSS scope check cover the change.
- Dialog primary actions (payment confirm, customization Add to order) are teal,
  not orange, following the owner's "add buttons -> brand-interactive"
  instruction; whether the modal primary should also take the orange is an open
  owner choice.
- Provisional only: not a palette decision, not propagated, no brand or design
  authority updated; `DESIGN.md`, `BRAND.md` and `untitled.pen` are untouched.

#### Publication

- Not committed and not pushed, pending owner review. Unrelated dirty files and
  untracked asset folders are preserved untouched.

#### Exact next action

- Owner reviews the POS trial on the unlocked device and accepts it or names
  changes (the mint value / selected-vs-unselected difference, the unselected
  artwork colour, the action orange variant, and whether the modal primary
  action should also be orange). Do not propagate it, do not mark it approved or
  done, and commit and push only after that acceptance.

#### BRAND-COLOR-01 follow-up — POS pill rounding and category recolour (provisional), 24 September 2026

##### Owner authorization

- Owner's 24 September follow-up to the same POS trial: (1) the selected POS
  top-nav pill reads too rounded, so give only the POS indicator a less rounded
  corner (16px is the smallest named candidate, versus the 23px baseline);
  (2) the selected category should use the trial's action orange with dark
  readable text and the white knockout artwork (the original), not mint; (3) the
  unselected category artwork should carry the brand teal tint at its original
  opacity. Still POS-only, provisional and reversible behind the same
  `data-pos-brand-trial` attribute. Other screens, the nav container, the
  Orders/Products green pill, the geometry, the dark teal canvas and the exact
  logo are untouched. It closes the two open items the first pass listed (the
  unselected-artwork one-line candidate and the weak selected-vs-unselected
  difference).

##### Research gate, 24 September 2026

- Same authorities as BRAND-COLOR-01, re-affirmed: WCAG 2.2 SC 1.4.3 Contrast
  (Minimum) 4.5:1 text, SC 1.4.11 Non-text Contrast 3:1 for the selected
  artwork graphic and the selected fill against the dark canvas, and SC 1.4.1
  Use of Color (selection is still carried by the fill sweep, the ink/artwork
  flip and `aria-pressed`, not colour alone).
- Skills re-read for this pass: graphify (query before exploring), better-colors
  (one colour one meaning; fill exactly one action per view), color-system
  (AA/AAA thresholds; never colour alone), design-token (alias layer, no raw
  value in a component) and Ponytail at full intensity.

##### Changes (3 files, no new file)

- `src/globals.css` — dropped the now-unused `--olaso-trial-mint` and
  `--olaso-trial-mint-ink` aliases (no stale mint); added
  `--olaso-trial-nav-radius: 16px`. The selected category now shares the
  existing `--olaso-trial-action` and `--olaso-trial-action-ink`.
- `src/features/pos/components/CategoryCard/CategoryCard.module.css` — active
  border, fill and status/name/count ink read the action aliases; the active
  illustration is the literal `brightness(0) invert(1)` white knockout; the
  base `.illustration` reads `var(--olaso-trial-art-filter, none)`, so only
  POS re-tints the unselected artwork and every other screen keeps the original
  green.
- `src/features/pos/components/TopNavigation/TopNavigation.module.css` — only
  `.indicator` reads `var(--olaso-trial-nav-radius, 23px)`, so the POS pill is
  16px while `.item`, `.navigation` and every other screen stay at 23px.

##### Measured values (computed from the exact trial values, no estimates)

| Element | Baseline | Follow-up | Requirement |
| --- | --- | --- | --- |
| POS nav indicator radius | 23px | 16px | visibly less rounded |
| Orders / other nav indicator radius | 23px | 23px | unchanged |
| Selected category fill | mint `#B4F0D5` | orange `#E06A00` | one action colour |
| Selected category ink | teal `#01363E` | `#1C211B` | >= 4.5:1 |
| Selected artwork filter | teal art filter | `brightness(0) invert(1)` | >= 3:1 graphic |
| Selected fill vs dark canvas | 10.24:1 | 3.90:1 | >= 3:1 |
| White artwork vs selected fill | 10.61:1 | 3.37:1 | >= 3:1 |
| Selected ink vs selected fill | 10.24:1 | 4.86:1 | >= 4.5:1 |
| Selected fill vs unselected card | 1.28:1 | 3.37:1 | visual separation |
| Unselected artwork (teal, 0.46) vs white card | 2.18:1 (green) | 2.64:1 (teal) | decorative illustration |

The orange lifts the previously weak selected-vs-unselected separation from
1.28:1 to 3.37:1 and keeps the selected fill 3.90:1 from the dark canvas. The
white knockout on orange is 3.37:1 (>= 3:1 non-text). The unselected teal
artwork keeps its original 0.46 opacity and is a decorative category
illustration whose 2.64:1 is not a control boundary; the category name carries
the meaning.

##### Verification actually run, 24 September 2026

- `npm run build` passed (tsc + vite). `npm run check:pos` passed.
  `npm run check:css-scope` still reports only the same four pre-existing
  App/Lock keyframe `from`/`to` findings (exit 1 baseline unchanged); the new
  rules added none.
- Built CSS confirms the five remaining trial role aliases plus
  `--olaso-trial-nav-radius:16px`, and
  `border-radius:var(--olaso-trial-nav-radius,23px)` on the indicator.
- Packaging: `npm run android:beta` passed (check:android + cap sync + Gradle
  `testDebugUnitTest assembleDebug`). APK
  `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
  `71DCDBE99471B73C84D6F31334A5E93FEEF7690F3E0052950D1CE49F524A5955`,
  27219593 bytes.
- `adb install -r` over the connected Redmi 22081283G (XOPFAQGYNNGYVGPR)
  succeeded with no uninstall and no data clear; the cold start shows the
  Atelika Lock screen. No sale created, no data reset.
- Protected and unrun: the on-device computed-style readback (POS indicator
  radius versus Orders) and the device screenshots. The app cold-starts to the
  protected owner Lock, and `OLASO_OWNER_PIN` is unset in this session; the
  repo requires it via environment only (`goals/options/TABLET-TESTING.md`,
  `goals/options/PROTOCOL.md`, `tools/recovery/TABLET_ADB_CONTROL.md`) and
  never stores it. Recorded protected/unrun, not a pass, pending owner unlock.
- Graphify was queried before code inspection (POS navigation and category
  colour/geometry tokens). Not refreshed: this pass adds no file or module edge.

##### Limitations (not acceptance)

- Device measurement and screenshots are pending owner unlock, so the 16px
  versus 23px rendered radii are confirmed from the built CSS and the computed
  values, not yet from the live framebuffer.
- Dialogs were not re-photographed: no rule in the payment or customization
  dialogs changed in this follow-up.
- Provisional only: not a palette decision, not propagated, no brand or design
  authority updated; `DESIGN.md`, `BRAND.md` and `untitled.pen` are left
  untouched (the first pass left them untouched and this follow-up only changes
  trial values).

##### Publication

- Not committed and not pushed, pending owner review. Unrelated dirty files and
  untracked asset folders are preserved untouched.

##### Exact next action

- Owner unlocks the tablet (or supplies `OLASO_OWNER_PIN`) so the agent captures
  the POS nav pill at 16px beside the Orders 23px pill and the selected/unselected
  categories, then accepts or names changes. Do not propagate, do not mark it
  approved or done, and commit and push only after that acceptance.

#### BRAND-COLOR-01 follow-up rollback — owner rejected the preview, 24 September 2026

- The owner saw the 16px POS pill and orange/teal artwork trial on the tablet and
  rejected it. The pill looked wrong; the unselected artwork became gray rather
  than preserving the intended two-colour artwork logic, and selected artwork
  became all white. The narrow preview also failed to map the proposed orange
  consistently across the POS. These are observed failures, not an accepted
  brand rule.
- Restored only that follow-up's edits in `src/globals.css`,
  `CategoryCard.module.css`, and `TopNavigation.module.css`: the POS pill is
  23px again; selected category fill/ink/artwork return to the earlier mint/
  teal trial; unselected art returns to its original green. The earlier POS
  dark background and brand-action trial remain unchanged and provisional.
  No commit, push, or other screen change.
- The owner's proposed next direction is an orange-selected category with the
  original artwork's two-colour swap preserved, plus a coordinated review of
  product-card and plus-button outlines. This is a new bounded design decision,
  not implemented by this rollback. Inspect the actual artwork pixels and
  render states before any new recolour; do not use a blanket CSS filter that
  turns the whole illustration into one colour.
- Exact next action: verify this narrow rollback and report its build/device
  status honestly, then agree the complete POS colour mapping with the owner
  before another preview. Do not treat the superseded follow-up's old 'owner
  unlocks' next action as current.

##### Rollback verification, 24 September 2026

- Verified by a read-only audit; no further CSS change. The working tree and the
  installed APK both carry the earlier BRAND-COLOR-01 state: `trial-nav-radius`
  is absent (POS pill back to 23px), the `--olaso-trial-mint` /
  `--olaso-trial-mint-ink` aliases are present, and no filter sits on the base
  `.illustration`, so unselected artwork is the original green again.
- Packaging and install: `npm run android:beta` produced
  `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
  `AC8DF3F95D03178F1E84D882884DB49736D1AD88D38C075376281F486AFD131F`. The
  apparently interrupted `adb install -r` did complete on the connected Redmi
  22081283G (XOPFAQGYNNGYVGPR): the on-device
  `/data/app/~~gaHL7P9_.../com.olaso.pos-.../base.apk` pulls back with the same
  SHA-256, and `dumpsys package com.olaso.pos` reports `versionCode 11` and
  `lastUpdateTime 2026-09-24 16:52:24`. No uninstall, no data clear, no PIN
  needed; nothing left to re-run.
- Rollback scope confirmed narrow: only the follow-up's three files reverted; the
  earlier POS dark background and brand-action trial, and every unrelated dirty
  file, remain untouched.
- Note for the next design pass: the six `assets/category-art/*.webp` are
  single-colour green line art (`#006A2B`) on transparency (measured: dominant
  `rgb(0,106,43)` with only alpha variation). The "green plus white interior"
  look is green strokes over the white card, not two pixel colours, so the
  selected-state swap is the `brightness(0) invert(1)` knockout over the fill.

#### BRAND-COLOR-01 follow-up 2 — POS-only coherent orange interaction (provisional), 24 September 2026

##### Owner authorization and constraints

- Owner approved one reversible POS-only *coherent orange interaction* preview and
  named the complaints as a set, not a single patch: the current POS top-nav pill
  "looks ugly" while the Current order Dine In/Take Away and Cash/Card selected
  pills look much better, so those existing controls are the visual/geometry
  reference. Do not repeat the rejected 16px indicator and do not assume radius
  alone fixes it.
- Required mapping: one orange for everything POS-interactive - nav, category,
  product cards/plus, service and payment segmented controls, quick amounts,
  cart lines/Offert, search/chips, modifier and payment dialogs, action buttons.
  The category assets are single-colour strokes on transparency, so unselected
  must be orange strokes on the white card and selected must be white strokes on
  the orange card. The rejected teal/grey art filter is forbidden.
- Preserved: semantic success/availability green, danger/error red, the neutral
  white surfaces, the Atelika logo, the dark teal canvas, all geometry and every
  other screen. Preview stays behind the existing POS trial attributes; no
  commit or push until owner visual acceptance; no new dependency.

##### Research gate, 24 September 2026

- Re-confirmed authorities: WCAG 2.2 SC 1.4.3 Contrast (Minimum) 4.5:1 text /
  3:1 large text (https://www.w3.org/TR/WCAG22/#contrast-minimum); SC 1.4.11
  Non-text Contrast 3:1 for control boundaries and state graphics
  (https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html); SC 1.4.1
  Use of Color, so selection keeps its fill sweep, ink/artwork flip and
  `aria-pressed` rather than colour alone
  (https://www.w3.org/WAI/WCAG22/understanding/use-of-color.html).
- Skills read in full for this pass: graphify (queried before code), better-colors
  (one colour one meaning; fill exactly one action per view; measure the rendered
  pair and never estimate), color-system (AA/AAA thresholds, colour never alone),
  design-token (alias layer, no raw values in components), better-accessibility
  (verify a custom focus ring against every adjacent colour) and Ponytail at full
  intensity.
- Android/Capacitor boundary unchanged: CSS values plus POS-scoped aliases in the
  React layer. No Kotlin, no plugin, no package.

##### Source sampling and the solved artwork filter

- Orange is the already-measured Atelika logo accent `rgb(252,117,1)`, deepened
  to `#e06a00` so a filled surface clears 3:1 against both the white rail (3.37)
  and the dark canvas (3.90). Sample unchanged from BRAND-COLOR-01.
- Category artwork: six `assets/category-art/*.webp`, flat `rgb(0,106,43)`
  strokes on transparency (alpha-only variation). The orange stroke recolour is a
  solved CSS filter chain, `brightness(0) invert(41.6%) sepia(81.4%)
  saturate(3695.4%) hue-rotate(31.4deg) brightness(101.4%) contrast(197.5%)`,
  which maps the strokes to `rgb(225,106,0)` - hue 28.2, saturation 1.00 - with
  alpha untouched. It was measured back from the rendered element, not assumed:
  the sampler renders orange strokes on white (and on the teal canvas) and the
  original green on every non-POS screen. No teal and no grey anywhere.

##### Exact POS-only values (extending the existing trial block)

| Role | Value | Note |
| --- | --- | --- |
| Interactive fill / outline / ring | `#e06a00` | `--olaso-green`, `--olaso-border`, `--olaso-trial-select`, `--olaso-trial-action` |
| Ink on an orange fill | `#1c211b` | `--olaso-trial-action-ink`; 4.89:1 on the fill |
| Text on white | `#a64b00` | `--olaso-trial-action-ink-strong`; 5.79:1, because the bright fill is only 3.37:1 there |
| Pressed tints | `#fdeee0` / `#fbe3cd` | `--olaso-green-soft` / `--olaso-green-icon` |
| Artwork stroke filter | the solved chain above | `--olaso-trial-art-filter` |
| Success / availability | `#006a2b` | `--olaso-trial-success-ink`, unchanged |
| Removed | `--olaso-trial-mint`, `--olaso-trial-mint-ink` | no stale mint left in src or dist |

##### The nav pill (the named complaint)

- The reference difference was measured, not guessed: the Current order segmented
  indicator sits inside a 1px framed white track, while the POS nav track had no
  frame and its indicator was the same colour as the surrounding teal band over
  its full 46px height, so it read as a hole rather than a pill.
- Treatment: the nav indicator becomes the orange fill with dark ink, and the POS
  nav track gets the reference's 1px frame as an inset ring
  (`box-shadow: inset 0 0 0 1px var(--olaso-trial-action, transparent)`), which
  is a no-op on every other screen. Radius stays 23px and height stays 46px: the
  570x46 outer geometry is untouched and no layout shift is possible. The
  indicator is 46px on a 570x46 track exactly as before.
- Result: the POS nav pill and the segmented pills now share one language - white
  track, 1px orange frame, orange pill, dark ink.

##### Changes (8 files, no new token file, no dependency)

- `src/globals.css` - the POS trial block now carries the orange alias set and
  re-points the interactive green family to orange; success stays green.
- `src/features/pos/components/CategoryCard/CategoryCard.module.css` - active
  fill/border read the action alias; active status/name/count read the action
  ink; the base `.illustration` reads the art filter so unselected art is orange
  in POS only, and the active illustration keeps the white knockout.
- `TopNavigation.module.css` - the track frame and the dark ink on the orange
  selected item.
- `SegmentedControl.module.css`, `PaymentMethodControl.module.css` - dark ink on
  the orange selected segment.
- `PrimaryAction.module.css` - the Split label moves to the deeper orange and the
  shared focus ring moves to the dark ink so it clears both the white rail and the
  orange fill.
- `PaymentDialog.module.css` - share price to the deeper orange; method, quick
  amount and Confirm inks to the dark ink.
- `ModifierSelectionDialog.module.css` - the upcharge to the deeper orange and
  the Add button ink to the dark ink.
- `ProfileControl.module.css` - the selected language segment ink to dark.
- `Header.module.css` - the skip link text to the deeper orange.

##### Verification actually run, 24 September 2026

- `npm run build` passed (tsc + vite). `npm run check:pos` passed.
  `npm run check:navigation` passed. `npm run check:css-scope` still reports
  only the same four pre-existing App/Lock keyframe `from`/`to` findings; the
  new rules added none.
- Built CSS confirms the new aliases, the inlined filter and the inset ring, and
  zero `trial-mint` / `trial-nav-radius` left.
- Visual acceptance evidence (owner unlock was unavailable, so the owner-approved
  isolated real-component browser fixture was used; untracked, in `tmp`, excluded
  from the bundle by `tsconfig` `include: ["src"]`): the real Header, nav,
  SearchField, CategoryRow, ProductGrid, ReceiptRail and both POS dialogs rendered
  inside the real theme and the real trial attributes at 1340x800 in headless
  Chrome. Captures: `tmp/orange-shots/pos-full.png`, `pos-before.png` (same
  screen with the brand attribute off), `pos-modifier.png`, `pos-payment.png`,
  `other-screen-nav.png` (both attributes off, Orders active, green baseline and
  no nav frame) and `compare-nav-vs-segmented.png`.
- Measured from those renders (not estimates): nav pill ink on fill 4.80:1,
  segmented ink on fill 4.89:1, selected category ink on fill 4.89:1, selected
  category artwork on fill 3.37:1, selected fill on the dark canvas 3.90:1, the
  orange fill/outline on the white track 3.37:1, quick-amount ink on fill 4.88:1,
  the deeper orange on white 5.79:1. The unselected orange strokes sit at the
  existing 0.46 opacity (1.72:1 on white) as a decorative illustration whose
  meaning is carried by the category name, matching the baseline treatment.
- Packaging and install: `npm run android:beta` passed with JDK 21. APK
  `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
  `E2958B27D0DBD3D4B78C5C23250FF72EA44E264CD6CCB054595B0ABEC0ACCFB8`,
  27219593 bytes. `adb install -r` over the connected Redmi 22081283G
  (XOPFAQGYNNGYVGPR) returned `Success`; the pulled on-device `base.apk`
  hashes identically, `firstInstallTime` is unchanged at 2026-09-20 17:12:04
  (data preserved), `lastUpdateTime` 2026-09-24 17:20:10. No uninstall, no data
  clear, no PIN needed, no sale created.
- Graphify queried before code inspection (POS nav indicator vs segmented control
  geometry). Not refreshed: this pass adds no file or module edge.

##### Limitations (not acceptance)

- Device framebuffer capture and the on-device computed-style readback were not
  run: the app cold-starts to the protected owner Lock and no owner PIN is
  available in this session. The screenshots are the real components in a real
  browser at 1340x800, which is browser evidence, not tablet evidence.
- The fixture reproduces the POS screen composition rather than the live app, so
  it does not exercise the Activity/visited-screen retention path; no layout code
  changed, so that risk is limited to the colour aliases.
- The QuickAddRow chips remain `display: none` in its own base rule (pre-existing,
  unrelated to colour); their outline token is mapped to orange for whenever they
  do render.
- The payment dialog's Confirm was captured in its disabled state (short tender);
  the enabled Confirm shares the rail's verified Place order tokens.
- The nav frame is a 1px inset ring rather than a border so the 570x46 geometry is
  untouched; the reference control uses a real 1px border, so the two tracks match
  visually but not in box model.
- Provisional only: no palette decision, not propagated, no brand/design authority
  updated; `DESIGN.md`, `BRAND.md` and `untitled.pen` are untouched. The 16px
  indicator stays rejected and absent.

##### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  files and untracked asset folders are preserved untouched. The fixture lives
  under the gitignored `tmp/`.

##### Exact next action

- Owner reviews POS on the unlocked tablet and accepts or names changes (the
  orange value, the nav frame, the unselected artwork opacity, the deeper-orange
  text rule). Do not propagate it, do not mark it approved or done, and commit and
  push only after that acceptance.

#### BRAND-COLOR-01 follow-up 3 — owner-corrected narrow orange scope, 24 September 2026

- Owner rejected follow-up 2. Orange was requested only for the selected
  category, the category artwork swap (orange strokes on white when unselected;
  white strokes on orange when selected), product-card and plus-button outlines,
  and the existing Place order action. Orange on the Dine In/Take Away and
  Cash/Card pills, profile avatar ring, EN/FR selector, top navigation pill,
  and other POS controls was an assistant prompting error, not owner approval.
- Keep the prior dark teal canvas and the earlier teal selection/control mapping.
  The POS top-nav pill was separately reported as awkward: preserve its teal
  identity, use a slightly distinct teal fill `#0e5360` against the canvas
  `#01363e`, a 1px framed white track like the Current order controls, and a
  modest 20px inner radius (the rejected 16px was too sharp). Other screens'
  navigation remains unchanged. This is a visual trial, not a settled token.
- `src/globals.css` restores the POS teal aliases for `--olaso-green`, border,
  focus and pressed tints, retains `#e06a00` only as the targeted action/accent,
  and retains the orange-only category-art filter. `CategoryCard.module.css`
  keeps orange selected fill and white-stroke artwork, with orange strokes on
  unselected white cards. `ProductCard.module.css` explicitly uses the orange
  trial token for the 2px card outline and the plus button's outline/glyph;
  outside the trial the old 1.2px plus outline remains. `PrimaryAction.module.css`
  retains the orange Place order button. `TopNavigation.module.css` takes the
  POS-only teal fill/frame/radius. The follow-up-2 orange-only ink overrides in
  Header, ProfileControl, SegmentedControl, PaymentMethodControl, PaymentDialog,
  ModifierSelectionDialog and the Split button were removed; teal/white returns.
- Applicable guidance reused from this card's 24 September research: [WCAG 2.2
  non-text contrast](https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html)
  (3:1 meaningful outlines/state graphics), [minimum text contrast](https://www.w3.org/WAI/WCAG22/understanding/contrast-minimum.html)
  (4.5:1 normal text), and use of colour (state not hue alone). The orange
  `#e06a00` was already measured 3.37:1 against white; dark ink `#1c211b`
  was measured 4.86:1 on orange. The distinct teal nav fill and framed track
  solve the observed same-colour cutout; rendered review is still required.
- `npm run build`, `npm run check:pos`, and `npm run check:navigation` passed on
  the narrow CSS revision. `npm run check:css-scope` remains red only for the
  four pre-existing App/Lock keyframe `from`/`to` findings; no new finding.
  A 1340x800 real-component browser capture is
  `tmp/pos-color-corrected-3.png`; it shows the intended scope without clipping.
  The first two captures showed that a same-colour pill still looked like a
  cutout, so the final browser candidate uses a distinct teal fill within a
  real 1px framed track. Browser evidence is not physical-device acceptance.
- `npm run android:beta` passed with the existing JDK 21, producing APK SHA-256
  `EB79FFCA08A154F337CE38611B70E9DB76F4537D973CD3FA1772AF6C3D7B0C16`.
  `adb install -r` on the connected Redmi 22081283G returned Success;
  `dumpsys package` reports versionCode 11, unchanged firstInstallTime
  `2026-09-20 17:12:04`, and lastUpdateTime `2026-09-24 17:34:30`.
  Installation preserved data. Owner tablet visual acceptance is still pending;
  no sale was made and no PIN was used.
- No commit or push. Preserve unrelated dirty work. Exact next action: owner
  unlocks the installed app and judges the corrected POS on the Redmi; record
  any visual feedback before treating a colour as final or propagating it to
  other screens.

### POS-EVAL-01 — read-only one-item POS balance check on the Redmi, 25 September 2026 (no code change)

- Owner asked for a read-only visual evaluation of orange balance with an active
  order. No source, colour, data or order was changed: the only mutations were the
  draft cart (one Espresso) and the device screenshot.
- Method: unlocked the installed Atelika beta with the owner PIN (used
  transiently, never printed or stored), stayed on POS, and added exactly one
  seeded Espresso through its Customize order dialog with the optional extra left
  unchecked ("Add to order · 10,00 MAD"). Place order then read enabled with a
  10,00 MAD total and the rail showed one line (Regular · 10,00 MAD x 1). No order
  was placed, nothing was printed, cancelled or seeded.
- Values: Place order background `rgb(224,106,0)` with the label `rgb(28,33,27)`
  (`--olaso-trial-action-ink`), 4.86:1, passing AA; plus buttons `#e06a00` outline
  and glyph on white at 3.37:1, passing the 3:1 non-text threshold. Selected
  states remain the unified `#01363e` (nav pill, Dine In, Cash, selected category)
  on the `#f0f7f3` canvas.
- Balance and layout: a framebuffer histogram puts orange at 1.05% of the screen
  against 5.50% deep teal, so orange reads as an action accent rather than a
  field. No clipping: documentElement 1340 x 804, right-most element edge 1340,
  bottom-most 804.
- Captures: `tmp/posbg03/device-pos-one-item.png` (native 2000 x 1200),
  `tmp/posbg03/crop-one-grid.png`, `tmp/posbg03/crop-one-placeorder.png`,
  `tmp/posbg03/crop-placeorder-zoom.png`.
- Limitations: one product only, owner role only, 1340 x 804 CSS rather than the
  documentary 1340 x 800; the draft cart is left in place for the owner to review
  or clear. The first 3x crop misread the Place order label as white until a 6x
  zoom and the pixel histogram showed the dark `#1C211B` ink.
- No commit or push; no files changed by this check.

### POS-NAV-01 — unify the active nav pill with the selected segment teal (owner-approved), 24 September 2026

#### Owner authorization and constraints

- Owner approved one POS-only trial: the active top-navigation pill and the
  selected category-card background must be EXACTLY the deep teal the selected
  Dine In and Cash segments already use, reusing the existing token rather than a
  new shade. Everything else is preserved: the selected/unselected category
  inversion and legibility, the white header, the dark-teal logo and its
  alignment, the near-neutral mint canvas, the product outlines, and the orange
  plus / Place order. Date and time, the nav frame, the Report/profile outlines,
  warning/status colours, the Dashboard, other pages and the popup palette are out
  of scope for this pass.

#### Research gate, 24 September 2026

- Inspected first, as instructed. `SegmentedControl.module.css` and
  `PaymentMethodControl.module.css` both paint their `.indicator` with
  `background: var(--olaso-green)`; inside the POS brand-trial block that resolves
  to `#01363e`. `TopNavigation.module.css` instead used
  `var(--olaso-trial-nav-fill, ...)` with `--olaso-trial-nav-fill: #0e5360`, and
  the category fill already used `--olaso-trial-cat-ink: #01363e`.
- Standing authorities reused: WCAG 2.2 SC 1.4.11 non-text contrast 3:1
  (https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html) and SC
  1.4.3 text contrast 4.5:1
  (https://www.w3.org/WAI/WCAG22/understanding/contrast-minimum.html).
- No new dependency, token or native change: the pill now shares the segments'
  existing declaration.

#### Exact values

| Fill | Before | After |
| --- | --- | --- |
| Active top-navigation pill | `--olaso-trial-nav-fill` `#0e5360` (rgb 14,83,96) | `var(--olaso-green)` `#01363e` (rgb 1,54,62) |
| Selected Dine In / Cash segment | `var(--olaso-green)` rgb(1,54,62) | unchanged |
| Selected category-card fill | `--olaso-trial-cat-ink` rgb(1,54,62) | unchanged (already exact) |

- The category fill needed no edit: it already resolved to the identical value.
  Only the nav pill had drifted to a distinct shade, so the trial is one
  declaration plus the removal of the now-dead `--olaso-trial-nav-fill`.
- Selected foreground contrast is unchanged and still passes: white on `#01363e`
  is 13.17:1 for the active nav item and the Dine In / Cash labels; mint `#b5efd3`
  on `#01363e` is about 10.2:1 for the selected category name. The pill against
  the white track and header is 13.17:1, above the 3:1 non-text threshold.

#### Changes (3 files, no new file)

- `src/features/pos/components/TopNavigation/TopNavigation.module.css` — the
  `.indicator` background becomes `var(--olaso-green)`, the exact declaration the
  two segment controls use.
- `src/globals.css` — deletes the now-unused `--olaso-trial-nav-fill: #0e5360`.
  The 20px nav radius and 1px frame tokens are untouched.
- `UI_POLISH_LEDGER.md` — this record.

#### Device evidence, 24 September 2026

- `npm run build` and `npm run check:pos` passed; `npm run check:css-scope` still
  reports only the four pre-existing App/Lock keyframe findings. The built APK CSS
  contains no `0e5360` and no `trial-nav-fill`.
- `npm run android:beta` passed and the APK installed successfully. Computed
  styles on the Redmi 22081283G at 1340 x 804 CSS, POS live: nav indicator
  `rgb(1,54,62)`, active nav item `rgb(255,255,255)`, nav frame `rgb(1,54,62)`;
  Service type indicator `rgb(1,54,62)` with the active label white; Payment
  method indicator `rgb(1,54,62)`; selected category fill `rgb(1,54,62)` with the
  name `rgb(181,239,211)`; canvas `rgb(240,247,243)`. All three fills now measure
  the same value.
- Framebuffer pixels: Dine In `#01363E`, Cash `#01363E`, selected category fill
  `#01363E`. Captures `tmp/posbg03/device-unify.png`,
  `tmp/posbg03/crop-unify-nav.png`, `tmp/posbg03/crop-unify-segments.png`.

#### Limitations (not acceptance)

- **Device state changed before this pass.** On arrival the Redmi no longer had
  `com.olaso.pos` installed at all (266 packages listed, none matching `olaso`);
  its local SQLite/cafe data was therefore already gone and no command in this
  session uninstalled it. To reach the requested device capture the current trial
  APK was installed, which is a fresh install (`firstInstallTime` =
  `lastUpdateTime` = 2026-09-24 22:17:12) and starts from an empty local database.
  The owner unlock still worked because the staff profile and PIN live in the
  development backend. The device may need the usual development seeding before
  the shop's real records reappear locally.
- Capture is the Redmi at 1340 x 804 CSS, not the documentary 1340 x 800 Galaxy
  Tab A9. Only the default POS state was photographed; dialogs, warning/status
  states, other roles and other pages were not re-photographed.
- The pill and the 1px nav frame now share `#01363e`, so the frame reads as part
  of the pill rather than a contrast edge. That is the requested unification and
  the pill still sits on a white track, not directly on the canvas.
- Provisional only: not a palette decision, not propagated, no brand/design
  authority updated.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  files preserved untouched.

#### Exact next action

- Owner reviews POS-NAV-01 on the Redmi (`tmp/posbg03/device-unify.png`) and
  accepts it or names changes. Do not propagate it, do not mark it approved or
  done, and commit/push only after acceptance.

### POS-CARD-01 — POS-only product-card outline + neutral workspace trial (owner-approved), 24 September 2026

#### Owner authorization and constraints

- Owner approved two POS-only changes after the POS-CAT-01 pass: product-card
  outlines move from orange to the dark blue-teal used by the logo and the
  categories, while every product plus button stays orange; and the workspace
  background becomes subtly lighter and more neutral/grey while staying
  perceptibly green. The white top bar, the 14px gap before Search, the logo, the
  POS-CAT-01 mapping, the card dimensions and border width, every other control
  and every other screen are preserved.

#### Research gate, 24 September 2026

- Standing authorities reused (read in full in POS-BG-02 / BRAND-COLOR-01): WCAG
  2.2 SC 1.4.11 non-text contrast 3:1 for meaningful outlines
  (https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html) and SC
  1.4.3 text contrast 4.5:1
  (https://www.w3.org/WAI/WCAG22/understanding/contrast-minimum.html).
- No new dependency, no Kotlin, no native change: both edits are trial alias
  values in the existing CSS layer, and the card outline reuses the existing
  `--olaso-trial-select` token, so no token was added.

#### Exact values

| Role | Before | After |
| --- | --- | --- |
| Product-card 2px outline | `--olaso-trial-action` `#e06a00` | `--olaso-trial-select` `#01363e` |
| Product plus button outline + glyph | `#e06a00` | unchanged `#e06a00` |
| POS workspace canvas | `#e6f9f3` | `#f0f7f3` |

- Workspace maths: `#e6f9f3` is rgb(230,249,243) — chroma 19, blue-minus-red 13,
  channel mean 240.7. `#f0f7f3` is rgb(240,247,243) — chroma 7, blue-minus-red 3,
  channel mean 243.3. It is lighter, markedly less chromatic, and still
  green-dominant (green 7 above red, 4 above blue); not white, not neutral grey.
- Contrast: the card outline rises from 3.37:1 to 13.17:1 against the white card
  and sits at 12.11:1 against the workspace. The workspace against white moves
  from 1.093:1 to 1.088:1, so the tint stays perceptible but is marginally
  softer; the 14px gap before Search still reads as a distinct band.

#### Changes (4 files, no new file)

- `src/features/pos/components/ProductCard/ProductCard.module.css` L6 — `.card`
  border swaps from `--olaso-trial-action` to `--olaso-trial-select` (fallback
  `var(--olaso-border)` unchanged). `.add` keeps `--olaso-trial-action`, and the
  2px width, 20px radius and 174x162 size are untouched.
- `src/App.module.css` L16 — the `.shell[data-pos-trial='true']` block re-points
  `--olaso-canvas` to `#f0f7f3`.
- `src/globals.css` L129 — the full-viewport alias
  `:root:has([data-pos-trial='true'])` re-points `--olaso-canvas` to the same
  value.
- `UI_POLISH_LEDGER.md` — this record.

#### Device evidence, 24 September 2026

- `npm run build` and `npm run check:pos` passed; `npm run check:css-scope` still
  reports only the four pre-existing App/Lock keyframe findings.
- `npm run android:beta` passed and `adb install -r` succeeded (`lastUpdateTime`
  2026-09-24 21:28:26, app data preserved).
- Computed styles on the Redmi 22081283G at 1340 x 804 CSS, POS live: 9 product
  cards, each 174 x 162, outline `rgb(1,54,62)`; plus button border and glyph
  `rgb(224,106,0)`; `--olaso-canvas` `#f0f7f3` with the POS screen and body both
  `rgb(240,247,243)`; header band `rgb(255,255,255)` 76px top -8px; search top 90
  so the gap is still 14px; documentElement 1340 = viewport, no overflow.
- Framebuffer pixels: card outline `#01363E` at x18-19 with the workspace
  `#F0F7F3` immediately left of it; workspace `#F0F7F3` sampled between the menu
  and the rail, below the grid, and in the strip above Search; plus button
  `#E06A00`. Captures `tmp/posbg03/device-card-outline.png`,
  `tmp/posbg03/crop-card-outline.png`, `tmp/posbg03/crop-product-cards.png`.

#### Limitations (not acceptance)

- Capture is the Redmi at 1340 x 804 CSS, not the documentary 1340 x 800 Galaxy
  Tab A9. Only the default POS state was photographed; empty/warning categories,
  dialogs, other roles and other screens were not re-photographed.
- The workspace is now closer to white, so the card-vs-workspace and strip tints
  are marginally softer (1.088:1 vs 1.093:1). If the tint reads too faint the
  canvas can be nudged back toward green (for example `#edf6f1`).
- The card outline now shares the teal hue with the unselected category artwork
  and the search/nav teal, leaving the orange plus button as the only warm accent
  in the grid. That is the requested mapping.
- The WebView reports the unchanged 2px border as 1.71429px computed (a device
  zoom artifact); the declaration and visual weight are unchanged.
- Provisional only: not a palette decision, not propagated, no brand/design
  authority updated.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  files preserved untouched.

#### Exact next action

- Owner reviews the POS-CARD-01 product outline and workspace on the Redmi
  (`tmp/posbg03/device-card-outline.png`) and accepts it or names changes (the
  workspace value, the orange plus, the shared teal accent). Do not propagate it,
  do not mark it approved or done, and commit/push only after acceptance.

### POS-CAT-01 — POS-only two-state category mapping (owner-approved), 24 September 2026

#### Owner authorization and constraints

- Owner approved this exact POS-only two-state mapping: unselected = existing
  light/white card surface with artwork and text in the logo teal `#01363e`;
  selected = solid `#01363e` card with the SAME artwork and text recoloured light
  mint. Orange is removed from category styling only. Product plus buttons, Place
  order, other orange controls, the top-bar logo and alignment, the nav, other
  screens and category behaviour are untouched. Artwork shapes and assets are
  preserved; no new or AI-generated artwork.

#### Research gate, 24 September 2026

- Standing authorities reused from POS-BG-02 / BRAND-COLOR-01 (read in full
  there): WCAG 2.2 SC 1.4.3 contrast minimum 4.5:1
  (https://www.w3.org/WAI/WCAG22/understanding/contrast-minimum.html), SC 1.4.11
  non-text contrast 3:1
  (https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html), and SC
  1.4.1 use of colour (state must not rely on hue alone).
- The mint hue is sampled from the approved wordmark asset: the dominant opaque
  colour of `assets/brand/atelika-wordmark-transparent.png` is `#b5efd3`.
- Recolouring keeps the existing CSS `filter` mechanism, so the diff stays in the
  trial alias layer. The two chains were solved numerically (500k random samples
  plus a 7-pass local search over the CSS filter colour matrices) and land on the
  targets within 0.02 RGB (teal) and 0.03 RGB (mint).

#### Exact trial-only values (added to the existing POS brand-trial block)

| Token | Value | Use |
| --- | --- | --- |
| `--olaso-trial-cat-ink` | `#01363e` | selected fill/border, unselected artwork and text |
| `--olaso-trial-cat-ink-selected` | `#b5efd3` | selected artwork and text |
| `--olaso-trial-cat-art` | filter chain -> rgb(1,54,62) | unselected artwork |
| `--olaso-trial-cat-art-selected` | filter chain -> rgb(181,239,211) | selected artwork |

- The old orange `--olaso-trial-art-filter` was deleted; it had no other user.
  `--olaso-trial-action` (`#e06a00`) is retained for the product-card/plus
  outlines and Place order, which the owner excluded.

#### Changes (4 files, no new file)

- `src/globals.css` — replaces the orange category-art filter with the four
  tokens above.
- `src/features/pos/components/CategoryCard/CategoryCard.module.css` — selected
  border/fill and the selected artwork read the teal/mint category tokens; name
  and count read the teal token when unselected and mint when selected; the
  unselected artwork drops `opacity: 0.46` so both states show the exact hue.
- `scripts/check-pos.mjs` — the guard that asserted the old `opacity: 0.46`
  treatment now asserts the two-state category filter tokens.
- `UI_POLISH_LEDGER.md` — this record.

#### Device evidence, 24 September 2026

- `npm run build` and `npm run check:pos` passed; `npm run check:css-scope` still
  reports only the four pre-existing App/Lock keyframe findings.
- `npm run android:beta` passed and `adb install -r` succeeded (`lastUpdateTime`
  2026-09-24 21:10:03, app data preserved).
- Computed styles on the Redmi 22081283G at 1340 x 804 CSS, POS live. Selected
  Coffee: fill `rgb(1,54,62)`, name and badge `rgb(181,239,211)`, artwork filter
  `brightness(0) saturate(1) invert(0.602) sepia(0.034) saturate(19.04)
  hue-rotate(99deg) brightness(1.424) contrast(1.051)` at opacity 1. Unselected
  Matcha & Tea and Cold & Sweet: card `rgb(255,255,255)`, fill token present but
  `scaleX(0)`, name `rgb(1,54,62)`, artwork filter `brightness(0) saturate(1)
  invert(0.399) sepia(0.051) saturate(30.17) hue-rotate(140deg) brightness(0.671)
  contrast(1.435)` at opacity 1. The badge keeps the existing neutral ink
  `rgb(34,42,35)` on white, so it stays readable without a third hue.
- Rendered pixels: selected fill `#01363E`, unselected card `#FFFFFF`, selected
  artwork strokes `#AFEFD4` (mint, anti-aliased), unselected strokes `#023840`
  (teal, anti-aliased). Contrast about 10.2:1 (mint on teal) and 13.2:1 (teal on
  white). Captures `tmp/posbg03/device-categories.png`,
  `tmp/posbg03/crop-categories.png`.

#### Limitations (not acceptance)

- The capture is the Redmi at 1340 x 804 CSS (framebuffer 2000 x 1200), not the
  documentary 1340 x 800 Galaxy Tab A9. Only the default POS state and its two
  visible unselected cards were photographed; warning/empty categories, other
  roles and other screens were not re-photographed.
- The artwork is flattened to a single-hue silhouette in both states, the same
  treatment the earlier orange trial used; the source artwork files are unchanged.
  Anti-aliased edge pixels measure 1-2 RGB units off the token.
- The unselected badge keeps its neutral `#222a23` ink; folding it into the
  two-hue mapping is a two-declaration follow-up if the owner wants it.
- Reaching the capture needed a transient `svc power stayon true` (reverted to
  `false`) and `wm dismiss-keyguard`, because the display slept mid-check. No app
  data, PIN or credential was written anywhere.
- Provisional only: not a palette decision, not propagated, no brand/design
  authority updated.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  files preserved untouched.

#### Exact next action

- Owner reviews the POS-CAT-01 category mapping on the Redmi
  (`tmp/posbg03/device-categories.png`) and accepts it or names changes (the mint
  value, the unselected artwork weight, the badge-ink question). Do not propagate
  it, do not mark it approved or done, and commit/push only after acceptance.

### POS-BG-03 — POS-only white top bar + pale-teal workspace trial (provisional), 24 September 2026

#### Owner authorization and constraints

- The owner supplied an Atelika POS tablet reference (`tmp/atelika-pos-flat-reference.png`,
  1672 x 941, and the 1920 x 1080 variant) and asked for one bounded POS-only trial:
  white top bar, keeping a visible narrow pale-teal workspace strip between the
  header's bottom edge and the Search products field. Preserve the exact current
  cropped Atelika logo, the category cards/artwork, the product cards, the buttons,
  every other screen, the layout geometry, and the broad colour tokens. Reversible,
  smallest diff, one POS trial at a time.
- Reference sampling (System.Drawing pixel read, 24 September 2026): top bar
  `#FFFFFF`; workspace `#E6F9F3`; search field `#FDFDFD`. Only the two background
  values were adopted; the reference's own card/nav treatments were not copied.

#### Research gate, 24 September 2026

- Standing authorities reused from POS-BG-01/02 (read in full there and unchanged
  for a two-value background change): W3C WCAG 2.2 SC 1.4.3 Contrast (Minimum) —
  4.5:1 normal text (https://www.w3.org/TR/wcag/) — SC 1.4.11 Non-text Contrast —
  3:1 (https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html) — and
  Material 3 colour roles, surface vs onSurface
  (https://developer.android.com/develop/ui/compose/designsystems/material3).
- No live fetch of official docs was performed this step; no new guidance applies
  to a two-value background change. Android/Capacitor boundary unchanged: CSS
  values plus the existing scoped aliases in the React layer. No Kotlin, no native
  dependency, no new package.
- Skills re-consulted: better-colors (measure the pair, report value and
  threshold), design-token-audit (keep trial values in the alias layer, edit no
  primitive).

#### Exact trial-only values

| Role | Value | Note |
| --- | --- | --- |
| POS top bar (header band) | #FFFFFF | reference top bar; band height 76px so it stops at the header's bottom edge |
| POS workspace canvas | #E6F9F3 | reference workspace; replaces the POS-BG-02 dark teal #01363E |
| On-canvas ink | #01363E | was #FFFFFF for the dark canvas; the light field needs dark ink |
| Date/time | --olaso-green (#01363E under the brand trial) | white rule removed; 13.17:1 on the white bar |
| Cards, receipt, buttons, selected states, dialogs, status | unchanged | still --olaso-white and the existing accents |

#### Changes (3 files, no new file)

- `src/App.module.css` — the `.shell[data-pos-trial='true']` block now sets
  `--olaso-trial-header: #ffffff`, `--olaso-canvas: #e6f9f3`,
  `--olaso-trial-on-canvas: #01363e`. No primitive token edited.
- `src/globals.css` — the full-viewport correction alias
  `:root:has([data-pos-trial='true'])` now points `--olaso-canvas` at #e6f9f3,
  so html/body/#root paint the same pale teal with no layout change.
- `src/features/pos/components/Header/Header.module.css` — the header band
  `height: 90px` → `76px` (top offset 16 + header height 60), so the white bar
  stops at the header's bottom edge and leaves a 14px pale-teal strip before the
  search field (menu top 90px); the `.header[data-trial='true'] .date` white rule
  was deleted so the date returns to `--olaso-green`. Header x18/y16/w1304/h60 in
  `DESIGN.md` is unchanged; `DESIGN.md`/`BRAND.md`/`untitled.pen` untouched.

#### Verification actually run, 24 September 2026

- `npm run build` passed (theme build, prepare-sqlite-web, `tsc -b`, vite). Only
  the pre-existing crypto externalization warning. Built CSS confirms
  `[data-pos-trial=true]{--olaso-trial-header:#fff;--olaso-canvas:#e6f9f3;--olaso-trial-on-canvas:#01363e}`,
  `:root:has([data-pos-trial=true]){--olaso-canvas:#e6f9f3}` and the band
  `height:76px`.
- Focused 1340 x 800 render: a static harness (own DOM reconstruction, no app
  state) loading the real built CSS and the real logo
  (`tmp/posbg03/trial-harness.html`). Probe read back from the render:
  band `rgb(255,255,255)` h76 y0-76; header-bottom 76; search-top 90;
  strip 14px; canvas `rgb(230,249,243)`; date `rgb(1,54,62)`.
  Capture: `tmp/posbg03/harness-final-1340x800.png`. Headless defaults to a dark
  `prefers-color-scheme`, so Astryx `light-dark()` was forced light to match the
  app's always-light mode.
- Device verification, 24 September 2026 (installed beta, Redmi 22081283G,
  XOPFAQGYNNGYVGPR, framebuffer 2000 x 1200, WebView 1340 x 804 CSS, dpr 1.75):
  `npm run android:beta` passed 140 Gradle tasks and `adb install -r` over the
  existing app succeeded (streamed, data preserved). The owner PIN supplied in
  this task was used transiently as `OLASO_OWNER_PIN` for the documented unlock
  helper; it was neither printed nor written to disk. Unlock reached the live POS.
  Computed styles read back on the device: `--olaso-canvas` #e6f9f3, POS screen
  rgb(230,249,243), header band ::before rgb(255,255,255) height 76px top -16px,
  header rect x18 y16 w1304 h60, date rgb(1,54,62), search top 90, strip 14.00px.
  No overflow: documentElement scrollWidth = clientWidth = 1340, scrollHeight =
  clientHeight = 804, right-most element edge 1340. WebView console empty.
  Capture `tmp/posbg03/device-pos-1340x804.png`, header crop
  `tmp/posbg03/crop-header.png`. Framebuffer pixel scan at x1500: #FFFFFF down to
  y110, transition y113, #E6F9F3 from y115 (bar bottom about y113 physical = 76
  CSS); bottom rows y1195-1199 are #E6F9F3, so no cream strip remains.
- Contrast (computed from the values above): date #01363E on #FFFFFF 13.17:1
  (>= 4.5:1); dark on-canvas ink #01363E on #E6F9F3 12.05:1; but the white bar
  against the #E6F9F3 workspace is only 1.09:1, so the strip reads as a subtle
  tint change, exactly as in the owner's reference. Cards separate from the
 workspace by their existing 2px outline, not by fill.

#### Correction, 24 September 2026 — header row centring and logo/date alignment

- Owner review of the POS-BG-03 device capture: the whole header row sat visibly
  too low in the 76px white bar, and the wordmark needed to move up to sit centred
  with the date. Measured before: the 60px row ran y16-76 (16px of white above,
  0px below), so its centre 46 sat 8px below the bar's centre 38; the wordmark ink
  centroid was 39.99 CSS against the date's 37.74.
- Changes, each scoped to `.header[data-trial='true']` so no other screen moves
  (`src/features/pos/components/Header/Header.module.css`):
  - L123 `.header[data-trial='true'] { top: 8px; }` centres the 60px row in the
    76px bar; the band `::before` top moved -16px -> -8px (L141) so the bar still
    spans y0-76 and the 14px pale-teal strip before the search field is unchanged.
  - L127 `.header[data-trial='true'] .brandSide { gap: 16px; }` — the logo PNG
    carries about 3.4px transparent side padding, so the intended 20px gap read as
    about 23.4px optically; 16px restores about 19.4px, matching the reference's
    gap (about 22% of the logo's ink width).
  - L131 `.header[data-trial='true'] .wordmark img { transform: translateY(-4px); }`
    — the wordmark's ink is bottom-heavy. Three measurements of the same gap
    agreed (x-height centres about 3.3px, the reference's logo-bbox offset about
    4.8px, ink bottoms about 5.4px). A first 5px nudge was trimmed to 4px after the
    owner called it a hair too high.
- Device re-verification after the change (same Redmi 22081283G, 1340 x 804 CSS,
  `npm run android:beta` + `adb install -r`, unlocked with the owner PIN used
  transiently and never stored): row y8-68, centre 38 = bar centre; every row item
  shares centre 38 (wordmark 12-64, date 29-47, nav 15-61, Report 15.57-60.43,
  profile 13-63); band still y0-76; search top 90 so the strip is still 14px; no
  overflow (scrollWidth = clientWidth = 1340, scrollHeight = clientHeight = 804).
  Wordmark ink bbox 22.1-44.9, centroid 35.98; date bbox 32.8-43.6, centroid 37.76
  — x-height centres about 1px apart, i.e. optically centred. Captures
  `tmp/posbg03/device-final-4px.png`, `tmp/posbg03/cmp-before.png`,
  `tmp/posbg03/cmp-final.png`.
- Limitations: only the POS header row changed. The logo nudge is trial-scoped, so
  other screens keep the un-nudged logo. Card, nav, button, category and product
  geometry is untouched, and `npm run check:css-scope` still reports only the same
 four pre-existing App/Lock keyframe findings.

#### Logo asset swap and final alignment, 24 September 2026 (owner-approved)

- Owner approved replacing ONLY the POS top-bar wordmark with
  `assets/brand/atelika-wordmark-dark-teal-transparent.png` (2172 x 724, ink
  #00363D), leaving the mint asset on every other screen and on Lock/startup.
- Change, the smallest asset-reference edit
  (`src/features/pos/components/Header/Header.tsx`): L17 imports
  `atelikaLogoDarkTeal` and L83 renders `src={posTrial ? atelikaLogoDarkTeal :
  atelikaLogo}`. No asset was edited or redrawn; `alt`, the `width`/`height`
  attributes and the mint import are untouched, so Dashboard, Orders, Products,
  Stock, Reports, Lock and startup keep the mint wordmark.
- The approved dark asset renders 96 x 32 (mint: 96 x 30.25) and its ink sits
  lower, which dropped the logo ink centroid from 1.78px to 0.9px above the
  date's. The owner asked for a hair more, so the trial nudge moved from 4px to
  5px (`Header.module.css` L132) and the approved relationship is restored.
- Device evidence (Redmi 22081283G, 1340 x 804 CSS): POS header `img` src
  `/assets/atelika-wordmark-dark-teal-transparent-BoZRLL-m.png`, natural
  2172x724, rect x18-114 y17-49, transform translateY(-5px); trial band still
  rgb(255,255,255) 76px top -8px; canvas rgb(230,249,243). Dashboard header `img`
  src still `/assets/atelika-wordmark-transparent-HliNLugh.png` (1139x359) with no
  data-trial. Pixel scan: logo ink x 19.4-111.2, y 21.4-45.6, centroid 35.95,
  sample #033B41; date ink centroid 37.73 (1.78px apart, matching the approved
  mint state). Captures `tmp/posbg03/device-darklogo-5px.png`,
  `tmp/posbg03/crop-darklogo-final.png`.
- Install note: `adb install -r` first failed with INSTALL_FAILED_USER_RESTRICTED
  and once because the device dropped off USB mid-install; a retry succeeded
  (`lastUpdateTime 2026-09-24 20:50:56`) with app data preserved. Capacitor also
  served a cached `index.html` pointing at the previous bundle, so a CDP
  `Network.clearBrowserCache` + `Page.reload {ignoreCache:true}` step is needed
  before a new asset appears; a plain restart or reload is not enough. No app data
  or PIN was written anywhere.
- Limitation: `scripts/tablet-session.mjs unlock` still expects a native `<select>`
  staff picker, but the Lock screen uses the shared in-app MenuSelect, so the
  documented helper times out. A minimal equivalent (password field + Unlock
   click) was used from `tmp/posbg03/unlock2.mjs`.

#### Owner-directed capsule + category-fill correction, 25 September 2026 (provisional)

An earlier bounded POS visual trial was interrupted mid-flight and its worker was
closed. This entry records what survived that interruption, what the follow-up
pass completed, and what was actually re-verified. No further code change was
justified: the interrupted tree already satisfied the owner's contract.

- Owner contract: on the white header, the `Report` button and the ENTIRE profile
  button become 46px white rounded secondary capsules with one thin teal outline,
  dark-teal text and icons, no orange, and no second ring inside the avatar. The
  selected category fill stays the exact `#01363E` already used by the active
  top-nav pill, Dine In and Cash, and every category foreground colour, asset and
  state rule stays unchanged. Where the mint artwork made the selected card read
  greener, check first for a literal alpha or filter bleed; with none present, buy
  back a little dark-teal space with the smallest size or spacing adjustment.
- Handoff state: subagent `Gibbs` (thread `01a0d4b9-ed35-7d01-be4d-b616b965a356`,
  parent `01a0c880-2569-7990-bd16-78e4e41d92d5`) edited three CSS files at
  13:14:07, rebuilt `dist/` at 13:14:54 and installed a beta at 13:18:13, then
  captured `tmp/posbg03/device-before-hdr-cat.png` (13:12:15) and
  `tmp/posbg03/device-after-hdr-cat.png` (13:20:07). He wrote no ledger entry and
  no completion packet, so this entry is rebuilt from his files, the installed
  build and a read-only device session.
- Changes (3 files, no new file, no new token):
  - `src/features/pos/components/Header/Header.module.css` — the new
    `.header[data-trial='true'] .report` capsule (L152) sets `height: 46px`,
    `border: 1px solid var(--olaso-trial-select, var(--olaso-green))` and
    `color: var(--olaso-green)`; the row-centring (L124), logo gap (L128) and
    wordmark nudge (L132) rules remain the 24 September corrections.
  - `src/features/pos/components/ProfileControl/ProfileControl.module.css` — L169
    `[data-trial='true'] .profile` matches Report, L176 `[data-trial='true']
    .avatar` sets `border: 0` so only the capsule outline remains, and L181
    repaints the role line.
  - `src/features/pos/components/CategoryCard/CategoryCard.module.css` — the trial
    added `transform: scale(0.86)` on `.active .illustration` as its only category
    change. **The owner rejected it on 25 September and that declaration is
    reverted** (see the rejection entry below). Fill, border, text and badge still
    read the POS-CAT-01 tokens. `opacity` stays 1, `mix-blend-mode` stays `normal`
    and the recolour filter is unchanged, so there is no literal alpha or filter
    bleed to strip.
- Research gate, 25 September 2026: the authorities already read in POS-BG-01/02/03
  and POS-CAT-01 (WCAG AA, the Android/Capacitor boundary, the built Olaso theme)
  are reused and no token is added, so no new palette decision is implied. Dark
  teal `#01363E` on white is about 13:1, so both the ink and the 1px outline clear
  the 4.5:1 text and 3:1 non-text thresholds; the capsule and the bar are both
  `#FFFFFF`, so the capsule edge rests on that outline alone, as requested.
  `npm run check:css-scope` reports only the four pre-existing `App`/`Lock`
  keyframe findings: the new selectors are led by an attribute, not an element or
  a bare untargeted tag, and each still requires the hashed class.
- Verification actually run, 25 September 2026 (read-only, installed beta):
  - Device Redmi 22081283G (`XOPFAQGYNNGYVGPR`), framebuffer 2000 x 1200, WebView
    1340 x 804 CSS, dpr 1.75. The app was already unlocked on POS, so the owner
    PIN was never read, printed or stored, and the single Espresso draft cart was
    left as found with no order submitted and no data reset.
  - Header `data-trial='true'`; header rect x18 y8 w1304 h60; band `::before`
    `rgb(255,255,255)` top -8px left -18px 1340 x 76.
  - Report rect x1020 y15 w112 h46, `background rgb(255,255,255)`, ink and 1px
    border `rgb(1,54,62)`, radius 23px, icon `rgb(1,54,62)`, no orange, no shadow.
  - Profile rect x1144 y15 w178 h46, `background rgb(255,255,255)`, ink and 1px
    border `rgb(1,54,62)`, radius 25px, name and role `rgb(1,54,62)`, avatar 36px
    with `border-width 0px` — one ring around the capsule, none around the disc.
  - Selected Coffee card rect x18 y148 w234 h120 with border `rgb(1,54,62)`; its
    `.fill` is `rgb(1,54,62)` at `opacity 1` with no filter and `mix-blend-mode`
    `normal`, i.e. the exact fill. While the shrink was installed the artwork
    measured `matrix(0.86,0,0,0.86,0,0)` at x123.09 y160.41 w118.68 h96.32; it is
    reverted now, so the entry below reads the restored full size.
  - Colour invariant: seven elements compute `rgb(1,54,62)` — the active top-nav
    pill indicator (x465.4 y15.6), the selected category fill (x18.6 y148.6),
    three zero-width deselected category fills, the Dine In indicator (x1014.6
    y152.6) and the Cash indicator (x1014.6 y210.6). The selected fill therefore
    equals the nav, Dine In and Cash fills literally.
  - Framebuffer means over the same card rectangle in both captures
    (`tmp/posbg03/mean-color.ps1`): before `rgb(29.2,82.8,85.7)` with 76.6% of
    pixels exactly `#01363E`; after `rgb(23.8,77.1,81.1)` with 80.5% exact; the
    pure-teal Dine In reference `rgb(22.2,70.8,78.1)` with 90% exact. Scaling the
    artwork halved the mean-green gap to that reference (12.0 -> 6.3); the
    remainder is the frozen mint `Coffee`/`9 items` text and `Available` badge.
    That shrink is now reverted, so the gap is back to 12.0 (see the rejection
    entry below).
  - A fresh capture taken during this verification
    (`tmp/posbg03/device-verified-25sep.png`, 2000 x 1200) reproduces the
    shrunk-state mean and exact count, so the installed build at that time was the
    one measured, not only the inherited 13:20 capture.
  - No clipping or overflow: `documentElement.scrollWidth = clientWidth = 1340`
    and `scrollHeight = clientHeight = 804`, and no element's rect leaves the
    1340 x 804 viewport. WebView console held no error or warning entries.
  - Build: `npm run build` exited 0 and the built CSS carries the trial
    (`data-trial` appears 8 times, `scale(.86)` present). `npm run check:pos`
    passed. `graphify-out/graph.json` is present but stale (last written 21
    September 2026); this pass changed CSS values only, so it was not regenerated.
  - Route metadata, app-written rather than self-reported: thread
    `01a0d4b9-ed35-7d01-be4d-b616b965a356` records `thread_source: subagent` and
    `agent_nickname: Gibbs`; its last `turn_context` (`turn_id
    01a0d8be-32ff-7dc2-907d-a2d6a953b4b8`, `current_date 2026-09-25`) resolves
    `model: command-code/deepseek-deepseek-v4.1-flash`, and the OpenCodex catalog
    entry for that slug declares `context_window` and `max_context_window`
    1000000, `auto_compact_token_limit` 900000, and provenance provider
    `command-code`, model_id `deepseek/deepseek-v4.1-flash`.
  - Dev-only checks added: `tmp/posbg03/verify-trial-pos.mjs` (reads the computed
    capsule and teal invariants over the WebView CDP bridge) and
    `tmp/posbg03/mean-color.ps1` (framebuffer region mean and exact-count).
- Limitations:
  - Device coverage is the Redmi 22081283G at 1340 x 804 CSS, dpr 1.75, not the
    documentary 1340 x 800 Galaxy Tab A9.
  - The capsule fills are `#FFFFFF` on a `#FFFFFF` bar (1:1), so the capsule shape
    rests on a single thin teal line; at dpr 1.75 the WebView reports that 1px
    border as 0.571px, i.e. one device pixel. That is the requested thin outline,
    and it is the only thing separating the capsule from the bar.
  - The selected card reads greener than the pure-teal Dine In reference and than
    the nav / Dine In / Cash fills (`rgb(29.2,82.8,85.7)` against
    `rgb(22.2,70.8,78.1)`). The artwork shrink meant to close it was rejected by the
    owner, so this perception is open, not resolved; the artwork is fully opaque and
    the rest of the difference is the frozen mint text and badge.
  - Cross-screen scoping is by construction (`data-pos-trial`/`data-trial` are set
    only while POS is active and every trial variable falls back to its existing
    token); no second screen was re-photographed. The `warning` badge, dialogs and
    the empty/loading/error states were not re-photographed.
  - Reported without the interrupted worker's own evidence packet; only his three
    CSS edits, the installed build and the two captures were inherited.
  - Provisional only: not a palette decision, not propagated, no brand or design
    authority updated.

#### Owner rejection, 25 September 2026 — the selected-category artwork shrink is reverted

The owner rejected the 25 September attempt to shrink the selected category
artwork. Exactly one declaration was reverted; nothing else in the POS trial moved.

- Reverted: `transform: scale(0.86)` on `.active .illustration` in
  `src/features/pos/components/CategoryCard/CategoryCard.module.css` is deleted, so
  the artwork returns to its previous full trial size (`right: 0; width: 138px`).
  The comment that described the shrink as owner-approved now records the
  rejection and that the greener reading is left open.
- Preserved and re-read on the device after the reverting build: `Report` 112 x 46
  and the profile 178 x 46, both white with one thin `rgb(1,54,62)` outline and
  dark-teal ink; the avatar still has `border-width 0px`; the selected category
  `.fill` is still exactly `rgb(1,54,62)` at `opacity 1`; the artwork transform
  computes `none` at 138 x 112; no overflow (`scrollWidth = clientWidth = 1340`,
  `scrollHeight = clientHeight = 804`) and no console errors or warnings.
- Checks: `npm run build` exited 0, `npm run check:pos` passed, and
  `npm run check:css-scope` still reports only the four pre-existing `App`/`Lock`
  keyframe findings. The built CSS no longer contains `scale(.86)` and still
  contains the trial rules.
- Device: Redmi 22081283G, 1340 x 804 CSS, dpr 1.75. The beta rebuilt after
  `JAVA_HOME` was pointed at `tmp/android-toolchain/jdk/jdk-21.0.11+10` (the first
  attempt failed with `JAVA_HOME is not set` and no `java` on `PATH`), then
  `adb install -r` over the existing app preserved its data
  (`lastUpdateTime 2026-09-25 14:19:45`).
- Framebuffer mean over the same card rectangle is back to `rgb(29.2,82.8,85.7)`
  with 76.6% of pixels exactly `#01363E`, identical to the pre-trial capture,
  against the pure-teal Dine In reference `rgb(22.2,70.8,78.1)`. The greenish
  reading of the selected card is therefore unchanged and remains open for the
  owner; no 3D, shadow, colour or geometry change was made while discussing it.
- Side effect, disclosed: the required reinstall restarts the app, which drops the
  App-owned in-memory draft cart (process-death recovery is not implemented), so
  one Espresso was re-added through the existing Customize order step with the
  optional extra left unchecked, restoring the same `Espresso 10,00 MAD`,
  `Regular · 10,00 MAD x 1` draft line and a `10,00 MAD` total. No order was
  submitted, no data was reset, and the owner PIN was passed only through the
  transient `OLASO_OWNER_PIN` variable, never printed or written.
- Capture `tmp/posbg03/device-revert-25sep.png`. Dev-only helpers added:
  `tmp/posbg03/probe-state.mjs` and `tmp/posbg03/add-espresso.mjs`.
- Limitation: the rebuild-and-reinstall loop cannot preserve the in-memory cart, so
  a future device reverification should expect to re-create it.

#### Owner-rejected orange time / nav-label accent, 25 September 2026 — applied then fully reverted

The owner asked for a bounded POS-only orange-accent preview: the clock half of
the header date-time line, and the label of the selected top-navigation item
only. It was applied, deployed to the Redmi, then rejected on sight ('I dont like
the orange time and text of topbar') and reverted in the same session. No palette
decision; nothing propagated.

| Token | Value | Role in the preview |
| --- | --- | --- |
| `--olaso-trial-accent-on-light` | `#a84e00` | clock/time on the white header band |
| `--olaso-trial-accent-on-dark` | `#fc7500` | selected nav label on the `#01363e` pill |

- Measured, not estimated. Both tones are one brand orange hue (27.9 degrees) at
  two lightnesses, because no single orange clears 4.5:1 on both surfaces. The
  logo orange `#fc7500`, sampled from the Atelika wordmark's dot
  (`assets/brand/atelika-wordmark-transparent.png`, dominant orange pixel
  rgb(252,117,0)), is 2.73:1 on white but 4.81:1 on `#01363e`; its darker sibling
  `#a84e00` is 5.59:1 on white but 2.35:1 on the pill. The existing
  `--olaso-trial-action` `#e06a00` fails both (3.37:1 / 3.90:1) and was not reused.
  APCA for the record: `#a84e00` on white Lc 80, `#fc7500` on the pill Lc -47
  (below APCA's recommended 60 for labels even though it clears WCAG 2.2 AA).
- The three edits were `src/globals.css` (the two tokens), `Header.module.css`
  (`[data-trial='true'] .clock`) and `TopNavigation.module.css` (`.active span`).
  The time and the nav label were already in their own elements, so no markup
  changed. All three are deleted; the files are back to their pre-trial line
  counts (155 / 156 / 74) and the rebuilt CSS hash `index-CyJztXJG.css` matches the
  pre-trial build.
- Device re-verified after redeploy (Redmi 22081283G, 1340 x 804 CSS, dpr 1.75,
  `lastUpdateTime` 2026-09-25 14:57:47, app data preserved): clock `rgb(1,54,62)`,
  date `rgb(1,54,62)`, selected label and its icon `rgb(255,255,255)`, pill
  `rgb(1,54,62)`, inactive labels `rgb(40,48,41)`, no overflow
  (`scrollWidth = clientWidth = 1340`, `scrollHeight = clientHeight = 804`) and an
  empty console. `npm run build` and `npm run check:pos` passed; capture
  `tmp/orange-trial/device-orange-reverted.png`.
- Notes for any future attempt: `better-colors` requires fixing contrast by
  lightness rather than hue, which this preview did, but orange already encodes
  the POS action accent (`--olaso-trial-action`) and orange text on a neutral
  surface reads as a link, so reusing orange for a non-interactive clock and a
  selected label carries two semantic risks the final palette must resolve.
- Limitation: the preview was rejected on appearance, not on a measured failure,
  so no alternative orange was explored and only the two values above were ever
  seen on the device. Each reinstall dropped the App-owned in-memory draft cart
  (no process-death recovery), so one Espresso was re-added each time; no order
  was submitted and no data was cleared.


#### Limitations (not acceptance)

- Device coverage is the Redmi 22081283G at 1340 x 804 CSS, not the documentary
  1340 x 800 Galaxy Tab A9. The built-in unlock helper's wait outlived its own
  timeout, so the capture was driven with short direct CDP probes in
  `tmp/posbg03/`; the app itself unlocked with the owner PIN and reached POS
  normally. Only the default POS state was captured; dialogs, empty/loading/error
  states, other roles and other screens were not re-photographed.
- The 1340 x 800 harness capture is supplementary and covers only the
  header/search region; the device capture above is the primary evidence.
- On the white bar the `Report` button and the profile control were left at their
  source `background: var(--olaso-white)` and `border: 0` in this pass; the owner
  has since directed the capsule outlines, so see the 25 September entry above.
- Cross-screen scoping is by construction (`data-pos-trial` is only set while POS
  is the active screen); no second screen was re-photographed.
- Provisional only: not a palette decision, not propagated, no brand/design
  authority updated.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  files and untracked asset folders are preserved untouched.

#### Exact next action

- Owner reviews the reverted POS on the Redmi
  (`tmp/posbg03/device-revert-25sep.png`): the white top bar and 14px pale-teal
  strip, the 46px white Report/profile capsules with one thin teal outline and no
  avatar ring, the exact `#01363E` selected fill, and the full-size selected
  category artwork restored. The remaining open question is the greener reading of
  the selected card. Do not propagate it, do not mark it approved or done, and
  commit/push only after acceptance. Supersedes the POS-BG-02 'Exact next action'
  as the current POS trial.

### TOPBAR-01 — the shared top bar on every screen that shows it (provisional), 25 September 2026

#### Owner authorization and constraints

- The owner asked that the current POS top bar become the *same persistent* top
  bar on every screen that shows it — Dashboard, POS, Orders, Products, Stock,
  Reports — reusing the existing single `Header` mounted once in `App.tsx`, not a
  new or recreated component.
- Settings is explicitly excluded: its visual behaviour must stay exactly as
  before, even though the code mounts the Header there with no active nav item.
  Lock and the startup/locked states never mount this shell and are unaffected.
- Forbidden by the owner: promoting `--olaso-green` or `--olaso-canvas` globally;
  any POS body change (canvas `#f0f7f3`, category artwork and colours, product and
  orange action tokens); any change to screen content offset or geometry;
  recreating the header; and the orange time/nav accent rejected earlier the same
  day.

#### Research gate, 25 September 2026

- Standing authorities reused (read in full for POS-BG-02 / BRAND-COLOR-01):
  `better-colors` and `better-accessibility`, and WCAG 2.2 SC 1.4.3. `better-colors`
  requires fixing contrast by lightness rather than hue and reusing the project's
  own notation; this change moves existing token *values* and invents no colour.
- New sources checked 25 September 2026: MDN *Using CSS custom properties* and
  *CSS custom properties inheritance* (developer.mozilla.org), which confirm that a
  custom property declared on an element is inherited by that element's
  descendants. That is exactly the mechanism used here: the bar declares its own
  palette on the header element, so the bar subtree (nav, profile control, profile
  menu) resolves the same values on every screen while the app-wide tokens stay
  untouched.
- Simplest justified choice: widen the existing bar flag's *value* to the six
  screens and pin the bar's palette on the header element. No new component, no
  new attribute, no markup change, no new colour.

#### Exact values (pinned on `.header[data-trial='true']` in `Header.module.css`)

| Property | Value | Matches the POS trial value? |
| --- | --- | --- |
| `--olaso-trial-header` | `#ffffff` | yes, `.shell[data-pos-trial='true']` |
| `--olaso-trial-on-canvas` | `#01363e` | yes, same block |
| `--olaso-trial-select` | `#01363e` | yes, `:root:has([data-pos-brand-trial='true'])` |
| `--olaso-trial-nav-radius` | `20px` | yes, same block |
| `--olaso-trial-nav-frame-width` | `1px` | yes, same block |
| `--olaso-green` | `#01363e` | yes, same block, now bar-local only |

#### Changes (2 files, no new file)

- `src/App.tsx` — adds `const topBarTrial = activeScreen !== 'Settings';` (the
  `AppScreen` union is `NavigationPage | 'Settings'`, so this is exactly the six)
  and passes `posTrial={topBarTrial}`. `data-pos-trial` and `data-pos-brand-trial`
  still follow `activeScreen === 'POS'`, so every POS body token and the POS canvas
  are unchanged.
- `src/features/pos/components/Header/Header.module.css` — the six values above
  join `top: 8px` inside the existing `.header[data-trial='true']` block. No other
  file changed: `TopNavigation.module.css`, `ProfileControl.module.css`,
  `App.module.css` and `globals.css` are untouched, and the bar's existing
  `[data-trial='true']` rules for the band, capsules and avatar do the rest.

#### Device evidence, 25 September 2026 (Redmi 22081283G, 1340 x 804 CSS, dpr 1.75,
`adb install -r` at 15:28:32 with app data preserved)

| Screen | `data-trial` | white band | row | active pill | Report | profile / avatar | body canvas | top content |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | true | `rgb(255,255,255)` | y8-68 | `rgb(1,54,62)` r20 | 1020/15 112x46, 0.571px `rgb(1,54,62)` | 1144/15 178x46, avatar border 0px | `rgb(248,247,234)` | 92 |
| POS | true | same | y8-68 | same | same | same | `rgb(240,247,243)` | 90 |
| Orders | true | same | y8-68 | same | same | same | `rgb(248,247,234)` | 92 |
| Products | true | same | y8-68 | same | same | same | `rgb(248,247,234)` | 92 (sidebar at y169) |
| Stock | true | same | y8-68 | same | same | same | `rgb(248,247,234)` | 92 |
| Reports | true | same | y8-68 | same | same | same | `rgb(248,247,234)` | 92 |
| Settings | absent | none | y16-76 | `rgb(0,106,43)` r23 | 1020/23 112x46, border 0px | 1144/21 178x50, avatar 1.71429px `rgb(0,106,43)` | `rgb(248,247,234)` | 92 |

- On all six bar screens the active nav label and its icon are `rgb(255,255,255)`,
  inactive labels `rgb(40,48,41)`, and the date and time `rgb(1,54,62)`; the nav
  frame is 0.571px `rgb(1,54,62)`. POS is pixel-identical to its pre-change state
  (Report 1020/15 112x46, profile 1144/15 178x46, pill `rgb(1,54,62)` r20, canvas
  `rgb(240,247,243)`, top content 90).
- No overlap: `minContentTop` is 90-92 on every screen against a band bottom of
  76. Products' `top: 76px` belongs to `CategorySidebar` *inside*
  `ProductCatalogPanel` (panel top 92), so its absolute rect is [43, 169, 170,
  584]; nothing on Products enters y0-76.
- No overflow and no console output: `documentElement.scrollWidth x scrollHeight`
  was 1340 x 804 and the WebView console held no errors or warnings on all seven
  screens.
- Checks: `npm run build` 0, `npm run check:pos` 0, `npm run check:navigation` 0,
  `npm run check:css-scope` still reports only the four pre-existing App/Lock
  keyframe findings, and `graphify update .` rebuilt the graph (3107 nodes, 6412
  edges).
- Captures `tmp/topbar-trial/device-dashboard.png`, `device-pos.png` and
  `device-settings-excluded.png`.

#### Limitations (not acceptance)

- Provisional; no design, brand or architecture authority was updated.
  Settings keeps the pre-change bar deliberately, which still shows the green
  avatar ring, the green pill and the 50px profile capsule.
- Naming debt: `posTrial`, `data-trial` and `data-pos-trial` now mean "bar
  presentation" rather than "POS". Renaming was deliberately skipped to keep the
  diff minimal.
- Not re-photographed or re-measured: dialogs, empty/loading/error states, the
  profile menu, the cashier role (which shows no Report button), and the
  transition between a bar screen and Settings.
- One probe read caught a mid-transition state (innerWidth/innerHeight 0 with every
  rect offset by one viewport); the settled re-read reports 1340 x 804 with scroll
  0, so that is a measurement artefact and not layout overflow.
- The rebuild-and-reinstall restarts the app and drops the in-memory draft cart, so
  one Espresso was re-added afterwards (`Regular · 10,00 MAD x 1`, total 10,00
  MAD). No order was submitted and no data was cleared.
- The header is still a single instance, so it never remounts; only its attributes
  change when moving between a bar screen and Settings.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  files and untracked folders are preserved untouched.

#### Exact next action

- Owner reviews the six-screen top bar on the Redmi
  (`tmp/topbar-trial/device-dashboard.png`, `device-pos.png`) together with the
  excluded Settings (`tmp/topbar-trial/device-settings-excluded.png`). Accept it or
  name further changes, including the Settings decision if the owner wants it
  outside this scope permanently. Do not mark it approved or done, and commit/push
  only after acceptance. Supersedes the POS-BG-03 'Exact next action'.

### DASH-PALETTE-01 — owner-directed Dashboard-only palette trial (provisional), 25 September 2026

#### Owner authorization and constraints

- The owner asked for the first Dashboard-only palette trial, bounded by seven rules:
  (1) canvas cream `#F8F7EA` becomes the POS pale mint-grey `#F0F7F3`, including the
  full-viewport bottom strip; (2) white cards/surfaces and all geometry, spacing,
  typography, borders and shadows stay as they are, with no POS-style heavy outlines
  and no 3D; (3) nonsemantic green used for links, icons, highlights and accents
  becomes the accepted dark teal `#01363E` through role-scoped aliases; (4) chart and
  data visuals get a coherent teal tonal scale anchored by `#01363E`, preserving
  comparisons, emphasis and readable labels and not collapsing to one flat colour;
  (5) semantic success/positive, warning amber and danger red keep their meaning;
  (6) the inset informative pale tint (Today's best seller) may use a light
  teal/mint neutral already in the POS system, keeping the white-card hierarchy;
  (7) no orange, because Dashboard has no owner-approved primary action.
- Explicitly excluded: the shared top bar (`TOPBAR-01`, the accepted visual
  reference, not restyled or recreated), the POS body and every other screen body,
  Settings and Lock, and unrelated dirty work.
- Ambiguous green uses must be listed and preserved rather than guessed. The owner
  additionally authorised minimally darkening a chart step that cannot reach 3:1 on
  its adjacent white surface, while keeping monotonic light-to-dark order and
  distinctness, and keeping labels/tooltips as redundant cues.
- Dashboard's 21 sequential skill passes restart only after palette acceptance; this
  card does not start them.

#### Research gate, 25 September 2026

- `better-colors` and `better-accessibility` (read in full for earlier POS cards) plus
  `better-colors/contrast.md` were reused. `better-colors` requires measuring a
  foreground against the surface it actually renders on, never reporting an unmeasured
  ratio, and fixing contrast by changing lightness rather than hue.
- Official guidance checked 25 September 2026:
  [WCAG 2.2 SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html)
  requires the chart objects needed to understand the data to reach 3:1 against their
  adjacent colour (for a bar, the plot background; for touching segments, the
  boundary between them), warns that anti-aliasing lowers a thin mark's apparent
  contrast, and says not to round up below 3:1;
  [G209](https://www.w3.org/WAI/WCAG22/Techniques/general/G209) covers contrast at the
  boundary between adjoining colours; [G207](https://www.w3.org/WAI/WCAG21/Techniques/general/G207)
  covers 3:1 for meaningful icons; [WCAG 2.2](https://www.w3.org/TR/wcag/) remains the
  gate for text contrast. [Carbon's colour-token guidance](https://carbondesignsystem.com/elements/color/tokens/)
  and [Atlassian's colour accents](https://atlassian.design/foundations/color/accents)
  keep brand, accent, semantic/status and neutral families separate, note that accents
  must be exchangeable without changing meaning while semantic colours carry meaning,
  and recommend purpose-based, property-specific roles — which is why rule (5) is
  implemented by retinting only the nonsemantic accent and leaving `--olaso-success`,
  `--olaso-gold*` and `--olaso-danger*` untouched.
- Alternatives considered for the chart ramp: (a) hue-rotate the existing green ladder
  and keep every step's lightness; (b) hue-rotate, then darken only the steps that miss
  3:1; (c) leave the ladder green. (a) was rejected because it inherits six failing
  steps and a non-monotonic ladder; (c) contradicts rules (3) and (4). (b) was chosen.
- Simplest justified choice for the whole trial: keep every existing `--olaso-*` role
  token, add Dashboard-scoped role aliases on the Dashboard screen root, and swap only
  the declarations whose role is nonsemantic. No new dependency, no new component, no
  markup change, no geometry change.

#### Measured pairs, 25 September 2026 (computed from the declared values; rendered
read-back follows in the device evidence)

Baseline — the existing green chart steps against the white plot surface `#ffffff`
(this is measured first, as the owner asked):

| Step | Hex | Contrast vs white | 3:1 |
| --- | --- | --- | --- |
| chart-1 | `#c9ddcc` | 1.43:1 | FAIL |
| chart-2 | `#b9d4be` | 1.59:1 | FAIL |
| chart-3 | `#a8c9af` | 1.80:1 | FAIL |
| chart-4 | `#93bb9c` | 2.14:1 | FAIL |
| chart-5 | `#79a985` | 2.68:1 | FAIL |
| chart-6 | `#8db997` | 2.21:1 | FAIL (also lighter than chart-5: the old ladder is not monotonic) |
| chart-7 | `#6d9f79` | 3.05:1 | pass |
| chart-8 | `#4d875d` | 4.25:1 | pass |
| chart-9 | `#2c7749` | 5.47:1 | pass |
| tone10 | `#006a2b` | 6.78:1 | pass |

So six of the ten existing steps already miss 3:1 on white. A pure hue swap would
inherit that, which is why the owner authorised minimal darkening.

Chosen teal ladder — hue locked at 187.9 degrees (the `#01363e` hue), steps even in
WCAG relative luminance from the light end up to the fixed anchor:

| Step | Hex | Hue | Contrast vs white | 3:1 |
| --- | --- | --- | --- | --- |
| chart-1 | `#409caa` | 187.9 | 3.20:1 | pass |
| chart-2 | `#3695a4` | 188.2 | 3.50:1 | pass |
| chart-3 | `#2c8e9d` | 188.0 | 3.84:1 | pass |
| chart-4 | `#238695` | 187.9 | 4.27:1 | pass |
| chart-5 | `#1b7d8c` | 188.0 | 4.82:1 | pass |
| chart-6 | `#147382` | 188.2 | 5.52:1 | pass |
| chart-7 | `#0d6876` | 188.0 | 6.44:1 | pass |
| chart-8 | `#085b67` | 187.6 | 7.77:1 | pass |
| chart-9 | `#044b56` | 188.0 | 9.79:1 | pass |
| tone10 | `#01363e` | 187.9 | 13.14:1 | pass (fixed anchor) |

Contrast rises strictly from chart-1 to tone10, so luminance falls strictly and the
light-to-dark order is monotonic and distinct at every step; the light end sits
3.20:1 rather than exactly 3.0:1 to leave a small margin above the anti-aliasing
caution in SC 1.4.11 while staying minimal.

Other pairs measured for this trial:

| Pair | Contrast | Threshold | Result |
| --- | --- | --- | --- |
| accent `#01363e` on white card | 13.14:1 | 4.5:1 text | pass |
| accent `#01363e` on accent-icon `#e4ecec` | 10.95:1 | 3:1 icon | pass |
| accent `#01363e` on accent-soft `#e9eff0` | 11.30:1 | 4.5:1 text | pass |
| preserved status green `#006a2b` on `#e8f3e6` | 5.94:1 | 4.5:1 text | pass |
| preserved amber `#886923` on `#f4f0e5` | 4.51:1 | 4.5:1 text | pass |
| preserved danger `#b63e3a` on `#fff0ee` | 5.07:1 | 4.5:1 text | pass |
| axis label `#6d776f` on white card | 4.65:1 | 4.5:1 text | pass |
| secondary copy `#667068` on white card | 5.14:1 | 4.5:1 text | pass |
| saved-status dot `#37a563` on `#edf5eb` | 2.80:1 | 3:1 graphical | below 3:1, preserved and listed: the dot is decorative and the chip's text label "Saved · <date>" carries the meaning, so colour is not the sole cue |
| canvas `#f0f7f3` against the white card | 1.09:1 | n/a | tint boundary only, matching the accepted POS workspace; not a control edge |

#### Constrained chart-ramp decision (recorded before implementation)

- Keep ten tones so the intensity encoding is unchanged, keep `tone = ceil(intensity *
  10)` in `SalesPulse.tsx` untouched, and keep every label, tooltip and accessible name
  as the redundant cues.
- Rebuild only the ten colour values, Dashboard-scoped, exactly as measured above.


#### Changes (6 files, no new file)

- `src/App.tsx` — adds `const dashboardPaletteTrial = activeScreen === 'Dashboard';`
  and `data-dashboard-trial={dashboardPaletteTrial ? 'true' : undefined}` on the
  shell, mirroring the POS trial attribute. Nothing else in App changed.
- `src/globals.css` — adds `:root:has([data-dashboard-trial='true']) {
  --olaso-canvas: #f0f7f3; }` so the full-viewport strip below the 800px shell
  follows the Dashboard, exactly as the POS hook does for POS.
- `src/features/dashboard/DashboardScreen.module.css` — the role-scoped alias block
  on `.screen`: `--olaso-canvas`, `--olaso-green`, `--olaso-copy-green`,
  `--olaso-green-row`, the nine teal chart steps, `--dashboard-tint`, and the two
  preserved status aliases. `--olaso-success`, `--olaso-gold*`, `--olaso-danger*`,
  `--olaso-text`, `--olaso-copy`, `--olaso-axis`, `--olaso-line*`,
  `--olaso-panel-border` and `--olaso-neutral-icon` are deliberately not re-pointed.
- `SalesPulse.module.css` — three declarations: `.metricIcon` background and `.tip`
  background use `--dashboard-tint`, `.tip` text uses the accent, and `.change` keeps
  its green through the preserved `--dashboard-status-green` / `--dashboard-status-soft`
  with a comment recording why.
- `RecentOrdersPanel.module.css` — one declaration: `.iconActive` background uses
  `--dashboard-tint`; its colour already follows the accent.
- `StockAttentionPanel.module.css` — unchanged. Its `View all` label, chevron and
  focus ring already read `var(--olaso-green)`, which the Dashboard root now
  re-points, so no edit was needed.
- `UI_POLISH_LEDGER.md` — this record.

#### Device evidence, 25 September 2026 (Redmi 22081283G, 1340 x 804 CSS, dpr 1.75,
`adb install -r` at 16:11:54 with app data preserved)

- Canvas `rgb(240,247,243)` on the Dashboard; still `rgb(248,247,234)` on Orders and
  Settings, and `rgb(240,247,243)` on POS (its own trial) — every other screen body
  is untouched.
- Geometry unchanged: Dashboard `main` [0,0,1340,800]; panels [18,92,886,686],
  [922,92,400,334], [922,444,400,334]; all three panel backgrounds
  `rgb(255,255,255)`. No overflow: `documentElement` 1340 x 804 on every screen
  checked, and the WebView console held no errors or warnings.
- The nonsemantic accent now renders `rgb(1,54,62)` on: both `View all` labels and
  their chevrons, the pulse mark beside "Today's pulse", the NET SALES eyebrow, the
  4px accent bar, the Peak bolt and its label, all three KPI icon discs
  (`rgb(1,54,62)` on `rgb(233,239,240)`, 11.30:1), the best-seller star and its
  eyebrow, the active recent-order icon disc, and the chart tooltip
  (`1.958,00 MAD` at 11.30:1).
- Chart: ten tones render as measured — tone1 `rgb(64,156,170)` 3.20:1, tone5
  `rgb(27,125,140)` 4.82:1, tone6 `rgb(20,115,130)`, tone7 `rgb(13,104,118)`, tone8
  `rgb(8,91,103)` 7.77:1, tone10 `rgb(1,54,62)` 13.14:1, all against the white plot.
  Bar height rises with tone (tone1 h0-2 through tone10 h157-168), so taller still
  reads darker; the scale is monotonic and every step is distinct. Axis labels stay
  `rgb(109,119,111)` (4.65:1 on the white card).
- Preserved semantics, measured on device: "Saved · 25 Sept" chip `rgb(46,107,67)`
  on `rgb(237,245,235)` (5.72:1) with its `rgb(55,165,99)` dot; both Low badges
  `rgb(136,105,35)` on `rgb(244,240,229)` (4.51:1); neutral recent-order icons
  `rgb(86,96,87)` on `rgb(241,243,239)` (5.87:1). No red state occurs in current data.
- Captures `tmp/dashboard-palette/device-dashboard-default.png` and
  `tmp/dashboard-palette/device-dashboard-tooltip.png`.

#### Limitations (not acceptance)

- Provisional; no design, brand or architecture authority was updated, and the POS
  findings stay open.
- The comparison chip currently renders its neutral `unavailable` variant
  (`rgb(102,112,104)` on `rgb(250,250,247)`, 4.92:1) because there is no yesterday
  total to compare against, so the preserved green is verified in the shipped CSS and
  in the computed aliases rather than visually on device. Its focus ring follows the
  accent while its fill stays green: a deliberate split recorded for the owner.
- `.peakAxis { color: var(--olaso-green) }` in `SalesPulse.module.css` is inert —
  `.axis span` has higher specificity — so the peak day's axis label has always
  rendered in the grey axis colour. It was left as found; the peak is still marked by
  the bolt icon and its label. Removing it is a separate cleanup.
- Low-value days now render darker than before because the light end was raised to
  clear 3:1. That is the owner-authorised minimal darkening, not a regression.
- Not re-photographed or re-measured: dialogs, empty/loading/error states, the
  cashier role, French copy, and the chart with a red decline.
- **External change discovered mid-trial and repaired:**
  `assets/brand/atelika-wordmark-transparent.png` had disappeared from the tree,
  breaking `npm run build` for `App.tsx`, `AppDataProvider.tsx`, `Header.tsx` and
  `LockScreen.tsx`. It was restored byte-for-byte (SHA-256 match, valid PNG, 1139 x
  359 as previously recorded) from Vite's copy of that same asset in
  `dist/assets/atelika-wordmark-transparent-HliNLugh.png`. No design changed. Also
  missing: `assets/brand/atelika-wordmark-transparent-new-uncropped.png`, referenced
  by no code, so nothing was done. The two `olaso-*` brand deletions predate this work.
- The rebuild-and-reinstall restarts the app and drops the in-memory draft cart, so
  one Espresso was re-added afterwards (`Regular · 10,00 MAD x 1`, total 10,00 MAD).
  No order was submitted and no data was cleared.
- The shared top bar is unchanged by this card and POS/Orders/Settings still show
  their previous bar states.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  work and untracked folders are preserved untouched.

#### Exact next action

- Owner reviews the Dashboard palette on the Redmi
  (`tmp/dashboard-palette/device-dashboard-default.png`,
  `device-dashboard-tooltip.png`) and accepts it or names changes, including the
  preserved-green comparison chip and the amber/danger statuses. On acceptance,
  restart the Dashboard sequential 21 skill passes in the ledger's numbered order,
  one screen at a time, and leave Settings last. Do not mark it approved or done, and
  commit/push only after acceptance. Supersedes the TOPBAR-01 'Exact next action'.

### NAV-PALETTE-01 — each screen owns its palette for its whole visible lifetime (root-cause fix), 25 September 2026

#### Owner authorization and constraints

- Fix the proven navigation palette flash. Keep the existing 150 ms crossfade; do
  not hide, shorten or delay the animation.
- Invariant: every mounted screen owns its own palette for its entire visible
  lifetime (live, and leaving during the fade), so POS never reverts teal/mint to
  legacy green/cream while exiting and the incoming screen never borrows the
  outgoing screen's palette.
- Keep the bar palette on the Header as already pinned. Preserve the accepted POS
  and Dashboard palettes, full-size category artwork, semantic status colours,
  every other screen, Settings, Lock and the draft cart.
- Do not globally retain the outgoing shell palette; that would contaminate the
  incoming screen. The 4 px viewport strip must derive from actual transition
  visibility/completion rather than the urgent active screen.

#### Root cause (proven, not inferred)

- `App.tsx:134` runs `setScreen(page)` **outside** `startTransition`, so
  `activeScreen` flips at click time while `leavingScreen`/`fade` are deferred to
  the transition (`App.tsx:135-145`). The shell's palette attributes were derived
  from that urgent value (`App.tsx:398-400`, `posBackgroundTrial = activeScreen ===
  'POS'` at line 376), and the palette itself lived on the shell (`App.module.css`
  `.shell[data-pos-trial='true']`, `globals.css`
  `:root:has([data-pos-brand-trial='true'])`) — a sibling of every screen slot.
- The outgoing screen stays `data-live` at opacity 1 until the fade commits and
  keeps painting through the 150 ms crossfade, so it was repainted with its
  palette already withdrawn. rAF timeline for POS → Orders: at t=17 POS was mint
  `rgb(240,247,243)` with the Dine In pill and selected category fill teal
  `rgb(1,54,62)`; at **t=163** the shell attributes were already null, the body had
  flipped to cream `rgb(248,247,234)`, and the POS slot was **still `data-live` at
  opacity 1** painting cream with `rgb(0,106,43)` fills — 34 ms *before*
  `fade='prepare'` at t=197. Pixel grabs agree: one adb frame after the tap the
  still-visible POS read pill `rgb(0,106,43)`, card fill `rgb(0,106,43)`, canvas
  `rgb(248,247,234)`.
- Dashboard never flashed because DASH-PALETTE-01 declared its palette on the
  Dashboard `.screen` element, proving that screen-root ownership is the fix.
  Falsified by the same frames: a header flash (the band and `header[data-trial]`
  were constant) and an over-long animation (the reversion completed before the
  fade began).

#### Research gate, 25 September 2026

- MDN [Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)
  and [CSS inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance),
  checked 25 September 2026: a custom property is declared by its selector and
  inherits to descendants only — never to siblings or unrelated elements — and
  `:root` is what makes it global. That is exactly why a shell-scoped palette
  cannot follow a screen.
- React [createPortal](https://react.dev/reference/react-dom/createPortal), checked
  25 September 2026: a portal keeps the React tree but changes the DOM tree, and CSS
  inheritance follows the DOM tree, so content portalled into `document.body` does
  not inherit custom properties scoped on a React ancestor. The documented remedies
  are global tokens, a `body` + theme attribute, **applying the variables to the
  portal root**, or mounting the portal inside the themed subtree.
- `better-colors` / `better-accessibility` (read in full for earlier cards) and WCAG
  2.2 SC 1.4.11 were reused: measure the pair that actually renders, and fix the
  responsible layer rather than masking the symptom.
- Alternatives rejected. Extending the shell flags to include the leaving screen:
  one shell cannot hold two palettes, so the incoming screen would borrow the
  outgoing one — the contamination the owner forbade. Keeping the palette on `body`
  while POS is visible: the same contamination, app-wide. Portalling the POS dialogs
  into the POS screen element: the slot's own stacking context (opacity transition)
  would place dialogs beneath the shared top bar.
- Chosen mechanism (the documented portal-root approach, smallest safe change):
  declare the POS palette once on `[data-pos-palette]` in `globals.css`, then put
  that attribute on the POS screen root and on the two portalled POS dialog roots.
  The strip becomes one derived `data-frame-mint` attribute computed from the
  visible frame (`visibleLeaving ?? visibleContent`), so it changes exactly at fade
  completion instead of at the click.

#### Token and portal audit, before moving any declaration

- POS consumers of the re-pointed tokens (`--olaso-green`, `--olaso-border`,
  `--olaso-green-soft`, `--olaso-green-icon`) and the `--olaso-trial-*` family,
  all inside the POS screen root: CategoryCard, OrderItemCard, PaymentMethodControl,
  PrimaryAction, ProductCard, ProductGrid, QuantityStepper, QuickAddRow, ReceiptRail,
  SearchField, SegmentedControl.
- Siblings, already pinned by TOPBAR-01 on the Header element: Header,
  TopNavigation, ProfileControl.
- Outside the screen root and therefore requiring their own scope:
  **ModifierSelectionDialog** (9 re-pointed declarations) and **PaymentDialog** (6),
  both portalled to `document.body` via `src/components/OverlayPortal.tsx:40`.
  Their `.overlay` rules use only `--olaso-panel-border`, `--olaso-white`,
  `--olaso-copy`, `--olaso-text` and `--olaso-muted`, none of which the POS palette
  re-points, so scoping onto the overlay root changes only POS-owned colours.
- Not affected: `LabeledField` (no importer left), `PeriodCalendar` and `MenuSelect`
  (used only by Orders, Reports, Products, Stock, Settings and Lock, never POS).
  `MenuSelect` and `ProfileControl` use native `popover` and stay DOM descendants,
  so they inherit normally.

#### Changes (7 files, no new file)

- `src/globals.css` — the POS palette moves from
  `:root:has([data-pos-brand-trial='true'])` to `[data-pos-palette]` and gains
  `--olaso-canvas` and `--olaso-trial-on-canvas`. The two `:root:has(...)` strip
  hooks are replaced by one `:root:has([data-frame-mint='true'])` that sets
  **`--olaso-frame-canvas`**, a token of its own: html/body/#root now read
  `var(--olaso-frame-canvas, var(--olaso-canvas))`. The separation matters — the
  screens read `--olaso-canvas` for their own backgrounds, so overriding that at
  `:root` tinted the incoming screen while the outgoing one was still fading (seen
  on the first attempt and fixed here).
- `src/App.module.css` — the `.shell[data-pos-trial='true']` block is deleted.
- `src/App.tsx` — the three active-screen palette flags and their shell attributes
  are replaced by `const frameScreen = visibleLeaving ?? visibleContent`, a derived
  `frameMint`, and one `data-frame-mint` attribute. The `topBarTrial`/`posTrial` bar
  flag is unchanged.
- `src/features/pos/PosScreen.tsx` — `data-pos-palette` on the POS `<main>`.
- `ModifierSelectionDialog.tsx` and `PaymentDialog.tsx` — `data-pos-palette` on each
  overlay root: the only two POS token consumers outside the PosScreen root, because
  `src/components/OverlayPortal.tsx:40` renders them into `document.body`.
- `scripts/check-navigation.mjs` — the regression assertions below.
- `UI_POLISH_LEDGER.md` — this record.

#### Regression check added (no new framework)

`npm run check:navigation` now also asserts: `frameScreen` derives from
`visibleLeaving ?? visibleContent`; no `data-pos-trial` / `data-pos-brand-trial` /
`data-dashboard-trial` remains in `App.tsx`; `[data-pos-palette]` declares the POS
palette exactly once, including `--olaso-green: #01363e`; the strip hook sets
`--olaso-frame-canvas`; the frame rule reads
`var(--olaso-frame-canvas, var(--olaso-canvas))`; and both portalled POS dialogs
carry `data-pos-palette`. It fails if a screen palette is ever re-attached to the
active screen or a portal scope is forgotten.

#### Device evidence, 25 September 2026 (Redmi 22081283G, 1340 x 804 CSS, dpr 1.75,
`adb install -r` at 16:44:29, app data preserved)

- rAF transition matrix over 14 ordered pairs (POS, Dashboard, Orders, Products,
  Stock, Reports, Settings), asserting per pair: the outgoing screen's palette
  values (`bg`, Dine In pill, selected-category fill, Dashboard metric accent) never
  change while that slot is painted (`data-live`/`data-leave` present and opacity
  > 0.05); the incoming screen's palette never changes while painted; the strip never
  changes while the outgoing screen is visible; the `--olaso-canvas` token never
  changes; the bar only changes on Settings pairs. **All 14 PASS, 0 failures.**
- rAF timeline POS → Dashboard: t=8 POS mint `rgb(240,247,243)` with pill and
  selected fill teal `rgb(1,54,62)`; t=173 fade `prepare`, POS leaving at opacity 1
  with the **same** mint/teal; t=273 opacity 0.69; t=352 opacity 0.02 — mint/teal
  throughout; t=397 Dashboard live, still mint/teal. The strip stayed mint in every
  frame and the hidden Orders/Products/Stock/Reports slots stayed cream.
- Pixel proof of the reported route (tap Orders from POS, two frames one adb
  round-trip apart, same sample points as the pre-fix capture): pill
  `rgb(1,54,62)`, selected-category fill `rgb(1,54,62)`, canvas `rgb(240,247,243)` in
  **both** frames — against `rgb(0,106,43)`, `rgb(0,106,43)` and `rgb(248,247,234)`
  before the fix. Captures `tmp/nav-flash/fixed-0-on-pos.png` and
  `fixed-1-immediate.png`, with the pre-fix pair `grab-0-on-pos.png` /
  `grab-1-immediate.png` for contrast.
- Settled screens: POS and Dashboard both `band rgb(255,255,255)`,
  `header[data-trial]="true"`, pill `rgb(1,54,62)`, screen background
  `rgb(240,247,243)`, top content 90/92, `documentElement` 1340 x 804 and an empty
  console. Dashboard's palette (metric accent `rgb(1,54,62)`, white cards) and the
  POS body are unchanged. Captures `tmp/nav-flash/fixed-pos.png`,
  `tmp/nav-flash/fixed-dashboard.png`.
- Checks: `npm run build` 0, `npm run check:pos` 0, `npm run check:navigation` 0
  (with the new assertions), `npm run check:css-scope` still only the four
  pre-existing App/Lock keyframe findings.

#### Limitations (not acceptance)

- The sampler runs on the JS thread beside React, so frame timestamps are its rAF
  cadence (16-30 ms), not a hardware vsync trace; the pixel grabs are single frames
  that bracket a transition and cannot be pinned to an exact frame.
- `data-pos-palette` must be added to any future POS overlay rendered through
  `OverlayPortal` outside the POS screen root; `check-navigation` guards the two
  that exist today.
- Settings still changes its bar on entry and exit by owner decision, so that pair
  intentionally fails a "bar constant" assertion and the check exempts it.
- New attribute names (`data-pos-palette`, `data-frame-mint`) replace the retired
  `data-pos-trial` / `data-dashboard-trial`.
- The rebuild-and-reinstall restarts the app and drops the in-memory cart, so one
  Espresso was re-added (`Regular · 10,00 MAD x 1`, total 10,00 MAD). No order was
  submitted and no data was cleared.
- The owner accepted the Dashboard palette visually, but the sequential 21-skill
  rerun stays paused until this fix is accepted.

#### Publication

- Not committed and not pushed.

#### Exact next action

- Owner re-checks navigation on the Redmi (POS → Orders, POS → Dashboard,
  Dashboard → Orders, Orders → POS and the Settings pair) and accepts the fix; the
  Dashboard sequential 21 skill passes then restart in the ledger's numbered order,
  one screen at a time, with Settings last. Do not mark anything approved or done,
  and commit/push only after acceptance. Supersedes the DASH-PALETTE-01
  'Exact next action'.


#### Owner authorization and constraints

- Owner asked to see the entire POS screen background in the same dark teal as
  the top bar, POS screen only. Same constraints as POS-BG-01: preserve the exact
  cropped logo pixels, the white cards/receipt surfaces, the layout geometry and
  every other screen; correct only the contrast/readability regressions the dark
  canvas requires (text, icons and controls directly on the canvas); do not
  recolor buttons, selected states, dialogs or status colors. Reversible,
  smallest diff, no new theme architecture. Provisional, not a palette decision.

#### Research gate, 24 September 2026

- Official guidance recorded before implementing: W3C WCAG 2.2 SC 1.4.3 Contrast
  (Minimum), AA — 4.5:1 normal text, 3:1 large text (https://www.w3.org/TR/wcag/).
  SC 1.4.11 Non-text Contrast, AA — a focus indicator must keep at least 3:1
  against adjacent colors
  (https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html). SC 2.4.13
  Focus Appearance (AAA) and technique C40 (two-color focus indicator) use the
  same idea (https://www.w3.org/WAI/WCAG22/Techniques/css/C40). Material 3
  dark-theme color roles: surface = page background, onSurface = primary text and
  icons, surfaceContainer* for cards, and every foreground/background pair must be
  checked
  (https://developer.android.com/develop/ui/compose/designsystems/material3).
- Android/design boundary unchanged from POS-BG-01: this is a CSS value plus one
  scoped alias in the React layer. No Kotlin, no native dependency, no new
  package. The measured teal #01363E is reused from POS-BG-01 (owner-image
  background median).
- Skills read for this pass (in full): better-colors (measure the rendered pair,
  report value and threshold, change only when asked), better-accessibility
  (non-text and focus contrast, do not rely on color alone), color-system (AA/AAA
  thresholds: text 4.5:1, UI 3:1), design-token-audit (keep the change in the
  alias layer; no primitive edits).

#### Exact trial-only values (extending the POS-BG-01 scope)

| Role | Value | Note |
| --- | --- | --- |
| POS body canvas | #01363E | same measured teal as the header band, so the header reads as one field |
| On-canvas ink / indicator | #ffffff | new trial alias --olaso-trial-on-canvas; overrides only the on-canvas items below |
| Cards, receipt rail, buttons, selected states, dialogs, status | unchanged | still read --olaso-white and the existing accent/status tokens |

#### Changes (7 files, no new file)

- src/App.module.css — the trial block re-points --olaso-canvas from #e7ede4 to
  #01363E and adds --olaso-trial-on-canvas: #ffffff. No primitive token edited.
- src/features/pos/components/ProductGrid/ProductGrid.module.css — the .empty
  color and the .grid scrollbar thumb now read
  var(--olaso-trial-on-canvas, original-value), so the POS baseline is exact when
  the trial is off.
- On-canvas focus rings read the same token with their green fallback:
  SearchField .search:focus-within, QuickAddRow .chip:focus-visible, CategoryCard
  .button:focus-visible, Header .report:focus-visible and .skipLink:focus, and a
  new ProfileControl .profile:focus-visible rule (the white popover keeps green).
- Built CSS confirms
  [data-pos-trial=true]{--olaso-trial-header:#01363e;--olaso-canvas:#01363e;--olaso-trial-on-canvas:#fff}
  and five outline:2px solid var(--olaso-trial-on-canvas,var(--olaso-green))
  usages plus the profile outline-color. POS scoping is unchanged: the attribute
  is only set when POS is the active screen.
- DESIGN.md, BRAND.md and untitled.pen are untouched (trial, not an approved
  change). The POS-BG-01 header band rule was kept to avoid extra churn; it is now
  visually merged with the canvas and therefore redundant.

#### Measured rendered contrast (device framebuffer, no estimates)

| Pair | POS-BG-01 baseline | POS-BG-02 trial | Requirement |
| --- | --- | --- | --- |
| canvas vs header band | #e7ede4 / #01363e | #01363e / #01363e | single field |
| white card vs canvas | 1.19:1 | 12.18:1 | visual separation |
| white rail vs canvas | 1.19:1 | 13.14:1 | visual separation |
| muted #566057 on canvas | 5.5:1 | 2.01:1 (fail) | corrected to white |
| green #006a2b on canvas | 5.4:1 | 1.94:1 (fail) | corrected to white |
| empty message vs canvas | n/a | 13.14:1 | >= 4.5:1 |
| date/time vs band | 13.14:1 | 13.14:1 | >= 4.5:1 |
| logo ink vs band | 9.74:1 | 9.74:1 | artwork (unchanged) |

The only genuine failures were the muted-grey empty message and the green
focus/scrollbar indicators that now sit on the dark field; both are corrected to
the white trial ink inside POS scope. Text that stays on white cards/rail is
unchanged.

#### Verification actually run, 24 September 2026

- npm run build passed (tsc + vite). npm run check:pos passed. npm run
  check:css-scope reports only the same four pre-existing App/Lock keyframe
  from/to findings; the new rules are class-scoped and added none.
- Device render on the connected Redmi 22081283G (serial XOPFAQGYNNGYVGPR),
  unlocked POS, viewport 1340 x 804 CSS, dpr 1.75, 2000 x 1200 framebuffer. The
  shipped POS-BG-02 declarations were applied by injection on the already
  unlocked session (same technique and values as dist), because adb install -r
  forces a cold start back to the PIN-protected Lock screen.
- Computed styles read back: shell token #fff, --olaso-canvas #01363e, POS screen
  rgb(1,54,62); empty message rgb(255,255,255); search and category-card focus
  rings rgb(255,255,255).
- States captured: default POS, empty search result, search focus ring, keyboard
  focus ring on a category card, customization dialog, cash payment dialog.
- Both portal dialogs kept white surfaces, the existing green actions and the
  dark scrim, with no clipping. The payment dialog was cancelled, not confirmed.
- No sale created: the cart stayed empty, the payment dialog was cancelled and
  the cart cleared; the existing order list was not changed.
- No app console errors or warnings (WebView console empty).
- Removing the injection returned the screen to rgb(231,237,228) (the POS-BG-01
  state) and cleared the token: the trial is reversible without a rebuild.
- Packaging: npm run android:beta passed (Gradle assembleDebug, 140 tasks,
  JAVA_HOME tmp/android-toolchain/jdk/jdk-21.0.11+10). APK
  android/app/build/outputs/apk/debug/app-debug.apk, SHA-256
  7309E53B779F62C9ACE36B27494433BC3A82FC502B97D4A461BDC3112B691EDA, 27219593
  bytes; APK CSS contains the trial declarations and the five focus-ring usages.
- adb install -r over the Redmi succeeded (streamed, Success) with no uninstall
  and no data clear. The cold start shows the Atelika Lock screen, so the
  installed beta boots normally.
- Graphify was queried before code inspection (POS screen background canvas header
  background colors product cards cart layout styles). It was not refreshed: this
  pass adds no file or module edge.
- Captures: tmp/posbg/dev02-pos-baseline.png, dev02-pos-dark.png,
  dev02-pos-empty.png, dev02-focus-search.png, dev02-focus-card.png,
  dev02-choice-dialog.png, dev02-payment-dialog.png, dev02-pos-restored.png,
  dev02-installed-lock.png.

#### Limitations (not acceptance)

- The POS render is the Redmi at 1340 x 804, not the Samsung Galaxy Tab A9 at
  1340 x 800.
- The POS was rendered with the shipped declarations injected on the already
  unlocked session; it is not a capture of the freshly installed build, because
  install -r always returns to the PIN-protected Lock screen and no device/owner
  PIN is available here. The installed APK's possession of the declarations is
  proven by APK inspection instead.
- The .skipLink focus ring was added after the device render, so its own pixels
  were not re-captured (the install had re-locked the device). It uses the exact
  token mechanism measured white (13.14:1) on the search field and category card.
- The .grid scrollbar thumb change could not be observed: the tested menus do not
  overflow, and Android WebView overlay scrollbars may ignore scrollbar-color.
- The header band is now visually identical to the canvas (redundant but
  harmless); whether to delete it is an owner choice.
- Cross-screen scoping is by construction plus the earlier removal test; a second
  screen was not re-photographed because that also needs the unlocked session.
- DESIGN.md still says white body text is not for Olaso Sage; this trial
  deliberately departs from the cream baseline on the owner's explicit request
  and still needs the owner's palette decision.
- Provisional only: not a palette decision, not propagated, no brand/design
  authority updated.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  files and untracked asset folders are preserved untouched.

#### Exact next action

- Owner unlocks the installed beta on the Redmi and accepts the POS-BG-02 dark
  background, or names changes (canvas value, band removal, the on-canvas ink
  value). Do not propagate it, do not treat it as a rule, do not mark it approved
  or done. Commit and push only after that acceptance.

#### Correction, 24 September 2026 — bottom cream strip on a taller viewport

Supersedes the POS-BG-02 'Exact next action' above.

- **Owner-confirmed bug (fresh Redmi capture):**
  `tmp/posbg/actual-device-current-20260924.png` (2000 x 1200 framebuffer) showed
  the teal canvas to y1193, then six cream physical rows at y1194-1199 (`#F8F7EA`,
  preceded by the `#F0F1E5` antialias row). Cause measured, not guessed: the Redmi
  app viewport is 1340 x 804 CSS px (dpr 1.75), but `.shell` and the POS `.screen`
  are a fixed 1340 x 800. The 4 CSS px below the shell exposed the base page
  surface, which paints `var(--olaso-canvas)` and still resolved to the cream root
  value `#f8f7ea`, because the POS-BG-02 trial re-points `--olaso-canvas` on the
  descendant `.shell` only.
- **Element proof (`tmp/posbg/probe-bottom.mjs`):** in the installed build
  `html`, `body`, `#root` and `html[data-astryx-theme]` are all 804 px tall at
  `rgb(248,247,234)`; `.shell` is 1340 x 800 and transparent; the POS `.screen` is
  1340 x 800 at `rgb(1,54,62)`. Astryx puts `data-astryx-theme` on the `<html>`
  element, so the exposed surface is the `globals.css` full-viewport baseline, not
  the duplicated inline rule in `index.html`.
- **Research gate, 24 September 2026:**
  - CSS `:has()` is Baseline available, shipped in Chrome/Android WebView 105+;
    WebView updates independently of the Android version, so the durable pattern
    is the feature query `@supports selector(:has(*))`
    (https://caniuse.com/css-has, https://developer.chrome.com/blog/has-m105).
  - Capacitor Android renders in the device system WebView, so the engine version
    varies by device and must be checked, not assumed
    (https://capacitorjs.com/docs/android).
  - Android web-app guidance for a document shorter than the WebView: put the
    background on `html` (or a full-height wrapper) rather than leaving the
    viewport unpainted (https://developer.android.com/guide/webapps/best-practices,
    https://developer.android.com/develop/ui/views/layout/webapps/webview).
  - Boundary decision is unchanged: a CSS value in the React layer. No Kotlin,
    native dependency, package, or layout change. The connected Redmi reports
    WebView `153.0.8010.36`, so `:has()` is safe here.
- **Change (1 file, no new file):** `src/globals.css` adds, directly after the
  full-viewport baseline it corrects,
  `:root:has([data-pos-trial='true']) { --olaso-canvas: #01363e; }`. POS-only
  (matches only while App sets `data-pos-trial`), reversible with that attribute,
  and it changes no geometry, card, rail, dialog, or other screen. The colour is
  the same measured teal already declared in the App.module.css trial block, kept
  local to the provisional scope.
  `src/AGENTS.md` assigns this full-viewport baseline to `globals.css`, and the
  rule keys on the app-state attribute rather than a feature or component
  selector, so the global-CSS boundary is respected.
- **Verification actually run, 24 September 2026:**
  - `npm run build` passed; built CSS carries
    `:root:has([data-pos-trial=true]){--olaso-canvas:#01363e}`.
  - `npm run check:pos` passed. `npm run check:css-scope` reports only the same
    four pre-existing untouched App/Lock keyframe `from`/`to` findings; the
    non-module `globals.css` change adds none.
  - `npm run android:beta` passed with
    `JAVA_HOME=tmp/android-toolchain/jdk/jdk-21.0.11+10` (Gradle 140 tasks). APK
    `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
    `16880DD3128C215CA4C569BE5BA23F4967FFBBDDB69182AEF36769530E037AB5`, 27219593
    bytes; the APK CSS carries the rule.
  - `adb install -r` over the Redmi succeeded (data preserved, no uninstall, no
    clear). Because `install -r` cold-starts into the PIN-protected Lock screen,
    POS was reached with the owner's app Lock PIN (never printed) and the real
    installed build — not an injection — was captured.
  - Captures: `tmp/posbg/actual-device-after-fix-20260924.png` (POS, 1340 x 804),
    `tmp/posbg/after-fix-lock.png`, `tmp/posbg/after-fix-dashboard.png`.
  - Pixels: the fixed POS render is `rgb(1,54,62)` from y0 through y1199 including
    the former strip rows y1194-1199; `tmp/posbg/check-bottom.py` reports 0
    offenders, while the owner's pre-fix capture still fails the same check, so it
    is sensitive to the bug.
  - Computed styles: POS `html/body/#root` = `rgb(1,54,62)`, root token `#01363e`;
    Lock and Dashboard keep `rgb(248,247,234)` / `#f8f7ea` with no `data-pos-trial`,
    confirming POS scoping and cross-screen isolation on the device.
  - Reference geometry: under CDP `Emulation.setDeviceMetricsOverride` (1340 x 800)
    the shell bottom equals the viewport bottom (`exposedPx: 0`) and
    `elementFromPoint` at the last row returns the POS `.screen`, so a 1340 x 800
    viewport exposes nothing and the fix changes nothing there.
  - WebView console was empty (no errors, no warnings).
- **Limitations (not acceptance):**
  - Device render is the Redmi at 1340 x 804; the 1340 x 800 reference was checked
    by CDP emulated geometry, not a fresh Galaxy Tab A9 capture (none connected).
  - During the 150 ms screen crossfade the trial attribute follows the incoming
    `screen`, so entering POS can briefly paint the 4 px strip teal before the POS
    screen finishes fading in; that is the incoming screen's correct colour and was
    not separately photographed.
  - Provisional only: still not a palette decision, not propagated, no brand/design
    authority updated; DESIGN.md still records the cream baseline this trial departs
    from on the owner's request.
- **Publication:** Not committed and not pushed, pending owner acceptance.
  Unrelated dirty files and untracked asset folders are preserved untouched.
- **Exact next action:** owner reviews
  `tmp/posbg/actual-device-after-fix-20260924.png` and accepts the full-viewport
  teal POS background, or names changes. Commit and push only after acceptance;
  keep the trial provisional until then.

### POS-BG-01 — POS-only dark teal header + soft light body trial (provisional), 24 September 2026

#### Owner authorization and constraints

- Owner approved trying a POS-only background preview: a full-width dark teal
  header behind the existing cropped Atelika logo, and a soft light non-white
  POS body that keeps the existing white product/cart cards distinct. Explicitly
  out of scope: recolour or recreate the logo, buttons, selection colours,
  status colours, or product/card geometry. This is a visual trial, not the
  final global palette; do not propagate it to other screens and do not declare
  approved rules. Keep the diff minimum and reversible.

#### Source colour sampling (required: a measured teal, not an invented hue)

- Source image: `C:\Users\Ayman\AppData\Local\Temp\codex-clipboard-dbcf2eef-e1ba-460e-88ee-faee7decdb0b.png`
  (owner-supplied Atelika wordmark on its dark background, 1254 x 1254 PNG,
  798223 bytes, mtime 2026-09-24 14:08:14). Sampled with Pillow 12.3.0 on
  24 September 2026 (`tmp/posbg/sample_bg.py`).
- Background median over 26082 non-wordmark samples: `#01363E`; mean `#01363D`;
  dominant 6-step quartile bucket `#00363C`. Corner/mid/bottom patches all sat
  at `#01353B`–`#01373E`, so the field is a near-flat dark teal with a faint
  gradient. The trial band uses the measured median `#01363E` exactly.
- The same image's mint logo ink measures `#D0FFEE` and only reaches 12.02:1 on
  that teal, against about 1.2:1 on the current cream surface. This is the
  concern the trial is testing.

#### Research gate, 24 September 2026

- Official colour-role guidance was already researched in the root instruction
  chain and is reused here: [Carbon color overview](https://carbondesignsystem.com/elements/color/overview/)
  and [Atlassian foundations colour](https://atlassian.design/foundations/color).
  Both separate neutral surfaces from brand/accent and from status colour, and
  both require each foreground pair to be checked on the surface it renders on.
  This trial therefore adds one scoped neutral/brand surface and changes no
  accent, selection or status token.
- `better-colors` was read in full: measure the rendered pair, report the value
  and threshold, and change the colour only when asked. `color-system` and
  `design-token` were read for the role/alias-token boundary: the trial re-points
  the existing `--olaso-canvas` alias only inside the POS scope and adds one
  trial alias `--olaso-trial-header`, rather than editing primitives.

#### Exact trial-only values

| Role | Value | Note |
| --- | --- | --- |
| Header band | `#01363E` | Measured owner-image background median |
| Band geometry | full 1340 px width, y 0–90 | Behind the whole header row (header box y 16–76: 16 px above, 14 px below); flush with the search row at y 90 |
| POS body canvas | `#E7EDE4` | Provisional soft light sage; overrides `--olaso-canvas` only in POS scope |
| Date/time text on band | `var(--olaso-white)` | Existing `#006A2B` green failed at 1.94:1 on teal |
| Logo | unchanged | No recolour, no recreation, no reposition |

#### Changes (4 files, no new file)

- `src/App.tsx` — one derived flag `posBackgroundTrial = activeScreen === 'POS'`,
  a `data-pos-trial` attribute on the existing shell, and one `posTrial` prop to
  the shared Header. `activeScreen` is already permission-capped.
- `src/App.module.css` — `.shell[data-pos-trial='true']` re-points
  `--olaso-canvas` to `#E7EDE4` and defines `--olaso-trial-header: #01363E`.
- `src/features/pos/components/Header/Header.tsx` — optional `posTrial` prop to
  `data-trial` on the header element; no other markup change.
- `src/features/pos/components/Header/Header.module.css` — the band as the
  header's own `::before` (so it paints behind the shared header only when the
  attribute is present) and the white date colour in trial scope.
- Built CSS confirms: `._shell_*[data-pos-trial=true]{--olaso-trial-header:#01363e;--olaso-canvas:#e7ede4}`
  and `._header_*[data-trial=true]:before{...height:90px...}` and
  `._header_*[data-trial=true] ._date_*{color:var(--olaso-white)}`. Scoping to
  POS is by construction: the attribute is only set when POS is the active
  screen, so the band and light canvas cannot appear on Dashboard, Orders,
  Products, Stock, Reports, Settings, or Lock.
- `DESIGN.md`, `BRAND.md` and `untitled.pen` are deliberately untouched: this is
  a trial awaiting acceptance, not an approved design change.

#### Measured rendered contrast (actual device framebuffer, not estimates)

Measured from the captured PNGs (`tmp/posbg/measure_device2.py`):

| Pair | Baseline | Trial | Requirement |
| --- | --- | --- | --- |
| Logo ink vs header field | 1.23:1 | **9.74:1** | artwork; large-form mark |
| Date/time text vs header field | 13.1:1 | **13.14:1** | >= 4.5:1 |
| White card/rail vs body canvas | 1.08:1 | **1.19:1** | visual separation (no WCAG threshold) |
| Body ink `#101611` on trial canvas | 17.0:1 | 15.5:1 | >= 4.5:1 |
| Muted `#566057` on trial canvas | 6.1:1 | 5.5:1 | >= 4.5:1 |
| Existing green date on teal (before fix) | — | 1.94:1 (fails) | corrected to white |

The only genuine failure found was the shared green date/time text on the new
teal field; it was corrected to white inside trial scope without touching the
logo. Header nav, Report and the profile control keep their existing white
surfaces, so their dark text is unchanged. The product/cart cards, the cart rail
and both portal dialogs keep white surfaces and their existing green actions.

#### Verification actually run, 24 September 2026

- `npm run build` passed (tsc + vite). `npm run check:pos` passed.
  `npm run check:css-scope` still reports only the four pre-existing App/Lock
  keyframe `from`/`to` findings; the two new rules are class-scoped and added no
  finding.
- Device render on the connected Redmi `22081283G` (serial `XOPFAQGYNNGYVGPR`),
  unlocked POS, viewport 1340 x 804 CSS, dpr 1.75, 2000 x 1200 framebuffer. The
  shipped trial declarations were applied by toggling the two shipped data
  attributes (the same values in `dist`), because an `adb install -r` cold start
  always returns to the PIN-protected Lock screen. Computed styles read back as
  screen `rgb(231, 237, 228)` = `#E7EDE4`, band `::before` `rgb(1, 54, 62)` =
  `#01363E` at `90px`, date `rgb(255, 255, 255)`. After removal, the screen read
  `rgb(248, 247, 234)` and the band `rgba(0, 0, 0, 0)`, and the restored capture
  was byte-identical to the pre-trial baseline (470,316 bytes both).
- Dialogs under the new background: the customization dialog (`Add to order`) and
  the cash payment dialog were opened and captured over the trial POS; both kept
  white surfaces, the existing green primary actions and the dark scrim, with no
  clipping. The payment dialog was then cancelled, not confirmed.
- No sale was created: the Orders list's latest order was `0926-0002` before and
  after, and the cart returned to empty (`Add a product to begin.`, `0,00 MAD`).
  No café data was reset.
- No app console errors or warnings: the WebView console was empty and focused
  `logcat` showed only this session's own diagnostic SQLite line, no chromium or
  Capacitor errors.
- Packaging: `npm run android:beta` passed (Gradle assembleDebug, 140 tasks,
  `JAVA_HOME` = `tmp/android-toolchain/jdk/jdk-21.0.11+10`). APK
  `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256
  `EE9E74CFF05666BF61026B2B836B8629997DA7AFE875817BB253A30028B5B064`, 27219593
  bytes. The APK contains the trial in `assets/public/assets/index-CbYxRTYV.css`
  and `assets/public/assets/index-Cn17XPiC.js`.
- `adb install -r` over the Redmi succeeded (streamed install, `Success`) with no
  uninstall and no data clear. A cold start after install showed the Atelika
  Lock screen, so the app is installed and booting normally.
- Graphify was queried before code inspection (`graphify query "POS screen
  header background colors product cards cart layout styles"`). It was not
  refreshed: this pass adds one optional prop, one derived flag and two CSS
  rules, so it adds no file or module edge; the stale-graph note from LAUNCH-03
  still stands.
- Captures: `tmp/posbg/dev-pos-baseline.png`, `tmp/posbg/dev-pos-trial.png`,
  `tmp/posbg/dev-choice-dialog.png`, `tmp/posbg/dev-payment-dialog.png`,
  `tmp/posbg/dev-pos-restored.png`, `tmp/posbg/dev-installed-lock.png`.

#### Limitations (not acceptance)

- The POS render is the Redmi at 1340 x 804, not the Samsung Galaxy Tab A9 at
  1340 x 800; the reference-device caveat stands.
- The POS was rendered by toggling the shipped attributes with the shipped
  declarations on the already-unlocked session. It is not a capture of the
  freshly installed build: `adb install -r` forces a cold start that always
  returns to the PIN-protected Lock screen, and no device or owner PIN is
  available here, so the PIN was not guessed and the installed POS/photographic
  re-verification is **protected/unrun**. The installed APK's possession of the
  trial CSS and JS is proven by APK inspection instead.
- POS-only scoping is proven by the code path and the built selectors, and by
  removal restoring the exact baseline; it was not re-photographed live on a
  second screen because that also needs the unlocked session.
- The band is a straight full-width rectangle with square bottom corners, 90 px
  tall. Height, bottom rounding, and a logo-only band instead of a whole-header
  band are open owner choices; the whole-header band is this pass's
  interpretation of "full-width dark teal header".
- Provisional only: this is not a palette decision, not an approved rule, not
  propagated to any other screen, and no brand/design authority was updated.

#### Publication

- Not committed and not pushed, pending owner visual acceptance. Unrelated dirty
  files and untracked asset folders are preserved untouched.

#### Exact next action

- Owner unlocks the installed beta on the Redmi and accepts the POS background
  trial, or names changes (band height/rounding, canvas value, logo-only band).
  Do not propagate it, do not treat it as a rule, and do not mark it approved or
  done. Commit and push only after that acceptance.

### LAUNCH-04 — accepted Atelika wordmark re-derivation, 24 September 2026

#### Owner authorization and constraints

- Owner supplied one accepted logo replacement: the cropped transparent Atelika
  wordmark already in the tree at
  `assets/brand/atelika-wordmark-transparent-new-uncropped.png` (the file name is
  historical; the owner cropped it in place). Use that accepted crop, not the
  earlier draft, and change only the logo image everywhere. Palette, layout,
  branding text, package identity and unrelated artwork stay untouched.
- Asset-only pass: no React, native, CSS or business logic changed.

#### Source verification before use, 24 September 2026

- `assets/brand/atelika-wordmark-transparent-new-uncropped.png`: 1065 x 285,
  RGBA, 227286 bytes, mtime 2026-09-24 14:19:12, SHA-256
  `5430B870BAE22059EA2E56311C91A226061E1CB460133892B43ECC226232BE88`. Its alpha
  bounding box is `(0, 0, 1065, 285)` with 108789 of 303525 pixels fully
  transparent, so the artwork is already tightly cropped rather than a padded
  canvas.
- It is a distinct generation, not the earlier draft: the draft trimmed ink was
  1071 x 292 (aspect 3.668) and this crop is 1065 x 285 (aspect 3.737). The mint
  letters and the orange accent dot are unchanged, but the aspect differs, so
  the mark was not assumed pixel-identical to the previous logo.
- The previous live asset survives only in the ignored build copies
  (`dist/assets/atelika-wordmark-transparent-Dzg9JMMC.png`, 1145 x 366, ink
  1071 x 292, ink fraction 0.9354) and is used for comparison only.

#### Research gate

- No new Android, Capacitor or rendering boundary is introduced. This pass
  reuses the LAUNCH-02 research (adaptive icon 108dp canvas with a 66dp safe
  circle; Android 12 splash icon bounds 288dp with a 192dp visible circle;
  Capacitor 8 serves the built assets) and the same ink-to-canvas discipline.
  No package, plugin, timer or native code was added.

#### Changes

- Re-ran the documented derivation (`tmp/launch01/make_atelika_assets.py`, its
  source re-pointed at the accepted crop): ink plus an even margin reproducing
  the OLASO ink-to-canvas fraction 0.9347, so the rendered ink keeps its
  previous width and no layout box moves.
  - `assets/brand/atelika-wordmark-transparent.png` (new, 1139 x 359, ink
    1065 x 285, ink fraction 0.9350, SHA-256
    `BDA2969961D4D3A7266903DE61869EDFD412B0932DED9E447315EF41987981F9`) — the
    single shared web asset behind all five web references plus `index.html`.
  - `android/app/src/main/res/drawable-nodpi/atelika_launch_wordmark.png`
    (1152 x 1152, ink fraction 0.6224) and
    `drawable-nodpi/atelika_launcher_foreground.png` (1152 x 1152, ink
    fraction 0.5825), same discipline; no artwork pixel was resampled.
- Printer-resident logo re-derived from the same shared asset
  (`tools/wd8260-receipt-lab/generate-nv-logo.cjs`):
  `android/app/src/main/res/raw/olaso_nv_logo.bin` (3657 bytes, 95 x 300 dots,
  header 38, 0, 12, 0) with its golden fixture
  `tools/wd8260-receipt-lab/fixtures/nv-logo-write.bin`, and the golden SHA in
  `scripts/check-android-beta.mjs` updated to
  `C206C7E17A07DBF5043A32D5B219CFEA8EFD27DDA0B6F606E2CA6AD22C303F99`. This was
  not optional: the receipt-lab check regenerates the bundled bin from the web
  asset and compares it to the fixture, so leaving the old bin would fail
  `npm run check:receipt-lab`.
- Height hints updated only for the new 1139:359 canvas ratio: 225x72 to 225x71
  (`index.html`, `src/App.tsx` x3, `src/data/AppDataProvider.tsx`), 320x102 to
  320x101 (`src/features/settings/LockScreen.tsx`), 96x31 to 96x30
  (`src/features/pos/components/Header/Header.tsx`). CSS widths are unchanged.
- `BRAND.md` and `DESIGN.md` temporary-state notes updated to name the accepted
  crop instead of the removed draft file.

#### Verification actually run

- Pillow 12.3.0 measured the source and outputs: web ink fraction 0.9350 (target
  0.9347) and ratio 3.1727, inside the existing 2.6-3.6 guard; both Android icons
  1152 x 1152 RGBA at 0.6224 and 0.5825; the orange accent is present (1282 web,
  584 splash, 509 launcher pixels).
- `npm run check:android` passed (asset presence, RGBA, ratio, startup width
  parity, and NV-logo length/header/SHA).
- `npm run check:receipt-lab` passed (receipt, raster-logo, NV-logo, LAN and
  golden-byte checks).
- `npm run build` passed (tsc + vite); `dist/index.html` now references the new
  hashed asset `assets/atelika-wordmark-transparent-HliNLugh.png`.
- `npm run android:beta` passed (Gradle assembleDebug, 140 tasks, JAVA_HOME set
  to `tmp/android-toolchain/jdk/jdk-21.0.11+10`). APK SHA-256
  `D12EB80B12FA8C329C80794DE2A7414349A72E6FB52F37928AD0CCC38D1DA664`, 27219593
  bytes. The APK contains the new web asset, both 1152 x 1152 icons and the new
  `res/raw/olaso_nv_logo.bin`.
- `adb install -r` over the connected Redmi 22081283G (XOPFAQGYNNGYVGPR)
  succeeded and preserved app data. No uninstall and no data clear.

#### Limitations (not acceptance)

- No on-screen device capture: the Redmi is on its own MIUI keyguard with the
  screen off and no device or Olaso PIN is available, so the Lock, Header,
  startup and Dashboard surfaces were not photographed. Their asset resolution,
  size and box fit are proven by the build, the checks and the APK contents
  only. This is the same limitation LAUNCH-03 recorded.
- The printer-resident logo change is unverified on hardware; no printer is
  connected. Only the generated bytes, header and golden fixture were checked.
- Mint-on-cream contrast stays about 1.18:1 and the palette/background decision
  is still the owner's. No palette work was done.
- Graphify `graph.json` is still stale for the earlier structural change flagged
  in LAUNCH-03; this pass is not structural and did not refresh it.

#### Publication

- Not committed and not pushed: asset-only replacement awaiting the owner
  visual acceptance. Unrelated dirty files and untracked asset folders are
  preserved untouched.

#### Exact next action

- Owner reviews the installed beta on the Redmi and accepts the accepted Atelika
  wordmark as the live logo, or asks for a change. Commit and push only after
  that acceptance; do not treat LAUNCH-04 as accepted or as 100%.

### LAUNCH-03 — visible Olaso to Atelika text rebrand, 23 September 2026

#### Owner authorization and constraints

- Owner authorized finishing the customer-visible rename only: visible text and
  art. Deliberately unchanged this pass (later migration): the package
  `com.olaso.pos`, SQLite `olaso_pos`, secure-storage aliases, signing key,
  cloud/update URLs, environment-variable names, CSS tokens/data attributes and
  historical docs. Complete safe visible text/art, migrate the persisted terminal
  name without data loss, use image_gen for any photo edit, and do not claim
  printer verification without hardware.

#### Changes (visible text)

- Android launcher label: `values/strings.xml` `app_name` and
  `title_activity_main` now read "Atelika POS".
- Capacitor `appName` "Atelika POS"; `index.html` `<title>` and startup
  `aria-label`; document title in `src/App.tsx`; the access/recovery/locked
  alert `aria-label`s.
- Per-screen `aria-label`s on all six screens; Settings About
  (`SettingsContentPanel.tsx`); Lock copy (`LockScreen.tsx`); update copy
  (`src/data/appUpdate.ts`); the neutral category-artwork label
  (`src/lib/categoryArtwork.ts`).
- Terminal default name (`src/data/terminalSettings.ts`): new default
  "Atelika POS" plus a guarded rename migration that rewrites only the exact
  previous default `Olaso POS`. A name the owner typed in Settings is never
  touched, so no device data is lost.
- French dictionary (`src/lib/fr.ts`): the matching keys renamed.
- Printer self-test text (`src/printing/printerDiagnostic.ts`) is now
  "ATELIKA PRINTER TEST".
- Cancellation dialog (`src/features/orders/components/CancellationDialog/CancellationDialog.tsx`):
  completed here. Its French key had already been renamed, so leaving the English
  source unchanged made the French dialog fall back to English. Fixed.

#### Changes (visible art)

- New `assets/brand/atelika-lock-drink-note.jpg`: an image_gen edit of the Lock
  photo `olaso-lock-drink-note.jpg`. The printed cup mark reads "ATELIKA" and the
  handwritten note reads "_ATELIKA"; the smoothie, dome lid, pink flowers, court,
  tennis balls, shadows and light are preserved. `LockScreen.tsx` repoints to it;
  the old OLASO photo stays in the tree.

#### Verification actually run

- `npm run build` passed (tsc + vite). `npm run check:settings` passed
  (terminal name and printer test text). `npm run check:android` passed.
- `npm run android:beta` (check:android, sync, Gradle
  `testDebugUnitTest assembleDebug`, 140 tasks) passed. APK SHA-256
  `ABE1D68B8FC7F933556772C551F3B23320DDB4EC0C057DD9A39381EEA9058F1B`.
- `adb install -r` over the connected Redmi 22081283G succeeded and preserved
  app data (versionName 1.4, versionCode 11).
- Launcher label verified exactly from the built APK with `aapt2 dump badging`:
  `application-label:'Atelika POS'` in every locale, icon resolving to
  `mipmap-anydpi-v26/ic_launcher.xml` (Atelika adaptive foreground).
- The backdrop edit was inspected visually: cup reads ATELIKA, note reads _ATELIKA.

#### Limitations (not acceptance)

- Device on-screen check of the Lock, Header, startup and Dashboard screens could
  not be run: the Redmi is on its own device keyguard with the screen off, and no
  device or Olaso PIN is available. No PIN was guessed and the unlocked session
  could not be reached. The launcher label and icon are proven from the APK; the
  in-app copy is proven by build and checks, not by a fresh device capture.
- Graphify `graph.json` is stale for the prior structural change (StartupDots
  removed, CometSpinner added). No incremental `/graphify . --update` was run in
  this pass; this record flags it rather than claiming it.
- The resident printer logo (`res/raw/olaso_nv_logo.bin`, regenerated to Atelika
  by LAUNCH-02) is unverified on hardware; no printer is connected.
- Legacy density mipmap PNGs (`mipmap-*/ic_launcher*.png`) are unchanged; on
  API 26+ the adaptive `anydpi-v26` icon wins, so they are not visible on this
  device.
- Mint-on-cream contrast (about 1.18:1) is unchanged; the palette/background
  decision remains the owner's.

#### Publication

- Not committed and not pushed. Owner review pending. Unrelated dirty files and
  untracked asset folders preserved untouched.

#### Exact next action

- Owner reviews the installed beta. To capture the Lock/Header/Dashboard screens,
  unlock the tablet or provide the device PIN, or approve a browser 1340x800 pass
  for those screens.


### LAUNCH-02 — temporary Atelika logo image swap, 23 September 2026

#### Owner authorization and constraints

- Owner authorized the swap now, explicitly: use
  `assets/brand/atelika-wordmark-transparent-draft.png` as the exact source,
  keep the mint letters, the orange dot and the transparency, do not ask for
  another asset, and do not recolour or recreate the supplied logo. Rough edge
  quality and low contrast on cream are accepted for this pass.
- Logo images only. Left untouched: package ID and app name, launcher label,
  terminal name, document title, translations, printed receipt logo, product and
  category imagery, colours, backgrounds and layout. Sizes changed only where
  needed to keep the mark visible and the existing boxes in place.

#### Scope — every live logo image

- Web, one asset through five references: HTML pre-render (`index.html` src and
  width/height), database stage (`src/data/AppDataProvider.tsx`), access stage
  plus the Terminal-recovery and Terminal-locked alerts (`src/App.tsx`), Lock
  screen (`src/features/settings/LockScreen.tsx`) and the shared Header
  (`src/features/pos/components/Header/Header.tsx`).
- Native: splash icon (`values/styles.xml` pointing at
  `drawable-nodpi/atelika_launch_wordmark.png`) and the adaptive launcher
  foreground in the four `mipmap-anydpi-v24` and `mipmap-anydpi-v26`
  `ic_launcher` and `ic_launcher_round` files, pointing at
  `drawable-nodpi/atelika_launcher_foreground.png`. The launcher background
  (`@color/ic_launcher_background` #909F78) and the safe zone are unchanged.
- Out of scope by instruction: `res/raw/olaso_nv_logo.bin` and the receipt-lab
  sources (printed logo), `olaso-lock-drink-note.jpg` (the Lock photo backdrop,
  which still shows an OLASO cup in the photograph), and category/product art.
- The OLASO logo files stay in the tree unused so this pass can be reverted by
  repointing: the operational green wordmark PNG, `olaso_launch_wordmark.png`,
  `olaso_launcher_foreground.xml` and `olaso-logo-on-sage.png`.

#### Research gate, checked 23 September 2026

- Android adaptive icons: 108dp canvas, a background layer separate from the
  foreground layer, an inner 66dp guaranteed visible circle, and no shape drawn
  inside the foreground.
- Android 12 splash screen: icon bounds 288dp with a 192dp visible circle when no
  icon background colour is set, matching the androidx core-splashscreen 1.2.0
  mask resources verified locally in LAUNCH-01.
- Capacitor 8: the WebView serves the built assets and its background stays
  #F8F7EA; no splash plugin, timer or new dependency is introduced.

#### Changes

- New `assets/brand/atelika-wordmark-transparent.png`: a canvas trim of the draft
  (ink bounding box plus an even margin) with no pixel of the artwork altered.
  The margin reproduces the OLASO asset's ink-to-canvas ratio (93.5%), so the
  rendered ink keeps exactly the width it had before and no layout box moves.
  Height hints updated for the new canvas ratio (225x72 startup and alerts,
  320x102 Lock, 96x31 Header); CSS widths unchanged.
- New `drawable-nodpi/atelika_launch_wordmark.png` (1152x1152 RGBA) with the ink
  at 62.15% of the box, the same discipline as the OLASO splash icon, so the ink
  stays inside the 192dp visible circle.
- New `drawable-nodpi/atelika_launcher_foreground.png` (1152x1152 RGBA) with the
  ink at 58.16% of the canvas: Atelika's ink is taller than OLASO's at the same
  width, so the fraction was reduced just enough to keep the corners inside the
  66dp adaptive safe circle instead of reusing 59.6% and clipping them.
- Reference updates: four web imports renamed to `atelikaLogo` (the old name was
  importing an Atelika file), the `index.html` src, the `values/styles.xml`
  splash icon, and the four launcher XMLs.
- `alt` text now reads "Atelika" on all six image placements.
- `scripts/check-android-beta.mjs`: the launch and launcher icons are now PNGs,
  so the OLASO vector-trace assertions were replaced with dependency-free PNG
  IHDR guards — both Android icons must be 1152x1152 8-bit RGBA, and the web
  asset must stay RGBA and non-square, because a padded square canvas would break
  the startup, Lock and Header boxes. The startup width parity check still
  applies.
- `BRAND.md` and `DESIGN.md` each gained one factual note that this is a
  temporary, unapproved logo state pending the palette decision.

#### Verification actually run

- `npm run build` passed; the built bundle contains the Atelika asset and
  `dist/index.html` references it.
- `npm run check:android` passed with the new guards.
- `npm run check:css-scope` still shows only the four pre-existing App/Lock
  findings; nothing was added.
- `gradlew testDebugUnitTest assembleDebug` passed (140 tasks). Installed APK
  SHA-256 `DAF631F639A567CE390EF9B4BCFEFEB0530FEB909CB62BC6C2A5D9B217924291`.
  The streaming install was refused again with
  `INSTALL_FAILED_USER_RESTRICTED`; push plus `pm install -r -d` succeeded and
  preserved data.
- Device evidence on the connected Redmi tablet (2000x1200, density 280):
  - launcher grid tile (`tmp/atelika-launcher.png`) shows the mint Atelika mark
    with the orange dot on the sage background, and the launcher label still
    reads "Olaso POS";
  - cold start (`tmp/atelika-cold.mp4`, native frames in `tmp/atelika-frames/`):
    the mint mark renders on the cream startup surface with the green comet
    below it, and its measured ink is 310 device px wide — the same as the OLASO
    mark measured before the swap, so the ink-parity sizing held;
  - Lock screen (`tmp/atelika-lock.png`) shows the mint mark in the same slot as
    the OLASO wordmark, with the green accent bar still clear of it;
  - the platform splash first frame still shows only the cream background, as
    recorded in LAUNCH-01 for this device.

#### Limitations (not acceptance)

- The mint ink measures 1.18:1 against cream and 2.24:1 against sage, so the mark
  is faint on every cream surface. This is the expected, owner-accepted state of
  a temporary logo-only pass; the palette and background adaptation is the
  owner's next decision. No visual polish and no 100% claim is made.
- The draft's edge fringing carries through unchanged (about 109 desaturated
  outline pixels in the source). It was not cleaned, recoloured or retouched.
- The shared Header and the two terminal alert states are **protected/unrun** on
  device: they need an unlocked staff session and the owner PIN is not available
  here. Their markup, asset resolution and box fit are verified only by the
  build, the check script and CSS geometry.
- MIUI's launcher icon cache has not refreshed the dock tile: the app-grid tile
  shows the new mark while the dock tile still renders the previous icon in both
  captures (measured 0 mint pixels in the dock). A reboot or the launcher's own
  cache refresh should converge it; the system launcher was not force-stopped.
- The Lock-screen photo backdrop still contains the OLASO cup artwork because the
  owner scoped this pass to the logo image only.

#### Publication

- Not committed and not pushed. The pre-existing unrelated dirty files
  (`AGENTS.md`, `SAAS_TRANSITION.md`, `src/features/reports/reportProfit.ts`)
  and the untracked asset folders are preserved untouched.

#### Exact next action

- Owner review of the installed beta on the Redmi tablet, then the palette and
  background decision for the Atelika mark, or a revert to the OLASO files which
  are still in the tree. Do not treat this card as accepted or as 100%.

### LAUNCH-01 — owner-directed branded first frame and comet startup loader, 23 September 2026

#### Owner decision

- The owner approved implementation and explicitly chose a **static
  Olaso-branded native first frame on cream, visually steady into the web
  loading screen where the new comet animation starts**. This supersedes the
  earlier "native Android splash is plain Cream Surface only" rule.
- Scope came with the decision: port the supplied `CometSpinner` into all three
  startup stages, keep Olaso brand DNA (cream, the approved green wordmark,
  `currentColor`), keep the existing `data-olaso-startup` attributes, add no
  timer or delay, preserve the loading status semantics and honor
  reduced motion.

#### Scope inventory

- Three in-app startup stages: `index.html` pre-render
  (`data-olaso-startup="document"`), local database
  (`data-olaso-startup="database"`), terminal/staff access
  (`data-olaso-startup="access"`).
- The Android cold-start first frame, its launch theme, splash drawable and
  handoff into the WebView startup surface. No other screen, popup or flow.

#### Reproduction — actual source, not an assumed screenshot cause

- Recorded cold starts on the physical **Redmi tablet** `22081283G` (adb serial
  `XOPFAQGYNNGYVGPR`, MIUI/HyperOS, Android 12/API 31, dark mode, 2000x1200
  device px, density 280) with `screenrecord` plus `ffmpeg` frame extraction,
  repeated across six installed builds: `tmp/launch01/run1-3.mp4`,
  `new1-2.mp4`, `final2.mp4`, `slow2.mp4` with frames in `tmp/launch01/r1`,
  `n1`, `n2`, `fin2`, `slow2`. **This Redmi tablet is the owner's current
  device and is the acceptance device for this card**; no other device is
  required and none is pending.
- Reproduced: the launcher animation, then a **flat dark surface (RGB
  26,26,26) for about 1.9-3.5 s**, then a blank bright cream surface for about
  0.5-1 s, then the app. `SurfaceFlinger`/window dumps during that phase show
  the system window `Splash Screen com.olaso.pos` as the top window, so the
  dark frame is the platform's cold-start window, not the WebView.
- A **colour probe** (temporary `windowSplashScreenBackground`/`android:windowSplashScreenBackground`
  cyan, `windowBackground` magenta, status bar yellow) changed that flat
  surface to (0,60,67) teal — our splash colour at roughly 24% brightness, not
  magenta and not our status-bar colour. So the launch theme **is** applied;
  the platform composites that window heavily attenuated.
- A second probe with a **flat opaque magenta splash icon** never appeared in
  any captured frame: on this device the platform does not render the splash
  icon in that window at all.
- Controls: a **warm** start shows no dark frame (TotalTime 0), and the
  system Settings app shows a comparable dark cold-start phase, so this is
  device/vendor launch behaviour rather than an Olaso defect.
- Provisional conclusion, honestly bounded: the visible black is the
  platform's attenuated cold-start window. The screenshots are also partly
  capture-artefact — `adb screencap` during that window returns pure black
  (0,0,0) with no system bars, while `screenrecord` shows the attenuated
  colour. Both are recorded above; neither is presented as the other.

#### Research before implementation, checked 23 September 2026

- Android 12 splash screen API
  (`developer.android.com/develop/ui/views/launch/splash-screen`): the icon
  drawable box is 288x288 dp and, with no icon background colour, the visible
  content is masked to a 192 dp circle. Verified locally against the real
  `androidx.core:splashscreen:1.2.0` resources from the Gradle cache — the
  compat mask drawable crops the icon with a 410 dp oval and 109 dp stroke of
  the splash background colour, i.e. a 192 dp visible circle on pre-API-31 and
  the v31 theme maps `android:windowSplashScreenBackground` to
  `?attr/windowSplashScreenBackground`.
- Capacitor 8 (`capacitorjs.com/docs`): `backgroundColor` is applied to the
  WebView (`Bridge.java` sets it), and the project deliberately uses no splash
  plugin and no timer — the installed Activity already holds the SplashScreen
  exit overlay until `onPageCommitVisible`. Verified `android/app/src/main/assets/capacitor.config.json`
  in the built APK carries `#F8F7EA`.
- Alternatives considered and rejected: adding `@capacitor/splash-screen`
  (already excluded by `android/AGENTS.md`), a custom splash Activity or timer
  (same rule), GIF/video startup motion (ARCHITECTURE.md requires measuring
  first), a Tailwind/`cn` port of the supplied component (this repo has no
  Tailwind, no `@/lib/utils` alias and no `cn`), and rebuilding the wordmark as
  a new vector (the traced launcher vector's ink aspect is 5.30 while the
  approved PNG's ink aspect is 4.43, so a native traced mark would visibly
  change shape at the handoff).
- Native-versus-web boundary: the first frame stays a bundled native resource
  used only by the launch theme; all motion stays in the React/CSS layer; no
  new Kotlin, plugin or dependency.

#### Changes

- `src/components/CometSpinner/` (new `CometSpinner.tsx` +
  `CometSpinner.module.css`): minimal port of the supplied component with no
  Tailwind, `cn` or per-render `<style>`; the two keyframes move into the module
  stylesheet; geometry uses `--olaso-comet-size` instead of container queries;
  the two spans are scoped one level deeper than the startup surface's
  plain-span message rule so the comet keeps its size and Operational Green;
  `aria-hidden` because the surrounding `role="status"` region already
  announces loading; `prefers-reduced-motion: reduce` stops the animation on a
  resting comet (the removed dots had no reduced-motion path).
- Comet speed, owner correction 23 September 2026: both keyframe pairs now run
  at **3.4s** instead of 1.7s. The module keeps one shared
  `--olaso-comet-duration` default so shadow and rotation cannot drift apart,
  and `index.html` carries the same 3.4s for its self-contained pre-render
  copy, so all three startup stages stay consistent.
- `index.html`: the pre-render now carries the comet markup and inline CSS
  (self-contained, as before), the wordmark is 225x61 and a `::before` spacer
  equal to the comet height keeps the wordmark on the exact vertical centre.
- `src/data/AppDataProvider.module.css`: `--olaso-comet-size: 24px` (the
  previous dots' footprint), the same centring spacer, and the matching 225 px
  wordmark width.
- `src/App.tsx`, `src/data/AppDataProvider.tsx`: `StartupDots` replaced by
  `CometSpinner`; wordmark image attributes follow the new width.
  `src/components/StartupDots/StartupDots.tsx` deleted.
- `android/app/src/main/res/drawable-nodpi/olaso_launch_wordmark.png` (new,
  1152x1152): the approved green wordmark at 62.15% of the canvas so its ink
  fits Android's 192 dp visible circle; this makes the native mark about
  0.62 x 288 dp = 179 dp wide, which is what the web wordmark was matched to.
  `res/drawable/olaso_launch_blank.xml` deleted.
- `res/values/styles.xml`: the launch theme now declares
  `android:windowSplashScreenBackground` and
  `android:windowSplashScreenAnimatedIcon` explicitly (no `?attr` indirection),
  pins `isLightTheme` true (the app is always light mode), and keeps the
  existing cream window/status/navigation colours and `postSplashScreenTheme`.
- `DESIGN.md` (Launch continuity), `BRAND.md` (derived Android artwork) and
  `ARCHITECTURE.md` (startup performance) updated narrowly to record the owner
  decision, the 192 dp constraint and the new asset; no other design rule,
  screen or palette changed.
- `scripts/check-android-beta.mjs`: the launch-theme assertions now require the
  explicit `android:` attributes, `isLightTheme`, the new wordmark drawable and
  its file, the pre-render comet markup, and that the startup wordmark width
  matches in both startup surfaces; the `<StartupDots />` pins became
  `<CometSpinner />`.

#### Verification actually run

- `npm run build` passed (`tsc -b` + Vite). The built stylesheet contains both
  scoped keyframes and the animation references them.
- `npm run check:android` passed with the new assertions.
- `npm run check:css-scope` still fails on exactly the four pre-existing
  `from`/`to` findings in `src/App.module.css` and
  `src/features/settings/LockScreen.module.css`; the new comet stylesheet adds
  none (its keyframes use percentage stops only).
- `npm run android:beta` passed, including the app JVM unit tests, and the APK
  installed over the existing app with `adb install -r` (data preserved).
- Device frames after the change: `tmp/launch01/fin2/f_046.png` shows the
  startup surface as cream + green wordmark + comet. Measured wordmark ink on
  the device is **310 device px**, against the native target of
  **313 device px** (0.62 x 288 dp x 1.75) — about 1% apart, so the handoff
  keeps the mark at the same apparent size.
- The app's real WebView viewport is 1340 x 804 CSS px on this device
  (`devicePixelRatio` 1.75, effective scale 1.4925 measured from a known 400 px
  control), which is the 1340 x 800 reference layout; no desktop-browser pass
  was run for this card.

#### Limitations and open points (not passes)

- The native first frame on this Redmi is not brand-visible: the platform both
  fails to draw the splash icon and attenuates the window. Whether the Galaxy
  Tab A9 renders the icon is **unverified** — only the Redmi was connected.
- Because of that device behaviour, the native frame currently reads as cream
  rather than branded on the test device; the branded mark and comet appear on
  the web startup surface. Report the same finding to the owner before claiming
  a branded native frame.
- The startup wordmark is now 225 px wide (about 310 device px) instead of the
  previous 320 px, so the URL wordmark matches the platform-capped native mark.
  This is a visible change to the approved startup surface and needs owner
  acceptance; if the native icon never renders on the acceptance device, the
  owner may prefer restoring the larger wordmark.
- Cold-start timing and TalkBack speech remain open.
- Owner decision 23 September 2026: the black native background is **accepted
  for now** and the branded mark is confirmed to appear in place of the old
  square, so the native splash is closed for this card and must not be reworked.
  This card's earlier measurement that the platform does not paint the splash
  icon on this device is retained as a recorded observation only; it is not an
  open action and no other device is required to settle it.
- Owner decision 23 September 2026: the current 225px startup wordmark is kept
  as it is. It is no longer an open question on this card.

#### Owner correction, 23 September 2026 — comet speed

- Owner report: the comet loading animation is **WAY too fast** ("like Sonic").
  The owner also confirmed the connected Redmi tablet is their current device and
  this card's acceptance device, accepted the black native background for now,
  confirmed the branded mark appears instead of the old white square, and asked
  for no native rework and no other visual change.
- Change: both comet animations slowed from 1.7s to **3.4s** — the shared
  `--olaso-comet-duration` default in
  `src/components/CometSpinner/CometSpinner.module.css` and the pre-render rule
  in `index.html`. Shadow and rotation still share one duration, so they stay in
  lockstep.
- Device verification on the connected Redmi tablet, not only a build:
  - the rebuilt beta installed over the existing app with data preserved. The
    first `adb install -r` returned `INSTALL_FAILED_USER_RESTRICTED` (the same
    intermittent MIUI block already recorded on this device) and the immediate
    retry succeeded; installed APK SHA-256
    `857B95B4D8CFABF77E70E80751BC35B0DDDAC84F0F5EB0D6A300F38581A819F0`;
  - the live document reports `animation-duration: 3.4s, 3.4s` for the comet
    with names `olaso-comet-shadow, olaso-comet-rotation`, and both the
    pre-render rules and the React module rules (`._spinner_* ._comet_*`) are
    present;
  - the running comet was recorded for 11.83s (356 frames at 30fps) and tracked,
    giving a mean rotation of **105.9 deg/s, i.e. a 3.40s period**. Measured the
    same way, the previous 1.7s build ran at 219.9 deg/s (1.63s period), so the
    visible motion halved as asked (`tmp/launch01/bench2.mp4`);
  - `tmp/launch01/bench-cycle.png` shows one full cycle as a montage: a clear
    comet head with a tapering dotted tail orbiting on cream;
  - a fresh cold start after the change (`tmp/launch01/slow2.mp4`, frames in
    `tmp/launch01/slow2/`) still renders the startup surface with the wordmark
    and comet, and the comet frames repeat once per animation cycle.
- Timing note recorded, not changed: the supplied component applies the same
  `ease` timing to the rotation as to the shadow, so each cycle dwells briefly
  and then sweeps (measured about 10-20 deg/s while dwelling, about 220 deg/s
  mid-sweep, once every 3.4s). Switching the rotation to `linear` is a one-word
  change if the owner wants an even sweep; it was left alone because the owner
  asked only for the slower speed and for no other visual changes.
- **Superseded:** that 105.9 deg/s figure came from one steady injected element,
  which cannot reproduce a real startup. It measured the tempo only. The owner's
  direct observation of the real app (the comet "wants to spin but then goes
  back to its place") overrides it, and the correction below is what actually
  settled the motion.

#### Owner correction, 23 September 2026 — the comet snapped back

- Owner report: in the **installed** app the comet wants to spin and then
  returns to where it started. The owner also confirmed the previous 3.4s APK
  was the one installed, and that their observation of normal startup outranks
  an isolated scripted animation test and the numeric angular measurement.
- Investigation on the connected Redmi tablet, in the app's own document
  (`tmp/launch01/investigate2.mjs`, `raw_probe.mjs`, `phase_probe.mjs`,
  `react_probe.mjs`, `stage_watch.mjs`): the three causes are separate and all
  real.
  1. **Stage remount restarts the phase — the main cause.** Each startup stage
     mounts its own comet (static pre-render, then the React local-database
     stage, then the React terminal/staff-access stage), and a newly mounted CSS
     animation starts again at 0 degrees. Read straight off the device, a fresh
     hold of the comet is `matrix(1, 0, 0, 1, 0, 0)` (0 degrees, tail collapsed)
     at mount, then 83 degrees after 0.6s and 217 degrees after 1.2s. So every
     stage handover yanked the comet back to its start, which is exactly the
     reported snap.
  2. **Eased rotation.** Both keyframe pairs used the supplied `ease` curve, so
     the turn lurched (slow, then fast, then slow) instead of travelling at a
     steady speed.
  3. **Animated tail that retracted.** The shadow keyframes collapsed the tail
     back onto the head at 0%, 5%, 95% and 100% of every cycle, so the tail also
     "went back" even inside one cycle.
- Fix, the owner's suggested shape, kept as small as possible:
  - the shadow keyframes are deleted and the trail is a **fixed** comet taken
    unchanged from the supplied component's own fullest trail state
    (head plus four shrinking dots), so the shape never grows or retracts;
  - the only animation left is the rotation, now **`linear`** instead of `ease`;
  - the React comet carries a **negative `animation-delay`** of
    `performance.now() % 3400`, so a freshly mounted stage resumes the running
    phase instead of restarting at 0 degrees. This is a single read at render
    time, not a timer, and it needs no new dependency. The static pre-render is
    the phase reference because its animation starts at page load.
  - the 3.4s tempo, the cream surface, the green wordmark, the comet's size and
    the reduced-motion resting state are unchanged.
- Device verification after the fix (installed APK SHA-256
  `D8F7217D4F9B1F931AEC9B388D99BDCE722529DAB93414E0138130CF98591FC4`; the
  streaming install was refused again with `INSTALL_FAILED_USER_RESTRICTED`, so
  the APK was pushed and installed with `pm install -r -d`, which succeeded and
  preserved data):
  - in the live document the React comet reports `animation-name:
    _olasoCometRotation_*`, `animation-duration: 3.4s`,
    `animation-timing-function: linear`, five constant trail dots, and the
    negative delay actually applies (`-0.85s`, `-1.7s`, `-2.55s` requested and
    applied);
  - a normal cold start was recorded at 90Hz (`tmp/launch01/fixed1.mp4`, native
    frames in `tmp/launch01/fixed1n/`). Measuring the comet's own shape axis over
    the visible stage, which is only meaningful now that the figure is rigid,
    gives about **91.5 deg/s** across 0.30s of true frame timestamps — consistent
    with a linear 3.4s turn — with no backward steps beyond a single 4.7 degree
    measurement blip. The same measurement on the previous build is chaotic
    because that comet's shape kept changing;
  - `tmp/launch01/fixed-cycle.png` shows the startup comet as a montage: a
    constant head-and-tail figure on cream, changing orientation only;
  - the recording also covers the return to the Lock screen after the startup
    with no comet left on screen.
- Honest limits of this evidence: `screenrecord` reports a misleading ~14.5
  average fps because it drops frames when the device is busy (22 frames were
  missing mid-startup), so frame rates are taken from the true per-frame
  timestamps, not the container average; the startup surface is visible for
  under one 3.4s cycle on a cold start, so two full cycles of the real startup
  cannot be shown without holding the app open, which was not done; and the
  phase reference assumes the pre-render animation starts at about page load, so
  any residual offset is a few tens of milliseconds out of 3.4s.

#### Publication

- Not committed and not pushed: the owner asked to see the result first.
  `git status` also still shows the pre-existing unrelated edits
  (`AGENTS.md`, `SAAS_TRANSITION.md`, `src/features/reports/reportProfit.ts`)
  and the untracked asset folders, all preserved untouched.

#### Exact next action

- Owner review of the installed beta **on the connected Redmi tablet** (the
  acceptance device for this card): confirm that the comet now travels forward
  without snapping back at the slower 3.4s tempo and name any further change
  before any commit/push. Do not start UI-02 POS work from this card.

### UI-02 — owner accepts the 2px product-card outline, 23 September 2026

- **Source and date:** explicit owner decision on 23 September 2026 after
  comparing live previews on the physical tablet. The owner accepts the
  committed **2px** POS product-card outer outline (commit `1db4f38`, published
  by `fe50b5a`) and **rejects** both the 3px and the 2.5px previews.
- **Scope accepted:** only the outer outline of each POS product card, at 2px
  Operational Green with no shadow. The add-control circles keep their own 1.2px
  outline; category cards, cart panel, cart rows, radius, colour, size and
  behaviour are unchanged. This supersedes the pending-acceptance status of
  `UI-02 - owner correction: stronger POS product-card outline` above.
- **Preview method, not persisted:** the 3px and 2.5px candidates were tried as
  a live DOM override (`<style id="olaso-preview-border">`) injected through
  the WebView bridge on the already-unlocked tablet. Nothing was written to a
  tracked file and no preview was committed. After the decision the override was
  removed, so the device again renders the shipped 2px.
- **Comparison evidence:** every preview was captured in the same French POS
  session. On the card's left edge in the 2000 x 1200 device framebuffer the
  full-intensity core measured 2 device pixels at 2px, 3 at 2.5px and 4 at 3px,
  which is why the owner could compare them directly. Every candidate kept all
  9 card rects at `174 x 162` with zero content overflow.
- **Restoration verified:** with the override removed, `getComputedStyle`
  reports `borderTopWidth 1.71429px`, radius `20px` and colour
  `rgb(11, 107, 54)`, and the cart is empty (`0,00 MAD`). The restored capture
  `tmp/ui02-pos-restored-2px.png` differs from the same-session 2px baseline
  `tmp/ui02-pos-baseline-2px-samesession.png` in only 1,634 of 2,400,000 pixels,
  all inside the header band (32, 54) to (460, 83), which is the date and clock
  text (15:28 to 15:37). Every menu, card and rail pixel outside that band is
  identical, so no unrelated UI changed.
- **Checks:** no tracked file was created, edited or deleted by this work; no
  CSS, `DESIGN.md` or `untitled.pen` change. `git diff --check` was reviewed and
  `git status` still lists only the pre-existing unrelated changes (`AGENTS.md`,
  `SAAS_TRANSITION.md`, `src/features/reports/reportProfit.ts`). The preview
  helpers under `tmp/` are ignored development tooling and were left in place.
- **Device:** the connected device is the Redmi `22081283G` (adb serial
  `XOPFAQGYNNGYVGPR`), WebView `1340 x 804`, `devicePixelRatio` 1.75, French UI,
  POS screen, empty cart. The Samsung Galaxy Tab A9 at 1340 x 800 remains the
  named reference device and was not available, so the reference-device caveat
  stands.
- **Limitations retained:** this accepts one scoped correction, not the whole
  UI-02 screen. UI-02 is still **not** done and is not 100%: its remaining
  coverage and every earlier recorded boundary stay open. `untitled.pen` was
  edited as text, so it still needs to be opened in its design tool to confirm.
  TalkBack, enlarged OS text, RTL and long-expansion remain unverified.
  `scripts/tablet-session.mjs unlock` still fails on this build because it
  requires a native `<select>` staff picker the Lock screen no longer renders;
  unlocking used the owner PIN through `OLASO_OWNER_PIN` for the current
  terminal only, and it appears in no file, ledger or commit.
- **Status:** the scoped 2px product-card outline correction is owner-accepted
  and closed. UI-02 as a screen remains not accepted and not complete.
- **Exact next action:** the owner decides whether to run the remaining UI-02
  coverage and passes. Do not advance to Products or any other screen without
  that decision.
- **Publication:** owner-acceptance commit
  [`48cb887`](https://github.com/aymansal/olaso-pos/commit/48cb887cc8b5aa8ff372f88bcbaebc4285558626)
  is pushed to `origin/main`; this follow-up ledger commit records that
  publication.

### UI-02 — owner correction: stronger POS product-card outline, 23 September 2026

- **Source and date:** explicit owner instruction on 23 September 2026 after
  reviewing `tmp/ui02-pos-current.png`: the POS product cards' green outlines
  read too thin. Contract given: strengthen only each POS product card's outer
  outline, from 1.2px to a conservative 1.5px, and calibrate to 2px at most if
  the physical screen shows 1.5px is imperceptible. The add-control circles,
  category cards, cart panel, cart row borders, colours, geometry, shadows and
  behaviour stay untouched.
- **Instruction chain read:** root `AGENTS.md`, `src/AGENTS.md`,
  `src/features/pos/AGENTS.md`, this whole ledger, the current direction in
  `SAAS_TRANSITION.md`, and the applicable listed skills `better-ui`,
  `better-colors`, `design-token-audit`, `no-ai-design-slop`,
  `critique-affordance` and `mobile-native`. Graphify was queried before code
  inspection (`graphify query "POS product card border outline CSS"`, then
  `"ProductCard border width var(--olaso-border)"`).
- **Research before implementation, 23 September 2026:** MDN documents that
  `border-width` accepts any non-negative length, fractional CSS pixels
  included. WebSearch on 23 September 2026 confirmed the rendering consequence:
  a fractional border whose CSS width times the effective scale is not a whole
  number is antialiased across device pixels, so the painted line reads lighter
  than its declared colour. Alternative considered: keep 1.2px and replace the
  border with a layered inset `box-shadow`; rejected because `better-ui` says
  borders own structure while shadows own depth, and because the owner asked for
  a stronger outline, not simulated depth.
- **Android/Capacitor boundary:** a pure web-layer CSS change. Capacitor's
  workflow documentation confirms HTML/CSS edits need no native or plugin
  change. No Kotlin, plugin, dependency or native configuration was added.
- **Change applied:** `src/features/pos/components/ProductCard/ProductCard.module.css`
  line 6, the `.card` rule, `border: 1.2px solid var(--olaso-border) !important`
  becomes `border: 2px solid var(--olaso-border) !important`. The colour token,
  20px radius, 174 × 162 geometry, `overflow: hidden`, photo, name, price and the
  add control are unchanged; the add control keeps its own 1.2px circle outline.
  `DESIGN.md` records the outline in the `product-card` token block
  (`border: "2px solid {colors.action-border}"`) and in the `ProductCard`
  contract row. `untitled.pen` updates the 13 authority nodes only — the 12
  product cards in the production POS frame `W26Y6` and the reusable
  `Component / Product Card` (`e0wXTE`) — by changing `strokeWidth` 1.2 to 2.
  Other artboards are not the authority and were left as they were.
- **Device evidence that 1.5px is imperceptible:** with the rebuilt beta
  installed and the CSS confirmed live through the WebView bridge (the
  `._card_*` rule reads back as `border: 1.5px solid var(--olaso-border) !important`),
  the rendered outline was pixel-identical to the 1.2px capture. Scanning the
  card's left edge in `tmp/ui02-pos-current.png` and in the 1.5px capture both
  showed one full-intensity device pixel (`11,107,54`) plus one partial pixel.
  The page renders 1340 CSS px into a 2000-device-pixel framebuffer (effective
  scale ≈ 1.4925 device px per CSS px) while `window.devicePixelRatio` reports
  1.75, so Chromium snapped both 1.2px and 1.5px to two device pixels. That met
  the owner's stated calibration condition, so the value moved to 2px.
- **Verified device result at 2px:** the same left-edge scan now shows two
  full-intensity device pixels (`11,107,54`) plus one light pixel — the solid
  core doubled. `getComputedStyle` reports `borderTopWidth` `1.71429px`
  (3 device px at the reported ratio), colour `rgb(11, 107, 54)`, radius
  `20px`. The viewport stayed `1340 × 804` and every card rect stayed
  `174 × 162`, so no geometry moved. Captures:
  `tmp/ui02-pos-after-2px.png` (accepted value), `tmp/ui02-pos-after-15px.png`
  (1.5px intermediate) and `tmp/ui02-pos-current.png` (owner's reference).
- **Checks:** `npm run build` passed, `npm run check:pos` passed (cart, money
  and optional-extra assertions), `npm run android:beta` built in 24s and
  `adb install -r` preserved café data. Focused logcat showed no Capacitor or
  WebView console errors and only the known chromium feature warnings. The cart
  stayed empty (`0,00 MAD`), so no sale was created. Graphify was not
  refreshed: a CSS value change adds no file, symbol or edge.
- **Device:** the connected device is the Redmi `22081283G` (adb serial
  `XOPFAQGYNNGYVGPR`), not the Samsung Galaxy Tab A9 the root `AGENTS.md`
  names as the reference device; the viewport is `1340 × 804`.
- **Limitations:** the owner has not accepted this correction; no UI-02 skill
  pass was re-run, so UI-02 stays not accepted and this is not 100%. The 1.5px
  step was rejected on device evidence, not by the owner, who may still prefer it
  if the design tool renders it differently. The reference capture is the Redmi
  at 1340 × 804, not the Galaxy Tab A9 at 1340 × 800. `untitled.pen` was edited
  as text, so the design master must still be opened in its design tool to
  confirm. `scripts/tablet-session.mjs unlock` fails on this build because it
  requires a native `<select>` staff picker that the Lock screen no longer
  renders (`hasSelect: false`); the owner PIN was supplied only through
  `OLASO_OWNER_PIN` for the current terminal and appears in no file, ledger or
  commit. TalkBack, enlarged OS text, RTL and long-expansion remain unverified.
- **Status:** scoped UI-02 correction implemented and device-verified; UI-02
  owner acceptance still pending.
- **Exact next action:** the owner reviews the stronger product-card outline on
  the tablet and either accepts it or names one different value or scope. Do not
  widen it to other controls or screens without that decision.
- **Publication:** UI-02 outline commit
  [`1db4f38`](https://github.com/aymansal/olaso-pos/commit/1db4f38ea80a447dbcebea4a154969b77d7109ef)
  is pushed to `origin/main`; this follow-up ledger commit records that
  publication.

### UI-03 — owner acceptance, 23 September 2026

- **Source and date:** explicit owner approval on 23 September 2026 that UI-03
  Orders / Sales is accepted. It follows the plain French cancellation-copy
  correction and its publication (`477d432`, recorded by `1a49f2a`).
- **Scope accepted:** the Orders / Sales coverage and evidence published up to
  `1a49f2a` — the 21 numbered individual skill passes and the two
  owner-requested copy corrections — is accepted. No further Orders work is
  queued.
- **Retained limitations, not passes:** the acceptance closes no recorded
  boundary. Still unverified or outstanding: a 1340 × 800 browser capture of the
  cancellation dialog; TalkBack speech; enlarged OS text; RTL and
  long-expansion; a real cloud-outage transition; and live reprint. The owner's
  retained faint shared text colours (`--olaso-text-meta`,
  `--olaso-text-placeholder`) stay deferred to a later palette pass. This
  accepts the deliberate design; it is not a claim of 100%.
- **Changes:** documentation only. No app, UI, data, device or APK change.
- **Verification:** `git diff --check` reviewed; only this ledger changed, so no
  build or device run was required for a documentation-only acceptance.
  Unrelated working-tree changes were preserved.
- **Status:** UI-03 accepted and closed. UI-02 POS remains not accepted.
- **Exact next action:** read-only discovery of the owner-requested UI-02 POS
  product-card outline correction; no POS code or styling change until the owner
  approves one specific change from that packet.
- **Publication:** owner-acceptance commit
  [`a437366`](https://github.com/aymansal/olaso-pos/commit/a437366fee3d2cd5e95ad6f47c06d388bc2884b7)
  is pushed to `origin/main`; this follow-up ledger commit records that
  publication.

### UI-03 — owner correction: plain French cancellation copy, 23 September 2026

- **Source and date:** root review of the published cancellation correction on
  23 September 2026 flagged the French body phrase `contrepassation bancaire`
  as accounting jargon that a non-developer owner cannot read. This is a narrow
  copy-only follow-up to `UI-03 — owner copy correction: drop the redundant
  cancellation eyebrow and state no card refund` above; it supersedes that
  entry's quoted French body wording, which is left as the historical record.
- **Research before implementation, 23 September 2026:** the European Commission
  Directorate-General for Translation's [How to write
  clearly](https://op.europa.eu/en/publication-detail/-/publication/725b7eb0-d92e-11e5-8fea-01aa75ed71a1/language-en)
  and its [plain-language
  guidance](https://translation.ec.europa.eu/languages-and-translation-european-commission/plain-language-making-european-commission-texts-clear_en)
  advise replacing specialist terms with wording the reader already
  understands, which agrees with the already-read `better-writing` (pass 05)
  and `localization-design` (pass 19) skills. The alternatives were a
  parenthetical gloss of `contrepassation bancaire` or keeping the term; plain
  wording was chosen because the sentence only needs to say that Olaso does not
  refund and does not cancel card payments.
- **Changes:** `src/lib/fr.ts` changes the value of the existing key
  `The original order stays in history and the saved stock is restored. Olaso does not refund or reverse card payments.`
  from `La commande d’origine reste dans l’historique et le stock est rétabli. Olaso ne rembourse pas les paiements par carte et n’effectue aucune contrepassation bancaire.`
  to `La commande d’origine reste dans l’historique et le stock est rétabli. Olaso ne rembourse pas et n’annule pas les paiements par carte.`
  The English source string, the `CancellationDialog` component, the first
  sentence about history and restored stock, the `Motif obligatoire` label,
  the validation message, `Conserver` and `Annuler la commande`, and every
  other screen are unchanged. The separate `Reversal` -> `Contrepassation`
  label used by the Reports `CostsPanel` is a different screen and is
  intentionally untouched.
- **Verification:** `npm run build` passed (the known `jeep-sqlite` `crypto`
  externalization warning is unchanged) and `git diff --check` passed. The
  debug APK already rebuilt from this exact edit earlier on 23 September 2026
  was running on the connected Redmi `22081283G` (adb serial
  `XOPFAQGYNNGYVGPR`; package `com.olaso.pos` `lastUpdateTime`
  2026-09-23 11:54:50). With French selected and sale `0926-0002` open on the
  Commandes screen, opening the cancellation dialog and reading it through the
  WebView bridge returned the new sentence exactly:
  `La commande d’origine reste dans l’historique et le stock est rétabli. Olaso ne rembourse pas et n’annule pas les paiements par carte.`
  The tablet screenshot `tmp/ui03-cancel-dialog-fr-plain.png` shows the title
  `Annuler 0926-0002`, no eyebrow, the new sentence on two unclipped lines,
  `Motif obligatoire`, `Conserver` and `Annuler la commande`. The dialog was
  closed with `Conserver`; sale `0926-0002` stayed completed and synced; no
  cancellation was submitted; focused logcat showed only the known chromium
  `Seed missing signature` line.
- **Limitations:** the connected test device is the Redmi `22081283G`, not the
  Samsung Galaxy Tab A9 the root `AGENTS.md` names as the production baseline;
  the 1340 × 800 browser view of this dialog was not captured; TalkBack speech,
  enlarged OS text and RTL remain unverified. The French edit was left
  uncommitted in the working tree by the interrupted previous worker and is
  completed by this entry. Unrelated working-tree changes (`AGENTS.md`,
  `SAAS_TRANSITION.md`, `src/features/reports/reportProfit.ts`) were preserved
  and not staged.
- **Status:** UI-03 owner acceptance is still pending; this is a copy
  correction, not an acceptance, and it does not reopen any recorded Orders
  pass.
- **Exact next action:** the owner reviews the corrected French cancellation
  dialog and accepts UI-03 or names one scoped correction. Do not advance to
  Products.
- **Publication:** implementation commit
  [`477d432`](https://github.com/aymansal/olaso-pos/commit/477d43225f4abde6064581989cdd758f5656cc37)
  is pushed to `origin/main`; this follow-up ledger commit records that
  publication.

### UI-03 — owner copy correction: drop the redundant cancellation eyebrow and state no card refund, 23 September 2026

- **Owner request and scope:** a narrow UI-03 Orders cancellation copy
  correction. Remove the redundant `WHOLE-SALE CORRECTION` eyebrow from the
  cancellation dialog, and make the English and French body copy plainly state
  that the original order remains in history and that Olaso does not refund or
  reverse card payments. The internal correction model, data, sync names and
  flows are unchanged, and no other screen, error message or translation area
  is included.
- **Research before implementation, 23 September 2026:** the [W3C WAI-ARIA APG
  modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
  makes `aria-labelledby` or `aria-label` the dialog's accessible name and
  treats `aria-describedby` as optional, so removing a decorative label cannot
  change the dialog's name or description.
  [Android WebView guidance](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  keeps accessibility labels in the web content and advises against redundant
  labels, which supports deleting a label that repeats the title.
  [Capacitor's workflow](https://capacitorjs.com/docs/basics/workflow) confirms
  HTML/CSS changes are web-layer work that needs no native change. The
  alternatives were replacing the eyebrow with `ORDER CANCELLATION` or leaving
  it in place; the owner chose removal because the existing title already names
  the action.
- **Changes:** `src/features/orders/components/CancellationDialog/CancellationDialog.tsx`
  removes the header `<small>` eyebrow and replaces the body sentence with
  `The original order stays in history and the saved stock is restored. Olaso does not refund or reverse card payments.`
  The `aria-labelledby` title, the `aria-describedby` body, the close control,
  the reason label, the validation message and both footer actions are
  unchanged. `src/lib/fr.ts` moves the body entry to its alphabetical position
  as
  `La commande d'origine reste dans l'historique et le stock est rétabli. Olaso ne rembourse pas les paiements par carte et n'effectue aucune contrepassation bancaire.`
  and deletes the now-unused `WHOLE-SALE CORRECTION` key. No data, model, sync,
  document or other screen changed.
- **Verification:** `npm run build` passed and the known `crypto` externalization
  warning from `jeep-sqlite` is unchanged. `npm run check:orders` passed its
  historical receipt and signed-option assertions, then stopped at the protected
  `OLASO_OWNER_PIN` restore gate; no reset or reseed was attempted.
  `git diff --check` passed and the focused diff contains only the dialog and
  `fr.ts`. `npm run android:beta` passed with the repository JDK 21 and the debug
  APK installed with `adb install -r`, preserving café data (APK SHA-256
  `97D7340600A47DA77D9AC897D37F7BFAF60F7C800D1F8AC8DAEBC6AD1BC6C9FC`). On the
  Redmi `22081283G` at the 1340 × 804 WebView the dialog opened on the completed
  sale `0926-0002` with no eyebrow, the title `Cancel 0926-0002` and the new body
  sentence; closing used `Keep order` and the order stayed `Completed · Synced`.
  With French selected, the same dialog showed the title `Annuler 0926-0002`, the
  new French sentence on two unclipped lines, `Motif obligatoire`, `Conserver`
  and `Annuler la commande`. Captures: `tmp/ui03-cancel-dialog-en.png` and
  `tmp/ui03-cancel-dialog-fr.png`. English was restored; no cancellation was
  submitted and no print, stock or sale state changed.
- **Limitations:** the 1340 × 800 browser view of this dialog was not captured
  because no live browser preview of the real Orders flow is available here and
  the earlier temporary fixtures were not the real component flow, so the
  physical tablet is the authoritative visual evidence. TalkBack speech, enlarged
  OS text and RTL remain unverified. A completed same-day sale `0926-0002`
  already existed on the tablet during this review; this work created no sale and
  changed no order.
- **Status:** UI-03 owner acceptance is still pending; this correction is not an
  acceptance and does not reopen the recorded Orders passes. The internal
  append-only correction vocabulary in the data, sync and doctrine documents is
  intentionally retained.
- **Exact next action:** the owner reviews the corrected cancellation dialog in
  English and French and accepts UI-03 or names one scoped correction. Do not
  advance to Products.
- **Publication:** implementation commit
  [`8ac87a2`](https://github.com/aymansal/olaso-pos/commit/8ac87a2d13cdc67e3bb2433282fca937044eb178)
  is pushed to `origin/main`; this follow-up ledger commit records that
  publication. The protected destructive checks were not run.

### UI-03 — owner correction: Orders / Sales is the active screen, 23 September 2026

- **Source and date:** explicit owner correction on 23 September 2026 that the
  active UI-polish screen is UI-03 Orders / Sales rather than POS. This agrees
  with `SAAS_TRANSITION.md` (its opening pointer and its current-instruction
  section both name Orders / Sales as the active screen) and with this ledger's
  own Screen queue and its 21 recorded Orders passes.
- **Stale text corrected:** the State pointer previously claimed the owner had
  finished the Orders work and that UI-02 POS was the active screen, and the
  queue row still read `step 01 Apple Design complete with owner exceptions;
  step 02 next` although passes 01–21 are recorded. Documentation only: no
  code, UI, design, device or data change.
- **Erroneous detour recorded:** the 23 September POS customization-popup
  screenshot exercise is recorded as an unauthorized detour. It is not
  acceptance evidence for UI-02 or any screen, it changed no POS file, and the
  UI-02 option-row appearance stays as written in `DESIGN.md`.
- **Carried forward unchanged:** the owner's retained palette decision for the
  two faint shared text colours, and the recorded limitations (TalkBack speech,
  enlarged OS text, RTL and long-expansion, a real cloud-outage transition, and
  live reprint). None of these becomes a pass.
- **Verification:** `git diff --check` and the targeted `git diff` were reviewed;
  only this ledger changed, so no app build was run. Unrelated working-tree
  changes were preserved.
- **Status:** UI-03 is the active card and is NOT owner-accepted. All 21
  individual passes are recorded; owner acceptance is pending.
- **Publication:** not committed and not pushed, per the owner's instruction for
  this docs-only correction.
- **Exact next action:** the owner reviews the recorded Orders evidence and
  accepts UI-03 or names one scoped correction. No further Orders work and no
  Products work until that decision is recorded.

### UI-03 — restore development cloud order history before polish, 21 September 2026

- **Owner request and scope:** before changing the Orders appearance, restore
  the existing development mock orders so All dates, This month, Last month,
  This week, paging and order details can be checked against real data. This
  is a data-path correction only; no Orders layout or wording was redesigned.
- **Root cause:** the development seed creates sales in Convex, while the
  previous `useOrdersData` path treated SQLite keys as an allow-list and
  discarded every cloud row that had no matching local row. Dashboard and
  Reports used cloud summaries, so they still showed numbers while Orders was
  empty. This was the existing local-history merge contract, not missing seed
  records.
- **Research before implementation (21 September 2026):** [Convex paginated
  queries](https://docs.convex.dev/database/pagination) support cursor-based
  pages; [Convex indexes](https://docs.convex.dev/database/reading-data/indexes/)
  require the date/status access paths used here; [Convex filtering](https://docs.convex.dev/database/reading-data/filters)
  documents bounded server-side filters. [Capacitor](https://capacitorjs.com/docs)
  keeps this existing React/data change in the WebView boundary; no native
  Android or plugin change was needed. Alternatives were an unbounded client
  download or a destructive reseed; both were rejected for performance and
  data-safety reasons.
- **Changes:** `convex/schema.ts` adds business-date and status/date indexes;
  `convex/sales.ts` accepts bounded date/status filters, returns cursor pages,
  and derives an All/date total from bounded `dailyMetrics` summaries;
  `src/data/useOrdersData.ts` replays cursors for requested pages, merges cloud
  rows with matching local print state, and keeps unsynced local rows visible;
  `src/features/orders/OrdersScreen.tsx` avoids resetting a requested page
  while the remote total is loading. The search box continues to use the
  existing local search path until a proper Convex search index is designed;
  entering text therefore does not fetch cloud-only rows.
- **Observed development data:** the deployed development query returned 1,028
  All-date orders, 685 for 01–21 September 2026, and 332 for 01–31 August
  2026. The current week (14–21 September) has no 21 September sale in the
  seed, so its empty result is expected. The next page showed orders 9–16 and
  the first page showed 1–8 of 1,028 on the Redmi.
- **Cloud-only behavior:** a cloud row can be opened, but Reprint and Cancel
  remain unavailable when the tablet has no local receipt/print state. This
  preserves the existing Orders contract and does not pretend the cloud row is
  locally printable.
- **Verification:** `npm run check:convex`, `npx convex dev --once`,
  `npm run build`, and `npm run android:beta` passed. The APK was installed
  over the connected Redmi with `adb install -r`, preserving its data; the
  Orders viewport measured 1340 × 804. `npm run check:orders` passed its local
  receipt/option assertions, then stopped at the protected `seed:verify`
  destructive-reset gate because this deployment is not marked disposable; no
  reset was attempted. Browser visual polish and the full Orders skill review
  are still pending.
- **Limitations and next step:** exact totals are currently available for All
  and date-range queries from saved daily summaries; status-filtered totals use
  the bounded observed-page fallback until a server-side status rollup exists.
  Cloud text search remains the explicit follow-up above. Owner review of the
  restored periods is required before the combined UI-03 polish pass begins.
- **Publication:** implementation commit will be recorded after this change is
  pushed; implementation `66af2fb` is now pushed to
  [`origin/main`](https://github.com/aymansal/olaso-pos). The installed beta
  APK SHA-256 is
  `41e01a67da0d6e1afbfe8a0ce8d17b6fdae9eec961ab5f1fa5bd9c8f47c169d9`.

### UI-03 — physical Orders review and safe tablet wake correction, 21 September 2026

- **Owner workflow correction:** the Redmi has two separate states: a black
  screenshot means Android's display is asleep, while the visible Olaso unlock
  screen is the app's five-minute terminal lock. The physical review must take
  a screenshot first, wake only the Android display when needed, and use the
  normal owner unlock for the Olaso screen. The tablet must never be sent the
  Android menu key because Redmi opens Recents for that key.
- **Research before the tooling correction:** Android's [ADB guidance](https://developer.android.com/tools/adb)
  and [`KeyEvent.KEYCODE_WAKEUP` reference](https://developer.android.com/reference/android/view/KeyEvent#KEYCODE_WAKEUP)
  were checked on 21 September 2026. The smallest safe choice is to keep the
  existing wake key and delete the incompatible `KEYCODE_MENU` command from
  the development-only helper. Alternatives such as coordinate tapping or
  sending more navigation keys were rejected because they are device-specific
  and can open system UI. This is an Android test-tool change only; React,
  Capacitor, the WebView boundary, storage, sync and café data were untouched.
- **Tooling change:** `scripts/tablet-session.mjs` now wakes the display without
  opening Recents. The direct WebView unlock path was used for this review, and
  the owner PIN was kept out of files, logs and the ledger.
- **Fresh Redmi evidence:** after taking a screenshot first, the app was
  unlocked directly and reviewed at `1340 × 804`. The live Orders screen showed
  the unchanged `0926-0001` sale. All and Completed kept the row and selected
  detail. The open date calendar showed Today, Yesterday, week/month ranges and
  All. Search for the order number narrowed the table correctly and was then
  cleared. The cancellation popup opened, empty submission showed
  `Correction reason must contain 3 to 240 characters.`, and Keep order closed
  it without changing the sale. Captures: `tmp/ui03-orders-before-actions.png`,
  `tmp/ui03-date-picker.png`, `tmp/ui03-search-result.png`,
  `tmp/ui03-cancel-dialog-live.png`, and `tmp/ui03-cancel-empty-live.png`.
- **Physical limitations:** selecting Cancelled once coincided with the
  expected five-minute terminal lock before the result could be inspected.
  The current tablet date view contains the one same-day owner-review sale;
  no sale was created, cancelled, deleted or reseeded. Reprint was inspected
  as the visible `Printer unavailable · reprint available` state but was not
  triggered, so no printer side effect was introduced. French, loading, empty,
  error and cancellation-recovery states still need the browser/fixture or
  owner review evidence recorded below.
- **Verification:** the tablet showed no console or focused logcat errors in
  the fresh dumps. `npm run build`, `git diff --check`, and Graphify code-only
  refresh passed. `npm run check:orders` passed its static regression checks
  but stopped at the existing protected `seed:verify` destructive-reset gate;
  no reset was attempted. The helper correction did not require a new APK.
- **Status:** UI-03 remains incomplete and owner review is still required.
  Exact next action is for the owner to review the Orders screen, filters,
  selected row, calendar, popup, reprint state and recovery states; do not
  advance to Products.
- **Publication:** commit `d9970d6a995fc686bd746de0085a43cdbfe3855f` is pushed
  to [`origin/main`](https://github.com/aymansal/olaso-pos/commit/d9970d6a995fc686bd746de0085a43cdbfe3855f).

### UI-03 — combined Orders polish checkpoint, 21 September 2026

- **Scope reviewed:** the 1340 × 804 Orders screen, search field, status
  filters, date calendar portal, paginated table rows, empty/loading message,
  selected-order detail panel, reprint/cancel actions, and cancellation dialog.
  Data visualization was not applicable because Orders has no chart surface.
  The approved two-panel geometry, 42px toolbar controls, and existing table
  density were kept unchanged.
- **Research before implementation:** the [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
  was checked for focus entry, Tab containment, Escape close, and focus return;
  [MDN `:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible),
  [MDN `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action),
  and [MDN `user-select`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/user-select)
  were checked for keyboard indication, tablet taps, and the owner’s
  screen-by-screen selection rule. Android [WebView guidance](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and the Capacitor [Web API boundary](https://capacitorjs.com/docs/core-apis/web)
  confirmed that this interaction work belongs in the existing React/WebView
  layer; no native plugin change was justified. Checked 21 September 2026.
- **Skill findings merged once:** Apple/Emil restraint and immediate feedback;
  Better Accessibility focus visibility, 44px dialog actions, Escape/focus
  return and error announcement; Better UI active feedback and reduced-motion
  compatibility; Better Writing recovery wording; Mobile Native touch
  handling; Error Handling UX validation and preserved input; Localization and
  token reviews found no new wording or token requirement. No layout,
  palette, animation, decoration, or data-model choice was invented.
- **Changes made:** added a shared `src/components/useModalFocus.ts` and used
  it for the Orders calendar and cancellation popup plus the existing POS
  payment/modifier dialogs. Popups now focus their first control, keep Tab
  inside, close with Escape, and restore the invoking control or selected row.
  Orders buttons now expose visible green/white focus rings, immediate press
  feedback, and tablet `touch-action`; interface labels and values are
  unselectable while search and reason text remain selectable. Cancellation
  now reports the required 3–240 character reason inline, links the error to
  the textarea, and keeps the submit action available until the request starts.
- **Owner follow-up:** the owner rejected the gray pressed overlay when a
  sliding selected indicator already exists. The Orders table row, Orders
  status filters, and primary navigation must keep only their indicator. The
  POS service/payment controls and profile language control should use the same
  sliding indicator behavior; the language indicator uses the green pill.
- **Verification:** `npm run build`, `npm run check:pos`, Graphify code-only
  refresh, `npm run android:beta`, and Redmi install with `adb install -r`
  passed. Redmi showed the restored 1,028-order first page at 1340 × 804 in
  `tmp/ui03-orders-polished.png`; the existing rows, selected detail, payment
  totals and cloud-only action note remained visible. WebView checks confirmed
  the calendar receives focus, Shift+Tab wraps to its last control, Escape
  closes it, and focus returns to the page. `check:orders` and
  `check:reports` reached their existing protected destructive-reset gate;
  no reset was attempted. The CSS scope scanner still reports its existing
  unrelated `from`/`to` animation selectors.
- **Limitations:** the browser preview remained locked during this checkpoint;
  the Redmi is the authoritative visual evidence. The selected seeded rows
  are cloud-only, so cancellation popup submit/recovery and local reprint
  cannot be exercised on this tablet row. Cloud text search remains the
  bounded-data follow-up recorded above. Screen-reader speech, 200% text,
  RTL, and every French Orders state remain unverified.
- **Status:** combined review is in progress; this checkpoint is not a claim
  that UI-03 is complete. Exact next action is owner review of the Orders
  screen and popup states, then finish the remaining UI-03 loading/empty/error,
  French and cancellation evidence before advancing to Products.
- **Publication:** implementation commit `4255f53` is pushed to
  [`origin/main`](https://github.com/aymansal/olaso-pos/commit/4255f5344d6daaf6e87fa1b2db037ce1c46a56b0).
  The rebuilt APK SHA-256 is
  `740F6E46CA48E15CB9B7CD70C1CF3B15991179298327F0329E24139A193B4884`.
  This ledger publication is the follow-up commit for the same UI-03 card.

### UI-03 — remove duplicate sliding-selection feedback and open cancellation review, 21 September 2026

- **Owner correction:** a selected sliding pill already communicates both the
  selected item and the immediate touch result. A second gray pressed layer made
  the top navigation, Orders filters, and Orders rows look like two controls were
  selected at once. This owner rule is now part of the permanent ledger and
  applies to every later sliding control.
- **Research before implementation:** the installed Apple Design, Emil Design
  Engineering, Better UI, and Review Animations skills were reread for restraint,
  immediate feedback and motion interruption. The official [MDN `:active` guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/:active)
  and [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
  were checked on 21 September 2026. The existing 220ms Olaso indicator timing
  was reused; no new animation library or native Android change was needed.
- **Changes:** removed only the duplicate gray `:active` background from primary
  navigation, Orders status filters and selected table rows. Added the same
  restrained sliding indicator transition to the POS service and payment controls.
  The profile language control now uses a green sliding pill; its selected label
  stays white on that pill and has no second gray active state. Settings and Lock
  actions keep their ordinary press feedback because they do not have a sliding
  selection indicator. All changed controls keep the reduced-motion override.
- **Same-day cancellation evidence:** created the normal development sale
  `0926-0001` through the Redmi POS on 21 September 2026 at 16:02, then opened
  Orders and its `WHOLE-SALE CORRECTION` popup. Submitting an empty reason showed
  the inline 3–240 character validation and marked the textarea invalid. No
  cancellation was submitted; the order remains available for the owner's manual
  review. Capture: `tmp/ui03-cancellation-polished.png`.
- **Device visual evidence:** the Redmi WebView measured 1340 × 804. The profile
  menu capture `tmp/ui03-profile-language.png` shows the green EN pill; computed
  styles reported the green indicator (`rgb(0, 106, 43)`), white selected label,
  transparent inactive label, and a 0.22s indicator transition. POS service and
  payment indicators reported the same 0.22s transition. The tablet helper's
  wake action briefly opened Android Recents; the app was returned to the
  foreground with the normal `am start` activity command before the accepted
  screenshot was taken.
- **Verification:** `npm run build`, `npm run check:pos`, `npm run android:beta`,
  `git diff --check`, Graphify code-only refresh, and `adb install -r` passed.
  The build and install preserved the development data. The installed APK
  SHA-256 is `42CD87259EF626977933CE44620B000BDDFF78B900B3D55E86ACFA21866E8C57`.
  The full Orders visual
  review remains incomplete until the owner reviews the top navigation, filters,
  selected row, POS service/payment controls, profile menu, and cancellation
  popup on the live tablet.
- **Exact next action:** owner manually reviews this focused correction and the
  now-accessible cancellation popup; then verify the remaining UI-03 empty,
  loading, error, French and reprint states before marking Orders complete.
- **Publication:** implementation `137b430` is pushed to
  [`origin/main`](https://github.com/aymansal/olaso-pos/commit/137b430).

### UI-03 — empty-state recovery action and physical verification, 21 September 2026

- **Finding and decision:** the empty Orders result previously said only
  `No matching orders.`. The current `better-writing` rule says filtered empty
  states should offer a clear exit, and `error-handling-ux` requires a specific
  recovery action. The smallest approved change reuses the existing controls:
  `Clear filters` clears search, status, and date, then selects the existing
  `All` range. The action is hidden while loading and when there is nothing to
  clear. No order, database record, layout, or new dependency was added.
- **Research before implementation (21 September 2026):** the installed
  `better-writing`, `error-handling-ux`, `loading-states`,
  `design-qa-checklist`, and prior combined UI-03 skills were reread. Android's
  [WebView guidance](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and Capacitor's [Web API boundary](https://capacitorjs.com/docs/core-apis/web)
  confirm this is React/WebView state and does not require Kotlin or a native
  plugin. Alternatives were a new empty-state component, a new filter system,
  or native code; all were unnecessary.
- **Files changed:** `src/features/orders/OrdersScreen.tsx`,
  `src/features/orders/components/OrdersListPanel/OrdersListPanel.tsx`,
  `src/features/orders/components/OrdersTable/OrdersTable.tsx`,
  `src/features/orders/components/OrdersTable/OrdersTable.module.css`,
  `src/lib/fr.ts`, and this ledger. The temporary ignored browser fixture was
  updated only so it could render the new required prop.
- **Browser evidence:** the clean Orders fixture rendered at exactly `1340 ×
  800`; `No matching orders.` and `Clear filters` were visible together, the
  table had no overflow, and the clean tab reported no console errors or
  warnings. A fresh French fixture at the same size showed `Aucune commande
  correspondante.` and `Effacer les filtres`, with no overflow or console
  errors/warnings. Existing live, loading, and cloud-error fixtures remained
  available from the same UI-03 review set.
- **Physical evidence:** device is Redmi Pad `22081283G`, WebView `1340 ×
  804`. Screenshot-first capture `tmp/ui03-empty-first.png` showed the Olaso
  lock screen, not a black sleeping display. After the APK update, the install
  briefly left Android Recent Apps visible; no Recent Apps/menu key was sent,
  and `am start com.olaso.pos/.MainActivity` returned to Olaso. The owner
  unlock used the existing in-app button menu with the PIN kept out of files and
  output. Search for a harmless non-order string produced the empty state and
  `Clear filters`; pressing it restored `0926-0001`, switched the date control
  to `All dates`, and showed the saved first page (`1,029` orders). Captures:
  `tmp/ui03-empty-orders-before-search.png`,
  `tmp/ui03-empty-search-focused.png`, `tmp/ui03-empty-orders-result.png`,
  and `tmp/ui03-empty-orders-restored-full.png`. No console or focused logcat
  errors appeared; the development sale and database were unchanged.
- **Checks:** `npm run build` passed. `npm run android:beta` passed with the
  existing JDK 21 toolchain after the shell-only missing-`JAVA_HOME` retry;
  `adb install -r` passed and preserved the café data. APK SHA-256 is
  `A23F5A7129BA909BA9799DA793F900B0A3E62641CA8B15910670E5426E5DA3EF`.
  `npm run check:orders` passed its static receipt assertions, then stopped at
  its protected owner-PIN restore gate; no reset or reseed was attempted.
  The focused empty-state source guard passed. `npm run check:css-scope` still
  reports only the four existing `from`/`to` keyframe selectors in untouched
  App/Lock CSS. `git diff --check` passed.
  `graphify update .` passed with `2,919` nodes, `6,220` edges, and `197`
  communities; it reported the existing three Gradle syntax warnings and the
  existing need for LLM community relabeling.
- **Status and limitation:** the empty-state recovery gap is closed and this
  step did not change the approved layout or sliding-selection rule. Loading,
  cloud-error, French, reprint, cancellation, and recovery evidence remains
  part of the open owner review; this does not mark UI-03 accepted and does not
  authorize Products.
- **Publication:** implementation commit `f4e5731` is pushed to
  [`origin/main`](https://github.com/aymansal/olaso-pos/commit/f4e5731).
- **Exact next action:** owner reviews the combined UI-03 browser/tablet
  evidence and explicitly accepts or requests another scoped correction. Keep
  the screen on Orders until that acceptance.

### UI-03 — owner sliding-state review and combined skill checklist, 21 September 2026

- **Owner rule reconfirmed:** when a control has a sliding selected pill or
  indicator, that indicator is both selection and immediate touch feedback.
  The same control must not add a gray pressed background. This applies to
  primary navigation, Orders filters, Orders rows, POS service/payment,
  profile language, and future controls using this pattern.
- **Source decision:** the existing CSS already implements this rule. The
  navigation, Orders filters, Orders rows, POS service/payment controls and
  language buttons use transparent button surfaces plus one indicator layer;
  their only active animation is the existing indicator transition. No source
  file, dependency, data, or APK was changed in this continuation.
- **Research reused before this review:** [Apple buttons](https://developer.apple.com/design/human-interface-guidelines/buttons),
  [MDN `:active`](https://developer.mozilla.org/en-US/docs/Web/CSS/:active),
  [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion),
  [Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview),
  and [Capacitor Web APIs](https://capacitorjs.com/docs/core-apis/web), checked
  21 September 2026. CSS/React remains the correct boundary; adding a second
  pressed layer, JavaScript press state, native Android code, or a new package
  would add no needed behavior.

| Skill | UI-03 result | Evidence or remaining boundary |
| --- | --- | --- |
| `apple-design` | Verified for this correction | Green sliding indicator is the single selected/immediate state; no decorative press layer. Redmi capture `tmp/ui03-nav-products-pressed.png`. |
| `better-interface` | Routed and verified | Shared control consistency checked against the six domain rows below; no duplicate finding. |
| `better-accessibility` | Partial | Cancellation focus, Escape/recovery, visible focus treatment and editable-text selection were previously verified. TalkBack speech and enlarged OS text remain unverified. |
| `better-layout` | Verified on device | Orders, popup, French labels and navigation fit at Redmi WebView `1340 × 804`; browser `1340 × 800` was not available in the in-app browser panel during this continuation. |
| `better-writing` | Verified for checked states | English and French navigation, filters, status, cancellation validation and recovery text were readable and action-specific. |
| `better-typography` | Partial | English/French type fit the fixed device layout; enlarged OS text and full browser viewport review remain unverified. |
| `better-colors` | Partial | Green indicator, white selected text and transparent inactive controls were confirmed by computed styles; no new contrast measurement was made in this continuation. |
| `better-ui` | Verified for affected controls | Only the sliding indicator changes on selection; ordinary settings/lock actions retain ordinary press feedback. |
| `no-ai-design-slop` | Verified | No new decoration, container, effect, animation or redundant label was added. |
| `audit-ai-design-slop` | No new finding | The removed duplicate gray layer was the concrete competing-state defect; the existing visual language was preserved. |
| `emil-design-eng` | Verified for affected motion | Indicator motion is spatially meaningful, interruptible CSS `transform`, `220ms`, and has reduced-motion handling. |
| `review-animations` | Verified for affected motion | No keyframes, layout animation, `transition: all`, or motion-only feedback; affected motion remains under 300ms. |
| `design-qa-checklist` | Partial | Normal, selected, French, popup, validation, reprint-available and cancellation-recovery evidence exists. Live loading, empty and cloud-error states still need final owner/state evidence. |
| `error-handling-ux` | Verified for checked flow | Empty cancellation reason showed the 3–240 character error, preserved the order, and Keep order closed the popup without changing data. |
| `critique-visual-hierarchy` | Verified | The green indicator and selected row remain the only selection emphasis; no gray competing state appears. |
| `critique-information-density` | Verified | Approved two-panel geometry and table density stayed unchanged; no extra status layer was added. |
| `critique-affordance` | Verified for checked controls | Navigation, filters, selected row, language, reprint and cancel actions remain visibly actionable. |
| `design-token-audit` | Verified for this change | Affected surfaces use existing Olaso tokens; no new color, radius or motion token was introduced. |
| `data-visualization` | Not applicable | Orders has no chart or other data-visualization surface. |
| `mobile-native` | Verified on Redmi | Touch navigation and popup behavior were checked on the physical Android tablet at `1340 × 804`; the safe wake path did not open Recent Apps. |
| `localization-design` | Partial | English and French Orders states fit and remain readable; RTL and broader expansion testing remain unverified. |
| `loading-states` | Partial | Loading/empty copy remains present in the existing Orders table path, but live loading and cloud-error transitions were not reproduced on the tablet. |

- **Fresh Redmi evidence:** screenshot-first check found the app lock screen,
  not a black asleep display; the app was unlocked without Recent Apps. The
  live Orders page showed `0926-0001`, All and Completed filters, selected row,
  reprint-available state, cancellation popup, empty-reason validation and
  unchanged order recovery. Navigation from Orders to Products showed only the
  Products pill, with no gray pressed layer. French Orders and the green FR
  language pill fit at `1340 × 804`. Captures: `tmp/ui03-orders-owner-review.png`,
  `tmp/ui03-orders-completed.png`, `tmp/ui03-nav-products-pressed.png`,
  `tmp/ui03-profile-language-owner-review.png`,
  `tmp/ui03-cancellation-owner-review.png`,
  `tmp/ui03-orders-french-owner-review.png`.
- **Device/runtime result:** no console messages, focused logcat errors,
  clipping or overflow were observed. The retained development order remains
  completed and unchanged. The installed APK remains SHA-256
  `42CD87259EF626977933CE44620B000BDDFF78B900B3D55E86ACFA21866E8C57`.
- **Checks:** `npm run build`, `npm run check:pos`, the focused sliding-state
  source guard, and `git diff --check` passed. `npm run check:orders` passed
  its historical receipt assertions, then stopped at its protected owner-PIN
  restore gate; no reset or reseed was attempted. `npm run check:css-scope`
  still reports only the existing `from`/`to` keyframe selectors in untouched
  `src/App.module.css` and `src/features/settings/LockScreen.module.css`.
- **Publication:** this ledger checkpoint is the only working-tree change for
  this continuation. It must be committed with a `UI-03` message and pushed
  to `origin/main`; commit `6cfc1ef97cdd4b5a744b6997ff5813404d4a6bcf`
  is published at `origin/main`. Unrelated
  `src/features/reports/reportProfit.ts` and the preserved untracked
  directories remain outside the card.
- **Status:** UI-03 remains open. Technical review confirms the sliding-state
  correction; owner acceptance and final loading, empty and cloud-error
  evidence are still required before Products. No browser `1340 × 800` visual
  claim is made from the smaller in-app browser panel.
- **Exact next action:** owner reviews the fresh English/French Orders captures
  and the live tablet, then we close the remaining state-evidence gaps or record
  the owner's explicit acceptance/limitation. Do not advance to Products.

### UI-03 — close remaining state evidence and cloud-history retry, 21 September 2026

- **Honest continuation status:** the earlier UI-03 entries did not claim that
  every applicable requirement was passed. This continuation closed the
  implementation gap in the unavailable-history state and rechecked the
  remaining safe browser states. It did not invent a new layout or wait for
  owner acceptance before doing independent work.
- **Research before implementation:** the existing [W3C alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
  was checked for announcing the cloud-history problem while keeping the
  saved rows available. Android [WebView guidance](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and Capacitor's [Web API boundary](https://capacitorjs.com/docs/core-apis/web)
  confirmed that retry presentation and refresh wiring belong in the existing
  React/WebView layer; no native Android code, plugin, dependency or database
  change was justified.
- **Applicable skill record:** all applicable UI-03 skills named by the ledger
  were read before this screen review and remain covered by the combined table
  above. This continuation specifically applied `error-handling-ux`,
  `loading-states`, `better-writing`, `better-accessibility`,
  `design-qa-checklist`, `better-layout`, `localization-design`, and
  `mobile-native` to the new recovery control and state evidence.
  `data-visualization` remains not applicable because Orders has no chart
  surface. The review does not claim that every installed design skill applies
  to an Android POS screen.
- **Smallest change:** the existing Orders data hook now exposes its existing
  refresh function; `OrdersScreen` passes it to `OrdersListPanel`; and the
  unavailable-history message now shows a small existing-style `Retry` button.
  The ignored browser fixture was updated only to satisfy the new prop. Saved
  rows remain visible while cloud history is unavailable. No data, layout,
  wording outside the recovery action, dependency or database behavior changed.
- **Browser evidence at the required 1340 × 800:** a fresh fixture tab showed
  the saved `0926-0001` row and `Retry` together with the unavailable-history
  message; `innerWidth`/`innerHeight` were `1340 × 800`, document size matched,
  and the fresh tab reported no console warnings or errors. Loading showed
  `Loading order history…` with the empty detail panel; empty showed
  `No matching orders.` plus `Clear filters`; French showed the translated
  Orders labels and saved row. None overflowed the viewport.
- **Redmi evidence:** screenshot-first capture
  `tmp/ui03-remaining-review-first.png` was black, confirming Android display
  sleep. The tablet was woken directly without Recent Apps, the normal Olaso
  owner unlock was completed privately, and the live Orders page was opened.
  The retained `0926-0001` order remained selected, completed, synced and
  unchanged at the Redmi WebView's approximately `1340 × 804` viewport.
  Captures include `tmp/ui03-remaining-review-orders-page.png` and
  `tmp/ui03-remaining-review-orders-live.png`.
- **Checks:** `npm run build` passed. The current debug APK was installed with
  `adb install -r`; local APK SHA-256 is
  `AA0138D6C0B64B482B5E866BC0479BB7EE668BCA0F9D91C47E576AFF2E8B8153`.
  `git diff --check` passed. `npm run check:orders` passed historical receipt
  assertions and stopped at its protected `OLASO_OWNER_PIN` restore gate; no
  reset or reseed was attempted. `npm run check:css-scope` still reports only
  the four existing `from`/`to` keyframe selectors in untouched App/Lock CSS.
  Full `graphify . --update` still requires an unavailable LLM key; the
  permitted `graphify . --update --code-only` refresh passed with 2,920 nodes,
  6,221 edges and 186 communities. `caveman status` passed.
- **Remaining limitations:** TalkBack speech, enlarged OS text, RTL/large
  localization expansion, and a real cloud-outage transition on the tablet
  remain unverified. The real reprint action was not triggered because the
  tablet has no printer and the owner-review sale must remain unchanged. These
  are recorded limitations, not silently marked as passed.
- **Status:** the Orders implementation and safe state evidence are complete
  for this continuation, but UI-03 is not owner-accepted. No Products work is
  authorized. This continuation was committed as `60d78b7` and pushed to
  [`origin/main`](https://github.com/aymansal/olaso-pos/commit/60d78b7).
- **Exact next action:** the owner reviews the combined Orders evidence and
  explicitly accepts UI-03 or requests one more scoped correction. Only after
  that acceptance may the sequence move to Products.

### UI-03 / UI-02 — owner corrections, 21 September 2026

- **Owner decision:** the two faint shared text colors remain unchanged. The
  earlier contrast finding is retained for the later palette pass and is not a
  blocker for this targeted layout work.
- **Orders correction:** the date control now keeps its calendar and chevron at
  their normal size, gives the label one line, and uses a compact locale-aware
  range label so the year stays visible. The control uses the existing right
  edge of the fixed tablet toolbar; the surrounding screen geometry is not
  rearranged. Clearing search/status/date filters now returns to the product's
  owner-selected default, **This week**, rather than **All dates**. The initial
  Orders range also opens on This week so reset and startup agree.
- **POS correction:** the small customization dialog footer now keeps Cancel,
  Add to order, and the amount on one non-wrapping row. The wide dialog keeps
  the same footer behavior. No option rows, colors, product data or popup
  height rules changed.
- **Research checked before implementation:** [MDN `white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/white-space)
  and [MDN `flex-shrink`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-shrink)
  were checked on 21 September 2026. The fixes use the existing CSS flex layout;
  no library or runtime measurement was added. The unchanged Android boundary
  remains the existing [WebView presentation](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  used by the app.
- **Files changed:**
  `src/features/pos/components/ModifierSelectionDialog/ModifierSelectionDialog.module.css`,
  `src/features/orders/components/OrdersListPanel/OrdersListPanel.module.css`,
  `src/features/orders/components/OrdersListPanel/OrdersListPanel.tsx`,
  `src/features/orders/OrdersScreen.tsx`, `src/lib/date.ts`, and this ledger.
- **Verification:** `npm run build`, `npm run check:pos`, `git diff --check`,
  and `graphify . --update --code-only` passed. The focused date formatter
  check produced `1–21 Sept 2026`, `31 Aug–6 Sept 2026`, and
  `31 août–6 sept. 2026` without a line break. `npm run check:orders` passed
  its historical receipt assertions but stopped at the protected
  `OLASO_OWNER_PIN` restore gate; no reset or reseed was attempted.
  `npm run check:css-scope` still reports only the four pre-existing keyframe
  selectors in untouched App/Lock CSS. The source app preview stayed on its
  startup screen and the Redmi remained on the protected lock screen, so a
  fresh physical popup tap check is still unverified.
- **Status:** the owner-requested Orders behavior and the two POS layout bugs
  are corrected in source. UI-03's palette exception remains recorded rather
  than changed. UI-02 remains open for the owner's manual popup review and the
  existing POS option-row decision.
- **Exact next action:** open the POS customization popup with a small product
  and a large product at the fixed tablet viewport, then continue the UI-02
  review only after the owner accepts this correction.

### UI-02 — latest beta installed on Redmi, 21 September 2026

- Built the current `main` checkout at commit `0a57d45` with the repository
  JDK 21. The Android beta build passed and produced
  `android/app/build/outputs/apk/debug/app-debug.apk`.
- Installed with `adb install -r` on Redmi device `XOPFAQGYNNGYVGPR`
  (`22081283G`), preserving existing app data. Android reported `Success`.
  Installed package version is `1.4` / version code `11`; `MainActivity` was
  brought to the foreground after installation.
- APK SHA-256:
  `40A867C5111CBFC0C3A5D54214FF76976E148045FC193CBAE4A7BEBDA6F69BF0`.
- This confirms delivery and launch only. It does not claim that the protected
  lock screen was passed or that the POS popup was manually exercised on this
  install.

### UI-03 — sequential pass 01, Apple Design, 21 September 2026

- **Active skill and scope:** `apple-design/SKILL.md` was reread completely for
  this individual pass. The review covered the Orders location and status
  indicators, search/status/date controls, selected row, order details, calendar,
  cancellation dialog, loading/empty/error/French fixtures and reprint/recovery
  presentation. Gesture physics, momentum, rubber-banding, audio, haptics and
  translucent materials are not used by this fixed POS screen and were recorded
  as not applicable, not added as decoration.
- **Checklist — response and wayfinding: verified.** Navigation, status filters
  and rows use one green sliding indicator as both selection and immediate
  feedback, with no second gray pressed layer. Ordinary buttons retain their
  existing pressed feedback. Orders remains visibly selected, the selected row
  stays tied to the detail panel, and completed/sync/print status remains visible.
- **Checklist — spatial consistency and agency: verified.** The date calendar is
  anchored below its trigger and remains inside the `1340 × 804` WebView. The
  destructive whole-sale correction uses a centered modal and full-viewport
  dimming scrim; Keep order, Escape and the close control all preserve the sale.
  The empty-reason validation keeps the dialog open and leaves order `0926-0001`
  completed and unchanged.
- **Checklist — focus and recovery: verified.** Fresh live checks confirmed that
  the calendar and cancellation dialog place initial focus inside, wrap both Tab
  directions, close with Escape and return focus to their triggering control.
  The cancellation error is exposed as an alert and marks the reason field
  invalid. No cancellation or reprint was submitted.
- **Checklist — motion and restraint: verified.** Selection motion is a
  compositor-friendly `transform` transition at `220ms`, with no bounce,
  keyframed decoration or input lock. Emulated `prefers-reduced-motion: reduce`
  removes the shared navigation transition; the Orders indicator CSS uses the
  same explicit no-transition rule. The approved light layout, geometry and
  information hierarchy were preserved.
- **Owner exceptions, not compliance:** Apple guidance recommends dark-mode
  adaptation and user-scaled Dynamic Type/reflow. Olaso is permanently light
  mode and the owner has approved a fixed tablet layout, so this pass does not
  claim those two items as Apple compliance. They do not authorize a redesign
  or block the next skill.
- **Evidence:** `tmp/ui03-step01-resume-first.png` shows the live anchored
  calendar at `1340 × 804`. `tmp/ui03-apple-live-check.mjs` rechecked calendar
  and cancellation focus containment/restoration, centered geometry, full
  scrim dimensions, empty validation, preserved order state and reduced-motion
  behavior. Existing unchanged browser fixtures at `1340 × 800` cover normal,
  loading, empty, unavailable-history/Retry and French presentation. The earlier
  selected-state correction and fixture evidence were reused only after the
  affected source and current live state were reconfirmed.
- **Android/Capacitor boundary:** this pass found no native lifecycle, storage,
  networking, security or hardware change. Existing Android WebView/Capacitor
  research remains applicable: these CSS/React interaction states belong in the
  WebView layer. No Kotlin, plugin, package, database or application source
  change was justified.
- **Status:** Apple Design pass complete with the two permanent owner-approved
  exceptions above; no unresolved Apple finding requires implementation.
- **Exact next action:** complete UI-03 step 02, `better-interface`, as its own
  checklist and pass. Do not use the Apple result to skip that review and do not
  advance to Products.

### UI-03 — sequential pass 02, Better Interface, 21 September 2026

- **Active skill and scope:** `better-interface/SKILL.md` and its required
  `review-format.md` were read for this individual orchestration pass. The
  boundary is the complete Orders flow at the fixed tablet surface: search,
  status filters, date picker, paginated history, selected row, receipt detail,
  reprint/cancel actions, cancellation dialog, loading, empty, unavailable,
  French and keyboard states. React/Vite, CSS Modules, Astryx Olaso tokens,
  Boxicons and the 1340 × 800 Android WebView contract were confirmed in the
  project instructions and Orders DOX.
- **Routing result:** this skill owns review scope and evidence consolidation;
  it does not replace the six domain skills. Accessibility, layout, writing,
  typography, colors and UI were kept as separate numbered passes. The source
  inspection exposed two accessibility findings and routed them to step 03:
  order rows were being exposed as table rows rather than native buttons, and
  calendar days were announced as bare numbers without a full date or selection
  state. No independent Better Interface styling change was justified.
- **Evidence:** the fresh Orders fixture was opened and inspected through its
  accessibility tree in normal, empty, loading, unavailable-history and French
  states. Existing 1340 × 800 layout evidence was reused only because these
  changes do not alter geometry. The live fixture showed the approved single
  sliding selection treatment and no second gray selected layer.
- **Research and boundary:** the [WAI-ARIA button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
  and [accessible-name guidance](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
  were checked on 21 September 2026. Android [WebView guidance](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor Web API guidance](https://capacitorjs.com/docs/core-apis/web)
  confirm that these semantics remain in the existing React/WebView layer; no
  native Android or plugin change was needed.
- **Status:** orchestration pass complete. Domain findings were not counted as
  completed domain passes; step 03 records their accessibility corrections.
- **Exact next action:** complete the standalone step 04 `better-layout` pass
  after the step 03 correction below.

### UI-03 — sequential pass 03, Better Accessibility, 21 September 2026

- **Checklist and findings:** a keyboard/accessibility-tree walk found that the
  visual order rows used `<button role="row">`, which hid the native button
  action in the accessibility tree, and that calendar days were exposed only as
  repeated numbers such as “1” and “2”. Cancellation validation also left focus
  on “Cancel order” instead of moving to the invalid reason field. These are
  direct violations of the skill's native-controls, accessible-name/state and
  invalid-field focus rules.
- **Smallest corrections:** `OrdersTable.tsx` now keeps each row as a native
  button, removes the conflicting table/row/cell role overrides, and exposes
  the selected row with `aria-current` while preserving the exact grid and
  sliding cream indicator. `PeriodCalendar.tsx` now gives every day a
  locale-aware full-date label, exposes the range state with `aria-pressed`,
  and exposes today with `aria-current="date"`. `CancellationDialog.tsx` now
  focuses the reason textarea when the submitted reason is invalid. No visible
  geometry, colors, wording, selection animation or data behavior changed.
- **Verification:** `npm run build` passed. The fresh fixture's accessibility
  tree now reports the order as a button with its complete row content; calendar
  days are full dates with their selected state; and invalid cancellation moves
  focus to the reason field while keeping the dialog open. Normal, empty,
  loading, unavailable-history and French states were inspected. `git diff
  --check` passed. `npm run check:orders` reached the historical assertions and
  stopped at the protected `OLASO_OWNER_PIN` restore gate; no PIN, reset or
  reseed was attempted. `npm run check:css-scope` still reports only the four
  pre-existing keyframe selectors in untouched App/Lock CSS.
- **Android/Capacitor boundary:** this is React/WebView semantics only. No
  Kotlin, plugin, storage, network, printer or database code changed. Physical
  tablet confirmation of TalkBack speech remains unverified.
- **Status:** Better Accessibility implementation pass complete for the
  inspected Orders flow. Enlarged system text, RTL and TalkBack speech remain
  explicit verification limits, not silent passes.
- **Exact next action:** complete UI-03 step 04, `better-layout`, as a separate
  pass; do not merge it into this accessibility result.

### UI-03 — sequential pass 04, Better Layout, 21 September 2026

- The fixed 1340 × 800 geometry, two-panel grouping, aligned table columns,
  anchored calendar and pinned detail actions were checked against `better-layout`,
  the Orders DOX and `DESIGN.md`. The empty, loading, unavailable and French
  states retained their grouping without clipping in the existing tablet
  evidence. No geometry or layout change was justified. The owner's fixed-layout
  decision remains an explicit exception to responsive reflow guidance.
- **Status:** pass complete; no source change.

### UI-03 — sequential pass 05, Better Writing, 21 September 2026

- English and French labels, recovery copy, cancellation warning, validation
  message, disabled reprint note and empty-state instructions were inspected.
  They use direct café-operational wording and provide a recovery action where
  one exists. No copy change was justified.
- **Status:** pass complete; no source change.

### UI-03 — sequential pass 06, Better Typography, 21 September 2026

- The screen uses the existing DM Sans roles, tabular money/date figures,
  one-line date/time grouping and the approved compact tablet label sizes. The
  search and reason fields remain readable and selectable. No type scale or
  layout change was justified; the fixed tablet layout and owner-scaled text
  exception remain recorded.
- **Status:** pass complete with the fixed-layout exception; no source change.

### UI-03 — sequential pass 07, Better Colors, 21 September 2026

- Existing light-mode tokens were checked against their rendered light surfaces
  using the WCAG contrast calculation. The strong text pairs pass, but
  `--olaso-text-meta` on white is about 4.04:1 and
  `--olaso-text-placeholder` on white is about 3.89:1, below the 4.5:1 normal
  text target. These tokens affect the Orders detail metadata and search
  placeholder. The [WCAG 2.2 contrast requirement](https://www.w3.org/TR/wcag/)
  was checked on 21 September 2026.
- Per `better-colors`, the palette was not changed without an owner-approved
  color decision. This is a retained finding, not a pass claim. No layout,
  copy, data or interaction behavior changed.
- **Status:** pass inspected but blocked on the owner's palette decision. The
  exact next action is to approve a token correction or explicitly retain these
  colors as an exception, then remeasure the rendered pairs.

### UI-03 — sequential pass 08, Better UI, 21 September 2026

- The skill's high-frequency motion rule was applied without changing the
  sliding interaction itself. Orders filter and table indicators now use a
  150ms transform; filter-label color also uses 150ms. The shared top-navigation
  indicator and label use the same 150ms values. All transitions name the exact
  properties, keep the existing easing, and still turn off under reduced motion.
- **Before / after:**

  | Before | After | Why |
  | --- | --- | --- |
  | `transform 220ms`, `color 180ms`, and shared nav `opacity 180ms` | `transform 150ms`, `color 150ms`, and nav `opacity 150ms` | Frequent cashier selections acknowledge immediately while preserving the owner's sliding indicator. |

- Research checked [MDN transition performance guidance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)
  on 21 September 2026; transform/opacity remain the existing compositor-friendly
  properties. No bounce, scale, blur, keyframe decoration or new dependency was
  added.
- **Status:** pass complete. The shared navigation change is intentional and
  will be reverified when those later screens receive their own passes.

### UI-03 — sequential pass 09, No AI Design Slop, 21 September 2026

- The rendered Orders states and source were checked for repeated decorative
  containers, redundant labels, fake metrics, purposeless animation and generic
  generated copy. The cream two-panel structure, status indicators, receipt
  detail and single sliding selection all communicate real order state or task
  hierarchy. No removal or replacement was justified.
- **Status:** pass complete; no source change.

### UI-03 — sequential pass 10, Audit AI Design Slop, 21 September 2026

- The same evidence was audited diagnostically rather than redesigned. No
  concrete slop pattern or established UI defect remained after the recorded
  Orders corrections. No numeric slop score or speculative redesign was made.
- **Status:** pass complete; no source change.

### UI-03 — sequential pass 11, Emil Design Engineering, 21 September 2026

- The pass used the required Before/After review format. The existing selection
  movement had a valid spatial purpose and now uses 150ms for repeated cashier
  actions; the existing custom easing stays intact. The cancellation and date
  dialogs remain static and focus-led rather than theatrical. No other motion or
  visual change was justified.
- **Status:** pass complete; source change is the step 08 duration correction.

### UI-03 — sequential pass 12, Review Animations, 21 September 2026

- Filter, table and top-navigation selection transitions animate only `transform`
  or `color`/`opacity`, can be interrupted by a new selection, and are removed
  for reduced motion. Loading, empty, error and dialog states do not depend on
  animation to communicate meaning. The existing fixed layout crossfade remains
  outside the Orders-owned components and was not changed.
- **Status:** pass complete for the inspected Orders flow; no additional source
  change.

### UI-03 — sequential pass 13, Critique Visual Hierarchy, 21 September 2026

- The Orders title and filters lead the list, the selected row ties directly to
  the receipt detail, and Reprint/Cancel remain the only detail actions. Status,
  sync and printer notes are secondary. No hierarchy correction was justified.
- **Status:** pass complete; no source change.

### UI-03 — sequential pass 14, Critique Information Density, 21 September 2026

- The table keeps one compact row per order, the detail card groups receipt
  items and payment, and scroll is limited to long item/payment content above
  pinned actions. Empty, loading and error states remove unavailable content
  instead of filling the screen with placeholders. No density change was
  justified.
- **Status:** pass complete; no source change.

### UI-03 — sequential pass 15, Critique Affordance, 21 September 2026

- Native buttons, the search field, status filters, date opener, pagination,
  retry, Reprint, Cancel and dialog controls have visible labels or accessible
  names, focus states and clear disabled behavior. The selection indicator is
  now backed by `aria-current` instead of conflicting table roles. No additional
  affordance change was justified.
- **Status:** pass complete; no source change beyond the accessibility pass.

### UI-03 — sequential pass 16, Design Token Audit, 21 September 2026

- Orders continues to use the existing Olaso color, radius, spacing, typography,
  focus and motion values. The 150ms correction reused the existing curve; no
  new token or duplicate component style was introduced.
- **Status:** pass complete; no source change beyond the recorded duration
  correction.

### UI-03 — sequential pass 17, Data Visualization, 21 September 2026

- Orders has no chart, graph or quantitative visualization surface. Money,
  counts and dates are ordinary receipt/table values and remain governed by the
  existing locale and receipt contracts.
- **Status:** not applicable with evidence; no source change.

### UI-03 — sequential pass 18, Mobile Native, 21 September 2026

- The Orders work remains inside the existing React/WebView boundary. Native
  buttons retain `touch-action: manipulation`, the fixed Android viewport and
  scroll containment remain unchanged, and no device sniffing or zoom lock was
  added. The current semantic changes still need a fresh installed-APK/TalkBack
  check on the connected Redmi; browser evidence is not a substitute for that.
- **Status:** source pass complete; physical-device verification remains open.

### UI-03 — sequential pass 19, Localization Design, 21 September 2026

- English and French fixture states were inspected. Dates, money, service,
  payment, status, pagination and recovery labels use the existing locale layer;
  calendar accessibility names are now locale-aware full dates. RTL and a long
  expansion locale were not claimed because the product currently ships EN/FR.
- **Status:** pass complete for shipped locales; RTL/expansion remain explicit
  limits.

### UI-03 — sequential pass 20, Error Handling UX, 21 September 2026

- Loading shows a loading message, empty results offer Clear filters when useful,
  cloud history keeps saved rows visible with Retry, and cancellation validation
  states the exact reason requirement while keeping the dialog open. The
  invalid field now receives focus. No further recovery change was justified.
- **Status:** pass complete for the inspected states.

### UI-03 — sequential pass 21, Design QA Checklist, 21 September 2026

- Completed the Orders state inventory in the fresh fixture: normal, selected,
  loading, empty, unavailable-history/Retry, cancellation validation, French,
  calendar open/closed and keyboard focus. `npm run build` and `git diff --check`
  passed. `npm run check:orders` stopped at its protected six-digit
  `OLASO_OWNER_PIN` restore gate after historical assertions; no reset or reseed
  was attempted. `npm run check:css-scope` still reports only the four existing
  `from`/`to` keyframe selectors in untouched App/Lock CSS. Graphify was
  refreshed with `graphify . --update --code-only` after the JSX changes.
- The required 1340 × 800 layout evidence remains valid because geometry did not
  change; fresh browser accessibility evidence was collected for the corrected
  semantics. Redmi installation, TalkBack speech, enlarged OS text, RTL and
  exact rendered contrast after a palette decision remain open.
- **Android beta evidence:** `npm run android:beta` passed after setting the
  repository JDK 21 path; the debug APK was installed with `adb install -r` on
  the connected Redmi without clearing data. APK SHA-256 is
  `7A37721C9E9CA8CE2240E42E5D9423F349ED0FA47A82145B309D414540E17A5E` and the
  WebView reported `1340 × 804`. The protected owner unlock did not reach the
  Orders screen in this run, so a fresh physical Orders interaction check was
  not claimed; no PIN was reset or guessed.
- **Status:** all numbered Orders passes have been inspected, but UI-03 is not
  owner-accepted because the color finding and physical-device checks remain
  open. Do not advance to Products.
- **Publication:** implementation commit `fa986ee`, follow-up ledger commit
  `577646a`, and this final evidence correction `969eb4d` are pushed to
  [`origin/main`](https://github.com/aymansal/olaso-pos/commit/969eb4d).

### UI-02 — combined POS review, 21 September 2026

- **Scope inventory:** the live Redmi POS was checked at its WebView viewport of
  1340 × 804: shared Header/navigation, search, four category cards, the five-
  column product grid, empty cart, cart line with quantity controls and Offert /
  remove actions, customization dialog, cash payment dialog, cancel/close,
  and the empty, selected, disabled and recovery states exposed by those
  controls. English live content was used; the existing EN/FR labels and
  locale-formatted amounts remain in the source. Browser live unlock was not
  available in this pass, so the native Redmi evidence is the authoritative
  interaction check.
- **Skills read and merged:** Apple clarity/hierarchy/feedback/restraint;
  Better Interface's accessibility, layout, writing, typography, colors and
  UI owners; anti-AI-slop and audit; Emil interaction guidance; animation
  review; design QA and error recovery; visual hierarchy, information density,
  affordance, token audit, data visualization, mobile-native and localization.
  The skills supported preserving the approved POS composition, removing no
  useful café information, avoiding decorative motion, and making repeated
  cashier actions immediate. The owner rule for unselectable interface text
  overrides the general text-selection default; editable fields still select
  normally. No skill justified changing the green outlines, product grid,
  receipt rail, or option-row appearance.
- **Research before implementation (21 September 2026):** [W3C modal dialog
  guidance](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) requires
  focus to enter a modal, remain inside while tabbing, close with Escape when
  allowed, and return to the invoking action; [MDN touch-action
  guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)
  documents `manipulation` for removing tap delay without disabling scrolling;
  [Android WebView guidance](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor's web-layer guidance](https://capacitorjs.com/docs/core-apis/web)
  keep this presentation and focus behavior in the existing React/WebView
  boundary. The alternatives were adding a widget library or changing the
  native shell; neither was needed.
- **Findings and changes:** both custom dialogs previously left focus on the
  page, did not trap Tab, and did not consistently close with Escape. The
  shared `useModalFocus` hook now moves focus into each dialog, traps Tab,
  closes through the existing cancel path, and restores the opener or its
  current equivalent when a checkout render replaces the original button.
  POS content and both dialog portals now make interface labels unselectable;
  search and other editable fields retain normal copy/paste selection. POS
  buttons use the native tap behavior with no new animation. Layout, palette,
  option rows, product names and checkout rules were otherwise left unchanged.
- **Files changed:**
  `src/features/pos/useModalFocus.ts`,
  `src/features/pos/PosScreen.module.css`,
  `src/features/pos/components/ModifierSelectionDialog/ModifierSelectionDialog.tsx`,
  `src/features/pos/components/ModifierSelectionDialog/ModifierSelectionDialog.module.css`,
  `src/features/pos/components/PaymentDialog/PaymentDialog.tsx`,
  `src/features/pos/components/PaymentDialog/PaymentDialog.module.css`,
  `src/features/pos/components/PrimaryAction/PrimaryAction.tsx`, and this
  screen contract in `src/features/pos/AGENTS.md`. Unrelated dirty files were
  preserved.
- **Verification:** `npm run build` passed; `npm run check:pos` passed; the
  existing `npm run check:sales` reached its owner restore step but was blocked
  by the protected Convex deployment because it is not marked disposable. No
  destructive reset was attempted. `npm run android:beta` passed and the APK
  installed with `adb install -r`, preserving café data. On the Redmi, the
  modifier dialog focused its Close control, kept Tab inside, closed with
  Escape and returned to Add Latte. The payment dialog did the same and
  returned to the current Place order action. Computed selection was `none`
  for the POS/product and dialog surfaces, `text` for search and the payment
  amount field; viewport and document size were both 1340 × 804 with no
  overflow. Final captures:
  `tmp/ui02-pos-final.png`, `tmp/ui02-modifier-final.png`, and
  `tmp/ui02-payment-final.png`. APK SHA-256:
  `9ba513f2869727f8084ec83b62d908e04753a8db530a6cd2ef01706607e75591`.
- **Limitations and owner decision:** the browser live unlock was unavailable;
  screen-reader speech, enlarged OS text and printer output were not claimed.
  The POS option-row appearance remains an owner choice: plain rows with
  dividers and selection marks, or the current outlined rows. No choice was
  invented. The owner subsequently advanced the work to Orders for this data
  correction; that advance does not infer a new option-row design or claim
  those untested POS states.
- **Publication:** implementation commit `37b1c32` was pushed to
  [`origin/main`](https://github.com/aymansal/olaso-pos). This follow-up ledger
  record is the publication evidence for UI-02; the owner review remains open.

#### UI-02 follow-up — custom payment amount focus ring, 21 September 2026

- Owner reported that the green focus ring around the editable Amount given
  field was clipped on the left, right and bottom in both Payment and Split
  payment dialogs. The popup layout and field size remain unchanged.
- Research checked the current [MDN outline-offset guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline-offset)
  and [MDN overflow guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow):
  the dialog body intentionally hides overflow, while the previous positive
  outline offset drew the ring outside the input box. The smallest justified
  fix is the existing green outline with `outline-offset: -2px`, drawing it
  inside the input bounds. No new component, shadow, animation or layout rule
  was added.
- Changed only `src/features/pos/components/PaymentDialog/PaymentDialog.module.css`.
  This shared dialog style covers normal payment and split payment.
- Verification passed: `npm run build`, `npm run check:pos`,
  `npm run android:beta`, and `git diff --check`. On the Redmi at 1340 × 804,
  both dialogs focused the editable field with computed `outline-offset:
  -1.71429px`; the full green ring was visible on all four sides in
  `tmp/ui02-payment-custom-focus-no-keyboard.png` and
  `tmp/ui02-split-custom-focus.png`. The split check used two Latte items and
  confirmed the split payment field, then cleared the temporary cart without
  placing a sale. The updated APK was installed with the authorized package
  installer after the normal ADB install prompt was rejected; app data was
  preserved. APK SHA-256: `8c2bddd6a30158bd47e47d8b31607de6aaa18adc556fe41c3fbba56784b294cb`.
- This is a targeted focus-ring fix. Owner review of the full POS screen and
  its remaining option-row appearance is still required before UI-03.
- Publication: implementation `ac25581` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`. This follow-up publication commit
  records the remote implementation evidence; owner acceptance remains open.

#### UI-02 follow-up — small customization action width, 21 September 2026

- Owner reported that the Add to order action in the compact customization
  popups was oversized and clipped beyond the dialog edge, while the larger
  popup remained acceptable. A Redmi screenshot and UI inspection measured the
  compact dialog at about 320 CSS px wide, with the action extending beyond its
  right edge.
- Research used the current [MDN flex guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex),
  [MDN overflow guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow),
  and [MDN text-overflow guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-overflow)
  (21 September 2026). The smallest correction is to reduce horizontal action
  padding and the icon gap only for compact dialogs; the wide dialog keeps its
  existing sizing and the full action label remains visible.
- Changed only `src/features/pos/components/ModifierSelectionDialog/ModifierSelectionDialog.module.css`.
  The selectors are scoped to `.dialog:not(.wide)`, so the larger Latte-style
  customization popup is unchanged.
- Verification passed: `npm run android:beta`, `npm run check:pos`, and
  `git diff --check`. The rebuilt APK installed with `adb install -r` and
  preserved café data. On the Redmi at 1340 × 804, the compact Butter
  Croissant customization popup now keeps the Add to order button fully inside
  the dialog with visible side margins (`tmp/ui02-after-enter.png`). APK
  SHA-256: `9a426e8b2c7f1bd5087daafc4a7a771e190976e1cc0ee8a5cc09182d95351cc4`.
- This targeted correction does not close the broader UI-02 owner review.

### UI-01 — align chart tap details with Reports, 21 September 2026

- Owner explicitly requested Reports' compact value-only tap label on Dashboard,
  without the selected-column highlight or repeated visible date. Reports must
  inherit Dashboard's outside-tap dismissal. Both layouts remain unchanged.
  This is a narrow owner-authorized Reports correction, not the UI-06 review.
  The owner has since confirmed the existing bar shades are visibly clear and
  rejected both a dark outline and a uniform-color replacement.
- Graphify queried SalesPulse/SalesTrendChart; read Reports DOX and actual chart
  implementations alongside the current Dashboard/source instruction chain.
  Ponytail full, Better UI project consistency/motion restraint and Data
  Visualization details-on-demand/keyboard access apply. Owner chooses the
  exact appearance by naming the existing Reports treatment.
- Before implementation, checked official [React focus events](https://react.dev/reference/react-dom/components/common#onblur),
  [MDN pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event),
  [Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor web layer](https://capacitorjs.com/docs/core-apis/web), today.
  Reuse Dashboard's existing bubbling blur/relatedTarget and Escape dismissal
  on Reports before introducing document listeners. Verify actual outside taps,
  including non-focusable blank space; add a pointer listener only if required.
  All changes are React/CSS presentation; no native/plugin/data changes.
- Planned correction: Dashboard tip uses Reports' 3px/7px padding and existing
  colors/type, one amount, no shadow or selected/pressed column fill. Keep its
  full-date accessible button name, keyboard focus outline and accurate heights.
  Reports gets the same dismissal handlers, preserving selected-bar toggle and
  switching to another bar. Check Sales/Products/Stock report chart variants,
  first/last/zero bars, EN/FR, outside tap, Escape and keyboard focus; build and
  install on Redmi without clearing data. Record results below.
- Implemented only the two chart components and Dashboard tip CSS. Removed
  the repeated visible date, grid/gap, shadow and persistent/pressed column fill;
  copied the existing Reports value label padding. Reports now uses Dashboard's
  two existing Escape/blur handlers. No new hook, listener, package or chart
  abstraction was necessary. Updated DESIGN and both feature DOX contracts.
- Browser: actual Dashboard component at 1340×800 shows a single amount, 3px
  7px padding, no shadow and transparent selected-column background. French
  first-day value visually inspected; outside heading click dismisses it.
  Keyboard Space/Escape retained. Isolated Reports component checked in Sales,
  Products and Stock variants: outside text and chart-heading clicks dismiss;
  switching bars replaces the value; tapping the same bar closes; Space opens,
  Escape closes, Tab out closes. French last-day value visually inspected.
  No captured browser console warnings/errors. Temporary Reports preview closed;
  ordinary Dashboard preview kept for the owner.
- Final `npm run android:beta` passed (web build, Capacitor sync, JVM tests,
  assembly), log `tmp/ui01-chart-details-build.log`. Existing warnings unchanged.
  `adb install --no-streaming -r` succeeded, preserving cafe data. Final APK SHA-256
  `d8bc9d5331312ec3983b4a7fedc70fe1711066040c2b43fe45fd4f7208fdcc58`.
- Redmi 22081283G: actual ADB taps verify both charts show value-only labels
  and dismiss outside. First/last (including zero), same-bar toggle, another-bar
  selection and Escape passed. Sales/Products/Stock report variants all dismiss.
  Captures `tmp/ui01-chart-{dashboard,reports,report-products,report-stock}.png`
  visually inspected; Dashboard shows no touch-selection fill. Keyboard focus
  outline remains intentionally available (visible in the Products capture after
  the preceding keyboard check). Data/axis/bar geometry unchanged. Both tooltip
  styles measure 3px 7px padding/no shadow; chart boxes retain 834×244 and
  838×434. Focused native run captured no warnings/errors.
  Runnable focused check/results: `tmp/ui01-chart-details-native.mjs` and `.json`.
- The first device helper read the outgoing view before the route switched;
  fixed its wait to require the destination chart, then all assertions passed.
  A shell-quoted restoration command failed; a file-based helper restored Reports
  to Sales and left the app on Dashboard. No app workaround or data change.
- `git diff --check` passed. No structural component/module change; graph refresh
  not required. Unrelated PeriodCalendar/reportProfit edits and assets preserved
  and excluded from the commit (as before, the local APK includes existing edits).
- **Requested interaction correction verified.** This is not a whole Reports
  review or a resolution of chart fill contrast. Earlier accessibility gaps and
  the pending pale-bar appearance decision remain recorded; next is owner review
  of these exact tap behaviors. Do not restart completed Dashboard reviews.
- Publication: `149800f` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; this follow-up records delivery.

### UI-01 — remaining skills combined, 21 September 2026

- Owner authorized starting Dashboard and skipping completed reviews. Do not
  restart Apple, Better Interface routing or Better Accessibility. `git diff
  8d041a0 --` for Dashboard, Header, ProfileControl, TopNavigation, App, global
  CSS and translations was empty before this pass; reuse their prior evidence
  for unchanged behavior. Earlier unverified items stay unverified.
- Read remaining rows 04–21 actual SKILL.md files. Relevant references read:
  Better Layout grouping/alignment and spacing/adaptivity; Typography spacing,
  wrapping/punctuation, variable-font basics, details/accessibility; Colors
  contrast, token naming and palette structure; UI surfaces/icons/performance;
  anti-slop ARTICLE sections 1–10; animation STANDARDS. Graphify queried;
  Ponytail full; applicable root/source/features/Dashboard/POS/Android DOX read.
- Scope: existing three panels, shared header/profile actions, chart detail,
  EN/FR, ordinary cafe names, live/loading/empty/error/retry and selection.
  No new layout, theme, workflow or database work. Unrelated files preserved.

| Distinct check group | Skill coverage | Evidence reuse / remaining work |
| --- | --- | --- |
| Layout and hierarchy | 04, 09, 10, 13, 14, 21 | Reuse fixed bounds/two-line rows; inspect existing grouping, density and remaining states once |
| Wording and language | 05, 06, 19, 20, 21 | Check labels against actions and date/amount meaning; EN/FR fit once |
| Type and tokens | 06, 07, 08, 16, 21 | Inspect actual text sizes/weights and token literals; reuse existing font and numeric system |
| Contrast and chart meaning | 07, 15, 17, 21 | Measure rendered text/graphics once; reuse proportional-height/zero-value and chart keyboard evidence |
| Interaction and motion | 08–12, 15, 18, 21 | Reuse press, Escape, focus, 150ms fade and reduced-motion evidence; inspect remaining motion requirements once |
| Recovery and complete flow | 05, 15, 19–21 | Reuse verified routes/retry/data-preservation; retain unverified native prompt/speech limitations |

- Confirmed conflicts resolved by existing owner decisions: fixed viewport/no
  reflow; nonselectable UI; no scale/blur/glass/stagger; solid light surfaces;
  existing navigation indicator/crossfade. EN/FR only: RTL/new-language support
  is outside the current product. These are scoped exceptions, not literal
  compliance with every rule. No repeat approval request for accepted choices.
- Before-edit findings: shared profile role is 10px versus the established
  12px supporting size; French `Daily net sales` says `Ventes nettes du jour`
  although the chart spans 12 days; list failure text offers no recovery hint
  even though Retry summary refreshes the same snapshot. Chart shade 6 measures
  2.21:1 against its rendered white background, below the 3:1 graphical target;
  asked owner to choose an existing-green edge or uniform existing-green bars.
- Research, checked 21 September: [W3C graphical contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
  and [contrasting boundaries](https://www.w3.org/WAI/WCAG21/Techniques/general/G209),
  [Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview),
  [Capacitor web layer](https://capacitorjs.com/docs/core-apis/web).
  Better Typography size floors and existing Dashboard 12px copy justify the
  role-size reuse. Better Writing errors/consistent meaning, localization date
  semantics and Error Handling UX recovery justify the three copy corrections.
  Keep the existing recovery button; do not add duplicate actions or new UI.
- Intended implementation: CSS role 10→12px within the same 178×50 trigger;
  reuse the existing primary-text token for its identical hard-coded value;
  correct French chart subtitle and EN/FR list recovery instructions. Chart
  appearance waits for the owner's answer. React/CSS/translation changes only;
  native WebView/Capacitor continue rendering. No Kotlin/plugin/dependency.
- Intended checks: rendered EN/FR and error/retry states, unchanged geometry,
  measured contrast, existing shared-header six routes after role-size change;
  build/install over current Redmi preserving data. No reseeding tests.
- Final recovery inspection found the language buttons discard a rejected save
  promise, so failure gives no visible feedback. Error Handling UX communication
  and recovery require a message beside the action. Before implementing, read
  the App callback: it updates displayed language after persistence succeeds.
  [MDN Promise.catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
  checked today confirms the existing callback's rejection can be handled locally.
  Reuse the staff menu's existing error region, clear it on retry and name EN/FR
  in the recovery instruction. Do not change persistence or add a new popup.
  Verify a rejected callback followed by success in the isolated real-component
  fixture, in both languages. This is app presentation under the same native
  boundary; the final package must include this additional correction.
- Token audit also maps Header's near-identical raw primary text color to the
  existing `--olaso-text` role (Better Colors: use project tokens). Profile's
  exact same-value replacement and Header reuse do not introduce a palette.

#### Combined findings and coverage result

| Skills / rule | Result and evidence | Remaining boundary |
| --- | --- | --- |
| 04, 13, 14 — grouping, alignment, hierarchy and density | Three operational regions retain their bounds; dominant 44px total, smaller metrics and list headings remain distinct. Two-line recent orders and aligned separators reused. No additional containers or layout change justified. | Owner fixed-layout exception remains; not responsive/reflow compliance. |
| 05, 19, 20 — clear wording, consistent meaning and recovery | Stock/orders failure messages now point to the existing Retry summary button in EN/FR. French chart subtitle now means sales per day across the period. | Native report/lock popup evidence gaps below are not closed by these text checks. |
| 06 — size floors, established scale and number detail | Profile role 10px → existing 12px size; name/role fit the same 178×50 trigger in EN/FR. Existing DM Sans, metric hierarchy, tabular/locale formatting and 12px Dashboard metadata retained. | Approved compact header navigation remains 11px. Enlarged OS text is out of scope for this screen by owner decision. No new font or scale invented. |
| 07, 16 — actual contrast and semantic project colors | Profile icon and Report text use existing primary-text token. Scoped six-module color audit: 115/119 color-bearing declarations use tokens (96.6%). Four remaining literals are component-specific shadows/avatar surface and the explicitly approved pressed layer. | This percentage is not whole-app token coverage. The owner accepts the existing chart shades without an outline for this screen; no speculative token system migration. |
| 08, 15 — controls, state consistency and visible recovery | Existing native buttons, selected/pressed/focus treatments, anchored popover, concentric language selector and borderless View all retained. Language-save rejection now has a translated message in the existing error area; retry clears it. | No extra outline, scale, blur or duplicate recovery button. Native dialog focus trapping not newly verified. |
| 09, 10 — remove redundant decoration, preserve useful content | Existing two-line orders, meaningful sales/stock/history separation and best-seller highlight retained. No additional shell, card, badge, decorative animation or invented claim added. | Existing owner-approved layout is the constraint; these reviews do not authorize a new visual style. |
| 11, 12 — frequent interaction, interruption and motion | Reuse unchanged 150ms fade, immediate menu/chart actions, press feedback, interruption and reduced-motion evidence. No motion source changed. | Existing 220ms indicator/keyboard fade and nonselectable UI are recorded owner/project exceptions; full slow-motion frame study is out of scope for this screen by owner decision. |
| 17 — honest chart encoding and accessible detail | Reuse proportional height, zero-value, 12-day ordering, units, exact tap value and keyboard evidence. French subtitle corrected. | Pale rendered bar measured 2.21:1; owner confirms it is visibly clear and accepts the current shades without an outline. |
| 18 — tablet behavior and platform conventions | Existing native popover, ordinary touch controls, fixed native viewport and scoped selection behavior retained; current Redmi header/menu fit checked. | Android product: no iOS/PWA install features apply. Actual speech, enlarged text and native prompt checks are out of scope for this screen by owner decision. |
| 21 — complete-flow evidence | Changed wording and failed-language/retry flow checked once in EN/FR real-component browser fixture; shared header checked across six actual Redmi routes. Reused prior unchanged loading/empty/chart/route/selection evidence. | Overall Dashboard remains incomplete only until chart choice and owner acceptance are resolved; device-only checks are owner-scoped out of this card. |

- Actual changed files: Dashboard StockAttentionPanel and RecentOrdersPanel
  TSX; shared Header CSS; ProfileControl TSX/CSS; `src/lib/fr.ts`; owning POS
  DOX, DESIGN and this ledger. No persistence/native/source ownership changes.
- Browser 1340×800: corrected list errors fit and Retry summary restores live;
  profile role fits; French chart subtitle displays correctly. Added an ignored
  `?language-error` fixture that rejects the first language callback and allows
  retry. Both EN and FR failures show the translated message, preserve the
  previous selected language, and then clear the message on successful retry.
  English and French error-menu screenshots visually inspected; no browser
  warnings/errors captured. Restored ordinary French preview for the owner.
- `npm run android:beta` passed after the final language change, including web
  build, Capacitor sync, native JVM checks and APK assembly. Existing build
  warnings remain. Final log: `tmp/ui01-combined-final-build.log`.
- Installed final beta with `adb install --no-streaming -r` successfully on
  Redmi 22081283G, preserving records. APK SHA-256:
  `61d7389b58f862083cacdc9413a5317fb5119bda5d1a9351ced1f872aa9a77af`.
  Current workspace's pre-existing PeriodCalendar/reportProfit changes are in
  the built APK; they remain unrelated and excluded from this card's commit.
- Native 1340×804: all six header routes fit without horizontal overflow;
  French Propriétaire is 12px and fits the unchanged trigger. French menu fits,
  language switching succeeds, Escape closes it, and English was restored.
  Panel bounds remain (18,92,886,686), (922,92,400,334), (922,444,400,334),
  within native rounding. Visually inspected `tmp/ui01-combined-{dashboard,
  pos,orders,products,stock,reports,french-profile,final}.png`.
  Measurements: `tmp/ui01-combined-native.json`; token audit:
  `tmp/ui01-combined-token-audit.json`.
- Early helper waits failed while the device was asleep (WebView hidden,
  animations paused); waking it restored normal checks. A subsequent helper
  assertion targeted a span instead of the actual subtitle small element;
  corrected the inspection selector, not app code. The final run passed its
  layout/language assertions. It captured one existing Convex WebSocket
  back-forward-cache disconnect; do not claim an error-free native session or
  expand this polish work into a synchronization repair.
- No sale, reseed, stock write, printer configuration or security setting change.
  No structural module/component changes requiring graph regeneration. Known
  CSS-scope scanner limitation remains; no new animation/global selector was
  added. Earlier Apple/accessibility checks were not restarted.
- **Resolved:** the Dashboard first and last bar values now use the same centered
  tooltip rule as Reports. The owner resolved chart appearance by keeping the
  current shades without an outline; no outline or palette replacement was added.
  The owner explicitly moved TalkBack speech,
  native report/cart dialog focus details, enlarged OS text/200% zoom, usable
  increased contrast, full motion frame study and the native offline/role matrix
  out of this screen's scope. They remain recorded as out-of-scope limitations,
  not as tested passes. Fixed geometry and solid surfaces remain owner
  exceptions. Printer output and seeded Orders history are separate
  hardware/data issues. No 100% claim until the owner accepts the screen.
- Exact next action: obtain the owner's Dashboard screen acceptance before UI-02.
- Tooltip verification passed after the CSS correction: the 1340 × 800 browser
  preview measured first-bar and last-bar tooltip centers within 0.001 px of
  their bar centers. The labels may cross the chart edge, matching Reports.
  The Redmi 22081283G native 1340 × 804 check measured the first and last
  centers within 0.001 px, with no captured console messages; the focused
  capture is `tmp/ui01-edge-tooltip-native.png` and measurements are in
  `tmp/ui01-edge-tooltip-native.json`. `npm run build` and
  `npm run android:beta` passed, and the beta installed with `adb install -r`
  while preserving the existing data. APK SHA-256:
  `1A2088181F5B372282C95991DD55A11FACD504D06F913179DEF1C55D6AB6E4EB`.
- Publication: `64ef223` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`. Final staged diff check passed;
  only the nine files listed above were included. This follow-up records
  publication; unrelated changes and untracked assets remain preserved.
- Chart correction publication: `e8e4d56` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; only the Dashboard chart contract,
  ledger, and edge-tooltip CSS were included. Unrelated dirty files and
  untracked assets remain preserved.

### UI-01 — combined screen-review protocol, 21 September 2026

- **Superseded workflow record:** this checkpoint incorrectly interpreted
  overlap deduplication as replacing individual skill passes. The current
  “Required skills” and “Sequential review” instructions above control: complete
  every numbered skill pass in order, reuse duplicate fixes, and combine only
  the final report. Do not use this historical checkpoint as an instruction.
- Owner also closed Better Accessibility with the fixed-layout exception.
  This allows continuing; it does not turn zoom/reflow into compliance or the
  recorded speech, dialog, contrast and other verification gaps into passes.
- Updated this ledger and root AGENTS workflow only. No app edits, skill
  reviews, device actions, builds or installations in this checkpoint.
- Source is the owner's explicit workflow decision; no app/native boundary is
  affected. The actual overlap map must be built from skill files when the
  screen review starts; this documentation change does not claim it is done.
- Verification: read the ledger in full and current root instructions; checked
  recovery, coverage, handoff and status pointers for consistency. Unrelated
  working-tree changes preserved. `git diff --check` passed; no app build or
  structural graph refresh is needed for this documentation-only change.
- Exact next action: on the owner's Dashboard start, prepare the deduplicated
  checklist, reuse valid evidence and finish distinct outstanding UI work.
- Publication: `3bcdf9c` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; this follow-up records publication.

### UI-01 — Better Accessibility, 21 September 2026

- Read the actual skill plus semantics-and-aria, focus-and-keyboard,
  hit-areas, forms, screen-readers and motion-and-zoom. Graphify queried;
  Ponytail full. Scope remains the complete Dashboard/header/menu/chart,
  loading/empty/error/retry, EN/FR, allowed roles and native dialogs.
- Checklist: native semantics/names/state, keyboard paths/focus/dismissal,
  hit targets, dynamic announcements, headings/landmarks/bypass, reduced
  motion/forced colors, zoom/reflow. Forms/media/custom composite widgets
  do not exist in Dashboard; profile uses ordinary disclosure buttons.
- Before-edit evidence: actual Redmi axe-core 4.13.0 scan reports blocked
  viewport zoom; two generic labeled containers require manual review.
  Profile's accessible name omits visible name/role. App has no skip link,
  document title change or focus handoff when switching views. Conditional
  chart/list status regions are recreated, risking missed repeated updates.
- Research checked today: [W3C Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html),
  [status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html),
  [bypass blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html),
  [landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/),
  [disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/),
  [Android testing](https://developer.android.com/guide/topics/ui/accessibility/testing),
  [WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor web layer](https://capacitorjs.com/docs/core-apis/web).
- Smallest justified corrections: preserve visible profile text in its name;
  make chart/summary real named groups; retain empty status containers before
  updates; keyboard-only skip link using existing colors/44px target and the
  skill's offscreen-until-focused pattern. App focuses the new visible main
  and updates its title; outgoing retained content becomes inert during fade.
  Retain screen scrolling/state, native controls, existing geometry and motion.
  HTML/CSS/focus belongs in React/WebView; no native/plugin/data change.
- Zoom/reflow conflicts with explicit fixed-layout/disabled-scaling contracts;
  record the failure, do not rewrite layout or treat it as compliant. Actual
  TalkBack speech is not yet verified; device reports no enabled accessibility
  service. Do not silently enable a device setting to claim a speech test.
- Intended checks: browser EN/FR/state keyboard walk and popup recovery,
  actual Redmi before/after axe + focus/targets, all shared-header routes,
  reduced-motion/forced-colors, build/install preserving data. No reseed.
  Audit library downloaded into ignored tmp only, not an app dependency.

#### Findings and implemented corrections

| Severity / principle | Location | Before | After / status | Why |
| --- | --- | --- | --- | --- |
| HIGH — zoom/reflow | `index.html:7`, `src/globals.css:114` | Zoom disabled; fixed 1340px layout with hidden overflow | Unchanged pending owner direction; **Block** for full accessibility approval | At a measured 320px browser width, content remains 1340px and the right panels are outside the viewport. Existing fixed-layout/scaling contracts prohibit silently changing this. |
| MEDIUM — accessible names | `src/features/pos/components/ProfileControl/ProfileControl.tsx:85` | Spoken label omitted visible staff name/role | Name/role precede existing menu-action wording; decorative icon hidden; closed popover no longer references absent target | Aligns voice activation and spoken identity with visible text, EN/FR |
| MEDIUM — structure and keyboard navigation | `src/App.tsx:97`, `src/features/pos/components/Header/Header.tsx` | No skip path, view focus or contextual title; outgoing fade still accessible | Keyboard-only skip link; focus active main once visible; translated title; outgoing/hidden slots inert | Avoid repeated top-bar traversal and interaction with an outgoing view. Preserve focus already inside the new main or an open overlay. |
| MEDIUM — named groups | `src/features/dashboard/components/SalesPulse/SalesPulse.tsx:122`, `:160` | Generic containers carried potentially ignored names | Summary and chart expose group semantics | Gives the chart controls and summary meaningful context |
| MEDIUM — dynamic content | `src/features/dashboard/components/StockAttentionPanel/StockAttentionPanel.tsx:60`, `src/features/dashboard/components/RecentOrdersPanel/RecentOrdersPanel.tsx:41`, `SalesPulse.tsx` | Loading/empty regions remounted; duplicated chart status and simultaneous panel alerts | Persistent polite list status containers; existing summary status remains; duplicate chart live region removed | Reduces interruptions and follows the skill's stable-region guidance; real speech still requires TalkBack verification |

- Kept normal colors, typography, all three panel bounds, order hierarchy,
  borderless View all, 150ms fade, role permissions and text-selection rules.
  Shared changes are accessibility behavior, not a redesign of other screens.
  Native buttons remain for internal screen actions: this app has no URL routes
  to supply real navigation links; adding a router is outside this pass.
- Browser 1340 x 800: EN/FR labels, profile Enter/Tab/Space/Escape and trigger
  focus return, chart Space selection/exact value/Escape, error Enter retry,
  loading/empty/live messages, manager lock-error and cashier restricted menu
  checked. Axes/buttons have names and state; low/critical/out/cancelled use
  text, not color alone. No browser warnings/errors. Scoped axe component
  scan returned no violations/manual-review items; it is not whole-app proof.
- Redmi 22081283G, 1340 x 804: keyboard skip activates the Dashboard main;
  all 12 chart days then both View all controls follow the tab order; visible
  focus outlines; EN/FR/Settings/Lock menu tabs and Escape restore trigger.
  Targets measured chart ~54.8 x 200, View all ~67.6 x 48, languages ~100.9 x 48,
  skip ~135.5 x 44; no overlap introduced. Existing nav/Report/profile fit.
- Actual installed-app axe scans: Dashboard EN 35 rules passed, expanded EN/FR
  menus 36 passed, no incomplete items, sole violation `meta-viewport` in each.
  Source profile-name failure also corrected; an automated pass alone would
  not have caught every issue. Evidence `tmp/ui01-a11y-before.json` and
  `tmp/ui01-a11y-native.json` with readable control results.
- Six shared routes visually inspected in `tmp/ui01-a11y-{dashboard,pos,orders,
  products,stock,reports}.png`; no new clipping/overflow. Each exposes one active
  main; changed routes focus main and update title. Same-page Dashboard action
  deliberately keeps current focus. French profile captured separately; English
  restored. Dashboard bounds remain (18,92,886,686), (922,92,400,334),
  (922,444,400,334), within native pixel-rounding tolerance.
- Reduced-motion emulation yields 0s transitions and was cleared. Forced-colors
  emulation produces system-colored focus but Android renders unreadable text
  backplates in the capture: **not verified as usable**, not a contrast pass or
  an excuse to add a dark mode. Full perimeter contrast remains for Better Colors.
- Actual Report alert appeared in Android UI dump with the invalid printer
  address and OK button. Screenshot again did not retain that popup; current
  visual/focus-trap evidence remains incomplete. Printer output not tested.
- Open verification: actual TalkBack spoken walk and repeated announcements,
  native report/unfinished-cart confirmation keyboard trapping/focus restoration,
  actual enlarged OS text/200% zoom (browser zoom shortcut did not change the
  measured viewport), usable forced colors, full offline/role native matrix.
  The fixture tests do not stand in for those device checks. No sale/reseed,
  inventory write, printer setting or security preference was changed.
- `npm run android:beta` and `npm run check:navigation` passed. Existing build
  warnings remain. Graphify code update produced 2900 nodes/6187 edges; existing
  Gradle parsing warnings recorded. Unrelated PeriodCalendar/reportProfit edits
  and assets preserved/excluded; APK includes the current workspace's pre-existing
  edits. Two streamed installs were rejected, then normal file-transfer install
  succeeded after owner reconnected the tablet, without changing security settings.
- Final route verification caught focus attempted before newly shown React
  Activity content was ready. Final code focuses after the existing fade, with
  guards for controls already focused in the incoming main and visible overlays.
  Rebuilt and installed final APK successfully using `adb install --no-streaming -r`.
  Final SHA-256 `08d172aa4da96fe16c366e22ee0185c69cf22826246d6fd4f5516e16f7e5d7e6`.
  Repeated native route/audit checks now pass for that APK; all changed routes
  focus MAIN. Latest `tmp/ui01-a11y-native.json` supersedes intermediate runs.
  A failed early login helper was replaced with normal input insertion; no PIN
  or credential is stored in evidence. Installed app returned to Dashboard EN.
- `tmp/ui01-a11y-retention.json`: POS search survives Dashboard round trip;
  temporary Espresso query restored to its original value. Opening/focusing EN
  in the profile popup while changing screens keeps focus in the popup after
  the fade. No payment, sale or saved product change. Final screen visually
  inspected in `tmp/ui01-a11y-final.png`; final diff check passes.
- **Verdict: Block for full accessibility approval.** Scoped corrections are
  delivered, but zoom/reflow and the explicitly listed unverified checks remain.
  Do not call this skill 100% or silently advance. Exact next action: explain
  these results to the owner, resolve the fixed-layout accessibility exception
  or authorize a separate zoom/text adaptation, and arrange the remaining
  TalkBack/native-dialog checks. Next queued skill is 04 Better Layout only
  after an explicit owner handoff.
- Publication: `8d041a0` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; this follow-up records publication.

### UI-01 — Better Interface scope and routing, 21 September 2026

- Owner explicitly closed the Apple pass and requested the next skill. Retain
  its corrections, solid-surface exception and honest evidence limitations.
  Earlier instructions to block advancement on Apple verification are superseded
  by this owner handoff, not erased from the historical record.
- Read `better-interface/SKILL.md` and `review-format.md` in full. The skill
  owns orchestration, not a new visual style. Its default combined six-domain
  review is split into the already approved individual steps 03–08. Do not
  batch them or present this preparation as a full interface approval.
- Recon: Graphify queried Dashboard/Header/ProfileControl. Confirmed React 19,
  TypeScript, Vite, CSS Modules, Astryx, Boxicons, Olaso tokens and Capacitor
  Android. Applicable documents are root/source/features/Dashboard/POS AGENTS,
  DESIGN, BRAND, PRODUCT and ARCHITECTURE. No CONTRIBUTING, CODING_STANDARDS,
  CLAUDE or Storybook files found in the focused file inventory. Reuse current
  components and tokens; no framework, font or dependency replacement.
- Scope: all three Dashboard regions (sales summary/chart details/best seller,
  stock attention, recent orders); shared date/time, navigation, Report and
  profile trigger; expanded EN/FR/Settings/Lock menu, lock error and native
  report/unfinished-cart dialogs. Include both View all paths and return paths.
  Destination screen redesigns and printer delivery remain outside Dashboard.
- State coverage queued for each applicable owner: EN/FR, permitted roles,
  live/saved/offline, loading, empty, error/retry, pressed, selected, focus,
  disabled/busy, cancellation, dismissal and retained draft. Reference viewport
  1340 × 800; recheck current Redmi dimensions. Zoom/narrow-width checks must
  record actual outcomes against the fixed-tablet contract; do not turn an
  unsupported viewport into an approved layout rewrite or a silent pass.

| Domain / next step | Assigned coverage and carried work | Current review result |
| --- | --- | --- |
| Accessibility — 03 | Names, keyboard/touch access, focus/dismissal, status announcements, text-size/contrast preferences and editable-field selection exception | Not reviewed in this step; six-domain batching prohibited |
| Layout — 04 | Existing panel geometry, alignment, clipping, scrolling, popup bounds and zoom/reflow consequences | Not reviewed; preserve owner geometry |
| Writing — 05 | Labels, date/status language, empty/error/recovery messages, Report and lock-confirmation wording in EN/FR | Not reviewed |
| Typography — 06 | Size/weight/leading/tracking, numbers, truncation, realistic café content and enlarged text | Not reviewed |
| Colors — 07 | Actual rendered contrast pairs, selected/focus/disabled states, chart/status meaning and higher-contrast preferences | Not reviewed |
| UI polish — 08 | State consistency, press feedback, interrupted transitions, reduced motion, popup behavior and frame review | Not reviewed |

- All six owning SKILL.md files exist. Reading/routing from the umbrella does
  not mark any of their reviews complete. Assign each eventual finding once
  to its underlying rule owner, with source line and rendered evidence where
  relevant. Use the skill's severity ladder, consolidate repeated causes and
  cap the later combined report at 15 findings without hiding blockers.
- Verification today: read current Dashboard composition and shared menu;
  checked installed owners, project stack and worktree. No new ranked findings
  issued, no domain marked Clear, and no Approve/Block interface verdict yet:
  that requires completed domain evidence. Consolidate after 03–08 without
  rerunning them as another batch. No source/native/device changes or new app
  tests; no build required for this documentation-only step.
- Outcome: step 02's owner-approved **scope/routing task is complete**.
  Next skill is **03 — Better Accessibility**, awaiting owner continuation.
- Publication: `702c600` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; this follow-up records publication.

### UI-01 — nonselectable interface text, 21 September 2026

- Owner explicitly requested this correction for all Dashboard text, the shared
  navigation, Report, profile name/role, date/time, and the entire profile menu.
  This owner-directed step does not advance the Apple skill queue or resolve
  its outstanding accessibility decision.
- Research before implementation, checked today:
  [MDN user-select](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/user-select)
  documents `none` for interface text and `text` for editable content.
  [Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor](https://capacitorjs.com/docs/core-apis/web) keep selection in
  the existing web-rendering layer. Use scoped CSS on Dashboard and Header;
  the native profile popover is still a DOM descendant of Header. Explicitly
  retain text selection on editable fields through the existing global input
  defaults. No native changes or JavaScript event cancellation is needed.
- Prefer two existing container rules over per-label handlers or a whole-app
  selection ban. Future portalled overlays need their own scoped rule.
- Verify actual long-press/drag on Dashboard, header and expanded menu, chart
  interaction, all six shared-header routes, and selection/copy/paste in an
  existing text field. Build, install without clearing data, inspect browser
  and Redmi; record results below.
- Implemented scoped `user-select: none` in Dashboard and Header CSS; editable
  input/textarea/contenteditable exceptions in `globals.css`. Updated DESIGN
  and both owning DOX contracts. No layout, data, event handlers or native code
  changed. Other screen bodies remain for their own polish cards.
- Verification passed: browser 1340 × 800 double-click selects nothing; expanded
  menu labels resolve to `none`; chart tap/Escape still works and panel bounds
  are unchanged. No browser warnings/errors. Redmi 22081283G, 1340 × 804:
  700ms native holds on 12 targets (heading, total, stock name, receipt number,
  date/time, navigation, Report, profile name, EN, FR, Settings, Lock/switch)
  all leave selection empty. Shared header rule checked across all six routes,
  with no horizontal overflow. Evidence: `tmp/ui01-selection-checks.json`;
  visually inspected `tmp/ui01-selection-profile.png` and
  `tmp/ui01-selection-final.png`.
- Existing POS search field retains `user-select: text`: entered Espresso,
  selected all 8 characters, copied, cut, pasted successfully, restored its
  original empty value and returned to Dashboard. Native clipboard check in
  `tmp/ui01-selection-input.json`; no captured warnings/errors. No café data
  was changed. The temporary clipboard contains only the sample search word.
- `npm run android:beta` passed (including web build and JVM checks), followed
  by successful `adb install -r`. Existing build warnings unchanged. APK SHA-256
  `1ddc7374c306511caf388dce73f14a24486bf7a82c893302697adc020e54de62`.
  `git diff --check` passed. No structural change requiring graph regeneration.
  Pre-existing unrelated edits preserved and excluded from this commit.
- This requested selection correction is verified; it does not mark the whole
  Apple pass complete. Next: owner review; retain the existing Apple-pass
  pending items, then continue only the owner-authorized screen/skill.
- Publication: `2e00daa` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; this follow-up records delivery.

### UI-01 — individual Apple Design pass, 21 September 2026

Active skill: `apple-design/SKILL.md`, read in full. Graphify queried Dashboard
and shared controls; Ponytail full applies. This is step 01 only.

Checklist established before implementation:

| Skill sections | Applicable Dashboard coverage | Initial status |
| --- | --- | --- |
| 1, 10 — immediate response | Navigation, profile/language/Settings/lock, Report, View all, Retry, chart; down feedback, release commit, drag-away cancellation | Navigation has no pressed style; other controls need live verification |
| 3, 7, 11 — continuity and spatial consistency | Interrupt/reverse navigation; anchored profile and chart details; compositor motion/frame review | Pending current-device verification |
| 14 — preferences | Reduced motion, reduced transparency, increased contrast | Motion exists; surfaces already solid; increased-contrast styling absent |
| 15 — typography | Existing size/weight/leading hierarchy, EN/FR, user text size | Default hierarchy inspected; enlarged text not verified |
| 16 — foundations | Summary hierarchy, specific labels, loading/empty/error/status, recovery and exit paths, role-safe actions | Pending current interaction review; approved layout retained |
| 17 — process | Interactive real-component preview and current Redmi, frame inspection and owner contextual use | Agent checks pending; owner contextual acceptance remains separate |

Sections 2, 4–6, 8–9 apply to custom dragged/physics-driven objects: Dashboard
has none; native list scrolling remains native. No new gesture or spring library.
Section 10's extra hit padding cannot overlap neighboring nav/bar targets;
verify existing native button cancellation rather than invent a gesture system.
Section 12's translucent-chrome recommendation is an **owner exception**:
approved solid surfaces and unchanged layout take precedence; do not call this
literal full-skill compliance. Section 13 adds sound/haptics only for utility;
no new sound/haptic interaction is justified by these read-only Dashboard taps.
Section 15 permits a reasoned custom font: retain approved Olaso DM Sans.

Pre-implementation research, checked 21 September 2026:
- [Apple fluid interfaces](https://developer.apple.com/videos/play/wwdc2018/803/)
  supports touch-down feedback and interruptibility. The installed skill's
  sections 1/10 explicitly require press feedback; they do not require scaling.
- [MDN :active](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:active)
  provides native press-state styling. Reuse the exact `rgb(0 0 0 / 8%)` state
  layer from Olaso's existing SegmentedControl for TopNavigation. Unlike a new
  light fill, it preserves white labels over the selected green indicator.
  No added timer, pointer handler, transform, dependency or layout change.
- [Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor web runtime](https://capacitorjs.com/docs/core-apis/web)
  retain HTML/CSS rendering and native touch dispatch. This correction belongs
  in the existing CSS Module; no Kotlin/plugin, data or lifecycle changes.
- Intended verification: held press before release, drag-away cancellation,
  selected/unselected buttons, all six shared routes, unchanged Dashboard panel
  bounds, EN/FR and state fixtures, build and actual Redmi. Increased contrast
  and text size remain checklist items; do not silently count them as passed.
- Also reuse SegmentedControl's existing white focus ring on the selected
  green navigation button; its previous green ring disappeared into the green
  indicator. Apple 16 Flexibility/Craft supports perceptible interaction state;
  the exact white-ring treatment is already an Olaso pattern.
- Asked the owner whether accessibility-only layout/border adjustments are
  allowed for sections 14–15, preserving the normal appearance. Await answer;
  the unchanged-layout and borderless rules are not silently overridden.

Results and handoff:
- Continued independent touch checks before handoff: selected navigation,
  Report, profile, both View all buttons and a chart bar all show their existing
  pressed treatment with native Android touch; evidence
  `tmp/ui01-apple-controls.json`. Menu review exposed one additional section 1
  conflict: selected EN/FR uses `background: ... !important`, preventing the
  existing language-button pressed color. Simplest correction is to replace
  that override with the existing language-container selector specificity;
  retain every color and the same selected/unselected normal appearance.
  This uses the same researched native :active/WebView boundary above.
  Verify selected/unselected language press, restoration and language switching;
  rebuild/install before publication.
- Changed `TopNavigation.module.css`: native pressed state reuses the
  existing 8% dark layer; selected keyboard focus reuses the white inset ring.
  `ProfileControl.module.css` removes the selected-language override that
  blocked its existing pressed color. No other app source changed.
  No geometry, font, menu, animation-duration, data or native-source changes.
  Existing DESIGN pressed/focus contracts already cover both; no new design rule.
- Browser measured 1340 × 800; panels remain (18,92,886,686),
  (922,92,400,334), (922,444,400,334). Inspected English/French live views,
  profile popup and chart's first-day anchored detail. Escape returns profile
  focus. Loading/empty/error messages distinguish unavailable from zero;
  Retry returns live. French lock-failure fixture wraps inside the menu and
  retains recovery controls. Report fixture showed disabled Printing then
  restored Report; its alert was not exposed by the browser dialog API, so
  that popup itself is not counted as newly verified. No preview console warnings/errors.
- `npm run android:beta` passed, including web build, Capacitor sync and JVM
  checks. Existing SQLite crypto externalization, Gradle flatDir and SDK XML
  warnings remain. No non-trivial logic introduced; no extra unit tests.
  `adb install -r` succeeded on Redmi 22081283G, preserving records.
  Final rebuild after the language correction passed and installed successfully.
  Final APK SHA-256: `627dd9da1eca8d5963c60e5083c165ba2f3a990edc694b7fd2816f0ee101ff20`.
- Native viewport 1340 × 804. Visually inspected all six shared-header routes:
  `tmp/ui01-apple-{dashboard,pos,orders,products,stock,reports}.png`.
  No horizontal overflow. Actual held Android press visibly shades POS while
  Dashboard stays selected (`tmp/ui01-apple-real-press.png`); moving away and
  releasing leaves Dashboard. Release activation reaches POS. Initial CDP
  immediate samples preceded the active paint and were false; do not use them
  as latency proof. A later frame sample showed the 8% fill; no absolute
  touch-to-photon latency claim. Keyboard focus verified white on selected green.
- Navigation reversal accepted Dashboard before the Reports movement ended;
  sampled positions returned to Dashboard without reaching the old destination.
  Reduced-motion emulation gives 0s navigation transition, then was cleared.
  This verifies interruption/reduced motion, not a complete slow-motion video
  assessment. Profile popup remains opaque, anchored at x1090/y77, width232;
  Escape closes it and restores trigger focus. Focused foreground checks
  captured no console warnings/errors. Touch probing briefly selected text;
  cleared that inspection state before handoff.
- Today's live total is zero on 21 September; earlier receipts/chart history
  remain visible. No reseed, sale, stock adjustment, credential change or
  printer configuration change. Existing unrelated PeriodCalendar/reportProfit
  working edits are preserved and are not part of this commit; the APK was
  built from the current workspace, including those pre-existing edits.
- Sections 1/10 navigation correction, 3 interruption, 7 anchored popups,
  14 reduced motion/solid surfaces and 16 inspected recovery states have scoped
  evidence above. Sections 14 increased contrast and 15 text-size adaptation
  remain unresolved. Owner said tablet settings do not affect Olaso; this is
  owner-reported behavior, not permission to mark support unnecessary. Existing
  fixed-pixel geometry and absent increased-contrast rules corroborate a gap,
  but enlarged OS-font behavior was not experimentally measured in this pass.
- Additional final evidence: selected and unselected EN/FR both shade green
  while held; selected EN restores white on release. FR/EN switching works.
  Native shared menu bounds/content checked across all six routes; final
  EN/FR captures `tmp/ui01-apple-french-profile.png`,
  `tmp/ui01-apple-language-press.png`, `tmp/ui01-apple-final.png` inspected.
  `tmp/ui01-apple-menu-final.json` records measured results. Lock button press
  shades correctly; Settings touch sample did not capture an active state,
  so that isolated sample remains inconclusive, not a pass.
- Actual native Report produced the expected invalid-printer-address alert in
  the Android UI dump, with an enabled OK control; Report was enabled afterward.
  The attempted screenshot did not retain the alert, so its current visual
  appearance is not verified by that capture. No printer output claim.
  Both actual Dashboard View all actions reached their destinations; Stock
  exposes Low stock. This does not repair the historical Orders seed issue.
- Other open verification: Settings press and Retry held state,
  native report popup appearance/lock confirmation recheck, full motion frame review and
  owner use in context. Earlier successful native report/cart-cancel records
  remain historical, not silently relabeled current. Printer output and actual
  screen-reader speech are not claimed.
- Verdict: **Apple Design pass incomplete**, not 100%. Solid chrome remains
  an owner exception to the skill's translucent-chrome default. Do not start
  Better Interface yet. Resolve the accessibility direction, finish the listed
  Apple checks and report again. `git diff --check` passed; no structural change
  requires Graphify regeneration and no DOX ownership contract changed.
- Publication: implementation `f3247d5` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`. This follow-up records publication.

### UI-01 — one-skill-at-a-time protocol, 21 September 2026

- Owner added the seven specialist skills discussed in this conversation and
  required an individual completion report before proceeding to the next skill.
  The 21-step queue above supersedes all grouped-pass completion claims below.
- Retained the no-personal-design-choice rule and strengthened source tracing,
  checklist evidence, honest 100% reporting and the owner handoff after each step.
- Documentation only: updated this ledger and its root AGENTS workflow pointer.
  No app edits, visual checks, device actions or installations in this checkpoint.
- Sources: the owner's current instruction and the actual installed specialist
  skill files inspected in the preceding discussion. No new app/native boundary
  is introduced; implementation research remains required when step 01 starts.
- Verification: all 21 queued skill files exist; sequence has no duplicate names;
  Products/Stock workflow skills retained. Documentation diff checked; unrelated
  working-tree edits preserved. No build needed for documentation-only work.
- Next: Dashboard, step 01 Apple Design only. Existing changes remain in place;
  no skill is marked 100% complete by this documentation update.
- Publication: `2445947` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; this follow-up records publication.

### UI-01 — restarted visual skill sequence, 20 September 2026

The owner explicitly rejected treating the prior functional checks as finished
visual polish. Keep the approved light layout, two-line orders and borderless
View all. Apply every agreed skill successively; do not invent a fresh theme.

Pre-implementation research and scope:
- Read Apple Design, Better Interface and its six domain skills, their review
  format, grouping-and-alignment, both anti-slop skills, Emil Design Engineering,
  Review Animations, Design QA and Error Handling UX. Graphify queried the
  Dashboard regions and shared profile control; Ponytail full remains active.
- [Apple principles](https://developer.apple.com/videos/play/wwdc2026/250/)
  supports clear, consistent visual meaning and purposeful hierarchy.
  [Apple typography](https://developer.apple.com/videos/play/wwdc2020/10175/)
  supports a coherent type hierarchy, not an exact mandated café layout.
  Checked 20 September 2026. Apple HIG JavaScript-only pages were not treated
  as readable evidence; the official video transcripts are the usable sources.
- [Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor](https://capacitorjs.com/docs) retain native rendering ownership.
  These corrections belong in existing React markup/CSS; no native plugin,
  persistence, totals, stock calculations or navigation changes are needed.
- Simplest choices: reuse the existing neutral status treatment and 12px
  supporting-text size; align the existing divider to its row text. No new
  tokens, fonts, containers, animation or dependencies.

| Pass / source | Before | Intended correction | Why |
| --- | --- | --- | --- |
| 1. Apple §16 Familiarity / Craft | Loading and no-comparison messages carry a green upward trend icon | Existing neutral status colors; omit the unsupported trend icon | The appearance must not imply an increase when no comparison exists |
| 2. Better Layout — Align to shared edges | Recent-order divider begins 6px after the receipt text | Align both at the existing 44px row inset | Remove accidental edge inconsistency without moving rows |
| 2. Better Typography — Size floors / consistent scale | Stock/cancellation labels and chart-detail date use 11px; nearby metadata uses 12px | Reuse 12px for these and the best-seller caption | Improve small supporting-text readability within unchanged geometry |

Verify the visible before/after in English/French, chart details and profile
popover, live/loading/empty/error states; confirm unchanged panel bounds and
no clipping. Then build and verify the actual Redmi if connected. Record later
passes and limitations separately rather than mark all skills passed by reading.

Motion pre-implementation decision, 20 September:
- Review Animations standards 2/4 and Better UI Frequent interactions flag the
  shared 420ms screen crossfade. DESIGN already specifies 125–150ms and the
  source DOX requires retaining the crossfade. Reduce both opacity transitions
  and their cleanup timer to 150ms; retain the existing easing, immediate live
  pointer access and reduced-motion bypass. This reconciles existing authorities
  rather than inventing a new transition. No scale, bounce or blur is added.
- [Android animation overview](https://developer.android.com/develop/ui/views/animations/overview)
  supports subtle visibility cues; [MDN transition-duration](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration)
  defines the existing CSS boundary. Capacitor retains WebView rendering: no
  native animation layer is needed for React screen slots. Checked today.
- Verify the rebuilt shared switch on all authorized routes on Redmi, rapid
  navigation, return to Dashboard, and reduced-motion CSS. Preserve retained
  screen state. Do not activate another screen's redesign card.

Owner steering during the motion pass: “if the skill says 420 leave it then.”
Clarified that 420ms comes from existing code, not the skills (under 300ms) or
DESIGN (125–150ms). Restored the existing 420ms fade for now; no shared motion
change was delivered at that point. The owner then explicitly instructed:
“make it under 300ms.” Apply 150ms, matching the existing DESIGN range; this
supersedes the temporary restoration and resolves the duration decision.

#### Restarted pass results

| Pass | Visible result / evidence | Status and boundary |
| --- | --- | --- |
| Apple Design | Loading/no-comparison no longer look like positive sales growth. Existing dominant sales total, smaller metrics and separate operational lists retained. | Correction verified in real-component loading/empty fixtures; actual comparison stays colored. |
| Better Interface and six domains | Supporting labels/date 11→12px; order separators now align with receipt text (both x988 in browser). EN/FR fit unchanged panels. Profile popover and chart details inspected; existing Escape focus return retained. | Layout/type corrected; existing vocabulary and brand colors retained. Prior measured contrasts are historical evidence, not rerun measurements. No new palette. |
| No AI Design Slop + Audit AI Design Slop | Removed the unsupported trend icon from unavailable/no-comparison states. Three panels still separate sales, stock and receipts; existing chart tones encode values. No extra shells, cards, motion or text were added. | No additional decorative removal justified by inspected live/popover/state views. Existing two-line rows and borderless links satisfy the owner's earlier removal requests. |
| Emil Design Engineering + Review Animations | Shared crossfade 420→150ms, owner-approved. Native rendered duration is 0.15s; reduced-motion emulation gives 0s. Chart taps and profile disclosure remain immediate. | Duration finding resolved. Preserve the existing crossfade contract rather than adopting a new effect; no bounce/scale/blur. This is not a blanket approval of every animation elsewhere in the app. |
| Design QA + Error Handling UX | Live/loading/empty/error/retry, chart detail and profile menu inspected in the browser; live Dashboard and shared navigation checked on Redmi. Empty is distinct from unavailable. | Scoped verification below passed. Screen-reader speech, large OS text and printer output remain unverified; no full accessibility or whole-app certification. |

Motion review:

| Before | After | Why |
| --- | --- | --- |
| Shared page fades and cleanup last 420ms | Both fades and cleanup last 150ms | Owner requested under 300ms; existing DESIGN permits 125–150ms. |

Verdict: approve this duration correction within the existing page-switch
contract. The untouched 220ms shared navigation indicator and keyboard-initiated
page fade remain outside a claim of universal compliance with every Emil rule;
the existing source DOX explicitly retains animated navigation/crossfades.

Verification and delivery evidence:
- Browser 1340 × 800: panel bounds unchanged at (18,92,886,686),
  (922,92,400,334), (922,444,400,334). EN/FR live, loading, empty and error
  checked; Retry summary returns live. Chart first-day popup exposes 820 MAD,
  stays within the panel, uses a 12px date and dismisses with Escape.
  Profile popup inspected in French; English switch and Escape focus return
  checked earlier in this restarted pass. Final browser console: no warnings/errors.
- Loading/no-comparison fixture: neutral surface and zero trend SVGs; stock and
  cancellation labels and best-seller caption measured 12px. No horizontal
  overflow or clipped ordinary café content in these checked views.
- Final `npm run android:beta` passed: web build, Android configuration,
  Capacitor sync, JVM checks and APK assembly. Initial build needed the local
  JDK/SDK environment restored; final build ran with it. Existing SQLite crypto,
  Gradle flatDir and SDK XML warnings remain. No business logic tests added.
- `adb install -r` succeeded, preserving café records. Final APK SHA-256:
  `b27e1c8256c4bba307177352a03e73d3246b6492dfea3381ce231a0af4205b83`.
  Redmi 22081283G measured 1340 × 804. Final live capture visually inspected:
  `tmp/ui01-restart-final.png`. Retained 46 orders, 1,829 MAD, 87 items.
- Native shared switch checked through POS, Orders, Products, Stock, Reports,
  Settings and back to Dashboard: rendered fade 0.15s, outgoing slot clears,
  no horizontal overflow on measured routes. Rapid navigation ends on Dashboard.
  Reduced-motion emulation reports 0s, then was cleared. Final focused foreground
  navigation captured no new errors/warnings. Earlier OS-lock/background attempts
  captured a Convex WebSocket/back-forward-cache disconnect; do not describe
  the entire device session as error-free or treat this UI pass as a sync repair.
- Device initially asleep/OS-locked; unlocked the noncredential OS screen and
  dismissed the USB-mode dialog without changing its selected mode. An initial
  helper wait wrongly expected a literal `data-fade=idle`; corrected inspection
  waits for no outgoing slot and no running animations. Those failed attempts
  were not accepted as verification. Final foreground screenshot is the evidence.
- No database reset, sale, payment or inventory mutation. Unrelated
  PeriodCalendar/reportProfit edits and untracked assets preserved. No graph
  structure changed, so no Graphify regeneration required. `git diff --check`
  passed. CSS scope scanner was not rerun; its known older limitation remains.
- Limits: not tested with screen-reader speech, enlarged OS font/200% zoom,
  320px reflow, slow-motion frame analysis or a working printer. Prior native
  report-error and cart-lock checks remain historical; not repeated for these
  presentation changes. Orders cloud-only seed-history issue remains separate.
- Next: owner visual review of this restart, then address Dashboard feedback and
  the explicit outstanding checks. Do not label the screen owner-accepted.
- Publication: implementation `3b428ab` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`. This follow-up records the successful
  publication; the installed APK contains the 150ms fade and Dashboard changes.

### UI-01 — previous Dashboard delivery (superseded by restart above), 20 September 2026

#### Final delivery record

- Dashboard polish implementation finished with the current light-mode layout
  preserved. This record supersedes the pending native Cancel, stock selection
  and Pencil-geometry items in the earlier chronological checkpoints below.
- Coverage completed across this pass: metrics and comparisons, proportional
  chart bars and tap details, best seller, stock attention, approved two-line
  recent orders, cancellation indication, both View all routes, EN/FR,
  loading/empty/error/retry fixtures, profile menu roles and keyboard dismissal,
  Settings, empty-cart lock, nonempty-cart Cancel and native report-error recovery.
  Fixture evidence and real-device evidence remain distinguished below.
- Final narrow fix: `src/features/stock/StockScreen.tsx` no longer retains an
  ingredient excluded by the active filter. Updated its owning AGENTS contract.
  Redmi check: unfiltered Brioche → Dashboard → Stock View all selects Soft ice
  cream portions, with matching Low status and 10 pc quantity/threshold. A search
  yielding no rows clears the detail; clearing search restores the visible item.
- `DESIGN.md` records the owner's explicit unchanged-layout decision as the
  Dashboard geometry authority for UI-01. The older Pencil frame differs; it
  was not edited, and its geometry must not override that owner instruction.
- Final `npm run android:beta` passed (web build, Android configuration,
  Capacitor sync, JVM checks and APK assembly). Existing build warnings remain
  as recorded below. No structural code change requiring a Graphify refresh.
- First install attempt returned INSTALL_FAILED_USER_RESTRICTED. A subsequent
  `adb install -r` succeeded. Final APK SHA-256:
  `2ff56fd4f65180288013553eda836d515a5e5e7c9b6e8a741d40da14f981e5e5`.
  Redmi 22081283G WebView measured 1340 × 804. Visually inspected final captures
  `tmp/ui01-final-stock.png` and `tmp/ui01-final-dashboard.png`; no clipping or
  horizontal overflow, no captured console errors/warnings. Retained 46 orders,
  1,829 MAD and 87 items. No sale, payment, inventory write or reseeding performed.
- Browser final check at 1340 × 800 covered live/loading/empty/error French
  fixtures without console warnings/errors. Realistic café names retained.
- Explicit limitations: Orders still excludes the cloud-only seeded receipts;
  its local-history contract is a separate UI-03/data issue, not a corrected
  Dashboard route. Printer output cannot be verified without a configured
  printer; error recovery passed. Actual screen-reader speech was not tested.
  These limitations are not owner-accepted or silently marked passed.
- Publication: implementation `2d4fdb7` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`. `git diff --check` passed; unrelated
  PeriodCalendar/reportProfit files and untracked assets remained untouched.
- Owner review is next. UI-01 is not marked owner-accepted and no next screen
  redesign is started.

#### Continued light-mode review

- Final closure work: native nonempty-cart Cancel verified on Redmi using one
  unsaved Espresso. Cancel stayed on Dashboard, kept the staff session and
  preserved the 10 MAD draft; removed only that temporary draft afterward.
  Dashboard still showed 46 orders / 1,829 MAD. No sale or payment was placed.
- Orders mismatch traced to the existing contract, not navigation: sample month
  was created only in Convex by `scripts/seed-cafe-month.mjs`; useOrdersData
  counts/pages SQLite and allows cloud enrichment only for already-local keys.
  The current Orders implementation therefore excludes cloud-only seed receipts.
  UI-03/data-history work must resolve that separately; no artificial local
  receipt import or misleading counter change is part of Dashboard polish.
- Dashboard → Low stock did expose a small selection bug: a previously chosen
  healthy ingredient remained in the detail panel after filtering it out.
  Pre-implementation research, 20 September 2026:
  [Apple split views](https://developer.apple.com/design/human-interface-guidelines/split-views)
  ties detail to visible selection; apple-design Familiarity/Grouping and the
  existing Stock DOX require opening on the first visible ingredient. Update
  the existing selection guard to retain a selection only while it matches the
  filtered list. This is React view state under the already-reviewed Android
  WebView/Capacitor boundary, not inventory or persistence logic. No layout,
  colours, data or native changes. Verify by repeating the actual Dashboard path
  after selecting Brioche in unfiltered Stock, then build/install the beta.

- Re-read better-accessibility (including semantics-and-aria), better-colors
  and Ponytail; retain the other skill readings recorded below.
- Measured rendered live Dashboard text pairs: primary 18.34:1; metadata
  5.14:1; chart labels 4.65:1; best-seller quantity 4.65:1; Low 4.51:1;
  Critical 5.07:1; Cancelled 5.62:1. These meet 4.5:1. The active navigation
  indicator is a sibling layer, so ancestor-only measurements are not valid
  for its white text; check its actual green surface separately.
- Reproduced medium accessibility finding in ProfileControl: Enter opens,
  Tab reaches EN, ArrowDown does not move, although the popover claims menu
  semantics. Escape from EN leaves focus on BODY. Apply better-accessibility
  Native elements first / Full keyboard support: remove unsupported menu and
  menuitem roles, preserve ordinary Tab/Enter/Space buttons, and return focus
  to the opener on Escape. No visual redesign or new widget dependency.
- Research before implementation, 20 September 2026:
  [W3C disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
  distinguishes colloquial menus from ARIA menus and restores trigger focus
  on Escape; [MDN Popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)
  documents native popover behavior. Prefer deleting unsupported semantics
  over introducing custom arrow-key menu code for these four ordinary controls.
  [Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor](https://capacitorjs.com/docs) retain native rendering ownership;
  this focus/semantics correction belongs to React/HTML, with no native change.
- Planned checks: browser keyboard open/Tab/Enter/Space/Escape/outside close,
  role/language/lock-error fixtures, build and Redmi shared Header on all six
  routes. Continue Dashboard review without activating other screen redesigns.
- Implemented `ProfileControl.tsx`: removed unsupported menu/menuitem roles,
  added trigger ref and restored focus on Escape. Updated owning POS DOX and
  DESIGN contract. No CSS, Dashboard layout or palette changes.
- Verification passed: build and android:beta/JVM checks; browser Enter/Space
  opening, Tab sequence, Settings action, Escape focus restoration; manager
  and cashier fixture controls exclude Settings/Report, cashier navigation
  exposes POS/Orders only; lock-failure fixture reports the error and permits
  retry. Native browser confirmation fixture timed out at the dialog boundary;
  do not claim its Cancel branch passed. No new captured console errors.
- Confirmed active navigation white-on-green contrast 6.78:1 using the actual
  sibling indicator, not the ancestor white background. No palette edits.
- Installed beta over existing Redmi app, measured 1340 × 804. Native Escape
  key returned focus to profile opener. Shared popover inspected on all six
  routes after waiting for navigation fades to finish; captures
  `tmp/ui01-{dashboard,pos,orders,products,stock,reports}-menu.png`.
  Its bounds remain x1090/y77, width232, height175 within the viewport.
- Real Dashboard paths: View all Stock opens Low stock and the expected single
  low-stock row. View all Orders opens Orders. Settings opens correctly and
  omits Settings from its own popover. Empty-cart Lock reaches the lock screen.
  Report becomes disabled/Printing, then shows the native error “Printer
  address must be a valid IPv4 address.” OK restores the Report action.
  Printer delivery is not verified; no printer setup changed.
- Discovered follow-ups: Orders shows zero for today despite Dashboard's 46;
  Stock's retained selected detail can still show Brioche when Low stock lists
  only Soft ice cream portions. Record these for UI-03/UI-05/data investigation;
  route success is not proof of correct destination data. No data reset or fix
  was attempted in this visual checkpoint.
- Owner rejected the exaggerated long-name fixture as unrealistic and explicitly
  required unchanged layout. Removed those fixture names, restored ordinary live
  preview, withdrew proposed name wrapping/details; no production change made.
- APK SHA-256: `86071baa8625abd0865dded1f2c50e503862989c200515f447c8e4c7b4cc4fb4`.
  No structural graph change. Unrelated dirty files preserved.
- Still not verified: real screen-reader speech, native nonempty-cart Cancel,
  printer output, Pencil reconciliation (connection unavailable). Owner review
  remains required; this checkpoint does not declare the whole screen complete.
- Publication: `482c643` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`. Redmi returned to the live Dashboard.

- Owner authorized starting Dashboard and confirmed the app is always light
  mode. The agent's dark-mode question was a misunderstanding; it does not
  block Dashboard work. Preserve the approved cream appearance.
- Read Apple design (including sections 15–17), the six better-interface
  domains and review format, anti-slop skills and relevant ARTICLE sections,
  Emil interaction guidance, review-animations, QA/error guidance,
  data-visualization and localization-design. Graphify queried Dashboard and
  its three regions before code inspection; Ponytail full applies.
- Scope: sales summary and comparison, 12-day chart/tap details, best seller,
  stock warnings, four recent orders, both View all actions, Header report
  feedback and staff menu (languages, Settings, lock/switch). Inventory includes
  loading, unavailable/error/retry, empty, long content, cancellation, decline,
  keyboard focus/dismissal, roles and EN/FR. Inventory is not a passed check.
- Reproduced with isolated real components: French comparison reads `32.1`
  or `50.0` while currency uses commas; an empty chart repeats four `0 MAD`
  ticks and paints 4px bars for zero. Long-data fixture confirms the 8px floor
  exaggerates approximately 1,000 MAD beside approximately 1,234,568 MAD.
- Narrow corrections justified by localization-design Date, Time, and Number
  Formats and data-visualization accurate encoding: locale-format the existing
  one-decimal comparison; remove the minimum decorative bar height. Reuse the
  existing chart-state message for an all-zero period instead of a false scale.
  Preserve each day’s existing full-height tap target when the period has sales.
- Research before implementation, checked 20 September 2026:
  [Apple charts](https://developer.apple.com/design/human-interface-guidelines/charts)
  explains relative bar heights and a zero lower bound;
  [MDN Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
  provides native locale formatting. Alternatives rejected: decorative minimum
  bars distort ratios; a new chart/formatting library adds no needed capability.
  [Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview)
  and [Capacitor runtime](https://capacitorjs.com/docs) keep this display-only
  correction in React/standard web rendering. Native viewport/lifecycle and
  saved summaries remain unchanged; no new Kotlin/plugin/database work.
- Planned verification: build; real component empty/live/decline/loading/error,
  tiny/zero values and tap details; EN/FR; 1340 × 800 browser; actual Redmi.
  Device rechecked: Redmi 22081283G connected. No retained café records reset.
- Implemented only `SalesPulse.tsx`: localized comparison, accurate fractional
  bar heights and the existing all-zero chart message. Updated `DESIGN.md`.
  No palette, geometry, order fields, data, native code or shared controls changed.
- Verification: `npm run build`, `npm run android:beta` (including JVM tests)
  and the existing isolated `tmp/check-dashboard-presentation.mjs` passed.
  Known build warnings: SQLite crypto externalization, Gradle flatDir and SDK
  XML tooling mismatch; no new build errors. No reseeding checks run.
- Browser at verified 1340 × 800: empty, loading, error/retry, live and long
  content; French `32,1`/`50,0` and English `50.0`; tiny bar measured 0.142884px
  for 1,050 MAD versus 1,234,567.89 MAD; exact amount remains available by tap.
  Chart Escape, language menu and both View all callbacks checked. No captured
  browser warnings/errors. Callback fixtures do not prove full route flows.
- Installed with `adb install -r` successfully, preserving data. Redmi 22081283G
  measured 1340 × 804; live Dashboard retained 46 orders / 1,829 MAD / 87 items.
  French comparison `6,6` and English `6.6` verified through staff language menu;
  restored English. Chart-day selection shows exact 1,829 MAD. Captured and
  visually inspected `tmp/ui01-dashboard.png`; no clipping in this live state.
  Focused device session captured no console errors. Native empty/error states
  and printer output were not exercised; those states were browser fixtures.
  APK SHA-256: `e81e62353ecf296d5f18d49040ab937c32af90087cf5297d755827935a95c64d`.
- Domain coverage: layout/type reviewed in existing + long-content fixtures;
  writing/localization corrected; chart encoding corrected; accessibility and
  motion partially reviewed (selection, Escape, unchanged immediate feedback).
  Color contrast measurement, full keyboard/role coverage, extreme truncation
  recovery, native report/lock dialogs and actual destination routes remain.
  Verdict: **partial checkpoint, not whole-screen approval**.
- Pencil connection retried and unavailable (desktop transport not connected);
  no master updated. No graph structure changed; no graph refresh needed.
  Unrelated PeriodCalendar/reportProfit work preserved.
- Whole-screen acceptance remains pending. Light-mode direction is confirmed.
- Publication: checkpoint `a97ee93` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`; this follow-up records the evidence.

### UI-00 — establish recovery and screen sequence — complete, 20 September 2026

- Owner requested this file, mandatory rereading after compaction, actual skill
  reading, Dashboard-first/Lock-last coverage and no personal design choices.
- Created this ledger and linked it from root instructions, README and the
  SaaS record. Updated stale active-direction text so there is one UI sequence.
- Documentation only: no UI changes, app tests, device actions or data changes.
- Verification: read back the full ledger; checked all eight screen cards,
  all 25 named skill files, recovery links in AGENTS/README/SaaS, the owner-choice
  and compaction rules, and `git diff --check`. Passed. No app build is needed
  for documentation-only changes.
- Publication: `389364f` pushed to `origin/main` at
  `https://github.com/aymansal/olaso-pos`. This follow-up records that evidence.
- Next: UI-01 Dashboard, starting with the recovery protocol and full inventory.
