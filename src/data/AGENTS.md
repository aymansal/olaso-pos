# Application Data DOX

## Purpose

Owns the application data boundary: Convex providers and feature hooks plus the
tablet's local SQLite operational record.

## Ownership

- `usePosData.ts` hydrates the POS from the local operational cache and asks
 the shared worker to synchronize after a committed sale. Receipt language
 comes from the App-owned saved terminal preferences, not another POS read. It
 also supplies the POS quick-add ranking with the same load, so a committed
 sale refreshes it without another screen-level read.
- `useOrdersData.ts` reads the saved SQLite order count plus one OFFSET page
  before remote work settles, enriches matching keys from the first cloud page
  while Orders is mounted, preserves tablet-local print state, and coordinates
  reprint and cancellation through the shared worker.
- `useDashboardData.ts` makes one saved-summary snapshot request only while
  Dashboard is mounted, uses the current local business date on each visible
  load, and exposes explicit retry state.
- `useReportsData.ts` makes one saved-summary range request only while Reports
  is mounted or its period changes, including profile-owned orders, units, and
  net sales, and exposes explicit retry state.
- `useInventoryManagement.ts` and `useCostManagement.ts` render from SQLite,
  commit authorized writes locally first, and refresh after the shared worker.
  Stock used-today is today’s recipe deductions grouped by ingredient name and
  unit; while online it keeps the larger of that local total and today’s
  one-call saved-summary plus still-unsynced local sales so the column survives
  reinstall without shrinking behind a stale cloud figure. Displayed on-hand
  includes stock deltas from a mapped local duplicate of the same ingredient.
  Cost management never calls Convex directly.
- `useSettingsData.ts` loads local device/sync state, saves validated non-secret
  preferences, delegates deliberate Sync to the shared worker, coordinates
  explicit printer test/logo-setup actions without claiming paper state, and
  owns Check for update / Update / Later against the HTTPS manifest channel.
- `appUpdate.ts` owns manifest parsing, checksum expectations, and the Android
  AppUpdate plugin boundary; it never embeds a download credential.
- `terminalSettings.ts` owns immutable device identity, terminal label, clock
  format, validated local printer endpoint, local lock state, sync summary, and
  safe failure copy. `pendingSyncCount` is pending and failed
  `sale-completed` / `sale-cancelled` outbox rows, not all outbox types.
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
  cache refresh gate, and visible-hook completion revision. A local sale or
  cancellation bumps that revision so Stock used-today and other retained
  screens reload when shown. Automatic runs
  start only after local POS paint (double rAF + idle callback); manual Sync
  remains immediate. Each batch still attempts eligible sales after staff,
  catalog, and inventory work. `perform` throws the existing connection or
  access sentence when internet is not validated, the activity is not focused,
  or staff provisioning is still pending; it must not return a successful empty
  sync.
- An intentionally cancelled refresh on lock/background/session change rejects
  as unavailable without persisting a false sync failure. Genuine storage or
  business failures still follow the normal error-recording path.
- `offlineViews.ts` owns bounded tablet-only Products/Stock detail,
 Dashboard/Reports fallback reads, and the POS quick-add ranking over the last
 seven business days; it never performs management writes. Stock used-today
 groups completed-sale movements by live ingredient name and unit, then keeps
 `max(local, cloud + unsynced)`. On-hand folds mapped local-duplicate
 `local_stock_delta` into the visible row. Report used-ingredient on-hand is
 looked up by name and unit, not the movement’s ID. Quick add ranks by
 units sold, the same rule as the Dashboard best seller. Offert lines still
 count units; product and category money use the charged 0, not catalog line
 totals.
- `identitySession.ts` derives and persists one protected local session/PIN
  verifier/attempt-state record per provisioned staff profile after successful
  sign-in; it also promotes an offline-created profile's protected verifier and
  returned cloud session without retaining the raw PIN. It never exposes those
  values through ordinary local data contracts.
  Owner PIN changes reuse this protected boundary: pending credentials change
  locally, and provisioned credentials change only after cloud acknowledgement.
  All per-profile protected values are replaced in one native encrypted commit;
  after a cloud PIN acknowledgement, any local persistence failure clears that
  profile's protected copy rather than leaving the old PIN usable offline.
  PIN changes, provisioning, sign-in, and authenticated directory cleanup share
  one credential queue. Staff snapshots never lower a saved identity revision;
  stale directory revisions cannot invalidate newer protected access.
- Profile application language is saved locally first. Reconnect pushes that
  local value before pulling the cloud directory, and offline staff
  provisioning carries the same value through the local-ID/cloud-ID promotion.
- `localStaff.ts` owns owner-only local profile creation/deletion plus its
  PIN-free management operations; `staffSync.ts` owns protected credential
  provisioning, cloud acknowledgement, local/cloud profile-session promotion,
  and protected cleanup only after earlier actor-owned work has synchronized.
- `orderHistory.ts` owns the keyset SQLite sale reader, saved receipt/print-state
  parsing, sync summary, and retry reset.
- `localSales.ts` owns trusted sale preparation, the atomic local commit,
  immutable receipt snapshots, and outbox acknowledgement/failure state.
  Offert lines keep catalog prices on the snapshot, write 0 charged money to
  `sale_items`, and set `discountCentimes`. Optional tenders store each
  payment's method and due, plus amount given/change for cash; their dues must
  sum to the sale total.
- `localSaleQuote.ts` captures the SQLite catalog when payment starts and keeps
  one private quote across an in-process lock. UI receives a display copy and
  opaque ID; completion validates the unchanged cart, maps promoted IDs, and
  combines quoted prices/recipes with fresh ingredient valuations. Saved lines
  carry catalog evidence for cloud fingerprint verification, never a UI price
  override. Release the quote on unpaid dismissal or successful sale commit;
  process-death draft recovery is not provided.
- `localManagement.ts` owns the shared local-first management operation
  persistence: atomic outbox enqueue, optional parent dependency, cloud
  acknowledgement plus local/cloud record mappings, and safe retry/failure
  updates. Domain cards still own their business validation and record changes.
- `localProductConfiguration.ts` owns local-first product-size and choice-section
  replacement, safe size deletion, and independent choice copying.
- `localCatalog.ts` creates a new product and its active default Regular size
  in one local transaction; the size operation depends on the product operation
  so a newly saved product is immediately sellable offline and after sync.
- `localInventory.ts` owns ingredient, purchase, valuation, and stock-
  adjustment transactions. Opening quantity with a paid price is committed as
  the first purchase in the same transaction.
- `localCosts.ts` owns exact-date expense/compensation writes, including owner
  stop of an open monthly-pay period; `localCostViews.ts` owns bounded role-scoped
  reads and cloud snapshot merging. Its public cost reader holds the shared
  transaction queue across all pages and aggregates; direct database readers
  stay usable inside an already-owned transaction. Finance page collection and
  queued replacement entry recheck current foreground, connection, and session
  so an interrupted fetch never replaces saved costs. `inventorySync.ts` and `costSync.ts` own
  their reconnect dispatch boundaries.
- `dailyOwnerReport.ts` composes the owner-only current-day report from bounded
  saved SQLite/report data, grouping every completed order and product under its
  saved profile (or `Unattributed` when no profile ID exists), and sends its
  deterministic bytes through the shared printer transport.
- `managementOperation.ts` owns the plain operation envelope, bounded payload
  and protected-field validation, actor/role permission validation, saved-row
  parsing, and safe operator-facing sync-failure classification.
- `operationSession.ts` prefers each queued operation's original protected
  session; if that session is missing, the currently signed-in profile may
  authorize sync when it still holds the required permission.
- `printState.ts` owns persisted pending/printed/failed sale print attempts;
  `receiptPrinting.ts` coordinates one post-commit attempt and never calls sale
  or stock creation logic.
- `operationalCache.ts` owns the bounded cloud-to-local menu, category artwork
  key, recipe, product-owned size/choice, and stock snapshot.
  Ordinary snapshot reads share the serialized transaction queue so readers
  cannot observe replacement's temporary archived/absent rows. An explicitly
  supplied transaction connection reads directly; never enqueue it again.
- `src/lib/productConfiguration.ts` owns the pure size/choice/recipe resolver.
  Checkout and trusted cloud validation must call the same resolution; React
  components never compute stock or price from choices.

## Local Contracts

- Keep React components free of SQL, synchronization, and secret handling.
- Evolve SQLite only through ordered migrations; never rewrite a released
  migration. Schema 22 stores an optional compressed product JPEG data URL
  (`image_jpeg`); do not queue raw camera files. A cloud catalog snapshot that
  omits a product JPEG must not clear a JPEG already saved on this tablet.
  Schema 23 stores each staff profile's preferred application language.
  Schema 24 adds exact start/end dates for recurring expenses and compensation.
- Store money in integer centimes and ingredient quantities in integer base
  units.
- Commit related local sale, stock, and outbox effects in one transaction.
- Commit each management domain change, immutable management-operation record,
  and outbox entry in one serialized transaction. A dependency remains blocked
  while its parent outbox row is pending; a failed or missing parent does not
  hide the child. Acknowledgement deletes only the parent outbox row and
  preserves its audit/mapping record.
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
- New sales and corrections persist their originating profile ID. Sync prefers
  that profile's protected session; if it is unavailable, the active signed-in
  profile may authorize the transport when it has the required permission.
  Sale cashier names stay on the local receipt and are sent to Convex.
- Serialize transactions on the shared SQLite connection; callers may start
  concurrently but `BEGIN`/`COMMIT` boundaries may not overlap.
  PIN changes and staff provisioning/acknowledgement share a credential queue;
  resolve fresh profile mappings inside it rather than trusting a dialog snapshot.
- Re-read trusted product, recipe, choice, and ingredient data inside the
  local sale transaction; never persist UI-provided prices or deductions.
  Payment quotes are captured from SQLite before taking payment and retained
  privately across in-process locks. Their display copy is not trusted input.
  Quoted sales retain original catalog facts, validate the exact original cart,
  and use current ingredient valuations at completion. Cloud synchronization
  identifies the authoritative live or archived configuration by fingerprint;
  it never accepts a supplied price override.
- Represent offline sale usage as a signed local stock delta over the cached
  cloud balance so low stock never blocks a valid sale.
- Keep operational and outbox reads explicitly bounded.
- Page local sale history with the created-time index: COUNT plus LIMIT/OFFSET
  for a numbered page, keyset for sequential reads. Keep public cloud history
  page sizes at 20 or fewer.
- Dashboard reads use one bounded snapshot request on mount or deliberate
  retry, with a bounded saved-tablet fallback offline; never poll or subscribe
  while the screen is hidden. Online reads request the cloud snapshot and the
  saved-tablet snapshot concurrently and show the tablet snapshot only when it
  has strictly more completed current-day sales; they never add the two
  totals.
- Reports reads use one bounded saved-summary request per selected range or
  deliberate retry, with a one-to-31-day saved-tablet fallback offline; tab
  switches remain local and never start another query. Changing the range
  keeps the previous totals visible but dimmed while the new range loads and
  swaps to the new totals when they arrive; a failed reload clears the stale
  snapshot to the error state. The selected range
  prefers this tablet’s saved receipts when they contain more completed sales
  than the cloud snapshot, so unsynced today sales still appear. When local and
  cloud sales totals match exactly, local immutable profile attribution replaces
  only the cloud profile breakdown, preserving older profile-owned sales whose
  cloud daily metrics predate staff IDs. Used-ingredient
  bars overlay this tablet’s on-hand stock by name and unit.
- Online All reports collect cloud daily summaries through legal page-by-page
  pagination (`getAllSummaryPage`, one `.paginate()` per call, the data layer
  follows cursors to `isDone`) and aggregate them into the unchanged report
  shape; `getAllSummaryStock` supplies the bounded live-ingredient overlay.
  Offline All counts every completed unit from an independent SQL aggregate
  (never the top-20 product list), splits mixed-tender sales by their exact
  saved tenders, and keeps legacy single-method receipts on their top-level
  payment method.
- Cloud-backed totals overlay this device's pending cancellations with the same
  reversal calculation used at acknowledgement; an already cancelled cloud sale
  is never subtracted twice. Other devices' valid sales remain included.
- Costs aggregate monthly sales in SQL and page complete expense/compensation
  histories. Hold the local transaction queue for the entire multi-page read.
  Cloud finance replacement starts only after all pages succeed in the same
  foreground authenticated context; never prune from a partial result.
- Online Dashboard uses Convex saved summaries, with the saved-tablet
  snapshot shown temporarily while a newer local completed sale still waits
  for acknowledgement; totals are never mixed by addition; `offlineViews`
  remain the offline tablet-only path.
- Retained visible-screen hooks reload only for their first safe snapshot,
  an actual authenticated reconnect revision, changed request inputs, or a
  deliberate user action. Showing an already-loaded React Activity never
  starts another SQLite/cloud request; hidden effects are cleaned up and
  previous safe Dashboard/Reports/Orders content remains visible on refresh.
- Never refresh cloud catalog data over pending local management work. Pending
  or failed sales keep their immutable snapshots and stock deltas but must not
  freeze category/product/recipe/choice refreshes indefinitely.
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
- When internet is validated, a corrupt protected record for an already-cloud
  profile may be cleared and rebuilt by successful online PIN authentication.
  Never clear a corrupt still-local pending profile as an online fallback.
- Persist only safe operator sync-failure descriptions; never store raw server
  responses in SQLite or surface them to the application. Convex extra-field /
  validator rejects persist `Cloud rejected this saved order. Use Sync now to retry.`
  and stay failed until Manual Sync; automatic reconnect retries only the
  connection sentence.
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
  `npm run check:audit`,
  `npm run check:local-catalog`,
  `npm run check:local-inventory-costs`,
  `npm run check:local-staff`,
  `npm run check:product-configuration`,
  `npm run check:sales`, `npm run check:settings`,
  `npm run check:reconnect`, `npm run check:offline`, `npx tsc -b`, and
  `npm run build`.
- Run `npm run android:sync` after changing Capacitor configuration or native
  plugin dependencies.
