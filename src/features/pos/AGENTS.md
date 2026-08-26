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
- `ProfileControl` is the shared role-safe Header menu: every role can lock or
  switch staff, while only an owner outside the Settings screen can open
  Settings from it.
- `data/categories.ts` and `data/products.ts` map approved content assets onto
  the live local operational menu.
- `src/lib/categoryArtwork.ts` is the shared Products/POS gallery registry and
  neutral fallback; POS consumes the saved category artwork key rather than
  inferring from its name.
- Approved Pencil node `W26Y6` owns POS geometry and composition.

## Local Contracts

- Preserve the documented 966-pixel menu column, 320-pixel receipt rail, narrow
  product cards, embedded category art, and full-bleed cream viewport.
- Product and category assets are content; do not recreate them with UI icons.
- All interface icons come from Phosphor.
- Search, category, and cart behavior must stay local during service.
- Preserve already visited live category grids and their prepared product
  images using the installed React Activity boundary; do not eagerly mount
  unvisited categories or retain a removed category's product grid.
- Products released by category deletion remain sellable under a neutral
  `Uncategorized` category while any such active product exists.
- A deliberate staff switch confirms only a non-empty cart and preserves it for
  the next verified staff member; checkout records the staff member who
  completes the sale.
- Required modifier groups and later product-owned choice sections are
  explicit cashier choices; never silently select an option. A product with
  one size must not force a size selection. Cart identity includes the selected
  size once OPTIONS-03 activates product-owned checkout.
- Clear the cart only after the local sale transaction commits.
- Saved receipts support on-screen preview and plain post-commit print feedback.
  Do not expose printer settings, permissions, bytes, or transport from this
  feature.
- Checkout, persistence, stock deduction, sync, and printing do not belong in
  leaf components.
- Changing Header or TopNavigation requires visual verification of all six
  screens.

## Work Guidance

- Reuse existing controls before adding variants.
- Keep the modifier dialog and shared receipt preview prop-driven.
- Keep receipt presentation separate from any later printer boundary.

## Verification

- Run `npm run build`.
- Run `npm run check:pos` and `npm run check:sales` after checkout changes.
- Compare POS to Pencil node `W26Y6` at 1340 × 800.
- After Header or TopNavigation changes, inspect Dashboard, POS, Orders,
  Products, Stock, and Reports.

## Child DOX Index

No child DOX files.
