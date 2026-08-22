---
version: 0.4
name: Olaso POS Product Specification
status: active
updated: 2026-08-21
authority: Product purpose, scope, workflows, and operational behavior
---

# Olaso POS Product Specification

## Purpose

Olaso POS is a touch-first Android point-of-sale application for Olaso Club in
Tetouan. It lets staff take orders, print receipts, maintain the editable menu,
track exact ingredient consumption and cost, and give the owner useful sales,
stock, cost, and profitability reports.

The application is designed first for one Samsung Galaxy Tab A9 used in
landscape. It must remain fast during service and continue taking orders when
the internet is slow or unavailable.

## Product summary

In plain English:

1. A cashier adds products to an order.
2. The application calculates the total and records the completed sale.
3. The receipt is printed through an ESC/POS-compatible thermal printer.
4. Each product's saved recipe deducts exact ingredient quantities from stock.
5. The owner can see sales, product performance, and remaining stock.
6. The owner can add or edit products, ingredients, prices, and recipes without
   changing application code.
7. Purchased stock, recipe usage, worker compensation, and operating expenses
   produce a trustworthy monthly cost and profitability view.

## Product principles

These rules are ordered by importance:

1. **Never block service unnecessarily.** Taking an order and printing a
   receipt must not depend on a fast internet connection.
2. **Prevent lost or duplicate sales.** A retry must never record the same sale
   twice or deduct its stock twice.
3. **Keep numbers exact.** Prices, costs, valuations, and recipe quantities are
   stored in fixed integer units rather than approximate floating-point values.
4. **Make the menu owner-editable.** Products and recipes are data, not
   hardcoded screens.
5. **Show trustworthy reports.** Historical sales retain the price, recipe, and
   ingredient cost used when the sale happened. Missing cost data is reported
   as incomplete rather than silently treated as zero.
6. **Keep the interface faithful to Olaso.** `BRAND.md` and `DESIGN.md` remain
   the visual authorities.
7. **Build only for current needs.** The first production version supports one
   cafe and one POS tablet. Multi-branch and multi-POS behavior are added only
   when requested.

## Users

### Cashier

The cashier can:

- Search and browse the menu.
- Select a service mode: Dine-in / Sur place or Take-away.
- Add products and modifiers to an order.
- Change quantities and remove order lines.
- Complete a sale without customer or table entry; customer details remain
  deferred until a separately approved loyalty/customer feature.
- Complete a sale and print or reprint its receipt.
- View recent orders needed for operational recovery.

### Manager

The manager can do everything a cashier can do, plus:
- Add, edit, archive, and restore products.
- Organize products into categories.
- Set prices, sizes, options, and extras.
- Create ingredients and define their measurement units.
- Define and version each product's recipe.
- Receive purchased stock with package quantity and price, correct stock, and
  review stock movements and valuation.
- View operational sales reports.
- Record one-time and recurring operating expenses.

### Owner

The owner can do everything a manager and cashier can do, plus maintain staff
profiles and effective-dated compensation, recover staff access through the
approved support procedure, and view profitability and individual compensation.

Cashiers do not receive management, reports, profitability, compensation, or
Settings access. Managers do not receive profitability, individual compensation,
staff, or owner-recovery access.

## Target environment

### Tablet

- Samsung Galaxy Tab A9.
- Landscape orientation.
- Reference viewport: 1340 by 800.
- Touch targets and layout follow `DESIGN.md`.
- The production application fills the complete tablet viewport.

The physical Samsung Galaxy Tab A9 SM-X115 and its Android WebView dimensions
have been verified against the 1340 by 800 composition. Release acceptance must
repeat the check after material Android, WebView, or native-shell changes.

### Launch and operational readiness

- Opening the APK must never present an unbranded white or default Capacitor
  screen. Android launch, WebView startup, and React loading states use one
  continuous Olaso cream surface with approved brand artwork.
- The application shows a branded first frame immediately and reaches a usable
  local POS without waiting for Convex or any other network request.
- Restoring the local terminal-lock state remains a safety gate. While that
  state or SQLite is loading, the application shows an explicit branded startup
  state rather than exposing the POS or rendering a blank frame.
- Startup performance is measured on the physical Galaxy Tab A9 after Android
  or WebView updates. A single developer-machine result is not release
  evidence.
- The working performance budget is a median usable cold start of at most two
  seconds and a median warm start of at most one second across five controlled
  runs on the target tablet. A missed budget is investigated and documented;
  it is not hidden by extending the splash screen.
- The first branded frame is always a local static asset. An optional short
  owner-approved wordmark/light reveal may continue on the identical cream
  startup surface only while real initialization is still pending. Its format
  is selected from measured APK size, decode cost, quality, and startup timing;
  GIF or video is not assumed, and reduced-motion uses the static frame.

### Printer

- WDLink WD8260 80 mm ESC/POS thermal receipt printer.
- Its self-test confirms USB plus 10/100 Ethernet/TCP-IP, a 72 mm / 576-dot
  printing width, Font A at 48 columns, CP858 page 19, stored images, and a
  cutter.
- USB is the standalone desktop receipt-laboratory path. The production Android
  application prints through Ethernet/LAN via the router using a configurable
  printer address and a verified raw TCP port.
- Printer settings validate and persist that endpoint locally. A clearly marked
  Test printer action saves the configuration and sends a non-sale diagnostic;
  successful socket write feedback never claims paper was observed.
- A separate deliberate Restore saved logo action sends the bundled approved
  logo only during printer setup. It warns that the operation replaces all
  images stored in the printer and never claims storage or paper confirmation
  from a successful socket write.
- The accepted initial receipt is French/English and uses the printer-resident
  300-dot OLASO logo. It has no QR code until a real owner-approved destination
  exists. Arabic receipt output is deferred for the initial deployment.
- Generic ESC/POS is used instead of a proprietary driver while the verified
  device continues to pass the compatibility tests.

The supplied tablet and printer are available. The application is not
production-approved until their LAN printing, recovery, endurance, upgrade,
and release tests in `ARCHITECTURE.md` pass.

## Primary navigation

The approved shell contains these top-level destinations:

1. **Dashboard** — today's operational summary and important warnings.
2. **POS** — menu, current order, payment summary, and checkout.
3. **Orders** — recent sales, order details, cancellations, and reprints.
4. **Products** — categories, products, prices, options, and recipes.
5. **Stock** — ingredients, current quantities, low-stock status, and
   adjustments.
6. **Reports** — sales, products, ingredients, costs, profitability, and period
   comparisons.

`POS` is the default destination when a cashier opens the application.
Settings and staff management may be added under the owner profile instead of
adding another permanent navigation item.

Costs and profitability belong inside the Reports workspace rather than adding
a seventh permanent navigation destination.

### Deferred owner-led simplification

- After the functional and policy goals are stable, the owner reviews the whole
  application on the physical tablet and supplies one explicit list of disliked,
  verbose, redundant, or “AI-ish” interface elements.
- No speculative cleanup happens before that review. The final pass removes or
  shortens only owner-approved copy, icons, groupings, and visible information.
- Installation, validation, failure recovery, and destructive actions remain
  available, but technical explanation may move behind progressive disclosure
  instead of occupying the normal coffee-shop operator flow.

The current beta exposes confirmed device and synchronization settings from that
profile. Goal 05 replaces its convenience lock with individual staff identity:
owner, manager, and cashier each receive a private six-digit PIN; a locked
screen supports staff switching and appears after application/tablet restart.
It auto-locks after an owner-configurable five-minute default and imposes a
five-minute lockout after five failed attempts. Registered staff continue to
authenticate locally throughout an outage; a revocation reaches the tablet on
its next successful synchronization.

## POS workflow

### Starting an order

- The current order starts empty.
- Category selection and search only change the visible menu.
- Search, category changes, and cart edits happen locally and make no cloud
  request.
- Changing screens must not silently discard an unfinished order.

### Adding products

- Tapping a product adds one unit immediately.
- A product can offer sizes, milk types, syrups, extras, or other modifiers.
- Required choices must be selected before the line is accepted.
- Product availability is visible before the cashier adds it.
- The order line shows its product, selected options, quantity, unit price, and
  line total.

### Completing a sale

When the cashier confirms an order, the application:

1. Validates the order and calculates its totals.
2. Saves the complete sale locally in one operation.
3. Deducts the recipe quantities locally.
4. Starts a new receipt only after the local save succeeds.
5. Prints the receipt.
6. Synchronizes the sale to Convex in the background.

A cloud outage does not prevent a locally valid sale. The interface shows
whether the sale is synced or waiting to sync.

### Printing and recovery

- A sale is saved before printing begins.
- A printer error never recreates the sale.
- A failed print exposes `Reprint receipt`.
- Reprinting does not deduct stock again.
- A failed cloud sync retries later without cashier intervention.
- The cashier can see unsynced sales and the time of the last successful sync.

## Menu model

The menu is editable. Products are not permanently tied to the initial menu or
to four hardcoded database categories.

For the first POS screen, the supplied menu is organized into four practical
top-level groups:

1. **Coffee** — hot coffee, iced coffee, V60, coffee syrups, and coffee extras.
2. **Matcha & Tea** — matcha, hojicha, ube, milk choices, and related extras.
3. **Cold & Sweet** — frappes, lemonades, iced tea, soft ice cream, and desserts.
4. **Bakery & Savoury** — croissants, filled croissants, brioche, and savoury
   food.

The owner can later rename, reorder, hide, add, or archive categories.

### Product availability

A product may be:

- Available.
- Temporarily unavailable.
- Low stock.
- Archived.

Archiving is preferred to deletion because historical sales must keep their
product references.

### Sizes, options, and extras

The supplied menu includes reusable modifiers such as:

- Standard and plus sizes.
- Whole, lactose-free, oat, coconut, almond, and other vegetal milks.
- Syrups and flavours.
- Espresso shots, cold foam, ceremonial matcha, protein, honey, and cream.
- Soft ice cream or Magnum additions for relevant bakery products.

The owner must be able to set:

- Which modifier groups apply to a product.
- Whether a choice is required.
- Minimum and maximum selections.
- The price change caused by each option.
- Whether an option changes ingredient consumption.

## Recipes and fiche technique

The client's fiche technique is still being prepared. The application must
work with an incomplete menu first and allow recipes to be added later.

For each sellable product, the owner can define:

- Ingredients.
- Exact quantity of each ingredient.
- Measurement unit.
- Size-specific quantities.
- Modifier-specific additions or substitutions.
- The date or version from which the recipe becomes active.

Editing a recipe creates a new version. It does not rewrite the recipe attached
to previous sales.

### Product ingredient cost

- The current ingredient cost of a product is the sum of its recipe quantities
  multiplied by the current weighted-average cost of each ingredient.
- Product management shows selling price, ingredient cost, gross profit, and
  gross-margin percentage.
- Modifier ingredient effects contribute to the same calculation.
- Cups, lids, packaging, and other directly consumed items can be ordinary
  piece-based ingredients in a recipe.
- If any required ingredient lacks a usable cost, the product cost is marked
  incomplete and no complete margin is claimed.
- Rent, compensation, utilities, and other overhead are not arbitrarily divided
  across individual drinks in the first release.

## Stock behavior

### Receiving purchased stock

The owner or manager can receive an ingredient using its real purchase package.
A receipt records:

- Ingredient.
- Package label, such as carton, bag, bottle, or piece.
- Number of packages.
- Quantity in each package, converted to the ingredient's base unit.
- Price per package and total purchase price in integer centimes.
- Received date, actor, and optional note or supplier label.

For example, ten one-litre milk cartons at 20 MAD each add 10,000 millilitres
and 200 MAD of inventory value. New purchases update the ingredient's perpetual
weighted-average cost. Physical-count losses reduce inventory value using that
cost; a count increase uses the last known cost and is flagged if no cost is
available.

Purchase cash spending and ingredient cost consumed are different measures.
The Costs report shows both but never adds both into the same profit subtotal.

### Exact deduction

Completing a sale deducts the exact quantities defined by the active recipe.
Examples include millilitres of milk, grams of matcha, grams of coffee, syrup
quantities, packaging, or whole pieces.

### No theoretical waste model

The first version does not estimate waste, expected variance, or theoretical
versus actual usage. The client has stated that recipes are calculated and
wants the application to deduct those saved amounts.

Waste or breakage can still be entered as an explicit manual stock adjustment
when the business wants to record it.

### Stock movement history

Every stock change records:

- Ingredient.
- Quantity added or removed.
- Unit.
- Reason.
- Related sale or adjustment.
- User or device.
- Date and time.
- For a purchase, its package quantities, purchase price, cost effect, and
  resulting valuation.

Stock is never changed without leaving this history.

### Low stock

Each ingredient has an owner-configured low-stock threshold. The application
warns staff to complete the required daily low-stock review and contact the
owner outside the app; it never blocks a valid sale.

## Sales and reports

### Sales record

Each completed sale keeps a permanent snapshot of:

- Receipt number.
- Device-generated unique ID.
- Date and time.
- Cashier.
- Service mode.
- No customer or table details in the first production policy; these remain
  unavailable until a separately approved loyalty/customer feature.
- Products, quantities, modifiers, and notes.
- Product names and prices at the time of sale.
- Recipe version used for each line.
- Ingredient-cost snapshot and cost-completeness state for each line and sale.
- Subtotal, total, and payment method.
- Printing and synchronization state.
- Cancellation or refund references.

The first production policy has no tax calculation anywhere in the application,
and receipts show no tax line. Cash and card are the only payment methods.
Product-based split checkout completes one customer's selected products and
keeps unpaid products available for the next customer; it is not split tender.
Discounts remain unavailable until the owner separately approves a policy.

Receipts use the approved Olaso logo-only header until legal details are
requested, render in the currently selected French or English staff language,
and use `MMYY-0001` numbers (for example `0826-0001`). The sequence resets to
`0001` each month and is generated safely on the one local-first tablet.

A completed sale is never deleted. A cashier may make an offline, whole-sale,
same-calendar-day correction with a required reason, then enter a replacement
sale. The correction reverses the original saved effects exactly once. Card
corrections are recorded only; the app never calls a bank or terminal reversal.

### Required reports

The planned reports include:

- Sales totals by day, week, month, and custom period.
- Number of orders and average order value.
- Sales by product and category.
- Best-selling and slow-selling products.
- Sales by service mode and payment method.
- Ingredient consumption based on recipes.
- Ingredient cost consumed and gross profit.
- Current product ingredient cost, gross profit, and gross-margin percentage.
- Current stock and low-stock items.
- Inventory purchases and current inventory value.
- Stock additions, deductions, and manual adjustments.
- Worker compensation and other operating expenses.
- Monthly revenue, ingredient cost, gross profit, operating expenses, and
  operating profit.
- Cancelled or refunded sales.
- Cashier activity after roles are confirmed.

Reports must open from saved summaries and bounded pages. They must not scan the
complete sales history every time.

## Costs and profitability

### Cost layers

The application keeps these values distinct:

1. **Purchase cash spent** — the full cost of stock received during a period.
2. **Inventory value** — the cost still held in unused stock.
3. **Ingredient cost consumed** — the valued ingredients attached to completed
   sales during the period, also called cost of goods sold in the operational
   report.
4. **Worker compensation** — monthly compensation effective for the selected
   month.
5. **Other operating expenses** — rent, utilities, internet, maintenance,
   cleaning, marketing, equipment, and owner-defined categories.

The primary monthly profitability view is:

```text
sales revenue
  - ingredient cost consumed
= gross profit
  - worker compensation
  - other operating expenses
= operating profit
```

Inventory purchases and closing inventory value appear alongside this view as
cash and asset information. They are not subtracted again after ingredient cost
consumed, which would count the same stock twice.

### Staff compensation

- A staff profile identifies whether the person is an owner, manager, or
  worker independently of whether that profile can authenticate.
- Monthly compensation is optional. An owner or unpaid profile leaves it blank.
- Compensation is effective-dated so a later change does not rewrite previous
  months.
- Compensation and profitability details are owner-only. Development overrides
  never imply production access control.
- The Costs report reads the compensation schedule directly; it does not create
  a second manually duplicated salary expense.

### Other operating expenses

- An expense has a category, integer-centime amount, description, and effective
  date.
- It is either one-time or monthly recurring with optional end month.
- Editing a recurring amount creates a new effective period so historical
  reports remain stable.
- The first release provides an operational management report, not payroll,
  tax filing, bookkeeping, or an accounting-system replacement.

### Monthly reporting boundary

Costs and profitability are monthly first because compensation, rent, and most
overhead are monthly commitments. Existing sales reports may retain day, week,
month, and custom periods. A profitability result is marked incomplete when any
sale ingredient cost or required expense input is incomplete.

## Offline and synchronization behavior

- The installed APK contains its interface and product images.
- The installed APK also contains a curated gallery of right-sized category
  illustrations. Category management stores an artwork key chosen from that
  gallery; an approved neutral Olaso fallback covers every custom category that
  has no exact match.
- Creating a category never requires network access, runtime AI generation, or
  predicting every category name in advance. Gallery additions ship through a
  later application release; owner-uploaded artwork remains deferred.
- The tablet keeps the active menu, recipes, current stock, and unsynced sales
  locally.
- The application takes orders while offline.
- Cloud synchronization runs in the background when a connection exists.
- An unsynced sale remains visible until acknowledged by Convex.
- Retrying the same sale cannot create a duplicate.
- The first version assumes one active POS tablet, avoiding unnecessary
  multi-device conflict machinery.

Convex is the cloud record used for backup, remote reporting, and later
multi-device work. `ARCHITECTURE.md` defines the technical synchronization
rules.

## Distribution and updates

- The production application is an Android APK installed manually on the
  client's tablet.
- GitHub is the source of truth.
- A tagged release builds a signed APK through GitHub Actions.
- The APK is attached to a GitHub Release.
- The new APK is downloaded and installed over the existing application.
- Every release keeps the same application ID and signing key and increases the
  Android version number.
- Application data must survive an update.

Google Play is not part of the distribution plan. Android will require manual
confirmation for each APK update.

## Initial menu snapshot

This appendix transcribes the supplied menu images. It is an initial data
reference, not a permanent hardcoded catalog. Names, spelling, prices, tax
treatment, recipes, and availability must be confirmed by the owner before
production import.

All listed prices are in Moroccan dirhams (MAD).

### Coffee

#### Hot coffee and V60

| Product | Price |
| --- | ---: |
| Espresso | 10 |
| Espresso Blend | 18 |
| Cappuccino | 17 |
| Americano | 13 |
| Latte | 18 |
| Flat White | 18 |
| Nos Nos | 13 |
| Spanish Latte | 25 |
| Salted Caramel Latte | 28 |
| Mocha | 26 |
| V60 Hot | 45 |
| V60 Cold | 55 |

#### Iced coffee

| Product | Price |
| --- | ---: |
| Iced Coffee | 18 |
| Iced Latte | 22 |
| Iced Spanish Latte | 28 |
| Iced Toffee Latte | 25 |
| Iced Mocha Latte | 25 |
| Fredo Espresso | 37 |
| Iced Salted Caramel Latte | 29 |
| Iced Caramel Latte | 27 |
| Iced White Mocha Latte | 25 |
| Iced Nutella Latte | 29 |
| Iced Pistachio Latte | 35 |
| Iced Bueno Latte | 32 |

Coffee syrups shown in the menu: white chocolate, vanilla Madagascar, toffee
nut, hazelnut, caramel, chocolate, and agave.

Coffee extras shown in the menu: syrup 5, espresso blend 10, espresso shot 5,
honey 2, creme fraiche 3, lactose-free milk 5, and vegetal milk 10.

### Matcha, hojicha, and ube

#### Hot drinks

| Product | Price |
| --- | ---: |
| Matcha Latte | 28 |
| Matcha Latte Vanille | 35 |
| Spanish Matcha Latte | 32 |
| Matcha Latte Agave | 30 |
| Matcha Latte Pistachio | 38 |
| Matcha Latte Bueno | 35 |
| Matcha Protein | 45 |
| Hojicha Latte | 32 |

#### Iced matcha

| Product | Price |
| --- | ---: |
| Iced Matcha Latte | 32 |
| Iced Spanish Matcha Latte | 39 |
| Iced Vanilla Matcha Latte | 35 |
| Iced Strawberry Matcha Latte | 36 |
| Iced Pistachio Matcha Latte | 42 |
| Iced Mango Matcha Latte | 36 |
| Iced Protein Matcha Latte | 50 |
| Iced White Chocolate Matcha Latte | 35 |
| Iced Agave Matcha Latte | 40 |
| Iced Bueno Matcha Latte | 45 |

#### Iced hojicha and ube

| Product | Price |
| --- | ---: |
| Iced Hojicha Latte | 35 |
| Iced Vanilla Hojicha Latte | 40 |
| Iced Spanish Hojicha Latte | 45 |
| Iced Chocolate Hojicha Latte | 42 |
| Iced Caramel Hojicha Latte | 42 |
| Iced Ube Latte | 42 |
| Iced Spanish Ube Latte | 42 |
| Iced Vanilla Ube Latte | 42 |
| Iced Agave Ube Latte | 45 |

Matcha extras shown in the menu: ceremonial matcha 15, cold foam 10, vegetal
milk 10, and lactose-free milk 5. The plus size is shown as an additional 20.

### Frappes

| Product | Price |
| --- | ---: |
| Frappe Matcha | 50 |
| Frappe Signature Coffee | 35 |
| Frappe Oreo | 28 |
| Frappe Pistachio | 35 |
| Frappe Caramel | 30 |
| Frappe Bueno | 32 |
| Frappe Framboise | 29 |
| Frappe Chocolate | 26 |
| Frappe Lotus | 32 |
| Frappe Cerelac | 30 |

### Lemonades and iced tea

| Product | Price |
| --- | ---: |
| Mango Lemonade | 32 |
| Strawberry Lemonade | 32 |
| Fresquito Lemonade | 30 |
| Tropical Mango Colada | 30 |
| Strawberry Passion Lemonade | 30 |
| Coaracao | 30 |
| Mum's Lemonade | 25 |
| Tutti Oussama | 30 |
| Iced Tea | 34 |

House-made syrups shown in the menu: strawberry, mango, coconut, and Mum's
lemons. The plus size is shown as an additional 15.

### Soft ice cream

| Product | Price |
| --- | ---: |
| Vanille Madagascar / Yogurt | 20 |
| Dulce de Leche | 25 |
| Kunefe Pistachio | 35 |
| Oreo Hazelnut | 32 |
| Biscoff Lotus | 32 |
| Ceremonial Matcha | 40 |
| Bueno | 30 |
| Pistachio | 30 |
| Strawberry | 28 |
| Mango | 28 |
| Espresso | 28 |

A croissant addition is shown as an additional 20.

### Croissants

| Product | Price |
| --- | ---: |
| Pistachio Kunefe Croissant | 32 |
| Pistachio Croissant | 32 |
| Biscoff Croissant | 22 |
| Cheesecake Croissant | 25 |
| Dubai Croissant | 30 |
| Bueno Croissant | 22 |
| Banoffee Pie Croissant | 25 |
| Nutella Croissant | 18 |
| Savory Croissant | 20 |

Croissant extras shown in the menu: soft ice cream 20 and Magnum 25.

### Brioche

| Product | Description | Price |
| --- | --- | ---: |
| Spicy Tuna | Tuna, sriracha mayonnaise, red cheese | 34 |
| Shrimps Parm Brioche | Garlic cheese, shrimp, Parmesan | 49 |
| Morning Version | Smoked turkey, red cheese, scrambled eggs | 32 |

### Shared milk types

- Whole.
- Lactose free.
- Oat.
- Coconut.
- Almond.

## Delivery phases

Development proceeds through risk-ordered vertical slices. Each slice carries
one business or operational capability through pure rules, persistence,
synchronization, UI, recovery, and target-device verification. The project does
not build every page first or build a speculative complete backend before real
workflow feedback.

### Phase 1 — approved shell

- Match approved Pencil screen.
- Keep components and CSS separated.
- Establish the brand, design, product, and architecture documents.

### Phase 2 — working POS

- Real local cart and totals.
- Editable initial menu.
- Local order persistence.
- Order history and receipt preview.
- Mock printing.

### Phase 3 — cloud and stock

- Convex schema and authenticated functions.
- Background synchronization.
- Ingredients, recipe versions, and exact stock movements.
- Owner product and stock management.
- Reports backed by saved summaries.

### Phase 4 — costs and profitability

- Purchased-stock costs and weighted-average inventory valuation.
- Recipe, product, and historical sale cost snapshots.
- Staff compensation and one-time or recurring operating expenses.
- Monthly cost, gross-profit, and operating-profit reports.

### Phase 5 — Android and hardware

- Capacitor Android packaging.
- Signed APK release workflow.
- Native Ethernet/LAN ESC/POS bridge.
- Real tablet and printer testing.

### Phase 6 — production hardening

- Owner-led full-application critique and approved operator-UI simplification.
- Curated category artwork selection plus a neutral custom-category fallback.
- Final app icon and measured optional branded startup motion.
- Recovery and backup checks.
- Permission review.
- Performance and quota review.
- Endurance test during realistic service volume.
- Owner acceptance.

### Current execution order

Goal 01 delivered the functional POS, Goal 02 delivered the offline-capable
full-application beta, and Goal 03 delivered Android LAN receipt printing plus
safe saved-sale reprinting. Goal 04 delivered purchased-stock costing and
monthly profitability. Remaining work is sequenced by operational risk:

1. Confirmed business policy, production identity, and permissions: tax,
   payment, cancellation/refund, receipt, roles, and sensitive-data access.
2. Owner-led simplification, category artwork, measured startup/launch
   continuity, signing, backup/recovery, endurance testing, and final owner
   acceptance against the near-final APK.

Detailed goal status and activation order live in `WORK_LEDGER.md` and the
canonical `PLAN.md`.

## Explicit non-goals for the first release

- Google Play distribution.
- Multiple branches.
- Multiple simultaneous POS tablets.
- Delivery-platform integrations.
- Online customer ordering.
- Accounting-system integration.
- Payroll processing, tax filing, or statutory financial statements.
- Arbitrary allocation of rent, compensation, or overhead to individual drinks.
- Card-terminal integration.
- Artificially estimated waste.
- Forecasting or AI recommendations.
- A custom generic database abstraction that has only one implementation.

## Open owner decisions

- Official legal business name, address, and phone for the currently temporary
  logo-only receipt header.
- Production Android version and kiosk behavior.
- Production printer address reservation and raw TCP port confirmation.
- Official menu spelling and current prices.
- Future discount policy.
- Future loyalty/customer-record policy; customer details remain unavailable
  until that feature is explicitly approved.
- Final fiche technique and measurement units.
- Whether the owner needs a remote web dashboard.

## Product definition of done

The first production release is done when:

- The cashier can complete and recover orders without internet.
- Every valid completed sale is recorded exactly once.
- Stock deductions match the active recipe version.
- Received stock preserves purchase cost and inventory valuation history.
- Product and sale costs use checked recipe and weighted-average cost samples.
- Monthly profitability separates purchases, inventory, ingredient cost,
  compensation, and other expenses without double counting.
- The owner can edit menu and recipe data without code changes.
- Reports match a checked sample of real sales and stock movements.
- APK updates preserve application data.
- The physical tablet and printer pass the production test plan.
- The owner confirms the menu, receipt, permissions, and operational workflow.
