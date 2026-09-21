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

- Dashboard display text is unselectable, including chart details and all
  states. Preserve normal selection/copy/paste for editable text fields.
- Keep the dashboard summary-first; detailed work belongs in Orders, Stock, or
  Reports.
- Preserve the approved dashboard frame in `untitled.pen` and the shared
  navigation geometry.
- Missing, loading or failed snapshots never show zero or stale totals as current.
  Zero is reserved for a successfully loaded empty result.
- Chart tap labels match Reports: compact exact amount only, no repeated visible
  date or selected-column fill. Retain full date/amount in the button's accessible
  name and keyboard focus outline. Keep the value centered over every bar,
  including the first and last; do not push edge labels inward. Axis
  abbreviations are display-only.
  Escape and focus leaving the chart dismiss selection.
- Chart and summary are named groups. Keep the stock/order status containers
  mounted before their messages change; routine loading/unavailable updates
  announce politely rather than interrupting speech in several panels at once.
- Child regions stay prop-driven and render loading, empty, error, and live
  states without importing Convex.
- Offline Dashboard uses bounded saved tablet sales and stock warnings; it does
  not claim the complete cloud-wide total.
- Online Dashboard uses Convex saved summaries, with the saved-tablet snapshot
  shown temporarily while a newer local completed sale still waits for
  acknowledgement; totals are never added together; `offlineViews` remain the
  offline tablet-only path.
- Today’s best seller is the product with the most units sold, online and
  offline. A quiet today still compares against yesterday when yesterday had
  sales.
- The pulse chart is the latest 12 calendar days ending today. Tomorrow the
  leftmost day drops off and today stays on the right.
- `View all` on recent orders opens Orders. `View all` on Needs attention
  opens Stock filtered to Low stock.
- Recent orders use the owner's two-line hierarchy: number/amount, then
  time/service. Omit item count and routine Completed; retain Cancelled.
  Both View all actions are borderless navigation controls with 48px hit height.

## Work Guidance

- Reuse report and stock vocabulary from `PRODUCT.md`.
- Keep chart drawing inside the chart-owning component and its CSS Module.
- Do not introduce live subscriptions or historical scans from this feature.

## Verification

- Run `npm run build`.
- Run `npm run check:dashboard` after summary, warning, recent-order, or
  Dashboard data-boundary changes, against a disposable development backend.
  It reseeds that backend. For presentation-only changes, verify isolated real
  components with sample props instead of resetting retained records.
- Inspect Dashboard at 1340 × 800, including metric alignment, charts, stock
  rows, and recent orders.

## Child DOX Index

No child DOX files.
