# Stock Feature DOX

## Purpose

Provides ingredient inventory, low-stock status, stock selection,
ingredient lifecycle actions, exact adjustments, and append-only movement
history.

## Ownership

- `StockScreen.tsx` composes inventory/detail panels and owns screen filters,
  selection, pagination, and dialog state.
- `StockInventoryPanel` and `StockTable` own stock discovery and rows.
- `StockDetailPanel` owns selected-ingredient editing, stock facts, and
  movement history, like Edit Product.
- `IngredientDialog` owns create-only Add ingredient.
- `StockAdjustmentDialog` owns receive and physical-count interaction.
- `stockManagementTypes.ts` defines plain feature records and actions;
  `stockPresentation.ts` formats exact quantities at the display edge.
- `src/data/useInventoryManagement.ts` is the application data boundary that
  maps the saved SQLite record and local-first operations into these plain
  feature contracts; reconnect synchronization stays outside the feature.

## Local Contracts

- Convex stores stock as integers in each ingredient's base unit; presentation
  helpers may scale those exact integers only for display.
- Status always includes text or an icon; never rely on color alone.
- Every receive, opening balance with paid price, and count correction appends
  a movement and updates the balance atomically through the data hook.
  Creating an ingredient with opening quantity requires the price paid; that
  quantity is the first purchase. Empty-shelf create uses quantity 0.
- Components stay prop-driven and never import Convex.
- Confirmed ingredient deletion preserves purchase, movement, recipe, and
  report history; removes active recipe/choice references; and marks affected
  products unavailable until their recipe is repaired.
- Do not add theoretical-waste or inventory-valuation claims without confirmed
  product contracts and source data.
- Offline reads use saved ingredients plus bounded local movement, purchase,
  and recipe-link detail instead of waiting for Convex.
- Internet state never disables a valid ingredient, threshold, purchase,
  delete, or stock-adjustment form.
- All stock levels means all active ingredients. Ordinary lists exclude leftover
  archived rows; there is no ingredient archive action.
- The inventory table opens on the first visible ingredient. Pagination shows
  the same sliding three-page window as Orders, with a fixed page of seven
  equal-height rows that do not stretch. Unit-group and stock-level
  filters use the shared in-app list menu, not the Android native select.
  Ingredient names sit at the left without an icon; remaining headers,
  including STATUS, sit centered over their values. Selected rows use the
  same green leading mark as Products. Rows show the ingredient name only;
  the unit group column already names the family. Used today is this café’s
  recipe deductions for the current business date only: the larger of this
  tablet’s saved completed-sale movements by ingredient name and unit, or
  today’s cloud summary plus still-unsynced local sales. On-hand includes
  deductions queued on a mapped local duplicate of the same ingredient.
  Title-row counts are
  not shown. The search field matches the 36-pixel All units / All stock
  levels outline with 12-pixel type. Edit ingredient is the right card:
  Ingredient title aligned with Healthy/Delete, name and threshold fields,
  stock level, several recent movements, then Adjust count / Receive with
  padding above Save. It does not show a Stock details or Ingredient
  information heading, inventory value, linked recipes, or per-sale recipe
  quantities.

## Work Guidance

- Keep summary metrics compact on the Stock inventory title row.
- Keep stock list/table behavior separate from selected-item detail.
- Do not add deduction or adjustment calculations to React components.
- Keep all list/detail reads bounded and pagination client-side only within the
  bounded inventory snapshot.

## Verification

- Run `npm run build`.
- Run `npm run check:inventory` after inventory domain changes.
- Inspect Stock at 1340 × 800, including title-row metrics, status clarity, table
  alignment, detail-panel fit, dialogs, and movement history.

## Child DOX Index

No child DOX files.
