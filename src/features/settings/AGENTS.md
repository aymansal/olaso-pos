# Settings Feature DOX

## Purpose

Owns the profile-opened Settings workspace and the staff sign-in/terminal lock
presentation.

## Local Contracts

- Settings is opened from the shared profile control; it is not a seventh
  permanent navigation item.
- Device ID is visible and immutable. Terminal label and clock format are
  non-secret local preferences.
- Manual synchronization calls the data hook once per deliberate action and
  reports pending, success, offline, and error states. Online tablets also
  synchronize automatically while the app is open and connected.
- Every role reaches the same local Lock / Switch staff action from the Header;
  this does not grant Settings access. A deliberate non-empty-cart switch asks
  for confirmation and preserves that order while the app process remains
  alive; empty-cart, idle, invalid-session, and restart locks need no prompt.
- Printer & hardware persists a validated IPv4/raw-port endpoint and exposes one
  Android-only non-sale Test printer action with honest configuration,
  unavailable, timeout, write, and unknown feedback.
- The secondary Restore saved logo action is Android-only, requires an explicit
  warning that all stored images are replaced, and sends only the bundled
  reviewed native asset during deliberate setup.
- A successful test means only that bytes were written; the operator must
  confirm paper separately.
- Unlock is the production staff-authentication boundary. Every owner, manager,
  and cashier uses a separate six-digit PIN; never add placeholder, shared, or
  default credentials.
- About shows the installed version and, when an HTTPS update manifest URL is
  built in, Check for update / Update / Later. Update is blocked while a cart is
  unfinished and always requires Android installation confirmation.
- Offline unlock is available after that profile has signed in online on this
  tablet or an owner created it locally through Staff & access. Its session,
  PIN verifier, pending provisioning verifier, and failed-attempt state remain
  in profile-scoped Android protected storage, never ordinary settings or
  SQLite.
- Staff & access is owner-only. Its create dialog contains only name, role,
  six-digit PIN, PIN confirmation, Cancel, and Add staff; a successful offline
  save appears immediately as waiting to sync.
- Owner-only confirmed staff deletion immediately removes the selectable
  profile while preserving historical names/wages and earlier queued work;
  the active profile and final owner cannot be removed.
- While locked, a bounded server profile read may provide sign-in choices, but
  it is read-only: it never archives local profiles, clears protected access,
  or starts staff-authorized synchronization. After a successful online
  sign-in, its complete bounded result may reconcile the local staff directory;
  otherwise only the authenticated profile is upserted.

## Verification

- Run `npm run check:settings`, `npm run check:local-staff`, and
  `npm run build`.
- Inspect Settings and Lock at 1340 × 800, including persistence, manual sync,
  offline/error feedback, unlock, focus, clipping, overflow, and console state.
