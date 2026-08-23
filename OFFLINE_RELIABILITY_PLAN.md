# Olaso Offline Reliability Ledger

**Status:** active owner-led reliability work. This is not a Goal 06 activation.

**Purpose:** make the tablet dependable through an outage: every provisioned
staff member can unlock locally, sales remain local-first, and a returning real
internet connection safely brings the application back in sync.

This is the working ledger for this narrow topic. It records decisions, actual
evidence, work done, mistakes to avoid, and the next action. `PRODUCT.md` owns
the operator behaviour and `ARCHITECTURE.md` owns the technical boundaries.

## Non-negotiable rules

- Never store a raw PIN in React state beyond immediate entry, SQLite, logs,
  exports, source control, or ordinary application settings.
- Keep offline PIN verifiers and session material in Android Keystore-backed
  protected storage only.
- Never delete or overwrite one staff member's offline record because a
  different staff member signs in.
- A locally committed sale, stock deduction, receipt snapshot, and outbox entry
  remain one atomic SQLite operation. Reconnection must never create a second
  sale or stock movement.
- Do not replace the operational cache while local outbox work is pending.
- Treat actual validated internet access as online. Wi-Fi association alone is
  not enough: it may be a captive portal or have no internet.
- No background cloud action requiring staff authority while the terminal is
  locked. The connection label may update while locked.
- Keep the normal UI quiet. Do not add a dashboard of technical connection
  controls. The existing manual Sync remains a recovery fallback.
- Every behaviour claim needs a physical Galaxy Tab A9 test. A test that has
  not happened stays recorded as unverified.

## Toolchain and card-test protocol

### Verified local Android tools

- Java 21: `D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10`
- Android SDK: `D:\Olaso\tmp\android-toolchain\android-sdk`
- ADB: `D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe`
- Connected test tablet: `R8YX91AKWXJ` — Samsung Galaxy Tab A9 `SM-X115`,
  Android API 36.
- Installed package baseline before OFF-01 diagnosis: `com.olaso.pos`
  `0.1.0-beta.1`, last installed 2026-08-23 12:09:11.

### Required proof before a card is marked done

1. Record the card's exact scenario, device state, and safe observed result in
   the Journal.
2. For a read-only diagnosis card: record the tablet reproduction and safe ADB,
   Android, or WebView evidence; do not claim a fix.
3. For source, data, or native changes: run the smallest focused checks, then
   `npm run build`, and any required Android check/sync/beta build.
4. Install the newly built APK on the connected tablet and repeat the specific
   physical scenario. Check relevant Android/WebView logs without recording
   credentials or protected values.
5. Record files changed, checks, tablet result, failures, and the exact next
   action before moving to another card.

No card is considered complete because code compiles alone. It must have the
appropriate physical-tablet evidence.

## Confirmed owner decisions

| ID | Decision | Status |
| --- | --- | --- |
| OFF-DEC-01 | Each provisioned staff profile can unlock this tablet offline. | approved |
| OFF-DEC-02 | Each staff member performs one successful online sign-in on this tablet before their offline unlock is available. | approved |
| OFF-DEC-03 | A new online sign-in replaces only that same profile's protected offline record; every other profile remains available. | approved |
| OFF-DEC-04 | On a return of real internet access, the application updates connectivity everywhere, safely syncs pending local work, refreshes the menu/cache only after the outbox is empty, then refreshes the visible screen when appropriate. | approved |
| OFF-DEC-05 | The lock screen must immediately show the true connection state, but it does not perform staff-authorized cloud work while locked. | approved |

## Verified facts and open questions

### Verified facts

- The tablet has local SQLite operational data, locally committed sales and
  stock effects, and an outbox for unsynchronized work.
- The current implementation stores a separate protected offline session, PIN
  verifier, and failed-attempt record for each provisioned staff-profile ID. A
  later online sign-in replaces only that same profile's protected record.
- The current lock screen reads cached staff profiles from SQLite for offline
  startup. While online, a bounded server read may supply sign-in choices, but
  only the successfully authenticated profile is upserted into the local cache.
- The current lock screen checks native network status at mount and responds to
  browser `online` / `offline` events. It has no Android network-change
  listener, so Android Wi-Fi changes can leave the displayed state stale.
- The POS and Orders data paths have separate limited online-event retries;
  there is no one application-wide reconnect worker.

### User-reported production-like failure — not yet diagnosed

- A staff profile whose PIN is six ones had previously been used on the tablet.
  After the app was closed, Wi-Fi was disabled, and the app was reopened, that
  profile could not unlock with the same PIN.
- The UI showed: “Unable to unlock. Check the connection and try again.”
- That generic message is not an acceptable diagnosis. It is not proof that
  the PIN is wrong, that the profile lacks provisioning, or that SQLite data is
  missing.

### Still unverified

- A full offline POS sale on the current installed build.
- Reconnection without closing the application.
- Exact-once upload of an offline sale after Wi-Fi returns.
- Offline unlock for more than one provisioned staff profile.

## Work cards

### OFF-01 — Diagnose the current offline-unlock failure

**Status:** complete — physical reproduction identified a stale-profile-ID
mismatch between protected session material and the local staff cache.

**Objective:** identify the actual failing layer behind the generic unlock
message before changing the existing credential design.

**Do:**

1. Preserve the tablet's current app data. Do not clear app storage, reinstall,
   reset credentials, or create replacement staff profiles to make the failure
   disappear.
2. Reproduce the owner’s exact flow on the physical tablet: confirm the target
   staff profile online, close the app, disable internet, reopen, choose that
   profile, and enter the PIN privately on the tablet.
3. Capture only safe diagnostic evidence: lock-screen state, Android/WebView
   error category, native protected-storage result, selected profile identity,
   and whether the local staff cache/session/verifier exists. Never capture or
   print the PIN, verifier, session token, or encrypted value.
4. Classify the cause precisely: missing protected record, selected-profile
   mismatch, failed PIN verification, lockout, corrupt protected state, native
   plugin failure, false online detection, or another explicit cause.
5. Record the exact reproduction result and safe evidence in this journal.

**Must not do:**

- Do not weaken the PIN check, introduce a default PIN, bypass authentication,
  or silently fall back to an online request while offline.
- Do not implement multi-profile storage until the current failure is known.

**Acceptance evidence:** one reproducible cause with a safe error category;
the focused regression test for this precise mismatch is required as the first
test in OFF-02 before its implementation is accepted.

**Next action:** await owner authorization to start OFF-02.

### OFF-02 — Store protected offline access per staff profile

**Status:** complete — Owner and Samira each retain independent protected
offline access; authenticated directory refresh removes stale choices without
allowing locked-screen reconciliation.

**Objective:** replace the single offline identity record with independently
protected records for every staff member provisioned on this tablet.

**Required behaviour:**

1. A successful online sign-in for profile A creates or replaces only profile
   A’s protected session, PIN verifier, identity revision, and failed-attempt
   state.
2. Profile B, C, and all other provisioned staff records remain unchanged.
3. Offline unlock verifies the selected profile against that profile’s own
   record, not against whichever person signed in most recently.
4. The staff list remains sourced from the bounded SQLite operational cache;
   protected credentials never move into that cache.
5. An offline-unprovisioned person receives a direct message such as “This
   profile must sign in online once before offline access is available,” not a
   misleading generic connection error.
6. Wrong PIN and five-attempt lockout apply to the selected profile only.

**Design safeguards:**

- Prefer one protected record per profile over a global JSON list so one
  profile’s update cannot corrupt another profile’s verifier.
- Keep the profile identifier and cached identity revision beside the protected
  record; never use a display name as a credential key.
- A PIN change, archived profile, or revoked identity removes only that
  profile’s protected material at the next successful authorized refresh.
- Treat partial writes, corrupt records, and unavailable Keystore access as
  explicit safe failures. Do not erase other profiles as recovery.
- Preserve the current Android monotonic-clock lockout protection.

**Acceptance evidence:** provision at least two staff profiles online; force
close; disable internet; unlock both profiles independently; prove that an
online re-sign-in for one leaves the other functional offline.

### OFF-03 — Make offline sales an observed, proven flow

**Status:** pending.

**Objective:** verify the already intended local-first sales path before
changing reconnection automation.

**Do:**

1. With a provisioned staff member unlocked offline, complete one normal sale.
2. Confirm the local receipt, local sale row, stock deduction, print state, and
   one pending outbox entry exist before internet returns.
3. Confirm app close/reopen preserves that sale and its pending state.
4. Do not use test data that could be mistaken for real service data; label the
   test and remove it only through the approved correction path if required.

**Acceptance evidence:** a real tablet test proves one offline sale survives
restart and is waiting to synchronize, without claiming cloud success yet.

### OFF-04 — Establish one accurate application-wide connection state

**Status:** pending.

**Objective:** replace fragmented browser-event detection with a shared source
of truth based on Android-validated internet availability.

**Required behaviour:**

1. The existing Android connectivity boundary reports initial status and emits
   a change only when validated internet availability changes.
2. A small root-level React connection provider/hook exposes that state to the
   lock screen and all application screens. No third-party state library is
   needed.
3. The provider subscribes once, cleans up correctly, and rechecks on activity
   foreground/resume so long sleep and Wi-Fi changes do not leave stale state.
4. The lock-screen label changes promptly between online and offline. It does
   not imply that unprovisioned offline access is ready.

**Must not do:**

- Do not poll the network continuously.
- Do not call cloud APIs merely because Wi-Fi is associated.
- Do not give every screen its own native listener.

**Acceptance evidence:** leave the app open, turn Wi-Fi off/on without closing
it, and observe truthful status changes on Lock and POS with no console or
Android warning/error.

### OFF-05 — Add the serialized reconnect worker

**Status:** pending; requires OFF-03 and OFF-04.

**Objective:** make a live, unlocked terminal recover automatically and safely
when validated internet returns.

**Reconnect sequence:**

```text
validated internet returns while a staff session is active
  → one reconnect worker starts (never one per screen)
  → release only connectivity-failure retry backoff
  → send committed pending outbox work in bounded batches
  → acknowledge each accepted operation by its existing idempotency key
  → stop and retain failures with an honest local state
  → when the outbox is empty, fetch and apply the operational cache
  → notify the visible screen to refresh its appropriate local/cloud data
```

**Safety requirements:**

- Use a single-flight guard: overlapping connection events, screen mounts, and
  manual Sync cannot run two workers against the same outbox.
- Keep bounded batches and yield between them; do not create a retry storm.
- A server/business rejection remains failed and visible for recovery. A real
  offline-to-online transition may release only transport-failure backoff.
- Menu/cache replacement happens only after all current local operations are
  acknowledged. If work remains, retain the existing local menu and show the
  honest pending state.
- Hidden Dashboard, Reports, and Orders screens do not start unnecessary cloud
  work. The visible screen refreshes through its existing data boundary.
- While locked, only connection display changes. Sync waits for an authenticated
  unlock instead of using stale staff authority in the background.

**Acceptance evidence:** complete one offline sale, restore Wi-Fi with POS
still open, observe exactly one cloud sale/stock effect, empty outbox, refreshed
menu state, and no duplicate receipt, stock movement, warning, or error.

### OFF-06 — Full tablet reliability closeout

**Status:** pending; requires OFF-01 through OFF-05.

**Scenarios:**

1. Each provisioned staff profile: online provision → force-close → offline
   unlock → correct role and permitted screens.
2. Wrong PIN, five-attempt lockout, restart, and a second profile remaining
   available.
3. Offline sale → close/reopen → reconnect while unlocked → exact-once sync.
4. Wi-Fi loss/return while open on Lock, POS, Orders, Dashboard, Products,
   Stock, Reports, and Settings.
5. PIN change, archived staff, and revoked staff processed on next successful
   sync, without disturbing unrelated profiles.
6. Browser and Android logs, build, focused identity/local/sales checks, and
   full Android beta package pass.

**Completion evidence:** record each test, tablet result, APK version, checks,
files changed, unresolved limitation, and the exact next action below.

## Journal

### 2026-08-23 — Ledger created and OFF-01 started

- Owner rejected the prior short planning note. This standalone detailed ledger
  replaces it; offline reliability planning is no longer recorded as a new
  entry in the historical `WORK_LEDGER.md`.
- Recorded OFF-DEC-01 through OFF-DEC-05, the known code boundaries, the
  reported six-ones offline-unlock failure, and the items still unverified.
- No application, Android, identity, sync, or visual code changed.
- Next action: controlled physical-tablet reproduction for OFF-01, with the
  owner entering the PIN and the agent collecting only safe diagnostics.

### 2026-08-23 — OFF-01 toolchain baseline verified

- Re-read this dedicated ledger and the applicable root, source, data,
  Settings/Lock, and Android operating instructions before beginning OFF-01.
- Verified Java 21 at the recorded path, ADB at the recorded path, and the
  connected `R8YX91AKWXJ` Galaxy Tab A9 `SM-X115` on Android API 36.
- Verified the installed Olaso package is `0.1.0-beta.1`; no app data, Wi-Fi,
  staff profile, PIN, session, or APK was changed during this baseline check.
- Next action: capture the controlled offline-unlock reproduction with the
  owner entering the PIN privately, then inspect safe diagnostics only.

### 2026-08-23 — OFF-01 safe on-device baseline

- Read-only ADB inspection confirmed the app process is running and both the
  local SQLite database and Android protected-storage file exist. No app data
  was read, changed, cleared, or exported.
- The protected-store key names present are `identity.session` and
  `identity.offline_pin`; there is no `identity.offline_attempts` key. This
  proves only that the current single-profile design has protected material,
  not that it belongs to the reported profile or that its verifier is valid.
- Recent Android logs contain no Olaso fatal exception or runtime error.
- Next action: establish the reported six-ones profile through one online
  unlock, then reproduce the force-close/offline unlock while capturing safe
  diagnostics. The owner enters the PIN privately.

### 2026-08-23 — OFF-01 physical reproduction and diagnosis complete

- With Wi-Fi enabled, the lock screen reported online and had Olaso Owner
  selected. The reported online unlock reached the POS successfully.
- The app was force-stopped, Wi-Fi was disabled through ADB, and the app was
  relaunched. The Lock screen truthfully showed “Terminal offline · local
  service ready” with Olaso Owner selected.
- The same PIN was submitted offline through the tablet WebView without reading
  or recording the password field. The result was the specific safe error:
  “This staff identity is unavailable offline. Connect and sync this terminal.”
  It was not a wrong-PIN result, lockout, Android crash, Keystore read failure,
  or false-online result.
- Safe diagnostic comparison found two active cached profiles. The protected
  session is readable and structurally valid, and its saved name and role each
  exist in the local cache; its saved staff-profile ID does not. The protected
  record and local cached profile therefore describe the same named role with
  different identifiers.
- Root cause: while online, `LockScreen` fetches current profiles only into
  temporary React state. A successful sign-in saves that current server profile
  ID in protected storage, but does not refresh the persisted SQLite staff
  cache. After cold offline startup, the lock uses the stale cached profile ID
  and rejects it against the protected session ID.
- `npm run check:identity` passes, but its current coverage asserts the
  single-session match requirement rather than this stale-ID failure. OFF-02
  must add a focused regression test proving a freshly online-provisioned
  profile remains unlockable after offline restart.
- Wi-Fi was restored, the temporary Android WebView diagnostic port-forward was
  removed, and no app data, staff profile, PIN, session token, or protected
  value was cleared, exported, or logged.
- Result: OFF-01 complete. Exact next action: await owner approval before
  beginning OFF-02 multi-profile protected-storage implementation.

### 2026-08-23 — OFF-02 implementation and physical-test blocker

- Replaced the one global protected offline record with three Android
  Keystore-backed records per staff-profile ID: session, PIN verifier, and
  failed-attempt state. A successful online sign-in now changes only the
  selected profile's three records. The former one-profile records migrate
  once only when they match the selected profile, preserving an existing
  provisioned record without exposing its contents.
- Added a bounded staff-profile reconciliation at the data boundary. The Lock
  screen persists the authoritative active remote profile list before showing
  it, archives local profiles that disappear remotely, and removes protected
  access only for those archived IDs. This fixes OFF-01's stale SQLite ID
  mismatch without touching menu, sales, stock, orders, receipts, or outbox
  data.
- Added a focused executable check proving two profile IDs produce three
  distinct valid protected-storage keys each; updated the Lock contract checks
  for profile-scoped load/verify and cache reconciliation. `npm run
  check:identity`, `npx tsc -b`, and `npm run check:convex` pass. `npm run
  build`, `npm run check:android`, Android sync, and the debug APK build pass.
- Changed `src/data/identitySession.ts`, new pure
  `src/data/offlineCredentials.ts`, `src/data/operationalCache.ts`,
  `src/features/settings/LockScreen.tsx`, `convex/identity.ts`, generated
  Convex API types, and `scripts/check-identity.mjs`. Updated
  `ARCHITECTURE.md` and `src/data/AGENTS.md` to state the per-profile protected
  storage contract. Existing unrelated owner-review changes remain uncommitted
  and untouched.
- Installed the fresh `0.1.0-beta.1` debug APK over existing data on the
  Galaxy Tab A9; no storage was cleared or reset. The physical tablet confirms
  Wi-Fi and Android-validated internet are available, but online Olaso Owner
  sign-in still returns the app's generic unlock message. Safe protected-store
  inspection confirms no new profile-scoped record was written, so protected
  storage was not the failing stage.
- Convex development logs identify the actual rejected action:
  `identity:signIn` returns `Sign-in is temporarily unavailable.` before PIN
  verification. Source inspection confirms `convex/seed.ts` creates the two
  active profiles (Olaso Owner and Samira Barista) but no `staffIdentities`
  credential records. Therefore neither person can complete the required
  online provisioning on this deployment; repeated PIN attempts would not
  fix it and have stopped.
- No staff profile, PIN, server record, session token, SQLite data, outbox
  item, or production-like data was changed. Completing the card's physical
  two-profile proof requires owner authorization for one of two external data
  actions: provision credentials for the existing development profiles through
  the authorized recovery/onboarding path, or reset and reseed the development
  data after confirming its data-loss scope.
- Exact next action: await owner direction on credential provisioning versus a
  confirmed development-data reset. Do not claim OFF-02 done, do not commit,
  and do not begin OFF-03 through OFF-06.
- Graphify incremental refresh was attempted after the structural change but
  stopped before output generation because no semantic-extraction API key is
  configured in this environment. The existing graph was not imported into the
  app or altered.

### 2026-08-23 — OFF-02 locked-screen regression removed

- The prior implementation incorrectly treated the unauthenticated remote
  profile list as authoritative: while locked, it archived every local profile
  absent from that response and cleared that profile's protected access. This
  violated OFF-DEC-05 and caused the previously usable local Owner profile to
  disappear after the current remote profile IDs were loaded.
- Removed that locked-screen reconciliation and credential clearing without
  rolling back profile-scoped Keystore records. Remote profiles remain
  read-only sign-in choices; only the profile that successfully authenticates
  online is upserted locally, and every other local profile remains unchanged.
- Added a focused regression assertion that Lock never calls the removed
  reconciliation/clear path. `npm run check:identity`, TypeScript, Convex
  typecheck/deploy, `npm run build`, `npm run check:android`, Android sync, and
  the 140-task debug APK build pass.
- Installed the repaired APK over the existing tablet data. Safe read-only
  SQLite comparison before and after launch proves it made no further staff
  status or timestamp change. The earlier buggy APK had already archived the
  old local Owner and Samira rows and activated the current remote IDs; no
  tablet data, PIN, protected value, or server credential was changed during
  this repair. The temporary diagnostic database copy was removed.
- Exact next action: with explicit owner authorization, provision the current
  development Owner identity through the existing protected support boundary,
  verify online sign-in and offline restart for that profile, then provision a
  second approved test profile and complete the two-profile OFF-02 evidence.
- Queried the existing graph before the repair review. The required
  `graphify . --update` retry stopped before replacing `graphify-out/graph.json`
  because this workstation has no semantic-extraction API key for the changed
  mixed document/image corpus; the existing graph remains intact.

### 2026-08-23 — OFF-02 Owner online/offline restart proof passed

- With explicit owner authorization, provisioned only the current development
  Olaso Owner through the existing support-recovery action. No PIN, recovery
  code, profile ID, or session token was printed or stored in the repository;
  Samira remained unchanged. A separate direct server sign-in returned an
  authenticated owner result without exposing its token.
- The first tablet attempt isolated a deployment mismatch rather than another
  PIN failure: the installed APK expected the newly added profile revision,
  while the still-old development function returned no revision, causing a
  rolled-back local NOT NULL failure. Deployed the current checked Convex
  functions with `npx convex dev --once --typecheck enable`; no database reset
  or application-data mutation was performed.
- On the connected SM-X115, the Owner then signed in online successfully and
  reached the full POS. Force-closed the app, disabled Wi-Fi, cold-started it,
  confirmed the Lock screen reported offline, and unlocked the same Owner into
  the full POS using the profile-scoped protected record.
- The accepted offline path produced no fatal Android event, Capacitor console
  error, or protected-credential failure. Wi-Fi and validated connectivity were
  restored, logcat was cleared, and all temporary QA screenshots were deleted.
- Online POS startup also exposed pre-existing pending-outbox rejections from
  older tablet test sales: one legacy receipt-number validation failure and two
  unavailable-product conflicts. They are separate from OFF-02 authentication,
  were not deleted or retried manually, and must remain visible for the later
  OFF-03/OFF-05 recovery work instead of being silently cleared.
- Corrected stale root/source/Settings operating instructions so they now
  describe the already-approved Goal 05 staff-authentication boundary and the
  new read-only locked profile discovery rule. `npm run check:identity` and
  `git diff --check` pass.
- OFF-02 remains in progress because its acceptance contract requires two
  independently provisioned staff profiles and proof that re-signing one does
  not break the other. Exact next action: obtain the owner's approved six-digit
  PIN for the development Samira profile, provision only that profile, then run
  the complete two-profile offline/re-sign-in sequence.

### 2026-08-23 — OFF-02 two-profile acceptance complete

- With explicit owner approval, provisioned only the existing development
  Samira cashier profile with the supplied six-digit PIN. No PIN, recovery code,
  profile ID, verifier, or token was printed or stored in the repository.
- Samira's first online sign-in passed and correctly exposed only POS and
  Orders. The first offline selection exposed two older duplicate active rows
  per displayed staff name, left by the prior buggy build while pending outbox
  work prevented a full operational-cache replacement. A read-only in-memory
  tablet database audit confirmed the duplicate-count and current-server-ID
  mismatch without exporting a database or protected value.
- Added an authenticated-only staff-directory reconciliation. The locked server
  list remains read-only; only after successful online authentication may its
  complete bounded result archive stale local rows, upsert the active directory,
  and remove stale profile-scoped plus legacy protected records. If the list is
  unavailable, only the authenticated profile is upserted and all others remain
  unchanged. Menu, sale, stock, receipt, and outbox data are untouched.
- `npm run check:identity`, `npm run check:local`, `npx tsc -b`, `npm run
  build`, Android static checks/sync, and the 140-task Android beta build pass.
  The final APK installed over existing tablet data without clearing storage.
- On the final APK, Samira re-signed online; the local active directory then
  contained exactly one Owner and one Samira. With Wi-Fi disabled across cold
  restarts, Owner unlocked to the full owner POS, then Samira unlocked to the
  cashier-only POS/Orders shell. Neither path produced an identity failure,
  protected-storage failure, Capacitor console error, or Android fatal event.
- Wi-Fi and internet reachability were restored, logcat was cleared, and all
  temporary QA screenshots were deleted. OFF-02 is complete. Exact next
  reliability action: activate OFF-03 only after owner direction, then prove a
  labeled offline sale and its pending local effects without synchronizing it
  prematurely.
- The required `graphify . --update` retry stopped before replacing the graph
  because the changed mixed document/image corpus requires a semantic backend
  API key that is not configured. The existing graph remains intact; the
  pre-change graph query passed.

## Journal entry format

For every meaningful step, add a dated entry containing:

- Card and result: pass, fail, blocked, or awaiting owner decision.
- Exact scenario performed and device state.
- Safe evidence collected; never secrets or raw credentials.
- Files changed and focused checks run.
- Any user-approved decision or rejected approach.
- The precise next action.
