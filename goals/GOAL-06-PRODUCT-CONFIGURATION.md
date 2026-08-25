# Goal 06 Product Configuration Blueprint

This document defines the approved remaining product, size, choice, recipe,
stock, and ingredient-cost work inside Goal 06. `PRODUCT.md` owns business
behavior, `ARCHITECTURE.md` owns implementation boundaries, `DESIGN.md` owns
interaction rules, `PLAN.md` owns card order, and `WORK_LEDGER.md` owns status.

## Approved outcome

Each product owns its own sizes, choices, and exact ingredient recipes. The
owner can freely name and configure those choices without depending on shared
global groups or four permanently fixed Size/Milk/Syrup/Extras sections. A
cashier's actual selections determine the selling price, ingredients removed
from stock, ingredient cost, saved order, receipt, and historical reporting.

All authorized management and sales continue working without internet. Every
step must preserve existing products, orders, staff, stock history, pending
operations, printing, and the approved 1340 by 800 tablet layout.

## Product structure

A product has a name, optional category, availability, image, display order,
and at least one owned size. An existing product initially receives one
backward-compatible default size.

A size contains:

- An owner-chosen name.
- Its selling price in integer centimes.
- Its availability.
- Its own exact ingredient quantities and recipe version.

When a product has only one size, the cashier is not forced to make a pointless
size selection. With multiple sizes, the cashier selects one valid size.
Changing size can change price and the entire base ingredient recipe.

The owner may leave a recipe incomplete while preparing the menu. The existing
valid ordering behavior remains available, but costs must be identified as
incomplete rather than invented.

## Product-owned choices

Each product can have as many useful choice sections as needed, named by the
owner: Milk, Syrup, Flavour, Cream, Sweetness, Extra shot, or any other name.
These sections belong only to that product; editing them never unexpectedly
changes another product.

A choice section defines:

- Its name and display order.
- Whether it is required or optional.
- Whether the cashier selects one value or several.
- Minimum and maximum allowed selections.
- Optional default selections.
- Which product sizes can use it.

Each selectable value defines:

- Its name and display order.
- A selling-price adjustment, optionally different for each allowed size.
- Which sizes can use it.
- Zero, one, or several ingredient effects.

Instruction-only choices are valid: they can have no stock effect and no extra
charge. Ingredient choices can alter several ingredients together. The owner
sees meaningful actions, not raw negative quantities:

1. Add an ingredient and quantity.
2. Replace one ingredient with another at a defined quantity.
3. Set an ingredient to an exact quantity.
4. Remove an ingredient.
5. Make no stock change.

The final resolved recipe must never contain a negative quantity or conflicting
silent replacements. Size applicability, defaults, required selections,
minimums, maximums, prices, ingredient availability, and replacement targets
are validated before a sale is accepted.

## Required copying

`Copy choices from another product` is mandatory. It copies the selected
product's choice sections, values, selection rules, size applicability, prices,
and ingredient effects into independent records owned by the destination
product. Both products still refer to the same actual stock ingredients; only
their choice configurations are independent.

After copying, editing one product never changes the other. Matching size names
can be mapped automatically only when unambiguous. If the products have
different sizes or quantities, the owner resolves the missing assignment
before that copied choice becomes available. The app never guesses silently.

## Example: exact milk replacement

| Product configuration | Coffee | Whole milk | Almond milk |
| --- | ---: | ---: | ---: |
| Cappuccino Standard | 18 g | 200 ml | 0 ml |
| Cappuccino Plus | 20 g | 300 ml | 0 ml |
| Plus + Almond milk | 20 g | 0 ml | 300 ml |
| Plus + Almond milk + Extra shot | 38 g | 0 ml | 300 ml |

The almond option replaces the selected size's whole-milk quantity; it does
not deduct both milks. An extra shot adds 18 g of coffee. Selling price and
ingredient cost use the exact selected size and choices, not the ordinary
default configuration.

## Ingredient-only scope

- Product recipes contain actual drink or food ingredients only.
- Cups, lids, straws, containers, and other customer-facing packaging do not
  enter product recipes, per-product ingredient cost, or stock deduction.
- Ingredient purchasing can still use real supplier packages: for example,
  ten one-litre milk cartons at 20 MAD each. Purchase package math is not the
  same thing as adding a disposable cup to a product recipe.
- A house-made syrup is one ordinary ingredient. The owner enters its total
  quantity and total cost directly; no nested ingredient recipes, production
  batches, manufacturing workflow, or ingredients-of-ingredients are added.
- Example: 2,000 ml of house syrup costing 80 MAD makes a 10 ml serving cost
  0.40 MAD, using the existing ingredient valuation rules.
- Rent, wages, and other operating expenses remain separate reporting costs.

## Honest product costs

Different valid sizes and choices can produce different ingredient costs. The
product editor must not present one default recipe as the cost of every sale.
Where helpful, it may show a concise ingredient-cost range or an explicitly
incomplete state.

Do not add a detailed configuration preview, gross-profit table, margin
percentage, or simulated receipt inside Edit Product. The owner will decide
later where any deeper comparison belongs. Actual completed-sale profit and
reports continue using the immutable ingredient costs saved for the actual
size and choices sold.

## Offline and historical guarantees

- The existing Android Capacitor SQLite database remains the immediate source
  of truth. Reuse its protected staff authorization, serialized transactions,
  management operations, dependency ordering, acknowledgement mappings, and
  retry-safe cloud synchronization.
- Research current official Android and Capacitor guidance before each card.
  Do not add a state library, second database, native rewrite, generic rules
  engine, or other dependency without an independently proven need.
- Migrations are additive and backward-compatible until old products, pending
  operations, checkout, receipts, stock, reports, and cloud synchronization are
  proved against the new product-owned configuration.
- Every card leaves the installed application usable. Temporary compatibility
  reads or projections may remain until the final verified switchover; no
  half-migrated checkout or silent data loss is acceptable.
- One deterministic calculation resolves selected size, choices, final price,
  exact ingredient quantities, and exact cost. Checkout and trusted cloud
  validation must agree; existing immutable sale snapshots remain historical
  truth after later product edits or deletion.
- A completed sale saves product name, selected size, selected choices,
  selling price, final ingredient quantities, valuation, cost completeness,
  and receipt data in the same transaction as its stock deduction.
- Cancellation and reprint reuse the saved sale snapshot; they never recalculate
  from a later-edited recipe or apply a second stock deduction.

## Card order

This separate configuration sequence begins only after the existing DELETE-01,
navigation, startup, recovery, release, and security cards are complete. It
must finish before the owner's final manual visual review and release
acceptance.

### OPTIONS-01 — Product-owned sizes and recipe foundation

- Record current official Android/Capacitor research and inspect all existing
  catalog, checkout, sync, migration, permissions, and historical callers.
- Add the smallest backward-compatible local/cloud model for product-owned
  sizes, exact size recipes, owned choice sections, selectable values, and
  typed ingredient effects.
- Give each existing product one safe default size and preserve current shared
  choice behavior until the owner editor and checkout can consume the new
  independent records.
- Preserve existing and pending sales, products, ingredients, protected staff,
  outbox order, cloud mappings, valuation, receipts, and historical reports.
- Add focused migration/validation checks. On the Galaxy Tab A9, install over
  the existing app and prove current sales, existing data, offline use, restart,
  and reconnect still work before marking the card done.

### OPTIONS-02 — Custom owner choices and independent copying

- Replace the fixed Size/Milk/Syrup/Extras controls with the actual sizes and
  owner-created choice sections belonging to the selected product.
- Support named sizes and prices, size-specific recipes, custom choice labels,
  required/optional rules, single/multiple selections, defaults, limits,
  ordering, size applicability, selling-price adjustments, and safe ingredient
  effects through concise owner-facing controls.
- Implement mandatory `Copy choices from another product` with independent
  destination records, shared real ingredient references, safe size matching,
  and no accidental change to the source product.
- Keep existing POS behavior working through an explicit compatibility bridge
  until OPTIONS-03 activates the new checkout calculation.
- Remove the misleading Edit Product gross-profit/margin block. If cost is
  shown, use only a concise honest ingredient-cost range or incomplete state;
  detailed comparison placement remains an owner decision for later.
- Verify owner/manager editing, cashier rejection, copying independence,
  offline creation/editing, restart, ordered reconnect, and the complete
  1340 by 800 physical-tablet layout.

### OPTIONS-03 — Exact cashier selections, stock, and sale snapshots

- Make POS use the selected product size and its own valid choices; hide the
  selector for a single size and enforce defaults, requirements, limits, and
  size applicability before a line is accepted.
- Resolve the exact price and ingredient list once, including replacement,
  addition, removal, exact quantity, multiple ingredient effects, instructions,
  and size-specific price or quantity changes.
- Save the resolved result and deduct only the actual ingredients atomically;
  extend immutable sale snapshots and trusted synchronization without changing
  old historical orders or duplicating local/cloud effects.
- Verify the Cappuccino Standard/Plus, whole/almond/oat milk, extra-shot,
  multi-effect, and instruction-only cases in focused checks and on the real
  tablet, including offline sale, restart, reconnect, reprint, and cancellation.

### OPTIONS-04 — Exact costs, reconciliation, and legacy closeout

- Calculate an honest bounded ingredient-cost range across valid size/choice
  combinations; mark unknown ingredient valuation or incomplete recipes as
  incomplete instead of fabricating certainty.
- Keep manually priced house syrup as an ordinary ingredient. Confirm product
  recipes exclude cups, lids, and other disposable packaging.
- Confirm actual selected ingredients, inventory valuation, completed-sale
  costs, stock history, gross profit, and monthly reports reconcile exactly.
- Remove obsolete shared mutable choice behavior only after every existing
  product, outstanding operation, legacy sale, and migration path is safe.
- Complete focused automated checks and the physical offline, restart,
  reconnect, permissions, copy-independence, stock, cost, cancellation, receipt,
  migration, clean-log, and regression matrix.

### Earlier dependency — DELETE-01

The owner directed completing permanent removal in the existing original plan
before this separate product-configuration sequence. The later OPTIONS cards
must preserve category reassignment, ingredient repair, staff access removal,
immutable sales and financial history, and the final-owner protection delivered
by DELETE-01. The detailed deletion contract remains in the main Goal 06 plan.

## Official professional references

- Square item variations and modifiers:
  https://developer.squareup.com/docs/catalog-api/enable-modifiers-on-items
- Square catalog structure:
  https://developer.squareup.com/docs/catalog-api/design-a-catalog
- Toast item modifier and selection rules:
  https://doc.toasttab.com/openapi/menusv3/tag/Data-definitions/schema/ModifierGroup/
- Lightspeed item ingredients and exact quantities:
  https://k-series-support.lightspeedhq.com/hc/en-us/articles/1260804604870-Creating-and-editing-items
- Android offline-first architecture:
  https://developer.android.com/topic/architecture/data-layer/offline-first
- Existing Capacitor SQLite transaction guidance:
  https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md
