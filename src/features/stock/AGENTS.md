# Stock Feature DOX

## Purpose

Provides live ingredient inventory, low-stock status, stock selection,
ingredient lifecycle actions, exact adjustments, and append-only movement
history.

## Ownership

- `StockScreen.tsx` composes inventory/detail panels and owns screen filters,
  selection, pagination, and dialog state.
- `StockInventoryPanel` and `StockTable` own stock discovery and rows.
- `StockDetailPanel` owns the selected ingredient detail.
- `StockIcon` owns stock item icon presentation.
- `IngredientDialog` owns create/edit/archive/restore interaction.
- `StockAdjustmentDialog` owns receive and physical-count interaction.
- `stockManagementTypes.ts` defines plain feature records and actions;
  `stockPresentation.ts` formats exact quantities at the display edge.
- `src/data/useInventoryManagement.ts` is the application data boundary that
  maps Convex records and mutations into these plain feature contracts.

## Local Contracts

- Convex stores stock as integers in each ingredient's base unit; presentation
  helpers may scale those exact integers only for display.
- Status always includes text or an icon; never rely on color alone.
- Every receive, opening balance, and count correction appends a movement and
  updates the balance atomically through the data hook.
- Components stay prop-driven and never import Convex.
- Archived ingredients remain available to history and can be restored.
- Do not add theoretical-waste or inventory-valuation claims without confirmed
  product contracts and source data.

## Work Guidance

- Keep summary metrics compact and centered within their cards.
- Keep stock list/table behavior separate from selected-item detail.
- Do not add deduction or adjustment calculations to React components.
- Keep all list/detail reads bounded and pagination client-side only within the
  bounded inventory snapshot.

## Verification

- Run `npm run build`.
- Run `npm run check:inventory` after inventory domain changes.
- Inspect Stock at 1340 × 800, including centered metrics, status clarity, table
  alignment, detail-panel fit, dialogs, and movement history.

## Child DOX Index

No child DOX files.
