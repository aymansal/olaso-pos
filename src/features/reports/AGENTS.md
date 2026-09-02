# Reports Feature DOX

## Purpose

Provides live saved report summaries, trend visualization, product
performance, ingredient usage, and bounded period controls.

## Ownership

- `ReportsScreen.tsx` composes the summary and analytics panels.
- `ReportsAnalyticsPanel` owns local Sales, Products, Stock Usage, and
  role-appropriate Costs tab selection plus the shared period calendar.
- `CostsPanel` owns adding expenses and monthly pay. Every saved expense and
  compensation record is reachable through the card's internal row scrolling;
  the page layout never grows. Managers see expenses;
  owners also add compensation. Profit is not shown on this tab.
- `ReportSummaryPanel` and `SalesTrendChart` own the right-card facts and the
  current-month chart. The Products right rail is two Dashboard-like cards
  (categories and products) on the cream surface. Stock usage lists used
  ingredients once per ingredient, summed. Used-ingredient rows are compact
  (between the original tall rows and the extra-tight size) and the card
  scrolls when they overflow. Bars are that ingredient’s period usage
  against remaining on-hand stock (`used / (used + on-hand)`), never against
  another ingredient.
  The chart always shows the current calendar month with thin day bars, no
  peak photograph, round Y-axis numbers (integer ticks for units and usage),
  and a daily average divided by days elapsed this month; the period calendar filters the hero and
  right-card facts. The Sales profit card shows stock value, orders, and
  average. Costs stay add-only on the left card and use the shared global report
  period rather than a second month picker. Monthly pay rows can be stopped.
  Deleting a staff profile ends open wage on the prior day and keeps already-
  recorded wage history.

## Local Contracts

- Report metrics and charts read bounded summaries; they must not trigger
  unbounded historical scans.
- Reports opens on This week (Monday through today). One application data hook
  requests a one-to-31-day saved-summary range for the selected calendar
  period; a second bounded read fills the current-month chart. If this tablet
  has more completed sales in that range than the cloud snapshot, the tablet
  receipts win so today’s unsynced sales still appear. Changing the
  calendar keeps the previous totals visible but dimmed while the new range
  loads, then swaps to the new totals with a soft fade on the data areas
  only; panel chrome, headers, tabs, and the calendar never move. A failed
  reload clears the stale snapshot to the error state.
- Export stays off the report until a real format and destination are
  approved.
- Stock-usage and product tabs must share the established report shell rather
  than duplicate it.
- Keep ingredient base units separate; never invent a cross-unit stock total.
- Offline Reports derive the selected one-to-31-day period from bounded saved
  tablet receipts and movements and never remain on a cloud loading state.
  Offert drinks still count as units sold; their product and category money is
  0. Daily net uses the charged sale total.
  Online Reports use Convex saved summaries, then prefer this tablet’s saved
  receipts when they contain more completed sales for the selected range.
- Expense and compensation saves appear immediately from SQLite. Compensation
  and profitability are never rendered for a non-owner role.
- Monthly wages and monthly expenses are divided across the days of each
  calendar month and included for the days inside the selected report period.
  One-time expenses count on their recorded date.
- Wage and recurring-expense changes use exact effective dates. A correction or
  stop never recalculates days before that date.
- Historical ingredient/category reports and worker compensation keep their
  saved names after the corresponding live record is permanently deleted.

## Work Guidance

- Keep metrics centered and chart labels readable at the target viewport.
- Prefer stored daily summaries and bounded detail; add pagination only when a
  confirmed report outgrows the current cap.
- Do not add a general analytics pipeline without a confirmed report it serves.

## Verification

- Run `npm run build`.
- Run `npm run check:reports` after report query or aggregation changes.
- Inspect Reports at 1340 × 800, checking summary alignment, tab states, chart
  labels, legends, and product rows.

## Child DOX Index

No child DOX files.
