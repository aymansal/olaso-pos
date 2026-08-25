# Goal 06 Plan — Production Hardening, Release, and Acceptance

Project rules and durable decisions remain in AGENTS.md, PRODUCT.md,
ARCHITECTURE.md, DESIGN.md, and BRAND.md. PLAN.md owns goal order. This file
owns only the final production-hardening scope and card order.

## Status

**Goal:** Goal 06 — Production Hardening, Release, and Acceptance

**Status:** active; HARD-01 in progress

**Objective:** Complete every authorized management operation as a local-first
workflow, preserve prepared screens and saved content across navigation, remove
the remaining startup, recovery, security, performance, packaging, upgrade, and
operational risks, then let the owner perform the final manual screen-by-screen
review and UI polish before accepting a reproducible signed release for the real
tablet and printer.

## Sequencing decision

Goal 06 is not one autonomous `/goal`; it proceeds one reviewed card at a time.
Functional completion comes first: local-first management, staff/lock/category
work, physical offline/reconnect closeout, safe permanent deletion,
navigation/startup performance, backup, release/update readiness, and security
review. The separately approved product-owned size/choice/ingredient cards
then complete before the owner's final visual review. Their full contracts live in
[Goal 06 Product Configuration](GOAL-06-PRODUCT-CONFIGURATION.md).

POLISH-01 and POLISH-02 are deliberately last. Only after LOCAL-01 through
HARD-07 and OPTIONS-01 through OPTIONS-04 are complete does the owner manually
inspect every fully functional screen, prompt the desired UI changes, and
approve each result. HARD-08 then runs final endurance and acceptance against
that polished product.

## Verified starting leads

- The current native launch path can show default/unbranded white artwork before
  the application becomes visible.
- React waits for SQLite and then terminal settings, has an empty intermediate
  render, eagerly imports major screens, and includes oversized source images.
- `App.tsx` currently removes the old screen on every tab change. Returning to
  POS reconstructs its data hook and image elements; Dashboard/Reports can
  re-enter full loading and Reports explicitly clears its prior snapshot.
- LOCAL-01 through LOCAL-04 now provide verified local-first Product, Stock,
  expense, compensation, and staff management. The approved independent
  size/choice/ingredient model remains the next functional gap.
- The local POS already works independently of Convex success, so network work
  must never gate usable startup.
- The physical Galaxy Tab A9 and current WebView expose the approved full
  application through native scaling, but startup timing was not yet recorded
  through controlled five-run cold/warm tests.
- assets/brand/olaso-wordmark-operational-green-transparent.png is a verified
  720 by 196 RGBA derivative of the supplied artwork, colored Operational Green
  for use on the Cream Surface. It is not yet referenced by the app.
- Goal 02 proved debug install-over-upgrade and local migration. Production
  signing, protected key custody, release automation, backup restore, rollback,
  endurance, and owner acceptance remain incomplete.
- Current Settings and hardware copy is technically explicit but may be too
  verbose for a small coffee-shop team. The owner will decide what to remove,
  shorten, hide, or retain after reviewing the complete application.
- CATALOG-01 provides verified management-owned category artwork selection and
  a neutral offline fallback for categories outside the initial four.
- The wide launch wordmark is not an app icon. A compact icon and the owner's
  proposed minimal wordmark/light-reveal startup concept remain unapproved; no
  GIF, video, vector, or other motion format is selected yet.

## Included

- Repeatable physical-tablet startup baselines and ready marks.
- One continuous branded cream Android/WebView/React launch surface.
- Safe SQLite/lock startup gating and elimination of blank intermediate state.
- Profile-driven bundle, image, decode, and synchronization scheduling work.
- Local-first category, product, modifier, recipe, inventory, purchase,
  adjustment, expense, compensation, and protected staff/PIN management.
- Product-owned sizes, freely named choices, exact size/choice ingredient
  recipes, mandatory independent copying, actual selected-stock deduction,
  honest ingredient-only costing, and immutable historical snapshots.
- Safe deletion of live categories, products, ingredients, and staff while
  preserving completed orders, stock movements, financial history, and the
  last owner account.
- Retained visited-screen state, saved-content-first refresh, immediate resume
  clock correction, and navigation/image reconstruction removal.
- Export, backup, restore, corrupt-data stop, and support recovery rehearsal.
- Protected signing, versioning, GitHub Actions/Release flow, upgrade, rollback,
  and signing-key custody documentation.
- Security, privacy, dependency, secret, Convex quota/index, performance, and
  support readiness review.
- Realistic service endurance and final owner acceptance on the actual tablet
  and printer.
- A normal owner-led screen-by-screen review, followed by only the changes
  explicitly approved for each screen.
- A direct Lock / Switch staff action available to every authenticated role
  without opening owner Settings.
- A versioned category-artwork gallery with explicit category selection and a
  neutral fallback that never blocks an unfamiliar custom category.
- A final compact Android app icon plus an optional minimal branded startup
  motion that cannot delay the immediate static first frame.

## Excluded

- Replacing React, Vite, Capacitor, SQLite, Convex, Astryx, or the approved UI.
- A state library, service worker, custom cache framework, native UI rewrite,
  splash dependency, artificial splash delay, or optimization without a trace.
- Multi-tablet merge/conflict machinery; the first release keeps one active POS
  tablet and surfaces an unexpected stale cloud revision instead of silently
  overwriting it.
- Unapproved product features, new reports, printer transports, speculative
  scaling, Google Play distribution, or multi-branch support.
- Runtime AI image generation, attempting to predict every possible category,
  or requiring a perfect artwork match before a category can be created.
- Preselecting GIF, MP4, or another startup format without bundle/decode/startup
  measurements; decorative motion never extends the splash duration.
- Removing required validation, failure recovery, printer setup, or safety
  actions merely to make a screen look simpler.
- Disposable customer packaging in product recipes, nested ingredient recipes,
  house-syrup manufacturing workflows, shared mutable product choices, and a
  detailed profitability/configuration preview inside Edit Product.
- Committing signing keys, credentials, production exports, device identifiers,
  or private owner recovery information.

## Git workflow and card gate

- Work directly on `main`; it is the only local and remote branch.
- The initial read-only review starts in a normal conversation, not `/goal`.
  Do not mark a card active merely to load context and discuss the first
  screen.
- When the owner authorizes implementation, activate only the current card and
  keep later cards pending.
- Keep one Goal 06 card in progress and unrelated work out of its commit. Do
  not create goal, feature, or handoff branches and do not add PR ceremony for
  this single-owner project.
- Every card commit begins with its card ID and is pushed directly to
  `origin/main` before the card is done.
- PLAN.md's mandatory bug rule overrides this card order: any reproduced bug
  pauses the active card until the original path is fixed, regression-protected,
  and physically proved. A workaround, restart, cleaner test state, alternate
  record, or later card assignment is not completion evidence.
- Before every implementation card, search current official Android and
  Capacitor/plugin documentation for the affected platform behavior. Record the
  applicable native option, the selected native-versus-React/data boundary,
  why rejected alternatives do not fit this tablet/product, and the physical
  test that will prove the decision. Never treat the packaged app as an ordinary
  website, and never add native code merely to call an existing correct native
  plugin through Capacitor.
- Every implementation card follows PLAN.md, including focused checks, APK
  installation, physical Galaxy Tab A9 testing, and clean console/logcat
  evidence. Printer-impacting work also receives real paper verification.

## Task board

| ID | Task | Status | Completion evidence |
| --- | --- | --- | --- |
| LOCAL-01 | Add the shared local-first management identity/outbox/sync foundation | done | `0c7da7d63c293c4d96b5c28d8425210c6f9cc8b8` on `origin/main`; focused/build/Android/tablet/Graphify evidence below |
| LOCAL-02 | Make catalog and recipe management fully local-first | done | `1cfbf92fe6df3c8d6a8ee2065f60dafdad041d29` on `origin/main`; automated, Convex, Android, physical offline/restart/reconnect, cleanup, and Graphify evidence recorded in WORK_LEDGER.md |
| LOCAL-03 | Make inventory, expense, and compensation management fully local-first | done | `1105de62d8133448b7202dd67971ee83c56ced12` on `origin/main`; full automated, Android, offline/restart/reconnect/exact-cloud, lifecycle, focus-zoom, Graphify, and documentation evidence recorded |
| STAFF-01 | Add minimal owner-only offline staff creation and protected initial PIN setup | done | `9754897f4be65ffca1b572140e44fc229cad948f` on `origin/main`; focused/cloud/full regression, Android beta, exact 1340 × 800 UI, flight-mode creation, app/tablet restart, local/cloud sign-in, duplicate reconnect, protected cleanup, QA cleanup, and Graphify evidence pass |
| CATALOG-01 | Add offline category artwork selection and a neutral custom-category fallback | done | `43c9e4a3ed169ae7a07344f9587a51f65051e203` on `origin/main`; six optimized assets, neutral resolver, picker, schema 17, full local/cloud path, automated/Convex/Android, migration/offline/restart/reconnect/cleanup, exact UI, lifecycle/network/console, Graphify, authority, and DOX evidence pass |
| LOCK-01 | Add a direct role-safe Lock / Switch staff action outside owner Settings | done | `4486a8921d893e3e5edce098b8a17a500cf0a537` on `origin/main`; approved cart handoff, protected access, full regression/build, repeated 140-task beta, final APK, owner/cashier online/offline/restart matrix, exact viewport, clean logs, redundant-Settings root fix, and Graphify pass |
| LOCAL-04 | Close out flight-mode/restart/reconnect/exact-once management behavior | done | `7f240210c2a591649f7fabd3c3fe51fb9db72df3` on `origin/main`; full automated/physical matrix, schema 18 actor attribution, ordered/repeat sync, role isolation, stale-cache cleanup, hidden-wake focus fix, exact viewport, clean logs, Graphify, and QA cleanup pass |
| DELETE-01 | Add safe permanent category, product, ingredient, and staff deletion | done | `dc86855798041f1e772a7ca3d8729841549faa9d` on `origin/main`; official Android research, schema-19 migration, immutable history, local/cloud deletion, stale-copy and ordering root fixes, owner/cashier security, full regression/build, physical flight-mode/restart/exact-once reconnect, 1340 × 800 screens, clean logs, and Graphify pass |
| HARD-01 | Establish controlled startup, APK, WebView, bundle, and readiness baselines | in progress | Official research, five-run physical baseline, offline/history proof, and warm-lifecycle root fix pass; final checks/push pending |
| NAV-01 | Retain visited screens and remove repeated page/data/image reconstruction | pending | — |
| HARD-02 | Finalize the app icon and continuous branded launch with optional measured motion | pending | — |
| HARD-03 | Consolidate safe startup gating and revalidate lifecycle readiness | pending | Pre-bridge event error fixed early under mandatory bug rule; full startup orchestration/matrix remains |
| HARD-04 | Optimize only measured modules, assets, decoding, and sync scheduling | pending | — |
| HARD-05 | Implement and rehearse export, backup, restore, and corrupt-data recovery | pending | — |
| HARD-06 | Add protected production signing, release, upgrade, and rollback workflow | pending | — |
| HARD-07 | Complete security, privacy, dependency, quota, and support readiness review | pending | — |
| OPTIONS-01 | Add backward-compatible product-owned size, choice, and exact-recipe foundations | pending | Separate approved blueprint; follows original technical-hardening cards |
| OPTIONS-02 | Add custom product choices, exact ingredient actions, and independent copying | pending | — |
| OPTIONS-03 | Connect exact cashier selections to price, stock, immutable sales, and synchronization | pending | — |
| OPTIONS-04 | Reconcile selected ingredient costs, reports, migration, and offline acceptance | pending | — |
| POLISH-01 | Capture the owner's final app-wide simplification and dislike list | pending | — |
| POLISH-02 | Apply and verify the owner's final changes one screen at a time | pending | — |
| HARD-08 | Run service endurance, final owner acceptance, and release closeout | pending | — |

## Card contracts

### LOCAL-01 — Local-first management foundation

- Android research decision: follow Android's offline-first local-source-of-
  truth and lazy-write guidance using the already-installed native SQLite
  Capacitor plugin and explicit transactions. Keep the authenticated foreground
  reconnect worker; do not add Room, a second database, or WorkManager while
  staff-authorized cloud work is forbidden when locked. Revisit WorkManager only
  if synchronization must continue after the app exits and the security policy
  provides a native background credential boundary.
- Extend the established serialized SQLite/outbox path instead of adding a
  state library, second database, generic repository layer, or direct offline
  clone of every Convex function.
- Define durable tablet record IDs, operation IDs, revisions, actor/role audit,
  dependency ordering, acknowledgement mapping, and bounded failure/retry
  behavior for management operations.
- Enforce the same cashier/manager/owner matrix before local commit and again
  at Convex acknowledgement. UI visibility never authorizes a write.
- Keep an unexpected stale cloud revision visible for deliberate recovery; do
  not silently discard the local operation or overwrite a newer cloud record.
- Add ordered migrations and the smallest runnable checks for restart,
  dependency order, duplicate retry, rejection, and role isolation.

### LOCAL-02 — Local-first catalog and recipes

- Android research decision: use the native Capacitor SQLite database as the
  exclusive screen-visible source of truth online and offline. Save each domain
  row change plus the immutable LOCAL-01 operation/outbox envelope in one
  explicit transaction, then let the authenticated foreground worker push it.
  Preserve stable tablet IDs and parent dependencies across category, product,
  modifier, and recipe relationships; keep explicit revisions and surface a
  stale conflict instead of applying last-write-wins. Do not add Room, another
  database/ORM, WorkManager, or direct UI-to-network writes.
- Save category, product, price, availability/archive, modifier group/option,
  and recipe-version changes to SQLite plus outbox in one operation.
- Reflect a successful local save immediately in Products and POS, including
  offline-created records and relationships. Internet state never disables an
  otherwise valid catalog form.
- Synchronize parent records before dependent products/modifiers/recipes and
  map cloud acknowledgements without changing the stable local references.
- Preserve recipe version/history rules and never let a later sync rewrite an
  immutable sale snapshot.

### LOCAL-03 — Local-first stock, expenses, and compensation

- Save ingredients, units, thresholds, purchases, stock adjustments, operating
  expenses, and effective compensation periods locally before cloud work.
- Preserve exact integer quantities/centimes, append-only stock/valuation
  history, retry-safe purchase effects, recurring-expense periods, and owner-
  only compensation visibility while offline.
- Make saved changes appear immediately in Stock and role-appropriate Reports;
  reconnect acknowledges each effect exactly once without double counting.

### STAFF-01 — Minimal owner staff creation

- Keep staff management inside the owner-only Settings workspace; do not add a
  permanent navigation destination.
- The creation form contains only name, approved role, six-digit PIN, PIN
  confirmation, Cancel, and Add staff. Do not expose recovery codes, hashes,
  sessions, storage, sync internals, or a decorative icon for every field.
- Reuse the existing authenticated staff-profile and protected identity
  boundaries. Creating staff and setting the initial PIN must work without
  internet and allow that profile to sign in on the same tablet immediately.
- The support-only owner recovery secret never enters the UI. No raw PIN enters
  SQLite, ordinary outbox records, logs, source control, settings, or exports;
  pending server provisioning uses only the Android protected credential
  boundary and clears its pending material after acknowledgement.
- Verify on the physical tablet that an offline-created profile survives app
  and tablet restart, signs in with the correct role, synchronizes once after
  reconnect, and does not disturb existing staff profiles.

### CATALOG-01 — Category artwork

- Ship a small curated gallery for common café categories and let category
  management select an artwork key; do not bind artwork permanently to names.
- Provide one approved neutral Olaso illustration for any unfamiliar custom
  category so creation never depends on finding an exact match.
- Keep the gallery versioned in the APK, right-sized for the 234 by 120 cards,
  decorative to assistive technology, and expandable through later releases.
- Do not generate artwork at runtime, require network access, or use generic
  stock coffee imagery.

### LOCK-01 — Lock and switch staff from every role

- Put one short Lock / Switch staff action in the shared profile control used
  by owner, manager, and cashier screens; do not grant Settings access merely
  to expose this action.
- Lock locally and immediately without deleting that profile's protected
  offline provisioning, requiring internet, or treating an app restart as the
  normal staff-handoff workflow.
- Before implementation, confirm with the owner whether an unfinished cart is
  preserved for the next staff member or requires an explicit warning; never
  discard it silently.
- Verify owner and cashier handoff, offline behavior, restart behavior, role
  boundaries, and touch access on the physical tablet.

### LOCAL-04 — Offline management closeout

- In flight mode, perform every authorized catalog, recipe, stock, purchase,
  adjustment, expense, compensation, and staff/PIN workflow through its real UI.
- Force-close and restart before reconnecting; prove every saved change remains
  usable locally, retains its actor/role, and appears in the correct screen/POS.
- Restore internet and prove dependency-ordered exactly-once acknowledgement,
  no duplicate stock/cost/profile effects, no lost records, bounded outbox
  state, and correct cloud/local reconciliation.
- Repeat negative cashier/manager/owner checks offline and online, including
  sensitive compensation and protected credential material.

### OPTIONS-01 through OPTIONS-04 — Product-owned configuration

The complete product structure, choice rules, mandatory copying, exact milk
replacement example, ingredient-only scope, house-syrup policy, honest costing,
offline migration guarantees, individual card contracts, official references,
and physical-tablet evidence requirements are maintained in
[Goal 06 Product Configuration](GOAL-06-PRODUCT-CONFIGURATION.md).

Implement the four cards in sequence. Each card independently preserves the
currently installed menu, sales, protected staff, stock, pending operations,
offline checkout, cloud acknowledgment, receipts, and physical tablet layout.
Do not remove backward-compatible behavior until its replacement passes the
real-device acceptance matrix.

### DELETE-01 — Safe deletion and archive cleanup

- Give Products and Stock concise, explicit Archive/Restore/Delete choices
  without showing archived records in ordinary lists. Destructive confirmation
  names the record and consequence; no technical essay or icon clutter.
- Product deletion removes current owned sizes/choices/recipes locally and in
  Convex while completed-order snapshots keep every historical name, size,
  price, choice, recipe, cost, actor, and receipt. Category deletion is allowed
  even when it contains products; those products become uncategorized.
- Ingredient deletion removes live recipe/choice references, clearly identifies
  affected products for repair, and preserves historical purchase, movement,
  valuation, and sale snapshots. No financial history is silently rewritten.
- Owner-only staff deletion revokes live access and protected credentials while
  preserving saved actor names/roles and historical operations. Never remove
  the final owner or strand another profile's pending authenticated work.
- Completed sales, corrections, purchases, stock movements, expenses, and
  compensation periods remain immutable or append-only historical records;
  deleting a live profile or ingredient never deletes the business history.
- Implement each allowed delete as a validated local transaction plus durable
  management operation, dependency ordering, retry-safe cloud mutation, and
  bounded acknowledgement. Prove offline, restart, reconnect, duplicate retry,
  role isolation, snapshot preservation, and safe rejection on the tablet.
- Clean stale cloud-cache copies absent from a replacement snapshot without
  deleting current records, pending local work, immutable order snapshots, or
  referenced stock history.

### HARD-01 — Baseline and instrumentation

- After the approved screen and local-first work is stable, rebuild/install the
  near-final baseline and record at least five force-stopped cold launches and
  five warm launches on the physical tablet.
- Record Android initial display and application ready marks for SQLite, lock,
  POS shell, and cached menu, plus exact APK, Android, and WebView identity.
- Record median, minimum, and maximum rather than optimizing from one subjective
  launch.
- Measure repeated tab navigation, local/cloud work, initial JavaScript/CSS,
  APK assets, image dimensions/decoding, and synchronization start without
  adding a permanent telemetry framework.

#### Verified 2026-08-25 physical baseline

- Hardware: Samsung Galaxy Tab A9 `SM-X115`, serial `R8YX91AKWXJ`, Android
  16/API 36, Google WebView `151.0.7922.199`, physical `1340 × 800` app
  viewport. This is the current debuggable development APK, not a claimed
  production/release benchmark.
- Reproduction: set `OLASO_BENCHMARK_PIN` only in the current shell and run
  `npm run measure:android`. The standard-library-only host tool reads the
  existing debug WebView; no PIN, token, production listener, app telemetry,
  extra native module, or application dependency is persisted.
- Cold runs force-stop the process; warm runs recreate its Activity in the
  surviving process and Android explicitly reports `LaunchState: WARM`.
  Lock-ready measurements include host ADB/debug-inspection overhead and are
  therefore conservative upper bounds; post-PIN timing starts after the
  automated tap and is reported separately from human PIN entry.

| Physical launch measurement | Minimum | Median | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Cold Android first displayed frame | 1,047 ms | 1,081 ms | 1,148 ms | 5 |
| Cold local Lock/profile ready | 1,888 ms | 1,912 ms | 1,934 ms | 5 |
| Cold owner unlock to cached POS/menu | 805 ms | 885 ms | 916 ms | 5 |
| Warm Android first displayed frame | 184 ms | 191 ms | 236 ms | 5 |
| Warm local Lock/profile ready | 495 ms | 515 ms | 570 ms | 5 |
| Warm owner unlock to cached POS/menu | 709 ms | 766 ms | 830 ms | 5 |

The first cold WebView reached SQLite-opening/SQLite-ready/Lock/profile-ready
at 517/705/809/882 ms from its own navigation clock; the first warm WebView
reached those states at 241/256/299/328 ms. A separate flight-mode cold/warm
replay reached Lock in 1,815/563 ms and cached POS 410/422 ms after offline
owner verification; every authorized screen remained usable without internet.

| Repeated screen | Median return | SQLite calls per return | Images added/removed |
| --- | ---: | --- | --- |
| Dashboard | 135 ms | 0–13 | 1/1 after first return |
| POS | 180 ms | 15–30 | 14/1 every return |
| Orders | 139 ms | 2–14 | 1/14 after POS |
| Products | 142 ms | 10–24 | 1/1 |
| Stock | 129 ms | 15–34 | 1/1 |
| Reports | 132 ms | 5–20 | 1/1 |

- All 30 measured transitions destroy the previous screen instead of retaining
  it. Every POS return recreates four category illustrations, nine drink
  images, and the brand mark; one repeat also requested 13 image resources
  again. Nine PNG drink images are `1408 × 768` but display at `72 × 92`,
  requiring roughly 163 times the visible pixel area before scaling.
- APK: `31,626,309` bytes; web assets `6,893,643` bytes uncompressed
  (`5,541,887` compressed); four SQLCipher architecture libraries total
  `19,414,484` bytes. Current initial JavaScript is `925,371` bytes; CSS is
  `265,782` bytes; drink/brand PNG assets total `4,276,415` bytes. The Android
  package also includes browser-only `sql-wasm.wasm` (`652,953` bytes) and
  the `jeep-sqlite` browser chunk (`291,942` bytes).
- All six screens are currently direct eager imports. Dashboard/Reports
  remount their cloud read; POS/Products/Stock reconstruct their local query
  work. NAV-01 owns authorized React Activity retention; HARD-04 owns
  right-sized assets, measured module splitting, and other proven startup
  savings. Neither change is implemented by this baseline card.
- The current native launch asset is still Capacitor's generic blue mark on
  white. HARD-02 owns replacing it with the approved cream/OLASO launch; it is
  not hidden, altered, or claimed complete by HARD-01.
- Physical warm-recreation testing discovered and fixed an actual native
  SQLite-lifecycle bug: an abandoned transaction held the previous Activity's
  database pool open. `MainActivity.onDestroy()` now queues rollback and then
  connection close before safely stopping its bridge. An explicitly opened
  uncommitted transaction, real warm Activity recreation, owner unlock, and
  unchanged 13 sales/seven historical outbox rows/two active profiles all
  pass; normal cold/warm operation has no focused Android/WebView errors.
- Final regression coverage passes Android/native invariants; local SQLite,
  management, catalog, inventory/costs, and staff; protected identity, lock
  switching, settings, reconnect, and offline screens; POS money, exact costs,
  deterministic receipt bytes, TypeScript, and the complete production build.

### NAV-01 — Retained smooth navigation

- Replace the current one-screen conditional destruction with React 19
  `Activity` boundaries for screens the active role has actually visited. Do
  not add a router, state library, custom cache framework, or always-running
  CSS-hidden screens.
- Keep the last safe tablet snapshot visible while a genuine revision/reconnect
  refreshes in the background. A tab switch alone starts no SQLite/cloud load
  and never clears Dashboard/Reports/Products/Stock/POS content.
- Preserve each screen's selection, search, filters, report range, and scroll
  position; keep product/category DOM and images prepared so return navigation
  has no visible image reconstruction.
- Stop hidden-screen effects/subscriptions, never retain a screen the role
  cannot access, clear retained management state on Lock / Switch staff, and
  refresh Header/Lock tablet time immediately after foreground/resume.
- On the physical tablet, compare repeated navigation before/after traces and
  verify offline/reconnect, long sleep/resume, lock, restart, console/logcat,
  memory, and touch behavior. A 125-to-150-millisecond fade is optional only
  after the transition is already immediate and reduced motion remains static.

### HARD-02 — Launch continuity

- Use Android's existing platform splash mechanism, Cream Surface, and the
  verified green transparent wordmark; add no splash dependency or activity.
- Finalize a compact Android icon from owner-approved artwork; never crop the
  wide wordmark into an unreadable square or imply a provisional icon is an
  official brand master.
- Match system bars, WebView background, and the first React startup state so no
  white/default frame, jump, stretch, or incorrect logo orientation appears.
- Preserve original wordmark proportions and stable reserved dimensions.
- The first visible frame is always a static local cream/wordmark frame. A brief
  light or line reveal may run only afterward when initialization is still in
  progress, respect reduced motion, and use transform/opacity rather than layout.
- Compare the smallest viable static/vector/CSS/animated-image/video candidates
  on the real APK. Choose from measured bundle size, decode cost, frame quality,
  and startup time; GIF has no automatic preference.
- Do not hold the splash longer to disguise slow initialization.

### HARD-03 — Safe startup orchestration

- LOCAL-03's mandatory bug gate traced the former `triggerEvent` error to
  Capacitor's Cordova-compatible pre-bridge `pause`/`resume` evaluation, not the
  SecureSession network callback. `OlasoWebView` now guards only those direct
  lifecycle calls until the JavaScript event function exists.
- Before code, research the current official Capacitor Android plugin lifecycle,
  listener-readiness, activity foreground/resume, and Android connectivity
  callback guidance. Select the smallest native boundary that prevents an event
  from reaching JavaScript before the bridge is ready while preserving the
  explicit `networkStatus()` read as the initial source of truth.
- Do not remove or weaken the guard, delay startup artificially, or remove live
  connection updates. Retain the explicit native status read when React becomes
  visible.
- Show one branded startup state while SQLite and terminal-lock state settle.
- Remove empty intermediate rendering without exposing the POS before lock and
  database safety state are known.
- Keep actionable failure behavior when local data cannot open.
- Preserve ordered migrations, foreign keys, transaction serialization,
  outbox recovery, and local cart/session behavior.
- HARD-03 cannot be done until normal cold launch, screen-off launch,
  notification-shade launch, background/foreground return, and long sleep/resume
  all show correct connection state with zero `triggerEvent`, uncaught Capacitor,
  crash, duplicate-listener, or lost-resume errors in focused logcat/WebView
  evidence on the physical Galaxy Tab A9.

### HARD-04 — Measured performance

- Keep only the initial POS, required lock/startup path, and proven shared shell
  eager; load secondary screens on demand only when traces show benefit.
- Replace the current 1408 by 768 POS/category sources with visually checked,
  right-sized modern-format APK assets for their actual 72 by 92 product and
  234 by 120 category rendering. Reserve dimensions and defer only below-the-
  fold decoding without blur, image flash, or layout shift.
- Start cloud refresh/outbox work after the cached local POS is responsive while
  preserving eventual automatic recovery and idempotency.
- Compare timing, bundle, APK, memory/decode, offline, and visual evidence after
  each measured change; remove changes that do not help the target tablet.

### HARD-05 — Backup and recovery

- Add the smallest documented export covering sales, products, recipes, stock
  movements, purchases, compensation periods, and expenses as required by
  ARCHITECTURE.md, with explicit inclusion and privacy rules.
- Rehearse export, restore, unsynced-sale preservation, corrupt/unrecoverable
  local-data stop, and owner/support recovery without unsafe checkout.
- Record Convex backup limitations and owner retention responsibility.
- Keep recovery instructions and private recovery locations outside public
  source where appropriate.

### HARD-06 — Signed release and upgrade

- Add protected CI/release configuration for the same application ID, increased
  version code/name, repeatable signed APK, and GitHub Release attachment.
- Keep keystore, passwords, and credentials in protected secret storage and
  document off-repository signing-key custody and recovery ownership.
- Test install-over-upgrade from the previous accepted APK, preserve SQLite and
  settings, then rehearse rollback using the known-good previous artifact and
  documented data constraints.
- Produce deterministic release notes, checksums, and installation steps.
- Because the source repository is private, never embed a GitHub credential in
  the APK. Publish the signed APK and small version manifest through a separate
  tablet-reachable HTTPS channel; the leading recommendation is a dedicated
  public binary-only release repository, pending owner acceptance of public APK
  availability.
- Let an authorized operator see Update / Later, download deliberately, and
  enter Android's required installation-confirmation flow. Do not interrupt an
  active order or claim silent installation without Play or device-owner
  management.
- Verify the update's package ID, higher version code, signing certificate,
  checksum, SQLite migrations, protected staff access, Settings, pending sales,
  and rollback-by-newer-known-good-build on the physical tablet.
- Complete the applicable Android developer and package/signing-key
  registration before its worldwide verification rollout affects delivery.

### HARD-07 — Readiness review

- Search for secrets, production development overrides, unbounded Convex reads,
  database filters where indexes apply, sensitive data exposure, stale
  dependencies, and excessive function/I/O patterns.
- Re-run negative authorization and compensation isolation checks.
- Review Android permissions, network configuration, database encryption
  decision, export privacy, logs, crash/support evidence, and printer settings.
- Record first-production-week Convex and operational monitoring steps without
  adding speculative infrastructure.

### POLISH-01 — Final owner walkthrough

- Start only after LOCAL-01 through HARD-07 are complete and the physical
  tablet exposes the fully functional, technically stable application.
- First read the complete DOX chain, ledger, plan, authorities, and this file;
  query Graphify; inspect the current application state; and explain the
  understood product back to the owner in plain English.
- Review one real screen and its important states at a time, beginning with POS
  unless the owner chooses another screen. Do not flood the owner with a
  whole-application questionnaire.
- Let the owner identify what feels wrong before proposing solutions. Discuss
  each point and record exact keep, remove, shorten, rename, regroup, behavior,
  and visual decisions only after the owner confirms them.
- Treat unnecessary icons, corporate-sounding guidance, duplicated status, and
  permanently visible technical detail as review targets.
- Keep a concise approved checklist for the current screen. Do not change code
  or move to another screen until the owner explicitly says to proceed.

### POLISH-02 — Final approved simplification

- Apply only the owner-approved checklist for the current screen using the
  existing geometry, components, Phosphor family, and Olaso tokens.
- Prefer short natural labels and progressive disclosure. Hide support detail
  until it is useful instead of removing the underlying recovery path.
- Simplify Settings and printer setup for a coffee-shop operator while retaining
  validation, test, logo restoration, failure recovery, and accessibility.
- Recheck the affected workflow in browser and on the physical 1340 by 800
  tablet before asking the owner to accept it and move to the next screen.
  Visual cleanup cannot change persistence, authorization, printing, stock, or
  reporting behavior.

### HARD-08 — Endurance and acceptance

- Repeat five cold and five warm startup runs. Require median usable cold start
  at most two seconds and warm start at most one second, with no network gate or
  unbranded frame.
- Run realistic service volume across ordering, printing/reprinting, stock,
  management, costs, identity, offline/reconnect, app/tablet/printer restart,
  sync recovery, and an install-over-upgrade.
- Reconcile sales, stock, costs, summaries, print states, and outbox state after
  the run; investigate every mismatch rather than normalizing it.
- Complete final browser and physical 1340 by 800 visual/touch/accessibility QA,
  real printer acceptance, owner workflow acceptance, documentation, Graphify,
  release tag, pushed SHAs, and clean worktree.

## Goal completion criteria

- POLISH-01, POLISH-02, LOCK-01, LOCAL-01 through LOCAL-04, STAFF-01,
  CATALOG-01, OPTIONS-01 through OPTIONS-04, DELETE-01, NAV-01, and HARD-01
  through HARD-08 are done, verified, committed, pushed, and recorded.
- Every authorized management workflow saves and survives restart offline,
  appears immediately in the normal app, and synchronizes exactly once after
  reconnect with the correct actor and permission boundary.
- Previously visited screens return with retained content and interaction state,
  without a repeated full loading state, visible image reconstruction, or a
  navigation-triggered database/cloud request.
- Android, WebView, and React present one immediate Olaso cream launch sequence
  and meet the physical-tablet startup budget without waiting for the network.
- The owner-approved critique list is resolved, the app icon is accepted, and
  every custom category renders selected gallery art or the neutral fallback.
- Backup/export, corrupt-data stop, recovery, signed build, upgrade, rollback,
  and key custody are documented and rehearsed.
- Security, privacy, permissions, quotas, dependencies, logs, browser console,
  Android logcat, and hardware checks are clean.
- A realistic service run reconciles exactly and the owner accepts the final
  tablet, receipt, menu, policy, reports, and recovery workflow.

## Current checkpoint

- Goal 06 remains active on `main`; LOCAL-01 through LOCAL-04 and DELETE-01
  are complete. HARD-01 is the only card in progress.
- HARD-01 physical warm-recreation testing exposed an existing release blocker:
  the installed SQLite plugin does not release its Activity-owned database
  connection when the Capacitor bridge is destroyed. The recreated Activity
  opens a second connection; owner sign-in fails with `database is locked`.
  Android lifecycle and the official SQLite connection API require explicit
  resource cleanup. Ordered plugin-thread rollback then connection close now
  root-fixes the issue; the original physical warm recreation and owner unlock
  both pass without a restart, data reset, or workaround.
- Official Android startup guidance separates cold, warm, and hot launches;
  Android's initial displayed frame is not the application's usable local
  screen. Android Macrobenchmark recommends medians and real release-like
  devices, but adding a benchmark module, instrumentation dependencies, and
  signing variant to this development beta would distort this baseline.
  Measure the existing physical debuggable APK honestly with Android's `am
  start -W`, focused system logs, and debug-only WebView inspection. Reuse
  Capacitor's actual foreground lifecycle and the existing SQLite/React
  readiness boundaries; add no app telemetry, native plugin, permanent
  listeners, Android module, dependency, or production secret logging.
- Sources: https://developer.android.com/topic/performance/vitals/launch-time,
  https://developer.android.com/topic/performance/benchmarking/macrobenchmark-metrics,
  https://developer.android.com/topic/performance/benchmarking/macrobenchmark-overview,
  https://developer.chrome.com/docs/devtools/remote-debugging/webviews, and
  https://capacitorjs.com/docs/apis/app.
- LOCAL-01 through STAFF-01 implement local-first catalog, recipe, inventory,
  cost, compensation, and protected staff creation. LOCAL-04's full matrix and
  mandatory root fixes pass and its implementation is pushed to `origin/main`.
  Top-level navigation still destroys/reconstructs screens, data hooks, and
  oversized product images; NAV-01 and HARD-04 own that measured work.
- The owner approved independent product-owned sizes and choices, exact
  ingredient actions, mandatory copying, ingredient-only costs, ordinary
  manually priced house syrup, and preservation of immutable order history.
  OPTIONS-01 through OPTIONS-04 implement that separate blueprint after the
  original technical-hardening sequence and before final owner-led polish.
- The startup wordmark asset exists but is intentionally not consumed before
  HARD-02.
- The pre-bridge lifecycle error is fixed early under the mandatory bug rule.
  Source/log tracing identified Capacitor's Cordova `pause` event rather than
  SecureSession; normal, screen-off, and notification-shade launches now have
  zero `triggerEvent`/uncaught errors. HARD-03 still owns the complete startup,
  long-sleep, connection, and empty-rendering acceptance matrix.
- The owner's manual screen-by-screen review and UI prompting are intentionally
  deferred until HARD-07 and the separate OPTIONS-01 through OPTIONS-04 cards
  are complete.
- Official Android guidance requires the local database as the visible source
  of truth and deferred durable writes. The existing Capacitor SQLite plugin
  supports explicit transaction/rollback and parameterized deletes; Android
  warns foreign-key cascades are inactive unless constraints are enabled.
  Convex mutations support transactional indexed deletion. Reuse the current
  native SQLite/protected-session/outbox boundary; add no Room, WorkManager,
  native plugin, state library, or direct UI-to-cloud write.
- DELETE-01 implementation and the final physical-tablet acceptance matrix now
  pass. Immutable history retains deleted category, drink, ingredient, and
  worker names; offline owner-only staff removal preserves protected pending
  access; stale archived copies are removed safely; and category/ingredient/
  product deletions synchronize in verified sale-dependent order.
- DELETE-01 is pushed directly to `origin/main` as
  `dc86855798041f1e772a7ca3d8729841549faa9d`; its required full
  regression, Android build, physical tablet, clean logs, and Graphify pass.
- Focused Android, local management, identity, offline/reconnect, POS, costs,
  printing, TypeScript, and build regressions pass; Graphify is refreshed to
  3,320 nodes/7,602 edges and final physical 1340 by 800/runtime checks pass.
- Exact next action: commit and push HARD-01 directly to `origin/main`, record
  its implementation SHA, and stop before activating NAV-01.

## Planning journal

### 2026-08-25 — HARD-01 complete physical baseline captured

- Five cold and five actual Android `LaunchState: WARM` samples plus five
  rounds across Dashboard/POS/Orders/Products/Stock/Reports are recorded in
  the card's baseline table above; no later optimization card was started.
- Medians are cold frame/Lock/post-PIN POS 1,081/1,912/885 ms and warm
  191/515/766 ms. Every POS repeat issues 15–30 SQLite calls and reconstructs
  14 images; nine drink sources are 1,408 × 768 for 72 × 92 visible cards.
- Physical flight mode proves local startup/unlock/all screens. Deliberately
  abandoning a native SQLite transaction before warm Activity destruction now
  safely rolls back, reopens, unlocks, and preserves 13 historical sales,
  seven existing outbox rows, and both authorized profiles.
- The generic Capacitor splash, eager secondary screens, oversized artwork,
  browser-only SQLite assets, and exact package costs are explicitly measured
  for NAV-01/HARD-02/HARD-04; none is hidden or prematurely modified.
- Final focused Android/local/identity/offline/POS/cost/receipt/build checks,
  exact physical viewport, clean runtime logs, and Graphify refresh to 3,320
  nodes/7,602 edges pass.
- Exact next action: push verified HARD-01 directly to main, record its
  implementation SHA, and stop before activating NAV-01.

### 2026-08-25 — Warm database lifecycle root fix verified physically

- Closing SQLite from the Android UI thread interrupted queued work, and
  queued close alone retained an unfinished transaction. Both incomplete
  variants reproduced the original lock and were rejected.
- The production native Activity now queues rollback of unfinished SQLite
  work followed by exact connection close before the bridge stops its plugin
  thread. The existing Android check guards ordering and the full 140-task
  beta installs without changing schema or existing sales.
- The original physical same-process `LaunchState: WARM`, owner re-unlock,
  local POS, and all six navigation screens now pass. A first sample exposes
  29 SQLite calls plus 14 recreated images on a single POS return; NAV-01 will
  own the separately authorized retained-screen fix after HARD-01 closes.
- Exact next action: collect all five cold/warm runs, record repeat navigation,
  package/image/readiness evidence, verify offline/history and clean logs,
  refresh Graphify, and push HARD-01 directly to main.

### 2026-08-25 — Real warm startup exposed a native database lifecycle bug

- The newly rebuilt Galaxy Tab A9 beta completed a measured cold launch, but
  the first actual Android `LaunchState: WARM` Activity recreation left its
  earlier native SQLite connection open. Subsequent owner authentication
  failed reproducibly at `beginTransaction` with SQLite code 5.
- The third-party SQLite plugin has no destroy cleanup. Android's documented
  Activity lifecycle requires releasing owned resources; the plugin exposes
  explicit connection closing. Under the mandatory bug rule, stop profiling,
  fix the native ownership boundary, protect it with a runnable Android
  regression check, rebuild/install, and repeat the exact physical failure.

### 2026-08-25 — HARD-01 activated with official Android startup research

- Owner authorized only HARD-01 after DELETE-01. Android documents distinct
  cold/warm/hot states, first-display versus usable-display timing, repeated
  median/minimum/maximum evidence, and measurement on real hardware.
- The complete Android Macrobenchmark framework requires an extra benchmark
  module and a non-debuggable profileable release-like target. Reject it for
  the existing development APK baseline; use Android's built-in launch/system
  timing plus the already-debuggable Capacitor WebView and physical Galaxy Tab
  A9 instead.
- Keep process/activity measurements at Android's native boundary. Measure
  SQLite, lock, POS/menu readiness, repeat tab work, images, and bundle assets
  through the existing React/data/WebView boundaries. Add no production
  telemetry, native code, package, temporary credential, or behavior change.
- Official references are recorded in the current checkpoint above. Exact next
  action: trace the existing startup and navigation ownership, rebuild/install
  the unchanged beta, and collect the repeatable device baseline.

### 2026-08-25 — DELETE-01 complete on origin/main

- Pushed the complete deletion implementation directly to `origin/main` as
  `dc86855798041f1e772a7ca3d8729841549faa9d` and verified the remote
  main SHA. All official research, focused/cloud suites, Android beta, physical
  offline restart/reconnect, exact-once history, protected worker access,
  current Graphify, 1340 × 800 viewport, and clean-log gates pass.
- No card is in progress. HARD-01 remains pending until the owner explicitly
  asks to begin the measured startup/navigation baseline.

### 2026-08-25 — DELETE-01 physical deletion and ordered reconnect verified

- Implemented schema 19, nullable product categories, immutable independent
  category/product/ingredient/staff history, owner-only protected staff
  deletion, ingredient recipe/choice repair, actor-aware cloud removals, and
  true live Delete controls through the existing Android SQLite boundary.
- Root-fixed stale archived ingredients/staff, missing historical wage names,
  equal-timestamp cache replacement, and cross-domain deletion ordering. The
  focused migration/catalog/inventory/staff/cloud checks reproduce each issue.
- Physical Galaxy Tab A9 proves offline category/product/ingredient/cashier
  creation, protected cashier unlock, completed sale, deletion, app restart,
  owner/Samira safety, exact historical Orders/Reports/Costs, automatic ordered
  reconnect, one cloud sale, repeated reconnect, no secret payload exposure,
  exact 1340 × 800 screens, and clean Android runtime logs.
- Full focused/local/cloud/printing/Android/build checks pass and Graphify is
  current at 3,287 nodes, 7,552 edges, and 162 communities. Direct main
  commit/push and its recorded SHA are the only remaining closeout actions;
  do not begin HARD-01 without the owner's next instruction.

### 2026-08-25 — Owner restored original order and activated DELETE-01

- The product-configuration blueprint remains separate. The owner explicitly
  directed finishing the existing deletion, navigation/startup, recovery,
  release, and security cards before OPTIONS-01 through OPTIONS-04. Final
  owner-led polish and release acceptance still follow all functional work.
- Activated only DELETE-01. Current official Android offline-first and
  SQLiteDatabase guidance requires one local source of truth, durable queued
  writes, and explicit attention to foreign-key enforcement. The installed
  Capacitor SQLite transaction/API documentation already provides safe
  begin/commit/rollback and bound DELETE operations. Official Convex writing
  and indexing guidance confirms transactional mutation deletes and bounded
  indexed dependent-record reads.
- Selected boundary: native SQLite plus the existing protected staff session,
  serialized transaction, management outbox, foreground retry, actor session,
  and Convex mutation. Keep UI in React and domain validation/data changes in
  their owning layers. Reject Room, WorkManager, a new plugin, direct network
  form writes, unbounded scans, and destructive changes to immutable history.
- Exact next action: read every applicable subtree instruction chain and trace
  all category/product/ingredient/staff, archive/delete, recipe, stock/sale
  snapshot, identity, synchronization, and existing regression callers.

### 2026-08-25 — Approved product-owned configuration blueprint

- The owner rejected shared mutable modifier groups, four fixed option cards,
  packaging costs, nested syrup recipes, an Edit Product gross-profit preview,
  and restrictive empty-category/never-used-ingredient deletion rules.
- Added a standalone professional-POS blueprint for independent sizes, custom
  product-owned choices, mandatory copying, exact choice-linked ingredients,
  offline migrations, immutable sale snapshots, and truthful ingredient cost.
- Inserted OPTIONS-01 through OPTIONS-04 before DELETE-01; deletion now retains
  live product reassignment/recipe repair and historical actor/financial
  snapshots. Final owner-led visual polish remains after HARD-07.
- Documentation only; no application or Android code changed. No implementation
  card is active. The approved blueprint is pushed directly to `origin/main`
  as `b68aa8c11a01229cc2f7f0fdf176f324e046cd24`; internal document links,
  all three task-board orders, and staged whitespace checks passed. OPTIONS-01
  is the next step when the owner authorizes it.

### 2026-08-24 — LOCAL-04 complete on origin/main

- Pushed `LOCAL-04: close offline management reliability` directly to
  `origin/main` as `7f240210c2a591649f7fabd3c3fe51fb9db72df3` and verified the
  remote resolves to the same full SHA.
- All research, schema/actor, local-first UI, restart/reconnect/exactly-once,
  role, cleanup, lifecycle, viewport, log, full regression, Android, Graphify,
  authority, DOX, and development QA cleanup gates pass. No card is active.
- Stop here as instructed. DELETE-01 remains pending for owner discussion and
  is not activated automatically.

### 2026-08-24 — LOCAL-04 physical matrix and root fixes complete

- Schema 18 plus the protected operation-session resolver preserve original
  staff attribution across cross-staff reconnect for management, sales, and
  corrections. Physical manager work synchronized under the owner but cloud
  `updatedBy` remained the manager; staff creation and compensation remained
  the owner. Legacy label-only work cannot receive a fabricated actor.
- Flight-mode UI covered category/product/modifier/recipe, immediate POS use,
  ingredient/opening stock, priced purchase, exact count, expense plus
  correction, compensation, offline staff/PIN, owner/manager/cashier role
  isolation, force-stop/install/restart, ordered reconnect, and repeated retry.
  The second batch drained six management rows to zero and produced exactly one
  cloud effect per operation.
- Root fixes remove cloud-owned catalog/finance rows absent from replacement
  snapshots while preserving pending local work and immutable stock/sale/audit
  history. Normal Products and Stock lists exclude archived rows; current clean
  seed shows 4 categories, 15 products, 14 active ingredients, zero expenses,
  one compensation period, Owner/Samira only, and no LOCAL04/LOCAL03 clutter.
- Samsung keyguard can own a portrait display while Olaso is hidden; unlock
  correctly returns 1340 by 800. The real hidden-wake Convex DNS race was fixed
  by requiring both document visibility and window focus. Two repeated hidden
  wake cycles now have zero WebView warning/error; focused Android failures are
  zero and final owner POS is exact 1340 by 800.
- Full relevant local/cloud/security/Android/TypeScript/Convex/build checks pass
  and Graphify is current at 3,241 nodes and 7,452 edges. QA cloud rows were
  removed by the deterministic development reset, authenticated reconciliation
  removed the temporary manager locally, and the temporary schema backup was
  deleted after preservation proof. Exact next action is commit/push/SHA, then
  stop for DELETE-01 discussion as the owner requested.

### 2026-08-24 — DELETE-01 added as a LOCAL-04 dependency

- The owner rejected archive-only CRUD and asked for real removal. Permanent
  deletion is a separate offline/sync domain change, not a safe quick button,
  so DELETE-01 must complete before LOCAL-04 can accept management behavior.
- Products can delete because sale snapshots preserve history; categories must
  be empty, modifiers unused, and ingredients never referenced. Staff and
  append-only sale/stock/cost records remain archive/correction-only. Everyday
  lists hide archived rows; deliberate Archived filters expose them.
- The owner later directed full LOCAL-04 completion first and a stop for
  discussion. DELETE-01 remains the planned next card before HARD-01 but is not
  activated automatically.

### 2026-08-24 — LOCAL-04 paused on cross-staff cloud attribution

- The queued management record preserves its original profile/name/role, but
  reconnect currently sends every cloud mutation with the later staff member
  who happens to unlock. Sales and corrections also omit originating profile
  IDs and therefore share the same false-attribution risk.
- Mandatory bug handling pauses the matrix. Add one ordered migration for new
  sale/correction actor IDs and use each operation actor's existing protected
  profile session during cloud dispatch. Legacy rows may use the active session
  only when their saved label matches it; otherwise fail visibly rather than
  fabricate history. Add focused migration/session-selection regression proof,
  then reproduce manager-offline/owner-reconnect on the tablet.

### 2026-08-24 — Physical Products exposed stale replacement rows

- The schema-18 APK migrated the real tablet safely and an offline-created
  manager unlocked immediately. Products then exposed 500 bounded rows and
  repeated archived categories from old development resets before new catalog
  QA data was created.
- `replaceOperationalCache` archived old cloud rows but never pruned rows absent
  from the new replacement snapshot. Added ordered pruning for stale recipes,
  products, modifiers, and categories only after pending operational work is
  already excluded; current snapshot rows and immutable sale/stock history stay
  untouched. The focused regression preserves current rows and removes the
  stale pair. Rebuilt physical reconnect proof remains pending.

### 2026-08-24 — LOCAL-04 activated with the existing native boundary

- The owner said to continue. LOCAL-04 is the only active card; every later
  hardening and polish card remains pending. Clean synchronized starting SHA is
  `faf811611f55804b4baa9e535f47b7b009ee70c0` on `main` and `origin/main`.
- Official Android offline-first guidance confirms local data as the screen
  source and critical lazy writes as local commit plus durable queued network
  reconciliation. The current Capacitor SQLite transaction/outbox and visible
  authenticated reconnect worker are retained. Room, another database, state
  library, new native service/dependency, and WorkManager are rejected here;
  the product forbids staff-authorized cloud work while locked or hidden.
- Sources: https://developer.android.com/topic/architecture/data-layer/offline-first,
  https://developer.android.com/develop/background-work/background-tasks/persistent,
  https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md,
  and https://capacitorjs.com/docs.
- This is an acceptance/root-fix card. Run every real management UI in flight
  mode, restart before reconnect, prove ordered exactly-once cloud effects and
  repeated retry, inject and recover one bounded failure, verify role/sensitive
  data isolation online and offline, and clean only through normal workflows.
  Exact next action is caller/check/matrix inspection.

### 2026-08-24 — LOCK-01 complete on origin/main

- Pushed `LOCK-01: add role-safe staff switching` directly to `origin/main` as
  `4486a8921d893e3e5edce098b8a17a500cf0a537` and verified the remote resolves
  to the same full SHA.
- The card is done with policy, implementation, regression, final installed APK,
  physical owner/cashier online/offline/restart proof, exact viewport, clean
  logs, root-cause Settings-menu fix, Graphify, authorities, and DOX current.
  LOCAL-04 remains pending and no card is active.

### 2026-08-24 — LOCK-01 physical acceptance complete

- The installed SM-X115 proved owner/cashier role menus, empty immediate lock,
  non-empty Cancel/confirm, exact cart handoff, both profiles online/offline,
  flight-mode switching, force-stop/restart lock, and protected offline unlock.
  The test item was removed without checkout; sale and historical outbox counts
  did not change.
- Live WebView content is exactly 1340 by 800 without overflow or warning/error;
  focused Android runtime failures are zero. Full focused/local/cloud/offline/
  identity/Android/TypeScript/build checks pass. Final APK QA caught and fixed
  the redundant Settings item while already inside Settings; a source check and
  the rebuilt/reinstalled tablet now prove only the switch action remains there.
  Graphify is current at 3,211 nodes and 7,405 edges. Exact next action is final
  review, implementation commit, and push.

### 2026-08-24 — STAFF-01 activated with Android security research

- The owner said to continue. STAFF-01 is the only in-progress card; CATALOG-01
  and every later card remain pending. Graphify, the complete applicable DOX,
  plan, Goal 06 contract, ledger, and identity/Settings authorities were read
  before code inspection.
- Android's current Keystore guidance keeps cryptographic key material non-
  exportable and recommends established AES-GCM primitives. The existing
  `SecureSessionPlugin` already supplies Keystore-backed AES/GCM encryption and
  bounded profile-scoped values, so STAFF-01 adds no dependency, second native
  plugin, Room/database, or StrongBox requirement.
- Selected boundary: the owner form holds the six-digit PIN only while
  submitting; the derived offline verifier/session and the temporary pending
  provisioning PIN live only in Android protected storage. SQLite stores the
  non-secret local staff profile, actor/audit envelope, and PIN-free outbox.
  Reconnect under an authenticated owner reads the protected PIN briefly,
  creates the cloud profile and credential idempotently, provisions the cloud
  session for this tablet, maps the local/cloud IDs, then removes pending
  protected material.
- WorkManager remains rejected because staff-authorized synchronization is
  forbidden while locked and the SQLite/protected records already survive
  process/device restart. StrongBox is not required for the accepted physical-
  custody threat model and would add device-specific failure/performance paths.
- Sources: https://developer.android.com/privacy-and-security/keystore,
  https://developer.android.com/reference/android/security/keystore/KeyGenParameterSpec,
  https://developer.android.com/privacy-and-security/cryptography,
  https://github.com/ionic-team/capacitor/blob/main/android/capacitor/src/main/java/com/getcapacitor/PluginHandle.java,
  and https://github.com/ionic-team/capacitor/blob/main/core/src/runtime.ts.
- Physical acceptance will create a uniquely named profile in flight mode,
  restart the app/tablet, sign into that profile offline with its exact role,
  reconnect under the owner, prove one cloud profile/identity/session and zero
  pending operation, then repeat reconnect and clean up through ordinary
  archive/reconciliation paths.
- Exact next action: inspect every existing caller/invariant before editing
  application code; any reproduced bug invokes the mandatory root-cause gate.

### 2026-08-24 — LOCAL-03 complete on origin/main

- Pushed `LOCAL-03: add local-first inventory and costs` as
  `1105de62d8133448b7202dd67971ee83c56ced12` to `origin/main` and verified the
  remote branch resolves to the same full SHA.
- LOCAL-03 is done. No later card was activated; STAFF-01 remains the exact
  next card when the owner continues.

### 2026-08-24 — LOCAL-03 implementation and physical proof complete

- Added ordered SQLite migration 16 plus atomic local ingredient, threshold,
  archive/restore, priced-purchase, stock-adjustment, expense-correction, and
  compensation-period operations. Stock and Costs read SQLite both online and
  offline; managers never receive compensation/profitability data.
- Split catalog/inventory from finance dependencies. Sales wait only for
  catalog/inventory parents they can use; a failed expense or compensation
  cannot block an independent sale or operational refresh. Reconnect maps
  ingredient/purchase/movement/expense/compensation IDs and valuation revisions,
  and expense correction retries return one saved reversal/replacement pair.
- On SM-X115 in flight mode, created `LOCAL03_QA_Beans`, received 500 g for
  10 MAD, counted it to 400 g, saved a 0.01 MAD expense and future 0.01 MAD
  compensation, then force-stopped/restarted and proved all data remained.
  Reconnect produced exactly one archived cloud ingredient at revision 4 with
  400 g / 800 centimes, three append-only expense rows, and one 2027-08 owner
  compensation period. A second reconnect created no duplicates; seven older
  failed sale rows remained untouched. The expense correction moves its net
  effect out of the current month and the QA ingredient is archived.
- Mandatory bug gate fixed three root causes encountered during proof: guarded
  Capacitor's pre-bridge Cordova lifecycle event in `OlasoWebView`; disabled
  focus/user scaling for the known fixed viewport; and made cloud-test PIN
  readiness fail before any development reset. Normal, screen-off, notification-
  shade, keyboard-focus/close, restart, and repeat-reconnect tablet paths pass.
- Official sources for the added native decisions:
  https://github.com/ionic-team/capacitor/blob/main/android/capacitor/src/main/java/com/getcapacitor/Plugin.java,
  https://github.com/ionic-team/capacitor/blob/main/android/capacitor/src/main/java/com/getcapacitor/Bridge.java,
  https://developer.android.com/reference/android/net/ConnectivityManager.NetworkCallback,
  https://developer.android.com/develop/ui/views/layout/webapps/targeting, and
  https://developer.android.com/develop/ui/views/layout/webapps/understand-window-insets.
- Exact next action: Graphify refresh, final checks/docs, implementation commit
  and push, then record the full SHA and mark LOCAL-03 done.

### 2026-08-24 — LOCAL-03 activated with Android research

- The owner said to continue. LOCAL-03 is the only in-progress card; STAFF-01
  and every later card remain pending. The complete applicable DOX chain, plan,
  Goal 06 contract, ledger, and stock/cost/permission authorities were reread,
  and Graphify was queried before manual code inspection.
- Current Android offline-first guidance requires a persisted local source of
  truth and recommends lazy writes for critical data: write locally first, then
  queue network synchronization with explicit conflict handling. The existing
  `@capacitor-community/sqlite` plugin provides the required native transaction
  controls for one atomic domain change plus management operation/outbox.
- Selected boundary: keep Stock, expense, compensation, and role-appropriate
  Reports reads on SQLite; commit each exact integer quantity/centime change and
  outbox row in one serialized transaction; drain through the authenticated
  foreground reconnect worker. Rejected Room/another database, a state library,
  direct UI-to-Convex writes, and last-write-wins.
- WorkManager remains deferred because Olaso forbids staff-authorized cloud work
  while locked and does not require upload after process exit. SQLite preserves
  the work across restart; the foreground worker drains it after unlock. If the
  product later authorizes native background credentials, reconsider it then.
- Sources: https://developer.android.com/topic/architecture/data-layer/offline-first,
  https://developer.android.com/topic/architecture/data-layer,
  https://developer.android.com/develop/background-work/background-tasks/persistent,
  and https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md.
- Exact next action: inspect every existing write/read/sync caller and schema
  invariant before editing application code. Any discovered bug invokes the
  mandatory root-cause gate.

### 2026-08-24 — Root-cause bug fixing made a mandatory plan gate

- The owner requires a daily-use client application, not passing evidence built
  around known failures. Any bug discovered or reproduced now interrupts the
  current card and overrides ordinary card order until the root cause is fixed,
  regression-protected, and physically proved on the Galaxy Tab A9.
- Explicitly prohibited using different test data, another record/workflow, a
  clean database, repeated restarts, hidden errors, weakened validation, or a
  later-card label to bypass a failure. If a safe fix is impossible, the card
  remains blocked rather than being marked done or worked around.
- No application code changed. LOCAL-02 remains complete; no card is active.
  LOCAL-03 remains the planned next card, subject to this mandatory bug gate.

### 2026-08-24 — LOCAL-02 relational sync mapping foundation added

- The caller trace found a critical dependency beyond ordinary management UI:
  a sale can use a newly created offline product/recipe before cloud sync. Sale
  upload must therefore wait for pending catalog parents and translate temporary
  local product/recipe/option IDs through acknowledged mappings.
- Added ordered migration 14 with durable local/cloud record mappings and the
  modifier-option key needed to reconcile batched options after restart.
  Extended LOCAL-01 acknowledgement to atomically preserve primary/related
  mappings and added safe mapping resolution with cloud-ID fallback for existing
  synchronized records.
- Focused management, migration/restart, and TypeScript checks pass. No Products
  UI/domain mutation is claimed local-first yet.
- Exact next action: implement atomic local category/product operations, then
  modifiers/recipes, attach pending catalog dependencies to sales, and add
  reconnect handlers against the existing retry-safe Convex mutations.

### 2026-08-24 — LOCAL-02 activated with Android research

- The owner continued to the next card. LOCAL-02 is the sole in-progress card;
  LOCAL-03 and all later cards remain pending.
- Graphify traced Products UI/useProductManagement, current Convex mutations,
  SQLite operational tables, POS cache reads, reconnect refresh, revisions,
  mutation IDs, and category/product/modifier/recipe relationships. The complete
  feature/data/Convex DOX and current plan/ledger were reread.
- Official Android offline-first/data-layer guidance requires local data to be
  the UI source of truth and critical writes to update it first. Capacitor SQLite
  provides native transactions for the related local rows plus operation/outbox.
  Stable local IDs and LOCAL-01 dependencies handle relational parent ordering;
  existing revisions reject conflicts. Room/another ORM, WorkManager, last-write-
  wins, and direct UI network mutations are rejected for this one-tablet design.
- Sources: https://developer.android.com/topic/architecture/data-layer/offline-first,
  https://developer.android.com/topic/architecture/data-layer,
  https://developer.android.com/training/data-storage/room/relationships, and
  https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md.
- Exact next action: inspect all current hook/domain payloads and implement the
  smallest complete local catalog/recipe operations and reconnect dispatch.

### 2026-08-24 — HARD-03 explicitly owns the pre-bridge triggerEvent bug

- Confirmed the error remains in the current APK. It does not crash or damage
  data and the explicit React connection refresh recovers the visible state,
  but it is still a real lifecycle/console bug and not production-acceptable.
- Traced the likely path from `SecureSessionPlugin.load()` Android connectivity
  registration through `publishNetworkStatus()`/`notifyListeners()` before the
  JavaScript bridge defines `Capacitor.triggerEvent`.
- HARD-03 now requires official Capacitor/Android lifecycle research, a native
  readiness gate that preserves live status, and physical normal/screen-off/
  notification-shade/background/long-sleep tests with zero triggerEvent,
  listener, crash, or lost-resume errors. No application code changed now.

### 2026-08-24 — LOCAL-01 complete and pushed

- Pushed `LOCAL-01: add local-first management foundation` as
  `0c7da7d63c293c4d96b5c28d8425210c6f9cc8b8` to `origin/main`.
- The card is complete with Android-native research, migration/restart,
  permission/secret/dependency/idempotency checks, production build, 140-task
  beta, install-over schema migration on SM-X115, awake cold-launch smoke, and
  code Graphify refresh evidence recorded. The cloud Orders/Sales check
  limitation from the missing test restore PIN remains explicitly documented.
- LOCAL-02 remains pending. Its first step is fresh official Android/Capacitor
  research for offline catalog/recipe storage, lifecycle, and synchronization;
  no Product or recipe form was converted by LOCAL-01.

### 2026-08-24 — LOCAL-01 implementation and device verification complete

- Added ordered SQLite migration 13 with immutable management-operation audit/
  payload/acknowledgement rows and optional outbox parent dependencies. Existing
  sale synchronization now requests only sale/correction outbox types, so later
  management work cannot starve or be miscounted as a sale batch.
- Added separate pure `managementOperation.ts` validation/permission/failure
  rules and `localManagement.ts` persistence helpers. Local enqueue validates
  the device, stable IDs, actor, cumulative role permission, expected revision,
  bounded payload, protected-field exclusion, dependency, and idempotent retry.
  Acknowledgement preserves cloud mapping/audit and releases dependent work;
  missing/corrupt pairs and mismatched acknowledgements fail safely.
- `check:local-management`, `check:local`, `check:reconnect`, `check:settings`,
  `check:offline`, `check:pos`, TypeScript, production build, Android static/
  sync, and the 140-task Android beta pass. `check:orders` and `check:sales`
  stopped before data work because this machine has no six-digit development
  restore PIN; no secret was retrieved or printed and LOCAL-01 changes no cloud
  sale/correction function.
- The final APK installed over the real SM-X115 data. Native SQLite logged the
  12-to-13 upgrade, the existing database and saved operational/identity state
  remained present, and an awake cold launch reached the fitted Olaso Lock
  screen without a fatal, uncaught, or SQLite migration error.
- Full semantic Graphify refresh was unavailable without an external LLM key;
  `graphify update .` completed the required no-key code refresh to 2,911 nodes,
  6,672 edges, and 150 communities.
- Exact next action: commit/push LOCAL-01 on `main`, record the full SHA in the
  ledger/board, and keep LOCAL-02 pending.

### 2026-08-24 — Android-native research gate added

- The owner requires every remaining card to research official Android-native
  solutions before implementation so the APK is designed as an Android product,
  not treated as a browser page. Added this as a universal PLAN/Goal 06/DOX gate
  with a recorded native-versus-React decision and physical-tablet proof.
- LOCAL-01 research used Android's current offline-first/data-layer and
  persistent-work guidance plus the Capacitor Community SQLite transaction/API
  documentation. The official pattern is local database source of truth plus a
  durable queued lazy write, which matches the implemented SQLite operation and
  outbox foundation.
- Room is rejected because the existing Capacitor plugin already provides
  native Android SQLite and transactions; a second database stack would create
  two sources of truth. WorkManager is deferred because Olaso permits cloud work
  only inside an active staff session and does not require upload after the app
  exits; local work already survives in SQLite.
- Sources: https://developer.android.com/topic/architecture/data-layer/offline-first,
  https://developer.android.com/topic/architecture/data-layer,
  https://developer.android.com/develop/background-work/background-tasks/persistent,
  and https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md.
- Exact next action: review the existing LOCAL-01 implementation against this
  boundary, finish the native install-over migration/device evidence, then run
  closeout checks and Graphify refresh.

### 2026-08-24 — LOCAL-01 activated

- The owner authorized Goal 06 implementation. Goal 06 is active on `main` and
  LOCAL-01 is the only in-progress card; every later card remains pending.
- Re-read the root/source/data/Convex DOX, PLAN, Goal 06, current ledger, and
  authorities, then queried Graphify for SQLite transactions, outbox, sale and
  cancellation payloads, ReconnectProvider dispatch, management IDs/revisions,
  and Convex acknowledgements before manual code inspection.
- LOCAL-01 is foundation only. It does not convert Products/recipes (LOCAL-02),
  Stock/costs (LOCAL-03), or staff/PIN creation (STAFF-01) in this card.
- Exact next action: preserve/push the approved planning state, inspect every
  current caller and schema path, then implement and verify the minimum shared
  local management operation boundary.

### 2026-08-23 — Final manual polish moved behind functional completion

- The owner clarified that screen-by-screen critique and manually prompted UI
  polish must operate on the fully functional product, not lead Goal 06.
- Reordered the remaining cards: LOCAL-01 through HARD-07 now complete business
  behavior, offline management, staff/lock/category work, physical reconnect,
  navigation/startup performance, recovery, updates, and readiness first.
  POLISH-01 and POLISH-02 are the final change phase; HARD-08 performs final
  endurance and owner acceptance afterward.
- The completed OFFLINE_RELIABILITY_PLAN remains closed historical evidence for
  offline identities, sales, connection truth, reconnect, and saved screen
  reads. It did not implement offline management writes; LOCAL-01 through
  LOCAL-04 extend that foundation without reopening OFF-01 through OFF-06.
- No application card is active. Exact next action is LOCAL-01 when the owner
  says to begin.

### 2026-08-23 — Offline management and retained navigation made explicit

- The owner confirmed that every authorized day-to-day café operation must work
  without internet. The current saved-data-only Products/Stock behavior and
  direct online mutations are therefore an incomplete beta boundary, not an
  accepted production limitation.
- Added LOCAL-01 through LOCAL-04 so catalog, recipes, stock, purchases,
  adjustments, expenses, compensation, staff profiles, and protected initial
  PIN setup save locally, survive restart, appear immediately, and synchronize
  exactly once after reconnect with unchanged role/audit rules.
- Recorded the measured navigation root cause: `App.tsx` removes the inactive
  screen, screen hooks restart, Reports clears its snapshot, and 1408 by 768
  images are recreated for much smaller cards. NAV-01 now retains only visited,
  authorized screens with React `Activity`, saved-content-first refresh, state
  preservation, hidden-effect cleanup, lock clearing, and immediate resume
  clock correction. HARD-04 keeps the right-sized image/decode work.
- A GIF/loading delay, state library, service worker, custom cache framework,
  always-running hidden screens, and multi-tablet conflict machinery remain
  excluded. No application code or card status changed; exact next action
  remains the owner-led POLISH-01 review.

### 2026-08-23 — Main-only workflow selected

- The owner rejected goal/feature branches as unnecessary for this one-person
  project. `main` is now the sole local and GitHub branch, and all future card
  commits push directly to `origin/main`.
- Before deletion, every non-main local and remote branch was verified to have
  zero commits missing from `main`. Seven local and seven corresponding remote
  branches were then deleted; no application or documentation work was lost.
- Historical branch names in the work ledger remain audit text only; they are
  not live Git references.

### 2026-08-23 — Cashier handoff and remote-update reminders recorded

- The current cashier role cannot open Settings, so it cannot reach the current
  Lock application action. Closing and reopening the APK works only as a
  temporary workaround. LOCK-01 now requires a shared Lock / Switch staff
  action without expanding cashier permissions; application code was not
  changed in this planning step.
- After delivery, the owner must be able to send fixes to the café tablet
  without asking the client to handle APK files through WhatsApp. The private
  source repository cannot be queried by the APK without an unsafe embedded
  credential. HARD-06 now records the recommended signed-release pipeline and
  a separate HTTPS download channel, with Android's honest final confirmation.
- The leading low-cost option is a dedicated public binary-only GitHub release
  repository. Public APK availability versus a paid/private delivery service
  remains an explicit owner decision before HARD-06 implementation.
- Record and return both reminders whenever the owner asks for the outstanding
  reminder list.

### 2026-08-22 — Normal screen-by-screen collaboration selected

- Replaced the autonomous `/goal` start with a normal new conversation.
- Moved POLISH-01 ahead of technical hardening so the owner and agent establish
  the application screen by screen before implementation and measurement.
- Application code remains unchanged until the owner explicitly approves the
  current screen's decisions.

### 2026-08-22 — Owner-led polish deferred to final hardening

- Preserved all current screens until the owner can critique the complete app
  instead of encouraging piecemeal AI-driven redesign during feature work.
- Added explicit owner-review and simplification cards, category-art gallery and
  fallback work, compact app-icon approval, and a measured optional launch-motion
  decision with an immediate static/reduced-motion path.
- Recorded GIF/video/vector/CSS as candidates rather than choosing a format
  without physical startup evidence. No application behavior changed.

### 2026-08-21 — Startup moved into final hardening

- Preserved the profile-first startup scope and physical cold/warm budgets while
  moving execution after feature work to avoid repeated premature optimization.
- Added backup/recovery, protected signing, upgrade/rollback, security/quota,
  service endurance, and owner acceptance to the same final release goal.
- Recorded the verified green transparent wordmark as the future launch asset
  without connecting it to the current application.
- Added physical-tablet evidence after every implementation card.
- No application source or Android launch code changed and Goal 06 remains
  inactive.
