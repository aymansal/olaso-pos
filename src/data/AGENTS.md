# Application Data DOX

## Purpose

Owns the application data boundary: Convex providers and feature hooks plus the
tablet's local SQLite operational record.

## Ownership

- `usePosData.ts` hydrates the POS from the local operational cache and
  coordinates bounded cloud refresh plus sale retries.
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
- Re-read trusted product, modifier, recipe, and ingredient data inside the
  local sale transaction; never persist UI-provided prices or deductions.
- Represent offline sale usage as a signed local stock delta over the cached
  cloud balance so low stock never blocks a valid sale.
- Keep operational and outbox reads explicitly bounded.
- Never refresh cloud cache data over pending local outbox work.
- Web development uses the same SQL through `jeep-sqlite`; it is not a second
  persistence architecture.
- Keep `sql.js` pinned to the version recorded in `ARCHITECTURE.md`.

## Verification

- Run `npm run check:local`, `npm run check:sales`, `npx tsc -b`, and
  `npm run build`.
- Run `npm run android:sync` after changing Capacitor configuration or native
  plugin dependencies.
