# POS Feature DOX

## Purpose

Provides the cashier sales workspace: menu discovery, cart/receipt editing,
totals, local-first checkout orchestration, and post-commit print feedback. It also
owns the shared Header and TopNavigation currently used across the application.

## Ownership

- `PosScreen.tsx` composes search, categories, product grid, and receipt
  rail.
- `components/` owns the named POS controls and regions.
- `QuickAddRow` owns the best-seller chips beside the search field; the ranking
 comes from the application data boundary, never from this feature.
- `Header` and `TopNavigation` are cross-screen contracts despite their current
  POS location. App mounts one Header for every screen.
- `ProfileControl` is the shared role-safe Header menu: every role can lock or
  switch staff and switch application language with a compact EN|FR control,
  while only an owner outside the Settings screen can open Settings from it.
- `data/categories.ts` and `data/products.ts` map approved content assets onto
  the live local operational menu.
- `src/lib/categoryArtwork.ts` is the shared Products/POS gallery registry and
  neutral fallback; POS consumes the saved category artwork key rather than
  inferring from its name.
- Approved Pencil node `W26Y6` owns POS geometry and composition.

## Local Contracts

- Preserve the documented 966-pixel menu column, 320-pixel receipt rail, narrow
 product cards, embedded category art, and full-bleed cream viewport.
- The search field is a compact 320-pixel control. A clear control stays
 visible whenever the query is not empty, including after the keyboard is
 dismissed. `QuickAddRow` fills the rest
 of that band with at most three equal-width name-only best-seller chips and
 renders nothing when the tablet has no saved sales. Chips reuse the same add
 path as a product card, so a product needing a size or a required choice still
 opens the dialog.
- The Header carries no notification control; do not reintroduce a decorative
 bell or a hardcoded badge count.
- Product and category assets are content; do not recreate them with UI icons.
- A long product name or price ellipsises before the plus; the plus stays
  visible. Only the plus adds to the order.
- All interface icons come from Boxicons.
- Search, category, and cart behavior must stay local during service.
- Preserve already visited live category grids and their prepared product
  images using the installed React Activity boundary; do not eagerly mount
  unvisited categories or retain a removed category's product grid.
- The fixed menu area scrolls its uniform five-column product grid vertically
  when a category has more rows than fit. Category cards keep artwork in a
  strong right-side zone and wrap long names inside the reserved left text zone.
- Products released by category deletion remain sellable under a neutral
  `Uncategorized` category while any such active product exists.
- A deliberate staff switch confirms only a non-empty cart and preserves it for
  the next verified staff member; checkout records the staff member who
  completes the sale.
- Required modifier groups and later product-owned choice sections are
  explicit cashier choices; never silently select an option. A product with
  one size must not force a size selection. Cart identity includes the selected
  size once OPTIONS-03 activates product-owned checkout.
- Customization uses a viewport-bounded620px dialog for multiple groups, two
  independently stacked columns assigned by full option counts; selection never
  rebalances them. Single groups stay320px. One shared scroll region, fixed
  header/footer, original option rows. Optional max-one choices must be deselectable; required max-one
  choices remain explicit radio selections.
- Checkout clears the cart only after the local sale transaction commits. Place
  order and Split are separate tap buttons in the existing296 by50 footprint.
  Card Place order commits directly; Cash opens amounts. Split opens the same
  mixed-method overlay directly from either initial method. In-flight guards
  prevent repeated submissions. A fully Offert cart skips the overlay.
  Cash shows20 /50 /100 /200 DH plus custom given and change; Split is disabled unless two or more paid units
  remain. Offert lines stay off the split lists. No in-dialog Split toggle.
  Two bounded product lists scroll independently; cash controls stay outside
  those scroll areas. The overlay cannot close after the first recorded payer.
  Each split payer chooses Cash or Card; Card is exact and only Cash shows
  Given/Change. One sale records every tender on the ticket.
  The App-owned session retains payment progress through an in-process lock.
  Before opening payment, capture a trusted quote through the data hook. Keep
  that quote's display menu in the App-owned draft, including original prices
  and size/choice labels even when the live menu changes. Final completion sends
  the quote ID, not UI prices. Release an unpaid abandoned quote or a successfully
  committed one; failed completion must keep it for retry.
  After19 tenders the final payment must include all remaining items; enforce
  the20-tender ceiling before accepting another partial payment.
  A cashier may empty the current draft from the always-visible trash next to
  the Current order title; it stays gray while the cart is empty. The cart list
  itself stays blank until a product is added; each line uses the same compact
  card outline. A Gift left of the line trash marks that unit Offert: catalog
  price stays on the snapshot, charged total is 0, recipe stock still deducts,
  and qty greater than 1 splits one Offert unit. This is not a general discount.
- Checkout prints the saved ticket. POS does not open an on-screen receipt
  preview. Do not expose printer settings, permissions, bytes, or transport
  from this feature.
- The Header Report action appears only for an owner and delegates one
  current-day print request to App; Header owns only its busy presentation.
- The printed ticket joins product and size as one heading and renders actual
  choices as one compact, wrapping detail list. It never prints repeated `+`
  prefixes or treats Offert as a choice.
- Checkout, persistence, stock deduction, sync, and printing do not belong in
  leaf components.
- Changing Header or TopNavigation requires visual verification of all six
  screens.

## Work Guidance

- Reuse existing controls before adding variants.
- Keep the modifier dialog and payment overlay prop-driven.
- Keep receipt presentation separate from any later printer boundary.

## Verification

- Run `npm run build`.
- Run `npm run check:pos` and `npm run check:sales` after checkout changes.
- Compare POS to Pencil node `W26Y6` at 1340 × 800.
- After Header or TopNavigation changes, inspect Dashboard, POS, Orders,
  Products, Stock, and Reports.

## Child DOX Index

No child DOX files.
