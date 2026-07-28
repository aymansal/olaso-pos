# Olaso POS

Tablet-first point-of-sale interface for Olaso Coffee, designed for the Samsung Galaxy Tab A9.

![Olaso POS interface](pencil-exports/coded-W26Y6.png)

## Current status

The repository currently contains the approved POS interface shell. Product ordering, stock calculations, reporting, authentication, database access, Android packaging, and ESC/POS receipt printing will be added in later stages.

The product behavior and local-first technical architecture are now documented
before backend implementation begins.

## Stack

- React 19 and TypeScript
- Vite
- Astryx Design Core with the custom Olaso theme
- Phosphor Icons
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

## Project structure

```text
src/features/pos/
  components/       Reusable POS interface components
  data/             Temporary menu data
  PosScreen.tsx     Main tablet POS screen

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
- [`WORK_LEDGER.md`](WORK_LEDGER.md) — active goal, task board, checkpoint, and
  implementation journal.

## Planned work

- Complete product menu and editable recipes
- Sales, orders, stock, and reports
- Local/offline operation with synchronization
- Android packaging for the target tablet
- ESC/POS thermal receipt printing through Bluetooth or USB

## Target hardware

- Samsung Galaxy Tab A9
- ESC/POS-compatible thermal printers, including WDLink-class devices
