# Dashboard Feature DOX

## Purpose

Provides the owner's operational overview: sales pulse, stock warnings, and
recent orders.

## Ownership

- `DashboardScreen.tsx` composes the page. The shared Header lives in App.
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
- Offline Dashboard uses bounded saved tablet sales and stock warnings; it does
  not claim the complete cloud-wide total.
- Online Dashboard uses Convex saved summaries; still-unsynced tablet sales are
  not mixed into those totals; `offlineViews` remain the offline tablet-only
  path.
- Today’s best seller is the product with the most units sold, online and
  offline. A quiet today still compares against yesterday when yesterday had
  sales.
- The pulse chart is the latest 12 calendar days ending today. Tomorrow the
  leftmost day drops off and today stays on the right.
- `View all` on recent orders opens Orders. `View all` on Needs attention
  opens Stock filtered to Low stock.

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
