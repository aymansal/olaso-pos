---
version: 0.4
name: Olaso POS Architecture
status: active
updated: 2026-08-21
authority: Technical architecture, persistence, synchronization, performance, and code ownership
---

# Olaso POS Architecture

## Purpose

This document defines how Olaso POS is implemented. It exists to prevent slow
database usage, unnecessary cloud costs, mixed UI/backend files, duplicate
business logic, and fragile online-only checkout behavior.

`PRODUCT.md` defines what the application does. `DESIGN.md` defines how it
looks and behaves visually. This file defines how data and code move through
the system.

## Locked decisions

| Area | Decision |
| --- | --- |
| Client | React 19, TypeScript, and Vite |
| UI | Astryx Design Core with the static Olaso theme |
| Icons | Phosphor Icons only |
| Styling | Colocated CSS Modules |
| Android | Capacitor packaging for a manually installed APK |
| Primary device | Samsung Galaxy Tab A9 in landscape |
| Local data | SQLite on the tablet |
| Cloud data | Convex |
| Hosting | No Vercel dependency in the production APK runtime |
| Printing | Local Capacitor-to-Kotlin raw TCP/LAN bridge using WD8260 ESC/POS |
| Costing | Perpetual weighted-average ingredient valuation with immutable sale cost snapshots |
| Initial topology | One cafe and one POS tablet |
| Updates | Signed APKs attached to GitHub Releases and installed manually |

The repository includes the Convex development backend, Capacitor Android
shell, and local SQLite operational record. APP-11 verified a development
debug beta through offline checkout, restart, migration, install-over-upgrade,
and synchronization. This is not a production-signed or publicly distributed
release.

## System shape

```text
React component
  -> feature hook or screen action
  -> application operation
  -> local SQLite transaction
  -> outbox synchronization
  -> Convex domain function
```

Printing follows a separate local boundary:

```text
saved local sale
  -> printReceipt
  -> Capacitor plugin
  -> Android bounded TCP socket
  -> Ethernet/LAN WD8260 ESC/POS printer
```

Visual components never know how SQLite, Convex, Android network sockets, or
ESC/POS works.

## Responsibility of each platform

### APK

The installed application owns:

- Interface and product images.
- Current cart and transient screen state.
- Local active menu and recipe cache.
- Local stock view.
- Cached ingredient valuation required for offline sale cost snapshots.
- Completed local sales.
- Unsynced-operation queue.
- Receipt rendering and printing.
- Validated printer host/port configuration and persisted print-attempt state.
- Sync status and recovery controls.

### SQLite

SQLite is the immediate operational record on the tablet. It makes checkout
fast and keeps the cafe working offline.

It stores the minimum data needed for service:

- Active categories, products, modifiers, recipes, and ingredients.
- Current local stock quantities.
- Current ingredient valuation state and cost-completeness metadata.
- Sales and sale lines created on the tablet.
- Stock movements created by those sales.
- Outbox entries waiting for Convex.
- Device settings and last synchronization cursor.

All local effects of a completed order are committed in one SQLite transaction.
If that transaction fails, nothing from the order is treated as complete.
The application serializes transactions on its shared SQLite connection so
concurrent React effects, checkout, cache refresh, and synchronization work
cannot overlap `BEGIN`/`COMMIT` boundaries.

#### Capacitor SQLite package decision

As of 2026-07-28, use exact versions `@capacitor/core`,
`@capacitor/cli`, and `@capacitor/android` `8.4.2` with
`@capacitor-community/sqlite` `8.1.0` and `sql.js` `1.11.0`.

- Capacitor Android `8.4.2` requires Capacitor core `^8.4.0`; the selected
  SQLite plugin declares support for Capacitor core `>=8.0.0`.
- Capacitor CLI 8 requires Node 22 or newer; the development toolchain uses
  Node 24.
- The SQLite plugin is MIT-licensed, actively published, supports Android and a
  `jeep-sqlite`/SQLite-WASM web implementation, and exposes transactions plus
  versioned upgrade statements without another ORM.
- Keep `sql.js` pinned to `1.11.0`: `jeep-sqlite` `2.8.0` ships prebuilt
  JavaScript glue for that WASM version, while its broad dependency range can
  otherwise resolve an incompatible newer binary.
- The paid Capawesome SQLite package is not used because it requires a private
  registry license, and a custom native SQLite bridge would duplicate a
  maintained plugin.

The community plugin bundles SQLCipher even when database encryption is not
enabled. Encryption remains an open product/security decision, and applicable
encryption-export classification must be reviewed before production
distribution. Sources:
[Capacitor releases](https://github.com/ionic-team/capacitor/releases),
[@capacitor-community/sqlite](https://github.com/capacitor-community/sqlite).

The Android application ID is `com.olaso.pos`. Keep it unchanged across beta
and production upgrades. Capacitor configuration uses JSON because the
Capacitor 8 CLI TypeScript-config loader is not compatible with the project's
TypeScript 7 compiler; this avoids downgrading the application toolchain.

### Convex

Convex owns the synchronized cloud record:

- Canonical editable menu and recipe data.
- Acknowledged sales and sale lines.
- Ingredient and stock movement history.
- Report summaries.
- Users and permissions when authentication is introduced.
- Device registration and synchronization acknowledgements.

The APK may use the public Convex client from the dedicated sync/data layer.
No administrative secret is bundled in the APK. Security comes from validated,
authorized Convex functions rather than from hiding the deployment URL.

### Vercel

Vercel is not in the sale, stock, printing, or synchronization path.

The current Vite interface may be deployed for development previews, but the
production APK does not download its interface from Vercel and does not call a
Vercel Function before reaching Convex.

This avoids:

- An unnecessary network hop.
- Additional latency and failure points.
- Vercel Function usage for routine CRUD.
- Making the POS depend on a web deployment.

Vercel Hobby is documented for personal, non-commercial use and is not treated
as production infrastructure for the client.

## Local-first checkout transaction

Completing an order is one application operation.

Within one local database transaction:

1. Generate a durable `localSaleId`.
2. Validate that the cart is not empty.
3. Read the locally active product, recipe, ingredient, and valuation versions.
4. Recalculate prices, quantities, and ingredient costs from local trusted data.
5. Insert the sale with its ingredient-cost and completeness snapshot.
6. Insert all sale lines with price, modifier, recipe, and ingredient-cost
   snapshots.
7. Insert exact stock movements with their deterministic cost effects.
8. Update local current-stock quantities and inventory values.
9. Insert one outbox event containing the completed sale identifier.
10. Commit.

After the commit:

1. Clear the active cart.
2. Start one receipt attempt without delaying the committed-sale result.
3. Let the background worker synchronize the outbox event.

Printing and cloud synchronization cannot turn a committed sale into an
uncommitted sale. The local schema version 5 sale row begins with `pending`
print state in the sale transaction. A later serialized print attempt increments
only its attempt counter and records `printed` byte/timing evidence or `failed`
bounded error code/message; it never inserts another sale, item, stock movement,
or outbox event.

## Synchronization

### Outbox rule

Every cloud-bound local operation first creates an outbox entry in the same
transaction as the data it represents. The sync worker only sends committed
outbox entries.

Each entry contains:

- Operation ID.
- Device ID.
- Operation type.
- Local record ID.
- Creation time.
- Attempt count.
- Last error when applicable.

The queue uses bounded retry delays. It does not spin continuously when the
network is unavailable.

### Idempotency

Every sale is identified by `deviceId + localSaleId`.

The Convex sale mutation:

1. Checks the indexed idempotency key.
2. Returns the existing acknowledgement if the sale already exists.
3. Otherwise inserts the sale, lines, stock movements, and report updates in
   one mutation.

A network retry therefore produces the same result instead of another sale.

### Download synchronization

- The first successful setup downloads the complete active operational menu.
- Later syncs request records changed after the saved cursor.
- Deleted operational records are represented by archived/tombstone state so
  the tablet can remove them from active views.
- Product images and the curated category-art gallery are versioned APK assets
  for the initial release. Categories persist an artwork key and resolve an
  unknown/missing key to one neutral bundled fallback. Dynamic owner-uploaded
  images and runtime AI generation are deferred until they are required.
- Ingredient synchronization includes the current valuation revision needed to
  reproduce offline sale costs. Salary and general-expense data never enter
  the cashier operational cache.
- The application exposes a manual `Sync now` recovery action.

### Current scaling limit

This synchronization model is optimized for one active POS tablet.
Multi-device conflict resolution is added only when a second POS device is
approved. Cloud idempotency and transactional mutations are retained because
they are required even for one device.

## Cloud data model

Names may be refined during schema implementation, but the responsibilities
must remain separate.

### `categories`

- Name.
- Sort order.
- Active or archived state.
- Revision/update metadata.

### `products`

- Category reference.
- Name and receipt name.
- Base price in integer centimes.
- Active, unavailable, or archived state.
- Image asset key.
- Sort order.
- Current recipe version reference.
- Revision/update metadata.

### `modifierGroups` and `modifierOptions`

- Product applicability.
- Required/optional rules.
- Selection limits.
- Price change in integer centimes.
- Ingredient effects when applicable.
- Active or archived state.

### `ingredients`

- Name.
- Base measurement unit.
- Current cloud stock quantity.
- Current inventory value in integer centimes, last usable weighted-average
  cost state, and cost-completeness status.
- Low-stock threshold.
- Active or archived state.

### `recipeVersions` and `recipeItems`

- Product and size applicability.
- Version number and activation time.
- Ingredient reference.
- Exact quantity in the ingredient's base unit.
- Immutable state after being used by a completed sale.

### `sales`

- Device and local sale IDs.
- Receipt number.
- Cashier reference.
- Service mode.
- No customer or table fields.
- Tax-free money totals in integer centimes.
- Ingredient-cost total and cost-completeness snapshot.
- Payment method.
- Status.
- Local completion and cloud acknowledgement times.
- Cancellation/refund references.

### `saleItems`

- Sale reference.
- Product reference when still available.
- Product name and price snapshot.
- Quantity.
- Modifier snapshot.
- Recipe version reference.
- Line total.
- Ingredient-cost snapshot and completeness state.

### `stockMovements`

- Ingredient reference.
- Signed quantity delta.
- Movement type.
- Sale or adjustment reference.
- User/device reference.
- Creation time.
- Cost delta and resulting valuation when the movement changes inventory value.

Stock movements are append-only. Corrections create another movement.

### `inventoryPurchases`

- Ingredient and related stock-movement references.
- Package label, package count, and base-unit quantity per package.
- Total quantity received in the ingredient's integer base unit.
- Price per package and total cost in integer centimes.
- Received date, actor, optional supplier label, and correction reference.

Purchases are append-only. A correction records a reversing or replacement
entry rather than rewriting historical valuation.

### `staffProfiles` and `compensationPeriods`

- Staff display identity, cashier/manager/owner classification, active state,
  and the required authentication-subject link.
- Optional integer-centime monthly compensation with effective start month and
  optional end month.
- Compensation changes create a new effective period.
- Salary fields are returned only through owner-authorized functions and are
  excluded from cashier snapshots and ordinary staff reads.

Staff profiles and authentication identities remain distinct. ID-01 defines the
production session boundary before ID-02 persists it.

### `operatingExpenses`

- Category, description, and integer-centime amount.
- One-time effective date or monthly recurrence with start and optional end.
- Status, revision, actor, and retry identifier.
- Optional compensation reference only when needed for traceability; salary
  totals are read from compensation periods and are never duplicated manually.

### `dailyMetrics`

- Local business date.
- Gross and net totals.
- Order count.
- Cancel/refund totals.
- Totals by payment method, service mode, product, and category as required.
- Exact ingredient usage in each ingredient's base unit and its deduction-event
  count.
- Ingredient cost consumed and cost-completeness counts.

This table is incrementally updated when a sale is accepted or corrected.
Reports do not recalculate every historical sale on every screen load.

### Deferred tables

The following are added only when their features are implemented:

- `devices`.
- `cashSessions`.
- `discountRules`.
- Suppliers and multi-line purchase orders.
- `branches`.

## Money and quantity representation

### Money

- Store MAD values as integer centimes.
- `18 MAD` is stored as `1800`.
- Never store operational money as a JavaScript floating-point decimal.
- The confirmed first production policy has no tax calculation or tax line.
- Recalculate totals in the local application operation and again in the
  Convex mutation.
- Save the confirmed totals with the sale; do not derive old totals from the
  current product price.
- Keep purchase totals, stock-movement cost effects, sale ingredient costs,
  compensation, and expenses in integer centimes.
- Weighted-average calculations use integer arithmetic with deterministic
  rounding and preserve the ingredient's total carrying value. JavaScript
  decimal unit prices are display values only.
- A missing cost is explicit state. Never convert unknown cost to zero.

### Stock

Each ingredient has one base unit:

- Millilitres for liquids.
- Grams or milligrams for weighed ingredients.
- Pieces for indivisible packaging or bakery items.

Recipe and stock quantities use integers in that base unit. Conversion for
display happens at the edge of the application.

## Backend ownership

Backend files are split by business domain. They are not dumped into one file,
and ordinary CRUD is not split into an artificial class or repository for each
operation.

```text
convex/
  schema.ts
  categories.ts
  products.ts
  modifiers.ts
  recipes.ts
  ingredients.ts
  inventory.ts
  costs.ts
  staff.ts
  sales.ts
  reports.ts

  lib/
    auth.ts
    money.ts
    stockCalculations.ts
    costCalculations.ts
    validation.ts

src/
  data/
    localDatabase.ts
    schema.ts
    sync.ts
    outbox.ts

  features/
    dashboard/
    pos/
    orders/
    products/
    stock/
    reports/
```

Rules:

- A Convex domain file owns the public queries and mutations for that domain.
- Shared pure calculations live in `convex/lib`.
- A helper is created only when at least two operations genuinely share it.
- Public Convex functions validate arguments and authorization.
- Internal scheduled or composed work uses internal Convex functions.
- React components do not import Convex or SQLite clients.
- Feature hooks/actions call the data layer and expose plain application data
  to components.
- Do not create a generic database adapter with only a Convex implementation.
- Do not use barrel files; import real files directly.

## Frontend ownership

The current component separation remains the required pattern:

```text
src/features/pos/
  PosScreen.tsx
  PosScreen.module.css
  data/
  components/
    ProductCard/
      ProductCard.tsx
      ProductCard.module.css
```

- Every named reusable or independently interactive component has its own TSX
  file.
- Component-specific CSS stays in its colocated CSS Module.
- Screen modules own layout, not child component internals.
- Components receive data and callbacks through props.
- Screens and feature hooks coordinate use cases.
- Persistence, synchronization, reporting queries, and printing protocols stay
  outside components.

## Convex function rules

### Queries

- Use an index for every query that may grow.
- Use `.unique()`, `.first()`, `.take(n)`, or pagination to bound results.
- Never use an unbounded `.collect()` on sales, sale items, stock movements, or
  reports.
- Do not use `.filter()` where an index can narrow the database range.
- Return only the information needed by the current screen.
- Paginate order history and report detail.
- Avoid permanent subscriptions for screens that are not visible.

### Mutations

- One completed sale is one client mutation.
- A mutation can insert its sale, lines, movements, and summary updates
  transactionally.
- Product/recipe bulk editing uses one validated mutation rather than a client
  loop of mutations.
- Patch only changed editable fields.
- Archive referenced records instead of deleting them.
- Mutations are safe to retry.

### Actions

- Do not use actions for ordinary database CRUD.
- Use an action only for a required external network service or a different
  runtime.
- Printing stays local and is never a Convex action.
- Avoid chains of `runQuery` and `runMutation` calls when one mutation and
  shared TypeScript helpers can perform the work.

## Initial index plan

Indexes are added for real access paths, not speculatively.

Expected indexes include:

- Categories by key, active sort order, and update time.
- Products by key and update time; the bounded management/cache result handles
  category and status presentation locally.
- Modifier records by group/key or status/sort order.
- Recipe versions by product/version and retry identifier.
- Ingredients by key, active name, and update time.
- Sales by device and local sale ID for idempotency.
- Sales by completion time for paginated history.
- Sale items by sale.
- Stock movements by ingredient and creation time.
- Stock movements by related sale.
- Inventory purchases by ingredient/time and business date/time.
- Compensation periods by staff profile and effective month.
- Operating expenses by effective month/status.
- Daily metrics by business date.

Redundant and unused indexes are removed because every index consumes storage
and adds write work. Add a cashier/date, category/status, sale/date/status, or
activation index only with the implemented query that uses it.

## CRUD behavior

### Create

- Validate input at the Convex boundary.
- Generate identifiers in the owning layer.
- Create related records in one mutation when they form one business operation.
- Return the created ID and revision, not an unnecessarily large object graph.

### Read

- Read the smallest indexed range required by the screen.
- Cache operational menu data locally.
- Search and category filtering run locally after the active menu is cached.
- Use pages for history.
- Do not poll repeatedly for stable data.

### Update

- Send only changed fields.
- Reject stale management edits when they would overwrite a newer revision.
- Create a recipe version instead of mutating a recipe used by old sales.
- Batch related updates.

### Delete

- Archive categories, products, ingredients, recipes, and modifiers referenced
  by history.
- Physically delete only unused draft data after validation.
- Sales and stock movements are never hard deleted through ordinary CRUD.
- A cancellation or refund creates explicit corrective state and movements.

## Quota and performance budget

### Startup and runtime performance

The startup path is an operational boundary and is measured separately from
network synchronization:

```text
Android launch surface
  -> WebView and critical React shell
  -> SQLite connection and terminal-lock restoration
  -> usable local POS and cached menu
  -> deferred cloud synchronization and non-critical screens
```

Rules:

- Use Android's native splash mechanism for the unavoidable launch frame. It
  uses the Olaso cream surface and approved artwork and transitions to a
  visually identical web startup surface; the default Capacitor artwork and
  blank white frames are not production states.
- The native first frame is static and locally bundled. Optional brand motion
  begins only on the visually identical web startup surface, never extends the
  time before usable POS, and has a static reduced-motion path. Select its asset
  format only after measuring APK weight, WebView decode, memory, and startup on
  the physical tablet; GIF, video, and vector/CSS are candidates, not policy.
- Convex, DNS, Wi-Fi, and cloud synchronization never gate the first usable POS.
- SQLite and terminal-lock restoration may gate cashier access, but they must
  share one visible startup flow. Do not create successive blank or visually
  unrelated loading phases.
- Keep the critical startup module graph small. The POS shell and the minimum
  lock/startup path may load eagerly; screens not required for the initial
  destination load on demand through the existing React/Vite stack.
- Start background synchronization only after the local POS is rendered and
  responsive. Deferral must not weaken outbox recovery or idempotency.
- Ship product artwork at dimensions and formats appropriate to its rendered
  size, declare dimensions to prevent layout shift, and defer below-the-fold
  decoding. Do not decode full 1408 by 768 images for 174-pixel cards when a
  checked smaller asset is visually equivalent.
- Do not add a state library, service worker, custom cache framework, or native
  rewrite for startup. Add machinery only when a trace proves the existing
  platform cannot meet the budget.

Verification records both Android time to initial display and an application
ready mark after the local POS can accept input. Compare the median of at least
five force-stopped cold launches and five warm launches on the physical Galaxy
Tab A9. The working budgets are at most two seconds to usable local POS for a
cold launch and one second for a warm launch, with no unbranded frame, startup
error, or network dependency. Profile first, change one measured bottleneck at
a time, and retain before/after evidence.

Measurement and platform behavior follow Android's official
[app-startup guidance](https://developer.android.com/topic/performance/vitals/launch-time)
and [SplashScreen guidance](https://developer.android.com/develop/ui/views/launch/splash-screen).

Rechecked against Convex's official limits on 2026-07-28, the Free plan totals
remain:

- 1,000,000 function calls per month.
- 1 GB of database I/O per month.
- 0.5 GB of database storage.
- 20 GB-hours of action compute.

Free has hard caps. Starter can continue beyond the included amounts with
usage-based billing. Explicit client calls and subscription updates count as
function calls, and writes can fail after the Free cap is reached. Current
limits must be checked again before production launch:
<https://docs.convex.dev/production/state/limits>.

### Per-operation budget

| User action | Cloud behavior |
| --- | --- |
| Open or edit cart | No call |
| Search products | No call |
| Change category | No call |
| Change quantity/modifier | No call |
| Complete sale | One mutation, retried idempotently if needed |
| Print/reprint | No call |
| Open active menu | Local read; sync only when stale |
| Open order history | One paginated query |
| Open report period | One summary query plus paginated detail on demand |
| Save related recipe changes | One batched mutation |
| Receive purchased stock | One mutation for purchase, movement, balance, and valuation |
| Save compensation or expense | One validated retry-safe mutation |
| Open monthly Costs report | One bounded summary query plus paginated purchase/expense detail on demand |

At 500 sales per day, one sale mutation produces about 15,000 sale calls in a
30-day month. The dangerous quota patterns are repeated polling, broad
subscriptions, full-table reads, and one mutation per sale line—not normal
single-sale mutations.

### Required reviews

- Check Convex usage and function health weekly during development.
- Check it daily during the first production week.
- Search backend code for `.collect(` and database `.filter(` before releases.
- Review every new index against a real query.
- Record an expected maximum result count for every non-paginated list query.
- Treat an unexpected increase in calls or I/O as a bug.

## Reporting strategy

The default dashboard reads small saved summaries.

When a sale is accepted, the same mutation updates:

- Daily order count.
- Daily money totals.
- Product/category counters required by active reports.
- Payment and service-mode counters required by active reports.
- Exact recipe ingredient usage and deduction-event counters required by the
  Stock Usage report.
- Ingredient cost consumed, cost-complete sale count, and incomplete-cost sale
  count required by the monthly profitability report.

Corrections reverse the original summary effect and apply the new effect.
Detailed reports load paginated sales or stock movements only when the user
opens them.

The monthly Costs query combines at most 31 daily summaries with indexed,
bounded compensation periods, operating expenses, and purchase totals for the
selected month. It returns separate values for revenue, ingredient cost
consumed, gross profit, compensation, other operating expenses, operating
profit, purchase cash spent, and closing inventory value. Purchases are never
subtracted again after ingredient cost consumed.

Product cost and margin use the active recipe and current weighted-average
ingredient costs. Historical sale profitability uses immutable saved cost
snapshots, never today's ingredient prices. Any missing ingredient cost makes
the affected product, sale, and report explicitly incomplete.

Do not introduce a general analytics pipeline until the stored summaries no
longer answer the owner's confirmed reports.

## Security

- Validate arguments for every public Convex function.
- Check authentication and role permission for every public operation.
- Never trust totals, prices, stock deductions, or permissions sent by the
  client.
- Recalculate cloud totals from cloud product/recipe snapshots or validate the
  submitted immutable version.
- Administrative secrets never ship inside the APK.
- Device identity is not a substitute for user authorization.
- Management actions record the responsible user/device.
- Salary and individual-compensation fields require owner authorization and are
  never returned by cashier, operational-cache, or general staff queries.
- The dedicated development authorization override may exercise these paths in
  development but must not exist on a production deployment.
- Public functions expose the smallest required operation.
- Scheduled and internal composition calls use internal functions.

The confirmed policy is cumulative cashier < manager < owner authorization.
Cashiers use POS, reprint, same-day whole-sale correction, and low-stock
warnings; managers additionally use products, stock, expenses, and operational
sales reports; only owners access staff, identity recovery, profitability, and
individual compensation. Each staff member has a separate six-digit PIN.

ID-01/ID-02 must replace the current non-secret terminal lock with protected
credential verifiers and local sessions. Lock/user-switch and app/tablet restart
return to a locked identity boundary; the owner-configurable default idle lock
is five minutes, and five failed attempts impose a five-minute local lockout.
Registered staff remain usable through a multi-day outage, so a remote
revocation takes effect on the tablet's next synchronization. Physical tablet
custody is the accepted first-release lost-device control. Verified support may
reset an existing owner identity through a protected backend boundary; it must
not create a temporary privileged profile or expose a plaintext PIN.

### Confirmed production identity and session boundary

ID-02 implements this design without changing the local-first checkout
boundary:

```text
staff PIN
  -> Convex credential verification (online) / protected local verifier (offline)
  -> opaque per-device session token
  -> Android Keystore-backed protected storage
  -> session-token argument on every protected Convex operation
  -> Convex role/session helper and audit actor
```

- **Identity:** a staff profile and a user identity are distinct records linked
  one-to-one. Owner, manager, and cashier are the only production roles;
  `worker` is migrated to `cashier` before enforcement. The immutable device ID
  scopes sessions but never authorizes a person.
- **Credentials and sessions:** Convex stores only a salted, slow PIN verifier
  and session-token verifier. The raw six-digit PIN and raw opaque session token
  are never written to React state beyond immediate entry, SQLite,
  `device_settings`, logs, source control, or normal exports. The Android
  Keystore-backed bridge stores one independent session, offline PIN verifier,
  and failed-attempt state per provisioned staff profile; browser development
  has no production credential fallback. A new sign-in replaces only that
  profile's local protected record, revokes the prior token for that
  staff/device pair, and removes already revoked rows through the bounded
  staff-profile session index.
- **Offline:** after an online provisioning/login, the tablet can verify a
  registered staff PIN and continue a local session indefinitely while offline.
  The next successful synchronization applies archived/revoked identities and
  invalidates their protected local material. This is an explicit availability
  choice: an offline tablet cannot learn a new revocation.
- **Locked profile discovery:** the unauthenticated Lock screen may read the
  bounded active server profile list for sign-in choices, but that read never
  archives local profiles or clears protected credentials. After a successful
  online sign-in, the app may apply that complete bounded list as an
  authenticated staff-directory refresh: stale local rows are archived, active
  rows are upserted, and stale profile-scoped plus legacy protected records are
  removed. If the bounded list was unavailable, only the authenticated profile
  is upserted and every other local profile remains unchanged.
- **Lock and switch:** lock clears active in-memory identity but not the
  protected credentials. Unlock requires PIN verification; a different staff
  member can then become the current actor. Restart begins locked. The native
  monotonic clock, not editable wall time, measures the five-minute idle and
  failed-attempt lockouts.
- **Convex enforcement:** public protected functions receive an opaque session
  token and use one shared session helper to verify active staff identity,
  role, device binding, and revocation state. Existing `ctx.auth` development
  overrides are removed from production paths in ID-02; UI concealment never
  replaces this check. Returned fields and local operational caches are scoped
  by the same role.
- **Audit and recovery:** every protected write records the resolved staff
  identity and device. Verified support recovers an owner by invalidating the
  existing credential/sessions and issuing a one-time reset path for that same
  identity; it never creates a temporary owner or bypasses authorization.
- **Threat limits:** PIN sharing remains detectable only through its shared
  audit identity and is prohibited operationally. Direct SQLite edits cannot
  obtain token/PIN material but may corrupt an unencrypted operational database;
  unsafe database state stops checkout. Wall-clock changes cannot shorten PIN
  lockouts; same-day offline corrections retain device time and are reconciled
  against the café business date when synchronized.

## Printing boundary

`printReceipt` is the only application-facing byte-generation/transport
operation for sale receipts.

```text
src/
  printing/
    printerTransport.ts
    printerDiagnostic.ts
    testPrinter.ts
    printReceipt.ts
    receiptModel.ts
    receiptEncoder.ts

android/
  app/src/main/.../
    EscPosPrinterPlugin.kt
```

Rules:

- React components never contain ESC/POS bytes or Android transport code.
- Browser development keeps the deterministic receipt preview and reports the
  native-only transport as unavailable; it does not simulate paper success.
- TypeScript builds validated receipt models and deterministic WD8260 ESC/POS
  bytes. Native Kotlin owns only the bounded raw TCP socket and its byte-write
  result.
- The receipt model and encoder are transport-independent and use only saved
  immutable sale data. They never look up current product names, prices, or
  recipes for a reprint.
- Receipt money is integer centimes, the initial code page is CP858 page 19,
  unsupported characters become `?`, and ordinary streams contain neither
  raster-image data nor QR commands.
- Reprinting uses the saved sale snapshot.
- Orders merges cloud acknowledgement without overwriting tablet-local print
  state. Reprint is enabled only when the immutable local sale row exists, calls
  the same `printReceipt` boundary with current settings, and updates only
  attempt state/diagnostics.
- The receipt language follows the selected French or English staff language;
  unsupported-script bitmap rendering remains deferred until another language
  is required.
- The production transport is Ethernet/LAN through the router. USB remains a
  standalone desktop laboratory path and Android USB/Bluetooth transports are
  not implemented.
- The printer host and verified raw TCP port are settings, not hardcoded
  deployment constants.
- The current Settings test path persists a validated IPv4/port and calls one
  registered Capacitor plugin. Kotlin owns 2-second bounded connect and write
  operations, returns only byte/timing facts, and reports `paperConfirmed` as
  false; no vendor SDK or new Android permission is used.
- Printer setup packages the reviewed 2,441-byte, 300-dot NV logo as an Android
  raw resource. A deliberate Settings action loads that static asset natively
  and sends it through the same bounded socket after warning that all stored
  printer images are replaced. No runtime rasterization or generated per-sale
  logo data enters the APK.
- Normal receipts recall the pre-provisioned 300-dot NV logo instead of
  retransmitting or rerasterizing it for each sale.
- Checkout returns as soon as the local sale transaction commits, clears the
  cart, and starts one background attempt. UI copy says `sent` rather than
  claiming paper; unavailable/timeout/write failures keep the sale and persist
  a reprintable failed state.

## APK release and update

The reproducible development beta is built with `npm run android:beta` using
Java 21 and Android SDK 36. It compiles with API 36 but targets API 35 so the
manually distributed fixed-landscape POS remains enforceable on Android 16
large screens. It retains application ID `com.olaso.pos`,
uses version code/name `2`/`0.1.0-beta.1`, and writes only the ignored debug
APK at `android/app/build/outputs/apk/debug/app-debug.apk`. Its merged manifest
contains no printer, Bluetooth, USB, biometric, or fingerprint permission.

APP-11 verified install-over-upgrade from schema version 2 to 4, preserved
terminal settings, cached offline startup and checkout, process-restart
recovery, and acknowledged idempotent Convex synchronization on an API-35
emulator. The later Android-16 tablet check changed only the target API to 35;
the compile API remains 36.

The physical Samsung Galaxy Tab A9 SM-X115 reports an approximately 1007 by
601 CSS-pixel WebView on its 1340 by 800 panel. The packaged activity is
sensor-aware landscape and immersive fullscreen. Android 16 ignores ordinary
orientation restrictions for API-36-targeted large-screen applications, so
this manual-distribution APK targets API 35 and also retains the API-36
restricted-resizability compatibility property while the fixed landscape
interface remains in use.
The native Capacitor runtime scales the fixed 1340-pixel reference by the long
edge of the CSS screen before React mounts and reapplies that scale after
resize/orientation changes plus a short bounded startup/foreground settling
window; ordinary browser previews remain unscaled. Physical testing confirmed
the complete composition, touch targeting, and cart survival across POS
navigation. Production signing, public distribution, post-checkout printing,
and the remaining hardware acceptance checks remain outside this development
beta.

```text
GitHub tag
  -> GitHub Actions build
  -> signed APK
  -> GitHub Release
  -> manual tablet installation
```

Release rules:

- Keep the same Android application ID.
- Sign every release with the same protected signing key.
- Back up the signing key outside the repository.
- Increase the version code and version name.
- Never commit signing secrets.
- Test installation over the previous production APK.
- Verify that local SQLite data survives the upgrade.
- Keep a known-good previous APK for rollback.

Google Play and live-update services are not used.

## Failure behavior

| Failure | Required behavior |
| --- | --- |
| No internet | Continue local ordering and queue sync |
| Convex rejection | Keep outbox item, show actionable sync error |
| Duplicate retry | Return existing acknowledgement |
| Local save failure | Keep cart intact; do not print |
| Printer disconnected | Keep sale; show reprint action |
| Paper out | Keep sale; allow retry after paper replacement |
| App closed after sale | Recover sale and pending print/sync state |
| APK update | Preserve local database and settings |
| Corrupt or unrecoverable local data | Stop unsafe checkout and expose recovery/export path |
| Missing ingredient cost | Continue valid ordering; mark product, sale, and profitability report incomplete |
| Stale purchase/expense edit | Reject it without changing quantity, valuation, or historical reports |

## Backup and recovery

- Convex is the synchronized cloud record, not the only copy of unsynced sales.
- SQLite persists unsynced work across restarts.
- The owner can export sales, products, recipes, stock movements, purchases,
  compensation periods, and operating expenses in a documented format.
- A backup/export process must be tested before production.
- Free-plan backup limitations must be reviewed before the client depends on
  the system.
- Recovery instructions and signing-key storage location must be documented
  outside the source repository.

## Testing strategy

### Pure calculation tests

The smallest runnable tests must cover:

- Money totals and rounding.
- Weighted-average receiving, inventory valuation, and deterministic cost
  allocation rounding.
- Modifier prices.
- Recipe expansion.
- Product cost, margin, and incomplete-cost propagation.
- Stock deduction.
- Cancellation/refund reversal.
- Sale cost snapshots and their cancellation/refund reversal.
- Compensation effective periods, recurring expenses, and monthly profit
  subtotals without purchase double counting.
- Daily-summary updates.

### Persistence tests

- A complete sale commits all local records or none.
- Duplicate Convex submissions create one sale.
- Duplicate purchase, compensation, and expense mutations create one effect.
- Recipe edits do not change historical sale snapshots.
- Archived products remain visible in historical sales.
- Outbox retries survive application restarts.
- APK schema migrations preserve existing data.

### Hardware tests

On the real tablet and printer:

- Ethernet/LAN connection, timeout, router/printer disconnect, and reconnection.
- Normal receipt.
- Logo.
- Long product names and modifiers.
- French/English CP858 accents and unsupported-character behavior.
- QR/barcode only if a real owner-approved use is added.
- Paper-out recovery.
- Cut command when supported.
- Reprint without another sale.
- Repeated-print endurance.
- App restart and tablet restart.

## Scaling triggers

Do not build these before the trigger occurs:

| Trigger | Then add |
| --- | --- |
| Second POS tablet | Multi-device stock/conflict rules |
| Second branch | Branch IDs, tenant boundaries, branch permissions |
| Remote owner dashboard confirmed | Compliant web hosting and remote session design |
| Catalog images edited by owner | Cloud image storage and image processing |
| Reports outgrow daily summaries | Dedicated aggregate strategy or analytics export |
| Convex Free usage approaches a cap | Optimize measured hot paths, then consider Starter |
| Printer fails generic ESC/POS test | Minimal vendor-specific transport/SDK integration |

## Non-negotiable implementation checklist

- [ ] UI components contain no database or printer implementation.
- [ ] Component styles remain in colocated CSS Modules.
- [ ] Cart changes make no cloud calls.
- [ ] One completed sale uses one idempotent Convex mutation.
- [ ] A sale is committed locally before printing.
- [ ] Internet failure does not block valid local checkout.
- [ ] Money and stock use integer base units.
- [ ] Purchase, inventory, sale-cost, compensation, and expense money uses
  integer centimes with deterministic cost allocation.
- [ ] Recipes are versioned after use.
- [ ] Historical sales keep product, price, modifier, recipe, and ingredient-cost
  snapshots.
- [ ] Stock changes leave append-only movement history.
- [ ] Purchases and cost corrections leave append-only valuation history.
- [ ] Cost reports separate purchase cash, inventory value, ingredient cost,
  compensation, and other expenses without double counting.
- [ ] Individual compensation is accessible only through owner-authorized
  functions.
- [ ] Queries use indexes and bounded results.
- [ ] Reports use saved summaries and paginated detail.
- [ ] Public functions validate input and permission.
- [ ] Signing secrets never enter Git.
- [ ] APK upgrades preserve SQLite data.
- [ ] Android launch has no default/blank frame and meets the measured startup
  budget on the physical tablet without waiting for the network.
- [ ] Physical hardware testing happens before production approval.

## Open technical decisions

- Exact Convex authentication/session implementation for the confirmed policy.
- Conflict behavior if a second device is introduced.
- Export destination and backup retention.
- Verified WD8260 raw TCP port and production router address-reservation policy.
- Local encryption requirements for the tablet database.
