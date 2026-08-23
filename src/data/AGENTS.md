# Application Data DOX

## Purpose

Owns the application data boundary: Convex providers and feature hooks plus the
tablet's local SQLite operational record.

## Ownership

- `usePosData.ts` hydrates the POS from the local operational cache and
  coordinates bounded cloud refresh plus sale retries.
- `useOrdersData.ts` renders the bounded local history page before remote work
  settles, requests cloud pages only while Orders is mounted, merges rows by
  the sale idempotency key while preserving tablet-local print state, and
  coordinates deliberate sync/reprint recovery.
- `useDashboardData.ts` makes one saved-summary snapshot request only while
  Dashboard is mounted and exposes explicit retry state.
- `useReportsData.ts` makes one saved-summary range request only while Reports
  is mounted or its period changes, and exposes explicit retry state.
- `useSettingsData.ts` loads local device/sync state, saves validated non-secret
  preferences, performs one bounded synchronization attempt per deliberate
  action, and coordinates explicit printer test/logo-setup actions without
  claiming paper state.
- `terminalSettings.ts` owns immutable device identity, terminal label, clock
  format, validated local printer endpoint, local lock state, sync summary, and
  safe failure copy.
- `secureSession.ts` owns the Android-only protected-storage wrapper for opaque
  session tokens and offline PIN verifiers; ordinary SQLite settings never hold
  credentials.
- `identitySession.ts` derives and persists one protected local session/PIN
  verifier/attempt-state record per provisioned staff profile after successful
  sign-in; it never exposes those values through ordinary local data contracts.
- `orderHistory.ts` owns the keyset SQLite sale reader, saved receipt/print-state
  parsing, sync summary, and retry reset.
- `localSales.ts` owns trusted sale preparation, the atomic local commit,
  immutable receipt snapshots, and outbox acknowledgement/failure state.
- `printState.ts` owns persisted pending/printed/failed sale print attempts;
  `receiptPrinting.ts` coordinates one post-commit attempt and never calls sale
  or stock creation logic.
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
- Treat the unauthenticated Lock-screen server profile list as read-only. Only
  after a successful online sign-in may its complete bounded result reconcile
  the local staff directory and remove stale protected access. If that result
  is unavailable, upsert only the authenticated profile and preserve all
  others.
- Persist only safe operator sync-failure descriptions; never store raw server
  responses in SQLite or surface them to the application.
- Device ID is immutable after first setup. Manual sync releases local retry
  backoff, processes at most 10 sales, and performs one fresh bounded snapshot
  request only after the outbox is empty.
- Printer host/port remain non-secret local settings. Validate IPv4 and port at
  the persistence boundary; an empty or corrupt endpoint can never start a
  native connection.
- A new sale starts with pending print state inside its atomic commit. Attempt,
  success, and bounded failure diagnostics update only print columns in later
  serialized transactions.
- Web development uses the same SQL through `jeep-sqlite`; it is not a second
  persistence architecture.
- Keep `sql.js` pinned to the version recorded in `ARCHITECTURE.md`.

## Verification

- Run `npm run check:local`, `npm run check:sales`, `npm run check:settings`,
  `npx tsc -b`, and `npm run build`.
- Run `npm run android:sync` after changing Capacitor configuration or native
  plugin dependencies.
