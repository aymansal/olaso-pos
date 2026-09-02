# Settings Feature DOX

## Purpose

Owns the profile-opened Settings workspace and the staff sign-in/terminal lock
presentation.

## Local Contracts

- Settings is opened from the shared profile control; it is not a seventh
  permanent navigation item.
- The left card is one Settings page: application language, receipt language,
  clock format, printer host:port, Test printer, Sync, and Check for update.
  Application language is the signed-in profile's preferred language (SQLite
  plus cloud). Changing it in Settings or the Header EN|FR control updates
  both. Receipt language is tablet-wide and owner-only; it is not a profile
  preference. The Lock screen keeps the last application language used on
  this tablet.
- Staff & access is the right card. There are no Settings tabs and no Lock
  application control; lock remains on the shared Header profile menu.
- Device ID and terminal name stay in local storage but are not shown.
- Manual synchronization calls the data hook once per deliberate action and
  reports pending, success, offline, and error states. Online tablets also
  synchronize automatically while the app is open and connected. Waiting sales
  is pending and failed sale outbox rows only, not management operations.
- Every role reaches the same local Lock / Switch staff action from the Header;
  this does not grant Settings access. A deliberate non-empty-cart switch asks
  for confirmation and preserves that order while the app process remains
  alive; empty-cart, idle, invalid-session, and restart locks need no prompt.
- Printer & hardware persists a validated IPv4/raw-port endpoint as one field
  and exposes one Android-only non-sale Test printer action with honest
  configuration, unavailable, timeout, write, and unknown feedback.
- A successful test means only that bytes were written; the operator must
  confirm paper separately.
- Unlock is the production staff-authentication boundary. Every owner, manager,
  and cashier uses a separate six-digit PIN; never add placeholder, shared, or
  default credentials. Staff choice on Lock uses the in-app list, not the
  Android native select. Other list menus reuse that same control at compact
  size. Date and month stay native until the custom calendar.
- About is the last Settings block: installed version and, when an HTTPS update
  manifest URL is built in, Check for update / Update / Later. Update is blocked
  while a cart is unfinished and always requires Android installation
  confirmation.
- Offline unlock is available after that profile has signed in online on this
  tablet or an owner created it locally through Staff & access. Its session,
  PIN verifier, pending provisioning verifier, and failed-attempt state remain
  in profile-scoped Android protected storage, never ordinary settings or
  SQLite.
- A saved profile language survives lock, restart, install-over update, and
  local/cloud staff-ID promotion. Reconnect sends the tablet value before a
  cloud directory refresh can replace it.
- Staff & access is owner-only. Its create dialog contains only name, role,
  six-digit PIN, PIN confirmation, Cancel, and Add staff; a successful offline
  save appears immediately as waiting to sync.
- Owner-only confirmed staff deletion immediately removes the selectable
  profile, ends open monthly wage at the current month, and preserves
  historical names/wages and earlier queued work; the active profile and
  final owner cannot be removed.
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
