# Olaso POS

Tablet-first point-of-sale interface for Olaso Coffee, designed for the Samsung Galaxy Tab A9.

![Olaso POS interface](pencil-exports/coded-W26Y6.png)

## Current status

The repository contains a functional development beta: live catalog and stock
management, local-first checkout and receipt previews, synchronized orders,
dashboard and reports, terminal settings, and the approved tablet interface.
The documents also describe staff identity, signed APK updates, and LAN
printing. Those existing capabilities are not a SaaS security or release
acceptance claim; current verification belongs to the owner-selected step.

## Stack

- React 19 and TypeScript
- Vite
- Capacitor Android with SQLite
- Convex development backend
- Astryx Design Core with the custom Olaso theme
- Boxicons
- CSS Modules
- Pencil source design and exported references

## Run locally

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

The development and production commands automatically compile `Olasotheme-theme.ts` into static Astryx theme assets. Run `npm run theme:build` directly after changing only the theme.

## Build the Android development beta

With Java 21 and Android SDK 36 configured:

```bash
npm run android:beta
```

This checks the package and permission boundary, synchronizes Capacitor, and
creates the ignored debug APK at
`android/app/build/outputs/apk/debug/app-debug.apk`. It is a local development
artifact, not a production-signed release.

## Project structure

```text
src/features/pos/
  components/       Reusable POS interface components
  PosScreen.tsx     Main tablet POS screen

src/data/            SQLite, cache, outbox, and synchronization boundaries
convex/              Development backend schema and functions
android/             Capacitor Android shell
Olasotheme-theme.ts Astryx design tokens
BRAND.md            Olaso brand reference
DESIGN.md           Product interface rules and design system
PRODUCT.md          Product purpose, scope, and operational behavior
ARCHITECTURE.md     Data, backend, sync, performance, and APK rules
untitled.pen        Pencil source design
```

## Documentation

- [`BRAND.md`](BRAND.md) — brand identity and confirmed/provisional assets.
- [`DESIGN.md`](DESIGN.md) — visual tokens, components, layout, and UI behavior.
- [`PRODUCT.md`](PRODUCT.md) — what the application does and what is in scope.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — how data, backend logic, offline work,
  printing, and releases are implemented.
- [`SAAS_TRANSITION.md`](SAAS_TRANSITION.md) — the active SaaS transition plan,
  owner-reported concerns, research requirements, and current next action.

## Current direction

The owner is moving Olaso toward multiple client businesses and locations,
with a phone-first Next.js metrics dashboard and restricted APK updates.
Interface polish comes first, followed by security and database improvements.
`SAAS_TRANSITION.md` separates these requirements from unverified concerns.
Implementation proceeds only through the next step chosen by the owner.

## Target hardware

- Samsung Galaxy Tab A9
- WDLink WD8260 80 mm ESC/POS printer over Ethernet/LAN in production; USB for
  the standalone desktop receipt lab
