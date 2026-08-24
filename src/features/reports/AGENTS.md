# Reports Feature DOX

## Purpose

Provides live saved report summaries, trend visualization, product
performance, ingredient usage, and bounded period controls.

## Ownership

- `ReportsScreen.tsx` composes the summary and analytics panels.
- `ReportsAnalyticsPanel` owns local Sales, Products, Stock Usage, and
  role-appropriate Costs tab selection plus native date/period controls.
- `CostsPanel` owns saved monthly costs and opens the separate expense and
  compensation dialogs. Managers see expenses and purchase cash; owners also
  see compensation and profitability.
- `ReportSummaryPanel`, `ReportsKpiStrip`, `SalesTrendChart`, and
  `ProductPerformanceTable` own prop-driven analytics regions.

## Local Contracts

- Report metrics and charts read bounded summaries; they must not trigger
  unbounded historical scans.
- One application data hook requests a one-to-31-day saved-summary range;
  tabs change presentation locally without another backend call.
- Export actions remain disabled until a real format and destination are
  approved.
- Stock-usage and product tabs must share the established report shell rather
  than duplicate it.
- Keep ingredient base units separate; never invent a cross-unit stock total.
- Offline Reports derive the selected one-to-31-day period from bounded saved
  tablet receipts and movements and never remain on a cloud loading state.
- Expense and compensation saves appear immediately from SQLite. Compensation
  and profitability are never rendered for a non-owner role.

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
