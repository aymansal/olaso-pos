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

- Preserve selection between the list and detail panel. The Orders table uses
  the same cream sliding row highlight as Products and Stock, without the
  green mark. Column headers are centered over the values in that column.
  Date and time live on one line in a compact DATE column before STATUS
  (`dd/mm/yy` then time), with the DATE header centered over that pair; the
  order-number cell is the receipt number only. The list and selected-order
  detail do not show customer or table. Service and created time sit on one
  line in the detail card. Payment shows subtotal and total, plus Offert when
  the saved discount is greater than zero, and each saved tender's amount
  given and change. Those rows hug the totals on a simple receipt and grow
  only for split tenders, then scroll above Reprint and Cancel. Payment and
  actions stay pinned to the bottom of the card so completed and cancelled
  receipts do not shift the layout.
- The date picker and quick periods remain compact and open toward available
  screen space. Search, All/Completed/Cancelled, and All dates share one
  42-pixel outline with 12-pixel type.
- History reads are bounded and paginated. The pager uses the saved SQLite
  order count; each page click loads that OFFSET window of eight equal-height
  rows. The showing-count and pager sit on one line near the card bottom.
  Next on the last page stays there.
- Show immutable receipt snapshots and the local/cloud sync state without
  reconstructing current product data.
- Reprint and whole-sale cancellation are the detail actions. Receipt preview
  stays on POS after checkout. Failed sync is visible as status copy; Settings
  Manual Sync is the recovery action. Cancellation is not deletion.

## Work Guidance

- Keep filters and table behavior in the list panel rather than the screen.
- Keep receipt detail presentation independent from printer transport.
- Disable reprint for cloud-only history that has no local immutable snapshot
  row on this tablet.
- Do not implement cancellation as deletion.

## Verification

- Run `npm run build`.
- Run `npm run check:orders` after history, snapshot, pagination, or recovery
  changes.
- Inspect Orders at 1340 × 800 with the date picker closed and open; check table
  alignment, panel fit, and no overflow.

## Child DOX Index

No child DOX files.
