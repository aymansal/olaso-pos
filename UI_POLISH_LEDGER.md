# Olaso screen-by-screen polish ledger

Updated: 23 September 2026.

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
- **Publication:** commit recorded in the follow-up ledger commit.

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
