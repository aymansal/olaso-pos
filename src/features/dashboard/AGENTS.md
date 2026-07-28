# Dashboard Feature DOX

## Purpose

Provides the owner's operational overview: sales pulse, stock warnings, and
recent orders.

## Ownership

- `DashboardScreen.tsx` composes the page and shared Header.
- `SalesPulse`, `StockAttentionPanel`, and `RecentOrdersPanel` own the three
  dashboard regions.
- `data/dashboardData.ts` owns current static dashboard fixtures.

## Local Contracts

- Keep the dashboard summary-first; detailed work belongs in Orders, Stock, or
  Reports.
- Preserve the approved dashboard frame in `untitled.pen` and the shared
  navigation geometry.
- Dashboard data is presentation-only until the reporting/data layer exists.

## Work Guidance

- Reuse report and stock vocabulary from `PRODUCT.md`.
- Keep chart drawing inside the chart-owning component and its CSS Module.
- Do not introduce live subscriptions or historical scans from this feature.

## Verification

- Run `npm run build`.
- Inspect Dashboard at 1340 × 800, including metric alignment, charts, stock
  rows, and recent orders.

## Child DOX Index

No child DOX files.
