# POS Feature DOX

## Purpose

Provides the cashier sales workspace: menu discovery, cart/receipt editing,
totals, local-first checkout orchestration, and saved receipt preview. It also
owns the shared Header and TopNavigation currently used across the application.

## Ownership

- `PosScreen.tsx` composes Header, search, categories, product grid, and receipt
  rail.
- `components/` owns the named POS controls and regions.
- `Header` and `TopNavigation` are cross-screen contracts despite their current
  POS location.
- `data/categories.ts` and `data/products.ts` map approved content assets onto
  the live local operational menu.
- Approved Pencil node `W26Y6` owns POS geometry and composition.

## Local Contracts

- Preserve the documented 966-pixel menu column, 320-pixel receipt rail, narrow
  product cards, embedded category art, and full-bleed cream viewport.
- Product and category assets are content; do not recreate them with UI icons.
- All interface icons come from Phosphor.
- Search, category, and cart behavior must stay local during service.
- Required modifier groups are explicit cashier choices; never silently select
  an option.
- Clear the cart only after the local sale transaction commits.
- Saved receipts support on-screen preview only. Do not expose printing,
  printer permissions, or transport from this feature.
- Checkout, persistence, stock deduction, sync, and printing do not belong in
  leaf components.
- Changing Header or TopNavigation requires visual verification of all six
  screens.

## Work Guidance

- Reuse existing controls before adding variants.
- Keep modifier and receipt dialogs prop-driven.
- Keep receipt presentation separate from any later printer boundary.

## Verification

- Run `npm run build`.
- Run `npm run check:pos` and `npm run check:sales` after checkout changes.
- Compare POS to Pencil node `W26Y6` at 1340 × 800.
- After Header or TopNavigation changes, inspect Dashboard, POS, Orders,
  Products, Stock, and Reports.

## Child DOX Index

No child DOX files.
