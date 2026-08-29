# Orders Feature DOX

## Purpose

Provides bounded order history and a selected order's receipt-style detail.

## Ownership

- `OrdersScreen.tsx` composes the list and detail panels.
- `OrdersListPanel` owns filters, date controls, and the orders table.
- `OrdersTable` owns order rows and selection presentation.
- `OrderDetailPanel` owns the selected order summary and actions.
- `useOrdersData` supplies merged local/cloud sale snapshots and recovery state
  through the application data boundary.

## Local Contracts

- Preserve selection between the list and detail panel.
- The date picker and quick periods remain compact and open toward available
  screen space.
- History reads are bounded and paginated. The pager uses the saved SQLite
  order count; each page click loads that OFFSET window of six rows. Next on
  the last page stays there.
- Show immutable receipt snapshots and the local/cloud sync state without
  reconstructing current product data.
- Receipt preview, deliberate sync retry, and local saved-snapshot reprint are
  functional. Reprint updates only print-attempt state. Cancellation and refund
  remain unavailable until confirmed owner policy authorizes them.

## Work Guidance

- Keep filters and table behavior in the list panel rather than the screen.
- Keep receipt detail presentation independent from printer transport.
- Disable reprint for cloud-only history that has no local immutable snapshot
  row on this tablet.
- Do not implement cancellation as deletion.
- Keep the shared receipt preview prop-driven and transport-free.

## Verification

- Run `npm run build`.
- Run `npm run check:orders` after history, snapshot, pagination, or recovery
  changes.
- Inspect Orders at 1340 × 800 with the date picker closed and open; check table
  alignment, panel fit, and no overflow.

## Child DOX Index

No child DOX files.
