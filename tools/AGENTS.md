# Development Tooling DOX

## Purpose

Owns version-controlled development-only laboratories and hardware fixtures.
Nothing in this subtree is imported by the React application or packaged in the
Android APK.

## Local Contracts

- `wd8260-receipt-lab/` preserves the accepted standalone WD8260 USB receipt
  baseline, exact tool versions, printer-resident logo payload generator, and
  reviewed golden bytes.
- Its development-only LAN probe accepts an explicit IPv4 address, port, and
  bounded timeouts, sends reviewed bytes through Node's built-in TCP socket,
  and reports only observable connection/write facts. Paper remains a separate
  physical verification.
- Keep `tools/wd8260-receipt-lab/` and `tools/recovery/` self-contained.
  Recovery notes are for support and are never imported by the React
  application or packaged in the Android APK.
- `tools/release/` documents signing-key custody, local rehearsal keystore
  env vars, the public `olaso-pos-releases` HTTPS channel, and
  `npm run release:publish`. It is never imported by the application.
- Keep `node_modules/` and regenerated `out/` files untracked. Version generated
  bytes only when they are intentional reviewed fixtures under `fixtures/`.
- Supply Windows printer queue names at execution time; never version a local
  queue or a deployment-only LAN address.
- Preserve `D:\Olaso-escpos-lab` unchanged as the accepted external reference
  until the Goal 03 receipt work is complete.

## Verification

- Run `npm ci` inside `tools/wd8260-receipt-lab/` after dependency changes.
- Run `npm run check:receipt-lab` from the repository root after lab changes.
- USB-print the accepted receipt and inspect real paper when a card requires
  physical receipt evidence.
