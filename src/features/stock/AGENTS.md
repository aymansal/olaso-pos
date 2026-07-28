# Stock Feature DOX

## Purpose

Provides ingredient inventory, low-stock status, stock selection, and selected
ingredient detail presentation.

## Ownership

- `StockScreen.tsx` composes inventory and detail panels.
- `StockInventoryPanel` and `StockTable` own stock discovery and rows.
- `StockDetailPanel` owns the selected ingredient detail.
- `StockIcon` owns stock item icon presentation.
- `data/stockData.ts` owns current static inventory fixtures.

## Local Contracts

- Stock is expressed in each ingredient's base unit and displayed at the edge.
- Status always includes text or an icon; never rely on color alone.
- Future stock changes create append-only movements; they are not silent value
  overwrites.
- Current controls and quantities are presentation fixtures only.

## Work Guidance

- Keep summary metrics compact and centered within their cards.
- Keep stock list/table behavior separate from selected-item detail.
- Do not add deduction or adjustment calculations to React components.

## Verification

- Run `npm run build`.
- Inspect Stock at 1340 × 800, including centered metrics, status clarity, table
  alignment, and detail-panel fit.

## Child DOX Index

No child DOX files.
