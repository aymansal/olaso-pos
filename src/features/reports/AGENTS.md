# Reports Feature DOX

## Purpose

Provides saved report summaries, trend visualization, product performance, and
the presentation shell for alternate report tabs.

## Ownership

- `ReportsScreen.tsx` composes the summary and analytics panels.
- `ReportSummaryPanel` owns period selection and high-level summary.
- `ReportsAnalyticsPanel`, `ReportsKpiStrip`, `SalesTrendChart`, and
  `ProductPerformanceTable` own analytics regions.
- `data/reportsData.ts` owns current static report fixtures.

## Local Contracts

- Report metrics and charts read bounded summaries; they must not trigger
  unbounded historical scans.
- Date ranges and tabs change presentation only until report queries exist.
- Export actions are visual only until a real export format is approved.
- Stock-usage and product tabs must share the established report shell rather
  than duplicate it.

## Work Guidance

- Keep metrics centered and chart labels readable at the target viewport.
- Prefer stored daily summaries and paginated detail when backend work begins.
- Do not add a general analytics pipeline without a confirmed report it serves.

## Verification

- Run `npm run build`.
- Inspect Reports at 1340 × 800, checking summary alignment, tab states, chart
  labels, legends, and product rows.

## Child DOX Index

No child DOX files.
