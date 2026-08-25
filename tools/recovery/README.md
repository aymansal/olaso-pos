# Olaso support recovery (development tooling)

This folder is excluded from the Android APK. It documents owner/support
recovery steps that must not live only in chat history.

## What Convex does and does not keep

- Convex stores synchronized operational data after successful acknowledgement.
- Free-plan Convex limits (re-check before production): monthly function calls,
  database storage, and database I/O caps. Hard stop on Free when exceeded.
- Convex is **not** a substitute for unsynced tablet sales still waiting in
  SQLite/outbox.

## Owner tablet export

1. Sign in as owner on the physical tablet.
2. Open Settings → Data & sync → **Export backup**.
3. Choose a location with Android's system Save dialog (SAF).
4. Keep the JSON file off-device (USB, owner drive). It contains sales,
   products, recipes, stock movements, purchases, expenses, compensation, and
   staff profile names/roles — never PINs or session tokens.
5. **Verify backup** opens that file and reports counts without changing the
   tablet.

## Corrupt or unrecoverable local data

- The app fails closed: no POS/checkout while SQLite cannot open.
- Restart once. If it still fails, do not force orders.
- Prefer restoring from the last successful owner export plus Convex sync for
  already-acknowledged cloud data.
- Signing keys, keystore passwords, and private recovery media paths stay
  outside this repository.

## Android Auto Backup

Production packaging disables Auto Backup and excludes database/shared
preferences from cloud and device-to-device transfer so operational and
protected data are not copied by the system backup pipeline.
