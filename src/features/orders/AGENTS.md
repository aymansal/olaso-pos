# Orders Feature DOX

## Purpose

Provides bounded order history and a selected order's receipt-style detail.

## Ownership

- `OrdersScreen.tsx` composes the list and detail panels.
- `OrdersListPanel` owns filters, date controls, and the orders table.
- `OrdersTable` owns order rows and selection presentation.
- `OrderDetailPanel` owns the selected order summary and actions.
- `data/ordersData.ts` owns current static order fixtures.

## Local Contracts

- Preserve selection between the list and detail panel.
- The date picker and quick periods remain compact and open toward available
  screen space.
- Reprint, cancellation, payment, and sync controls are visual only until their
  application operations exist.
- Future history reads must be paginated as required by `ARCHITECTURE.md`.

## Work Guidance

- Keep filters and table behavior in the list panel rather than the screen.
- Keep receipt detail presentation independent from printer transport.
- Do not implement cancellation as deletion.

## Verification

- Run `npm run build`.
- Inspect Orders at 1340 × 800 with the date picker closed and open; check table
  alignment, panel fit, and no overflow.

## Child DOX Index

No child DOX files.
