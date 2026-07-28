# Application Data DOX

## Purpose

Owns the application data boundary: Convex providers and feature hooks plus the
tablet's local SQLite operational record.

## Ownership

- `usePosData.ts` hydrates the POS from the local operational cache and
  coordinates bounded cloud refresh plus sale retries.
- `useOrdersData.ts` renders the bounded local history page before remote work
  settles, requests cloud pages only while Orders is mounted, merges rows by
  the sale idempotency key, and coordinates deliberate retry.
- `useDashboardData.ts` makes one saved-summary snapshot request only while
  Dashboard is mounted and exposes explicit retry state.
- `useReportsData.ts` makes one saved-summary range request only while Reports
  is mounted or its period changes, and exposes explicit retry state.
- `useSettingsData.ts` loads local device/sync state, saves validated non-secret
  preferences, and performs one bounded synchronization attempt per deliberate
  action.
- `terminalSettings.ts` owns immutable device identity, terminal label, clock
  format, local lock state, sync summary, and safe failure copy.
- `orderHistory.ts` owns the keyset SQLite sale reader, saved receipt parsing,
  sync summary, and retry reset.
- `localSales.ts` owns trusted sale preparation, the atomic local commit,
  immutable receipt snapshots, and outbox acknowledgement/failure state.
- `operationalCache.ts` owns the bounded cloud-to-local menu, modifier, recipe,
  and stock snapshot.

## Local Contracts

- Keep React components free of SQL, synchronization, and secret handling.
- Evolve SQLite only through ordered migrations; never rewrite a released
  migration.
- Store money in integer centimes and ingredient quantities in integer base
  units.
- Commit related local sale, stock, and outbox effects in one transaction.
- Serialize transactions on the shared SQLite connection; callers may start
  concurrently but `BEGIN`/`COMMIT` boundaries may not overlap.
- Re-read trusted product, modifier, recipe, and ingredient data inside the
  local sale transaction; never persist UI-provided prices or deductions.
- Represent offline sale usage as a signed local stock delta over the cached
  cloud balance so low stock never blocks a valid sale.
- Keep operational and outbox reads explicitly bounded.
- Page local sale history by the created-time keyset index and keep public cloud
  history page sizes at 20 or fewer.
- Dashboard reads use one bounded snapshot request on mount or deliberate
  retry; never poll or subscribe while the screen is hidden.
- Reports reads use one bounded saved-summary request per selected range or
  deliberate retry; tab switches remain local and never start another query.
- Never refresh cloud cache data over pending local outbox work.
- Device ID is immutable after first setup. Manual sync releases local retry
  backoff, processes at most 10 sales, and performs one fresh bounded snapshot
  request only after the outbox is empty.
- Web development uses the same SQL through `jeep-sqlite`; it is not a second
  persistence architecture.
- Keep `sql.js` pinned to the version recorded in `ARCHITECTURE.md`.

## Verification

- Run `npm run check:local`, `npm run check:sales`, `npm run check:settings`,
  `npx tsc -b`, and `npm run build`.
- Run `npm run android:sync` after changing Capacitor configuration or native
  plugin dependencies.
