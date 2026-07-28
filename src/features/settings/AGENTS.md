# Settings Feature DOX

## Purpose

Owns the profile-opened Settings workspace and local terminal lock
presentation.

## Local Contracts

- Settings is opened from the shared profile control; it is not a seventh
  permanent navigation item.
- Device ID is visible and immutable. Terminal label and clock format are
  non-secret local preferences.
- Manual synchronization calls the data hook once per deliberate action and
  reports pending, success, offline, and error states.
- The local lock survives restart and preserves the in-memory POS order while
  the app remains open.
- Unlock is explicitly not authentication until owner-approved roles, PINs,
  and login policy exist. Do not add placeholder credentials or a working
  keypad.
- Printer/hardware controls and unconfirmed staff, receipt, and stock policies
  remain unavailable.

## Verification

- Run `npm run check:settings` and `npm run build`.
- Inspect Settings and Lock at 1340 × 800, including persistence, manual sync,
  offline/error feedback, unlock, focus, clipping, overflow, and console state.
