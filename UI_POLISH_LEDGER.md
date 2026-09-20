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

- **Active screen: UI-01 — Dashboard.** Restarted visual review delivered for
  owner review, with explicit verification limits below. Not owner-accepted.
- **UI-00 complete:** ledger and recovery instructions created and published.
  Next work is UI-01 Dashboard. No new UI implementation or app testing was
  performed during ledger creation.
- **Exact next action:** owner reviews the restarted Dashboard changes and
  150ms screen fade. Address Dashboard feedback here; carry the unverified
  accessibility/device checks below forward. Keep data-history work separate
  and do not advance to POS without Dashboard acceptance.
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

Owner clarification, 20 September: apply the agreed skills in successive passes
to every screen, not one blended bug audit. Order: Apple Design; Better Interface
(accessibility, layout, writing, typography, colors, UI); both anti-slop skills;
Emil Design Engineering and Review Animations; Design QA and Error Handling UX.
For each pass record actual visual findings, source, changes or justified no-change,
and evidence. A skill need not force a change. Bug checks alone do not complete
visual polish. A restart resets review status, not approved layout or café data.

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
| UI-01 | Dashboard | Metrics, chart details, recent orders, stock attention, View all paths, shared menus/actions reachable here and all relevant states | Restarted review delivered; limitations recorded; owner acceptance pending |
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

- Owner confirmed Olaso is always light mode. There is no dark-mode Dashboard
  and no dark-mode work requested. The earlier clarification was an agent
  misunderstanding, now resolved; preserve the existing cream appearance.
- Owner explicitly requires the Dashboard layout to remain unchanged. Use
  realistic café names in previews (for example Iced Matcha Latte and Oat Milk).
  The agent's exaggerated long-name fixture is not a real reported café problem
  and does not authorize expanding rows or adding name-detail interactions.
  Withdraw the best-seller wrapping/popover choice; keep the existing row.
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
