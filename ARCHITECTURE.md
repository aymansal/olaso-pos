---
version: 0.1
name: Olaso POS Architecture
status: active
updated: 2026-07-24
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
| Printing | Local Capacitor-to-Kotlin bridge using ESC/POS |
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
  -> Android Bluetooth or USB
  -> ESC/POS printer
```

Visual components never know how SQLite, Convex, Bluetooth, USB, or ESC/POS
works.

## Responsibility of each platform

### APK

The installed application owns:

- Interface and product images.
- Current cart and transient screen state.
- Local active menu and recipe cache.
- Local stock view.
- Completed local sales.
- Unsynced-operation queue.
- Receipt rendering and printing.
- Sync status and recovery controls.

### SQLite

SQLite is the immediate operational record on the tablet. It makes checkout
fast and keeps the cafe working offline.

It stores the minimum data needed for service:

- Active categories, products, modifiers, recipes, and ingredients.
- Current local stock quantities.
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
3. Read the locally active product and recipe versions.
4. Recalculate prices and quantities from local trusted data.
5. Insert the sale.
6. Insert all sale lines and modifier snapshots.
7. Insert exact stock movements.
8. Update local current-stock values.
9. Insert one outbox event containing the completed sale identifier.
10. Commit.

After the commit:

1. Clear the active cart.
2. Attempt receipt printing.
3. Let the background worker synchronize the outbox event.

Printing and cloud synchronization cannot turn a committed sale into an
uncommitted sale.

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
- Product images are versioned APK assets for the initial release. Dynamic
  owner-uploaded images are deferred until they are required.
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
- Customer/table snapshot.
- Money totals in integer centimes.
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

### `stockMovements`

- Ingredient reference.
- Signed quantity delta.
- Movement type.
- Sale or adjustment reference.
- User/device reference.
- Creation time.

Stock movements are append-only. Corrections create another movement.

### `dailyMetrics`

- Local business date.
- Gross and net totals.
- Order count.
- Cancel/refund totals.
- Totals by payment method, service mode, product, and category as required.
- Exact ingredient usage in each ingredient's base unit and its deduction-event
  count.

This table is incrementally updated when a sale is accepted or corrected.
Reports do not recalculate every historical sale on every screen load.

### Deferred tables

The following are added only when their features are implemented:

- `users` and `roles`.
- `devices`.
- `cashSessions`.
- `discountRules`.
- `suppliers` and `purchaseOrders`.
- `branches`.

## Money and quantity representation

### Money

- Store MAD values as integer centimes.
- `18 MAD` is stored as `1800`.
- Never store operational money as a JavaScript floating-point decimal.
- Recalculate totals in the local application operation and again in the
  Convex mutation.
- Save the confirmed totals with the sale; do not derive old totals from the
  current product price.

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
  sales.ts
  reports.ts

  lib/
    auth.ts
    money.ts
    stockCalculations.ts
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

Corrections reverse the original summary effect and apply the new effect.
Detailed reports load paginated sales or stock movements only when the user
opens them.

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
- Public functions expose the smallest required operation.
- Scheduled and internal composition calls use internal functions.

Authentication and PIN/session design will be selected after the owner
confirms roles and operational login expectations.

The current beta therefore stores only a non-secret local terminal-lock flag.
It survives restart and preserves the in-memory order while the application
remains open, but its explicit unlock action does not authenticate a user.

## Printing boundary

`printReceipt` is the only application-facing printing operation.

```text
src/
  printing/
    printReceipt.ts
    receiptModel.ts
    mockPrinter.ts

android/
  app/src/main/.../
    EscPosPrinterPlugin.kt
```

Rules:

- React components never contain ESC/POS bytes or Android transport code.
- Development uses a deterministic mock and receipt preview.
- Native Kotlin owns Bluetooth/USB permissions and transport.
- The receipt model is transport-independent.
- Reprinting uses the saved sale snapshot.
- Unsupported Arabic text is rendered as a monochrome bitmap when required.
- Only the transport supported by the client's real printer is implemented.

## APK release and update

The reproducible Goal 02 development beta is built with `npm run android:beta`
using Java 21 and Android SDK 36. It retains application ID `com.olaso.pos`,
uses version code/name `2`/`0.1.0-beta.1`, and writes only the ignored debug
APK at `android/app/build/outputs/apk/debug/app-debug.apk`. Its merged manifest
contains no printer, Bluetooth, USB, biometric, or fingerprint permission.

APP-11 verified install-over-upgrade from schema version 2 to 4, preserved
terminal settings, cached offline startup and checkout, process-restart
recovery, and acknowledged idempotent Convex synchronization on an API-35
emulator while compiling and targeting API 36. Production signing, Galaxy Tab
A9 acceptance, public distribution, and physical hardware verification remain
outside this development beta.

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

## Backup and recovery

- Convex is the synchronized cloud record, not the only copy of unsynced sales.
- SQLite persists unsynced work across restarts.
- The owner can export sales, products, recipes, and stock movements in a
  documented format.
- A backup/export process must be tested before production.
- Free-plan backup limitations must be reviewed before the client depends on
  the system.
- Recovery instructions and signing-key storage location must be documented
  outside the source repository.

## Testing strategy

### Pure calculation tests

The smallest runnable tests must cover:

- Money totals and rounding.
- Modifier prices.
- Recipe expansion.
- Stock deduction.
- Cancellation/refund reversal.
- Daily-summary updates.

### Persistence tests

- A complete sale commits all local records or none.
- Duplicate Convex submissions create one sale.
- Recipe edits do not change historical sale snapshots.
- Archived products remain visible in historical sales.
- Outbox retries survive application restarts.
- APK schema migrations preserve existing data.

### Hardware tests

On the real tablet and printer:

- Bluetooth or USB connection and reconnection.
- Normal receipt.
- Logo.
- Long product names and modifiers.
- Arabic bitmap when required.
- QR/barcode if required.
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
- [ ] Recipes are versioned after use.
- [ ] Historical sales keep product, price, modifier, and recipe snapshots.
- [ ] Stock changes leave append-only movement history.
- [ ] Queries use indexes and bounded results.
- [ ] Reports use saved summaries and paginated detail.
- [ ] Public functions validate input and permission.
- [ ] Signing secrets never enter Git.
- [ ] APK upgrades preserve SQLite data.
- [ ] Physical hardware testing happens before production approval.

## Open technical decisions

- Exact Convex authentication approach after role confirmation.
- Business-day cutoff and cafe timezone behavior.
- Receipt numbering authority while offline.
- Conflict behavior if a second device is introduced.
- Export destination and backup retention.
- Bluetooth versus USB printer transport.
- Local encryption requirements for the tablet database.
