# Olaso SaaS transition

Updated: 20 September 2026.

## Current instruction and next action

This is the single active plan and progress record, replacing the old goal
plans and ledgers. Read it after the applicable `AGENTS.md` files when resuming
work. `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, and `BRAND.md` still own
durable product, engineering, design, and brand decisions.

The owner has authorized documentation cleanup, research, this plan, and
installation/review of the five supplied design skill collections.
Do not run the app, test it, audit its code, fix bugs, change databases, install
an APK, publish a release, or start implementing this plan now. The owner will
choose the next step. The supplied skills are installed; no implementation
step is active. Next action: discuss the owner's selected ingredient task or
first specific UI change before choosing its implementation.

Work one step at a time. Completing a step does not activate the next one.
Record new concerns here as they arrive. Explain findings in plain English.

## Agreed direction

- Turn the current single-client Android POS into a service for multiple
  independent client businesses.
- A business may have one location or several locations. Keep each location's
  operations separate, while allowing its authorized owner to view them together.
- Polish the existing application first, including every relevant popup and
  less visible state. Simplify ingredient management with the owner.
- Then improve security, database behavior, synchronization, and efficiency.
  No claim of readiness for more clients until that work is proven.
- Add a Next.js owner dashboard accessed through a web link, designed first
  for phones. Desktop scope remains to be decided. Its initial purpose is metrics.
- Replace the private/public GitHub release ritual with dependable restricted
  distribution and a quiet update notice.
- Aim for professional operation at larger clients through measurable
  reliability, clear workflows, data protection, and maintainable code.

These are requirements and direction, not claims that these capabilities exist.

## Concerns to retain

| Concern | What is known now | Next investigation, when requested |
| --- | --- | --- |
| Ingredients, recipes, units, and purchases are too complicated | Owner-reported usability problem | Walk through the owner's real tasks; remove unnecessary decisions and repetition |
| Popups and secondary states feel inconsistent | Owner-reported usability problem | Review each chosen screen's complete interaction, not just its opening view |
| Products, orders, and staff changes synchronize too slowly | Owner-reported operational problem | Measure each action separately, including upload, download, server work, and local saving |
| Every action supposedly uploads the entire database | Unverified explanation from another conversation | Establish what actually travels in each direction before choosing a fix |
| Bugs, redundant code, and inefficient database work | Concerns requiring evidence | Investigate a selected scenario; record root cause rather than assume a rewrite is necessary |
| Security is inadequate for SaaS | Required review; no security audit performed here | Verify business/location isolation, permissions, sessions, offline access, and abuse protection |
| Updates depend on briefly making the APK repository public | Owner report, also described in existing release notes | Replace with a researched restricted channel |

Document review found that the architecture describes queued individual writes
and larger downloaded replacement snapshots. It also contains conflicting old
and newer descriptions of incremental downloads and reporting. Instructions
describe role checks and protected credentials; that does not prove their
correctness or SaaS isolation. Neither "every order is uploaded again" nor
"there is no security at all" is a verified technical finding from this work.
Old audit reports are historical evidence, not current diagnoses or permission
to resume their repair lists.

## Research before every implementation step

Before choosing or implementing any change, research current professional
practice for that exact problem. Start with current official documentation;
use primary engineering sources for patterns the platform documents do not cover.
Do not treat a video, generated answer, or an old plan as proof.

For each step, record a short research note here containing:

1. The actual problem and the evidence available; distinguish reports from
   reproduced facts.
2. Sources, direct links, and date checked. Recheck relevant guidance when the
   step starts; this initial research is not a permanent substitute.
3. The smallest suitable approach, alternatives considered, and the reason
   for the choice. Reuse existing capabilities before adding dependencies.
4. Which work belongs on Android, in the app's data layer, or on the server,
   where applicable. Use official Android and Capacitor/plugin guidance for
   affected device boundaries.
5. Expected user benefit, security/data implications, and a focused way to
   demonstrate the result. Set performance and cost targets before optimizing.

Research is a gate before implementation, not permission to broaden the task.
When evidence is missing, say so. Do not invent benchmarks, root causes, or
successful tests. Maintain protection against lost sales, wrong totals, and
unauthorized access while simplifying the app.

## Work order

| Stage | Scope | Status |
| --- | --- | --- |
| 0 | Replace old plans; capture requirements and initial research | Complete; publication recorded below |
| 1 | Owner-led interface polish and ingredient workflow simplification | Design skills installed and reviewed; waiting for the first selected app change |
| 2 | Security, database and sync investigation, then selected fixes | Not started |
| 3 | Business/location separation and safe migration of the existing client | Not started |
| 4 | Restricted APK distribution and update experience | Not started |
| 5 | Mobile-first Next.js metrics dashboard | Not started |
| 6 | Realistic acceptance, recovery, operational readiness, and staged client rollout | Not started |

Stages 3–6 are proposed grouping after the owner's confirmed UI-first and
security/data-second sequence; their detailed order can change by owner
direction. Do not generate a large speculative card backlog. A security or
data-loss issue discovered during authorized work must be recorded and explained;
do not silently fix unrelated systems or ship a known unsafe result.

### Stage 1: simplify the operator's work

Start with the screen the owner selects. Review the whole flow: opening,
editing, validation, saving, cancelling, deleting, empty/loading/error states,
keyboard, scrolling, long names, and relevant language and permission states.
Use consistent controls, spacing, field labels, button placement, and feedback.
Keep technical explanations out of everyday café work. Preserve accessibility.

For ingredients, first describe everyday tasks in the owner's words: add an
ingredient, receive a delivery, enter a drink recipe, correct a physical count,
and understand cost. Propose fewer visible steps and sensible defaults; keep
advanced size/choice details out of the simplest path. Do not predetermine a
replacement model before that discussion. Simpler screens must still preserve
exact units, accurate stock, purchase costs, and historical sales. No silent
conversion of old recipes or deletion of historical records.

### Stage 2: establish facts, then fix the cause

For one sale, one product change, one staff change, reconnect, and opening a
report, eventually measure: data sent, data received, records read/written,
request count, waiting time, and cloud-to-tablet save time. Compare small and
realistic large histories using isolated data. This is future work, not a test
authorized today.

The target is changes-only routine uploads, appropriately scoped incremental
downloads, bounded initial setup/recovery, and reports that do not repeatedly
read all orders. Make retries safe against duplicate sales or stock deductions.
Do not truncate business data to make requests appear small. Check unnecessary
full snapshots, subscriptions, image transfers, local rewrites, and repeated
requests as separate possible causes. Choose a database based on evidence;
neither keeping Convex unchanged nor replacing it is decided.

Review sign-in and recovery, per-action permissions, protected device sessions,
lost-device revocation, offline access duration, sensitive local storage,
server input checks, logging, and secrets. Design appropriate limits for login
attempts and expensive operations, scoped to account/device/business as needed.
Limits must not lose a queued sale or let one business exhaust another's service.
Define server behavior for valid offline work arriving after access changes.

### Stage 3: businesses, locations, people, and tablets

Proposed model for discussion:

| Concept | Meaning |
| --- | --- |
| Business (tenant) | One client company, isolated from every other client |
| Location | One branch belonging to exactly one business |
| Person and membership | A signed-in identity with explicit business/location permissions |
| Registered tablet | A till assigned to a business and location |
| Operational record | An order, stock movement, expense, or other fact owned by its business and location |

Example: Client A owns A1. Client B owns B1 and B2. Client A can never request
B1 or B2 records. Client B's authorized owner can select B1, B2, or their
combined view. Staff assigned only to B1 cannot access B2 merely by changing
a location number in a request.

The server must establish business membership from a verified session, check
location access on every operation, and check that referenced products, staff,
files, and parent records belong to the same allowed scope. A username or a
location selector alone is not protection. Apply scope to queries, writes,
reports, exports, file access, background work, caches, and retry identifiers.
Never fetch every client's data and hide the unwanted rows in the interface.

A shared database with enforced business/location boundaries is a candidate;
separate databases are another option if justified by contractual isolation,
scale, or recovery needs. No provider or final schema is selected today.

Keep location stock, sales, expenses, and reporting separate. Decide later
whether catalogs are independent, copied, or shared with branch overrides.
Do not create inter-branch stock transfers or multiple tills per branch without
a concrete requirement. A tablet should normally be provisioned to one branch;
safe reassignment and any branch switching require explicit design so pending
orders cannot migrate into another branch. Scope offline data and credentials
to the correct business, branch, and person.

Before migration: back up the existing client; map all current records to its
business and branch; account for pending tablet operations and older APKs;
rehearse an upgrade and recovery on isolated copies; verify totals and history.
Do not reset the production database. Multi-client release must demonstrate
that attempts to cross business or unauthorized location boundaries fail.

### Local storage versus SaaS

SaaS does not require an always-online till. Android's official offline-first
guidance supports local data for immediate operation and later synchronization.
Our proposed direction is to retain reliable offline checkout while the server
controls business membership, location access, and the shared acknowledged
record. Which management actions also work offline remains a decision to
review; copying all existing offline complexity into SaaS is not a requirement.

The owner dashboard can show only data that has reached the server. It must
show freshness per location and mark delayed/missing data clearly. Never call
an offline branch's figures live, silently exclude it from a combined total,
or promise immediate revocation on a disconnected tablet.

### Stage 4: private and inexpensive updates

Stop designing around public/private repository switching. Keep source code
private and separate release build history from customer download access.

Two candidates need a deployment/cost comparison before selection:

- Private object storage: an authenticated release endpoint checks the client
  or registered device's entitlement, then grants a short-lived download link.
  No GitHub access token or permanent shared download secret inside the APK.
- Managed Google Play private apps: potentially appropriate when customers'
  tablets can be enrolled into managed business organizations. Enrollment and
  management requirements must be evaluated; this is not a drop-in replacement
  for ordinary sideloaded tablets or a promise of silent installation.

Temporary links are bearer access: anyone possessing a valid link may use it
until it expires. A recipient can copy an installed/downloaded APK. Restricted
distribution is achievable; absolute "only this app can ever possess the file"
is not a security promise. Copying the APK must never grant access to client data.

Suggested check policy, pending measurement and owner choice: check a tiny
release manifest after authenticated foreground launch/resume only when the
saved last-check time is old enough (initial proposal: 12 hours), plus an
explicit Check for update action. Save this timing across restarts; coalesce
simultaneous checks and back off after failures. No every-minute database poll,
no sales-table reads, and no continuous update subscription. Use appropriate
HTTP caching without sharing private client responses across accounts. Cached
release information does not bypass authorization to download the APK.

Suggested interface: a small top banner that appears gently once per new
eligible version, with Update and Later. Retain an About badge after dismissal,
respect reduced motion, and do not cover payment controls or interrupt service.
Failure to check is not "you are up to date." Keep checkout available offline.

Preserve package identity, signing continuity, increasing versions, download
integrity checks, and installation over the existing app without data loss.
Installation uses the applicable Android confirmation flow. Defer it during
an active order or unsafe database work. Roll out gradually; retain a recovery
path compatible with database migrations and Android version rules. Review
current Android distribution/verification requirements when this step begins.

### Stage 5: the owner's dashboard

Build a phone-first Next.js website for metrics, with a clear branch selector
and a combined view of only authorized branches. Single-location owners should
not face unnecessary choices. Desktop layouts may follow the owner's scope.

Use server-enforced identity and location permissions. Cache keys must include
the permitted business/location context; one owner's page must never reuse
another owner's private response. Read scoped summaries with bounded history,
not every raw order for every page load. On sign-out or account/location change,
discard inaccessible cached results. Show branch freshness and incomplete totals.
Decide business-day/time-zone rules and currency handling before combining figures.
No browser access to tablet PIN secrets and no management features assumed.

### Stage 6: client readiness

Before client rollout, stage 6 must demonstrate tenant/location isolation,
correct totals under retry and offline recovery, realistic-volume performance,
backup restoration, and data-preserving upgrades. Define support ownership,
incident handling, and monitoring without logging client secrets. Business
onboarding, subscription/suspension policy, and retention/export rules need
owner decisions; no billing system or enterprise certification is assumed.

## Initial research checked on 20 September 2026

These sources support options, not a completed audit or final architecture:

- [Android offline-first guidance](https://developer.android.com/topic/architecture/data-layer/offline-first): local operation is compatible with network synchronization; it does not require uploading full history.
- [Convex best practices](https://docs.convex.dev/understanding/best-practices) and [pagination](https://docs.convex.dev/database/pagination): use suitable indexes and bounded reads instead of unbounded table collection.
- [Convex authorization guidance](https://stack.convex.dev/authorization): enforce access around server operations; do not rely on hidden UI controls.
- [AWS tenant isolation strategies](https://docs.aws.amazon.com/whitepapers/latest/saas-tenant-isolation-strategies/): shared and separated infrastructure are both SaaS options; isolation must be designed explicitly.
- [Private apps in managed Google Play](https://support.google.com/googleplay/android-developer/answer/9874937?hl=en): organization-restricted distribution, subject to managed setup.
- [Amazon S3 temporary download links](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html): expiring authorized object access; links remain usable bearer credentials. S3 is an example, not a selected vendor.
- [Capacitor App lifecycle](https://capacitorjs.com/docs/apis/app): foreground/resume events provide a possible trigger for a throttled check; the 12-hour interval is our proposal, not a platform requirement.
- [Android flexible in-app updates](https://developer.android.com/guide/playcore/in-app-updates/kotlin-java): applies to the Google Play route, not automatically to our sideloaded APK.
- [Next.js authentication](https://nextjs.org/docs/app/guides/authentication) and [data security](https://nextjs.org/docs/app/guides/data-security): authorization must protect data access, including server operations.

## Progress and recovery record

When resuming, read Current instruction and next action first. Do not reactivate
deleted goal plans from Git history or follow stale graph references to them.
Use Graphify for orientation and verify facts against current files. Research
notes and completed-step evidence belong here; do not grow another set of plans.

For each authorized step, record: scope, sources and decision, files changed,
checks actually performed, remaining limitations, commit/push evidence, and the
exact next action. Use focused checks and physical tablet evidence when app
behavior changes. Documentation-only work verifies documents without rebuilding
or exercising the unchanged application.

### SAAS-00 — documentation reset

- Owner's new direction and reported problems captured; no app diagnosis claimed.
- Removed 19 obsolete files: root plans/ledger, Goal 01–06 plans/start prompts,
  and OPTIONS card specs. Instruction files, product/design/architecture/brand authorities,
  operating guides, menu/recipe references, and historical audit evidence retained.
- Retained instructions point to this plan. UI-first order replaces the old
  polish-last sequence. Historical operating guides do not authorize testing now.
- Existing PeriodCalendar and reportProfit edits and untracked assets belong
  to other work and must remain untouched.
- App tests, builds, device actions, database changes, and releases: not run,
  as requested. Only documentation consistency and change scope are checked.
- Documentation verification: all 19 selected files are absent, every tracked
  `AGENTS.md` remains, changed-document local links resolve, retired plan
  references are removed from edited documents, and `git diff --check` passes.
  Hash checks confirm the three unrelated source files remain unchanged by
  this work. Graphify was queried; no structural app change requires a rebuild.
- Publication: documentation commit `546ccf09c0079aa374d0782cd27557caa3a6bf02`
  pushed to `origin/main` in `aymansal/olaso-pos`. This follow-up records that
  publication and closes SAAS-00; it does not start implementation.
- Next action: wait for the owner's chosen first UI step and additional skills.

### SAAS-01 — design skill installation and review

Scope: read the five owner-supplied repositories, install their portable Codex
skills, research distracting/generic UI patterns, and explain their fit for
Olaso. No app implementation, code audit, app test, or device action authorized.

Installation completed on 20 September 2026 into
`C:\Users\Ayman\.codex\skills`, using the official Skill Installer's download,
validation, and copy helpers against these pinned revisions:

| Collection | Installed skills | Source commit |
| --- | --- | --- |
| [Emil Kowalski](https://github.com/emilkowalski/skills) | 13 | `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3` |
| [ConardLi](https://github.com/ConardLi/garden-skills) | 5 | `aaf9a82f5efd73e87cc0998edc398e75bfc35901` |
| [MengTo](https://github.com/MengTo/Skills) | 141 | `5f47e389dac337a1bca5cddf376419248b3010f6` |
| [Jakub Krehel](https://github.com/jakubkrehel/skills) | 11 | `267330e1adfc66a718fb65fa6918c1f06d0a689e` |
| [Owl Listener](https://github.com/Owl-Listener/designer-skills) | 111 | `9a6930cf84a822eb458624bd11c61aac5bbdf224` |

All 281 skill folders and their bundled files are installed. Owl's wider
catalog advertises other repositories; only skills in the supplied repository
were installed. Claude/Gemini plugin commands were not converted into Codex
commands. No third-party installation scripts ran, no application dependencies
were added, and no external service credentials were configured. Existing skills
were preserved. Newly installed skills become available in a subsequent turn;
their runtime behavior has not been exercised in Olaso.

The machine-local receipt contains per-skill paths, revisions, file counts,
and verification evidence:
`C:\Users\Ayman\.codex\skill-install-records\2026-09-20-design-skills.json`.
Do not copy this entire skill library into the application repository.

#### Recommended use and limits

- Emil: `emil-design-eng`, `apple-design`, and `review-animations` for clear
  interaction states and restrained motion. `apple-design` is Emil's adaptation
  of Apple talks, not an official Apple-authored skill. Apply useful principles
  while retaining Olaso's Android platform, approved layout, and visual identity.
- Jakub: `better-interface`, `better-ui`, `better-typography`, and
  `better-accessibility` for consistent dialogs, controls, spacing, legibility,
  and feedback. Its stress-testing tools remain unused until testing is authorized.
- Owl: `jobs-to-be-done`, `teslers-law`, `form-design`,
  `information-architecture`, and `user-flow-diagram` for simplifying ingredient
  tasks before drawing screens. Use a focused conversation, not a large design
  workshop or extra documentation process.
- MengTo: `no-ai-design-slop` and `audit-ai-design-slop` are useful now: challenge
  unnecessary containers, repetitive labels, weak emphasis, and effects without
  a purpose. Most cinematic, 3D, and website theme skills are for future projects.
- ConardLi: `web-design-engineer` can help with intentional layouts and complete
  interaction states; its website/prototype tools and other media skills are
  mostly for future work. Do not bring prototype-only controls, CDN scripts, or
  a new styling system into the POS.

Skills provide guidance, not permission to change the app. Choose the few that
fit the selected problem. Repository instructions and owner decisions govern
conflicts; installed skills do not justify framework swaps, new dependencies,
new design authorities, or overriding accessibility and data correctness.

#### Research and proposed motion direction

Checked on 20 September 2026:

- [Apple motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion): keep feedback brief and purposeful, and avoid unnecessary motion in frequent interactions.
- [Apple: Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/): responsiveness and interruptible interaction inform the principles; this does not prescribe copying iOS surfaces into Android.
- [Emil: 7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips): repeated daily actions often benefit from reducing or removing motion.
- [Emil: Agents with Taste](https://emilkowal.ski/ui/agents-with-taste): explicit design judgment matters when using agents; isolated recipes still need context.
- [MengTo: No AI Design Slop](https://github.com/MengTo/Skills/blob/main/agent-skills/ui/no-ai-design-slop/SKILL.md): preserve a justified visual identity; remove reflexive decoration and unnecessary UI complexity.
- [Jakub: Better UI](https://github.com/jakubkrehel/skills/blob/main/skills/better-ui/SKILL.md): useful component consistency guidance, with defaults that need adapting for frequent POS use.
- [Owl: Tesler's Law](https://github.com/Owl-Listener/designer-skills/blob/main/interaction-design/skills/teslers-law/SKILL.md): distinguish necessary business complexity from work the software can absorb.
- [OpenAI skill documentation](https://learn.chatgpt.com/docs/build-skills): portable skill folders contain instructions and optional supporting resources.

Here, "AI slop" means unconsidered design defaults: repeated decoration,
unnecessary motion, weak prioritization, wordy labels, and incomplete states.
It is not a claim that a particular font, rounded corner, shadow, or gradient is
inherently bad, or proof of who authored an interface. Olaso has not been
visually audited in this step.

The owner rejects decorative bouncing buttons. Proposed POS baseline: stable
tap targets with immediate color/shading feedback, no input delay, and restrained
transitions only where they clarify a state change. Respect reduced motion.
Both Emil and Jakub include button-shrink recipes; do not apply them globally.
Apple-inspired clarity does not require glass surfaces, spring effects, or an
iPhone appearance. Confirm and implement the selected controls in a later step.

#### Ingredients: simplify the task before the screen

First discuss one real example with the owner: adding an ingredient, recording
a delivery, or specifying an amount used in a recipe. Identify what the operator
actually knows and what the app should calculate. For example, entering twelve
one-litre bottles with a total purchase price could let the app derive total
volume and unit cost, while a recipe uses millilitres. This is an illustration,
not an approved replacement model or a claim about current behavior.

Avoid moving the same complexity into extra dialogs. Preserve accurate units,
stock, cost calculations, and historical records. Workflow and underlying logic
may need to change together; visual polish alone cannot resolve that problem.

#### Evidence and next action

- Installation verification: 281 destinations, required skill headers present,
  and 1,392 copied files verified byte-for-byte against pinned source folders.
  External services and optional skill tools were not configured or invoked.
- Changed project file: this plan only. No app source, database, UI, release,
  or device changes. No build or app test is required for this documentation step.
- Graphify was queried for project orientation; no structural app change
  requires regenerating it. Document scope and whitespace checks precede commit.
- Publication: pending documentation commit and push; installation itself is
  machine-local and is recorded in the receipt above.
- Exact next action: the owner selects a concrete ingredient task or UI flow;
  discuss a simpler interaction, research its specific platform requirements,
  and proceed only within that selected scope.
