# Dashboard Feature DOX

## Purpose

Provides the owner's operational overview: sales pulse, stock warnings, and
recent orders.

## Ownership

- `DashboardScreen.tsx` composes the page and shared Header.
- `SalesPulse`, `StockAttentionPanel`, and `RecentOrdersPanel` own the three
  dashboard regions.
- `useDashboardData` supplies one bounded saved-summary snapshot through the
  application data boundary.

## Local Contracts

- Keep the dashboard summary-first; detailed work belongs in Orders, Stock, or
  Reports.
- Preserve the approved dashboard frame in `untitled.pen` and the shared
  navigation geometry.
- Child regions stay prop-driven and render loading, empty, error, and live
  states without importing Convex.
- `View all` opens Orders; detailed stock and reporting work remains in its
  owning screen.

## Work Guidance

- Reuse report and stock vocabulary from `PRODUCT.md`.
- Keep chart drawing inside the chart-owning component and its CSS Module.
- Do not introduce live subscriptions or historical scans from this feature.

## Verification

- Run `npm run build`.
- Run `npm run check:dashboard` after summary, warning, recent-order, or
  Dashboard data-boundary changes.
- Inspect Dashboard at 1340 × 800, including metric alignment, charts, stock
  rows, and recent orders.

## Child DOX Index

No child DOX files.
