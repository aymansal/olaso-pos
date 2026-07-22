# Olaso POS

Tablet-first point-of-sale interface for Olaso Coffee, designed for the Samsung Galaxy Tab A9.

![Olaso POS interface](pencil-exports/coded-W26Y6.png)

## Current status

The repository currently contains the approved POS interface shell. Product ordering, stock calculations, reporting, authentication, database access, Android packaging, and ESC/POS receipt printing will be added in later stages.

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

## Project structure

```text
src/features/pos/
  components/       Reusable POS interface components
  data/             Temporary menu data
  PosScreen.tsx     Main tablet POS screen

Olasotheme-theme.ts Astryx design tokens
DESIGN.md           Product interface rules and design system
BRAND.md            Olaso brand reference
untitled.pen        Pencil source design
```

## Planned work

- Complete product menu and editable recipes
- Sales, orders, stock, and reports
- Local/offline operation with synchronization
- Android packaging for the target tablet
- ESC/POS thermal receipt printing through Bluetooth or USB

## Target hardware

- Samsung Galaxy Tab A9
- ESC/POS-compatible thermal printers, including WDLink-class devices
