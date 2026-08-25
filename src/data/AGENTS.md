# Application Data DOX

## Purpose

Owns the application data boundary: Convex providers and feature hooks plus the
tablet's local SQLite operational record.

## Ownership

- `usePosData.ts` hydrates the POS from the local operational cache and asks
  the shared worker to synchronize after a committed sale. Receipt language
  comes from the App-owned saved terminal preferences, not another POS read.
- `useOrdersData.ts` renders the bounded local history page before remote work
  settles, requests cloud pages only while Orders is mounted, merges rows by
  the sale idempotency key while preserving tablet-local print state, and
  coordinates deliberate retry/reprint recovery through the shared worker.
- `useDashboardData.ts` makes one saved-summary snapshot request only while
  Dashboard is mounted and exposes explicit retry state.
- `useReportsData.ts` makes one saved-summary range request only while Reports
  is mounted or its period changes, and exposes explicit retry state.
- `useInventoryManagement.ts` and `useCostManagement.ts` render from SQLite,
  commit authorized writes locally first, refresh after the shared worker, and
  never call Convex directly.
- `useSettingsData.ts` loads local device/sync state, saves validated non-secret
  preferences, delegates deliberate Sync to the shared worker, and coordinates
  explicit printer test/logo-setup actions without claiming paper state.
- `terminalSettings.ts` owns immutable device identity, terminal label, clock
  format, validated local printer endpoint, local lock state, sync summary, and
  safe failure copy.
- `secureSession.ts` owns the Android-only protected-storage wrapper for opaque
  session tokens and offline PIN verifiers; ordinary SQLite settings never hold
  credentials.
- `connectionContext.tsx` owns the single Android-validated connection state,
  foreground visibility, and resume recheck; it does not synchronize
  application data.
- `AppDataProvider.tsx` owns the local-database readiness gate and Convex client
  lifetime. Its cream surface with one green wordmark and bouncing dots matches
  Android's plain-cream native splash and the static pre-React document without
  delaying readiness. Normal loading never shows `Starting Olaso…`.
  An immediate browser offline hint may close transport early, while Android
  validated state remains authoritative for application behavior.
- `reconnectContext.tsx` owns the authenticated single-flight outbox worker,
  cache refresh gate, and visible-hook completion revision.
- `offlineViews.ts` owns bounded tablet-only Products/Stock detail and
  Dashboard/Reports fallback reads; it never performs management writes.
- `identitySession.ts` derives and persists one protected local session/PIN
  verifier/attempt-state record per provisioned staff profile after successful
  sign-in; it also promotes an offline-created profile's protected verifier and
  returned cloud session without retaining the raw PIN. It never exposes those
  values through ordinary local data contracts.
- `localStaff.ts` owns owner-only local profile creation/deletion plus its
  PIN-free management operations; `staffSync.ts` owns protected credential
  provisioning, cloud acknowledgement, local/cloud profile-session promotion,
  and protected cleanup only after earlier actor-owned work has synchronized.
- `orderHistory.ts` owns the keyset SQLite sale reader, saved receipt/print-state
  parsing, sync summary, and retry reset.
- `localSales.ts` owns trusted sale preparation, the atomic local commit,
  immutable receipt snapshots, and outbox acknowledgement/failure state.
- `localManagement.ts` owns the shared local-first management operation
  persistence: atomic outbox enqueue, optional parent dependency, cloud
  acknowledgement plus local/cloud record mappings, and safe retry/failure
  updates. Domain cards still own their business validation and record changes.
- `localInventory.ts` owns ingredient, purchase, valuation, and stock-
  adjustment transactions. `localCosts.ts` owns expense/compensation writes;
  `localCostViews.ts` owns bounded role-scoped reads and cloud snapshot merging.
  `inventorySync.ts` and `costSync.ts` own their reconnect dispatch boundaries.
- `managementOperation.ts` owns the plain operation envelope, bounded payload
  and protected-field validation, actor/role permission validation, saved-row
  parsing, and safe operator-facing sync-failure classification.
- `operationSession.ts` resolves each queued operation's original local/cloud
  profile and returns that profile's protected session arguments; the staff
  member who happens to reconnect never replaces the saved actor.
- `printState.ts` owns persisted pending/printed/failed sale print attempts;
  `receiptPrinting.ts` coordinates one post-commit attempt and never calls sale
  or stock creation logic.
- `operationalCache.ts` owns the bounded cloud-to-local menu, category artwork
  key, modifier, recipe, and stock snapshot.

## Local Contracts

- Keep React components free of SQL, synchronization, and secret handling.
- Evolve SQLite only through ordered migrations; never rewrite a released
  migration.
- Store money in integer centimes and ingredient quantities in integer base
  units.
- Commit related local sale, stock, and outbox effects in one transaction.
- Commit each management domain change, immutable management-operation record,
  and outbox entry in one serialized transaction. A dependency remains blocked
  while its parent outbox row exists; acknowledgement deletes only the parent
  outbox row and preserves its audit/mapping record.
- Category, product, ingredient, and staff deletion removes the live record
  immediately without deleting immutable sale, recipe, movement, purchase, or
  compensation history. Earlier dependent sales/corrections synchronize first;
  later destructive operations depend on the latest pending operational
  descendant of that sale so category/ingredient/product revisions stay ordered.
  Historical category, product, ingredient, and staff names are owned by their
  saved records rather than a removable live foreign key.
- Management operation types use the `management.` prefix. Enforce the local
  actor's cumulative role permission before commit and let Convex enforce it
  again during synchronization. Never store a raw PIN or session secret in a
  management payload.
- New sales and corrections persist their originating profile ID. Management,
  sales, and corrections synchronize with that profile's protected session;
  legacy label-only rows may use the active session only when its name matches.
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
  retry, with a bounded saved-tablet fallback offline; never poll or subscribe
  while the screen is hidden.
- Reports reads use one bounded saved-summary request per selected range or
  deliberate retry, with a one-to-31-day saved-tablet fallback offline; tab
  switches remain local and never start another query.
- Retained visible-screen hooks reload only for their first safe snapshot,
  an actual authenticated reconnect revision, changed request inputs, or a
  deliberate user action. Showing an already-loaded React Activity never
  starts another SQLite/cloud request; hidden effects are cleaned up and
  previous safe Dashboard/Reports/Orders content remains visible on refresh.
- Never refresh cloud catalog data over pending local management work. Pending
  or failed sales keep their immutable snapshots and stock deltas but must not
  freeze category/product/modifier/recipe refreshes indefinitely.
- Operational catalog/inventory dependencies are ordered separately from
  finance work. A failed expense or compensation never blocks an eligible sale
  or operational cache refresh; a sale still waits for catalog/inventory data
  used by its saved product, recipe, ingredient, or valuation.
- Managers may read saved expenses but never compensation/profitability rows.
  Only owners may query or render individual compensation and monthly profit.
- Treat the shared connection context as display/readiness state only. The one
  reconnect worker owns automatic outbox and cache work.
- Cloud clients, reads, and reconnect work require both validated internet and
  a visible and focused foreground activity. A visible document behind the
  Samsung keyguard/notification shade is still hidden operationally and must
  not open or retry a WebSocket.
- Complete cloud replacement snapshots prune absent catalog, ingredient, staff,
  expense, and compensation copies by actual snapshot membership, never by a
  shared timestamp. Pending local operations, actor access, immutable recipes,
  and stock/sale/wage/audit history remain untouched.
- Automatic sync reads only pending rows, releases only classified connection
  failures after a real reconnect, and retains business failures. Manual Sync
  is the deliberate all-failure recovery action.
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

- Run `npm run check:local`, `npm run check:local-management`,
  `npm run check:local-catalog`,
  `npm run check:local-inventory-costs`,
  `npm run check:local-staff`,
  `npm run check:sales`, `npm run check:settings`,
  `npm run check:reconnect`, `npm run check:offline`, `npx tsc -b`, and
  `npm run build`.
- Run `npm run android:sync` after changing Capacitor configuration or native
  plugin dependencies.
