# Olaso support recovery (development tooling)

This folder is excluded from the Android APK. It documents owner/support
recovery notes that must not live only in chat history.

## What Convex does and does not keep

- Convex stores synchronized operational data after successful acknowledgement.
- Free-plan Convex limits (re-check before production): monthly function calls,
  database storage, and database I/O caps. Hard stop on Free when exceeded.
- Unsynced tablet sales remain local until the reconnect worker or Sync now
  acknowledges them.

## Second shop / new Convex project

- Each live coffee shop should use its own Convex deployment.
- Menu seeding for a sister shop is a support/deployment copy between projects
  (or a future deliberate tooling step), not an operator Settings export.

## Corrupt or unrecoverable local data

- The app fails closed: no POS/checkout while SQLite cannot open.
- Restart once. If it still fails, do not force orders.
- Prefer Convex sync for already-acknowledged cloud data after a clean install.
- Signing keys, keystore passwords, and private recovery media paths stay
  outside this repository.

## Android Auto Backup

Production packaging disables Auto Backup and excludes database/shared
preferences from cloud and device-to-device transfer so operational and
protected data are not copied by the system backup pipeline.
