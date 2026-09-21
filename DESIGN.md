---
version: 0.6
name: Olaso POS
description: Touch-first landscape point-of-sale system for Olaso Club on the Samsung Galaxy Tab A9.
status: active
updated: 2026-08-23
platform: React, Vite, and Capacitor Android
visualAuthority: Pencil node W26Y6
colors:
  primary: "#909F78"
  action: "#006A2B"
  action-border: "#0B6B36"
  surface: "#F8F7EA"
  surface-raised: "#FFFFFF"
  surface-soft: "#FAFAF7"
  text: "#101611"
  text-muted: "#566057"
  divider: "#DDE3D9"
  danger: "#FF6863"
  on-action: "#FFFFFF"
typography:
  category-title:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.1
  title-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
  body-md:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.35
  body-strong:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.2
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.2
  caption:
    fontFamily: DM Sans
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.2
  price:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.2
rounded:
  none: 0px
  image: 10px
  card: 20px
  category: 22px
  control: 24px
  panel: 28px
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 10px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  viewport-inset: 18px
  content-gap: 19px
components:
  device-canvas:
    backgroundColor: "{colors.surface}"
    width: 1340px
    height: 800px
  logo-lockup:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.image}"
    size: 48px
  app-surface:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    width: 1340px
    height: 800px
  search-field:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 20px
    height: 50px
    width: 320px
  category-card-active:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    typography: "{typography.category-title}"
    rounded: "{rounded.category}"
    width: 234px
    height: 120px
  category-card-default:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    typography: "{typography.category-title}"
    rounded: "{rounded.category}"
    width: 234px
    height: 120px
  status-warning:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.text}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    height: 24px
  product-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.card}"
    width: 174px
    height: 162px
  icon-button:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.action-border}"
    rounded: "{rounded.full}"
    size: 44px
  segmented-control:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    width: 296px
    height: 50px
  text-field:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    typography: "{typography.label-md}"
    rounded: "{rounded.control}"
    padding: 16px
    width: 144px
    height: 48px
  quantity-stepper:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    width: 116px
    height: 44px
  divider-line:
    backgroundColor: "{colors.divider}"
    height: 1px
  primary-action:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 8px
    width: 296px
    height: 50px
  receipt-panel:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    width: 320px
    height: 688px
  field-label:
    textColor: "{colors.text-muted}"
    typography: "{typography.caption}"
  border-rule:
    backgroundColor: "{colors.action-border}"
    height: 1px
---

# Olaso POS Design System

## Overview

Olaso POS is a compact landscape staff tool that feels like a real part of the Olaso cafe rather than generic retail software. The approved Pencil dashboard is a full-bleed warm cream application viewport with narrow portrait-like product cards, embedded category illustrations, fine green outlines, and pill-shaped touch controls.

The interface is operational first. Staff must recognize products, edit an order, and place it quickly. Brand character comes from official OLASO artwork, warm neutral surfaces, product photography, and restrained green accents. It must never come from a presentation backdrop, coffee-bean decoration, novelty copy, or low-contrast controls.

The target viewport is the Samsung Galaxy Tab A9 in landscape at 1340 by 800 pixels. The approved Pencil screen and the reusable masters in the `Olaso POS Component Library` frame are the visual authority. `components.html` is the portable implementation reference.

## Product Vision

The screen has one job: let a cashier identify products, assemble an order, verify it, and place it with minimal hesitation. Every design decision must improve recognition, speed, accuracy, or confidence.

The product should feel warm and unmistakably Olaso while remaining an operational tool. Its signature is the combination of embedded category artwork, real transparent drink photography, narrow portrait product cards, restrained green outlines, and a calm cream canvas. Brand personality belongs in those materials and details, not in ornamental UI.

Principles, in priority order:

1. **Fast to scan.** Products, prices, quantities, and totals remain visually predictable.
2. **Safe to operate.** Important actions have large targets, immediate feedback, and clear failure recovery.
3. **Faithful to Olaso.** Use real brand and product assets; do not approximate the wordmark or invent a generic cafe style.
4. **Quietly playful.** One expressive visual moment is enough. Operational controls stay calm.
5. **Reusable by construction.** A component is coded once, receives content through props, and owns its own styles.

### Owner-led simplification

- The owner now places interface polish first, ahead of the security and data
  work. Follow the selected screen/flow in `SAAS_TRANSITION.md`; do not start
  an autonomous audit or redesign adjacent screens.
- Review popups and editing, validation, saving, error, empty, scrolling, and
  keyboard states as part of that flow when authorized.
- Simplify redundant copy, icons, groupings, and visible support detail through
  the owner's feedback. Keep validation, destructive warnings, recovery,
  accessibility, and accurate stock/cost behavior intact.
- Additional owner-supplied design skills must be read before the work that
  uses them. No design implementation is authorized by this planning update.

## Authority and Change Rules

Use the authority that owns the decision:

1. `PRODUCT.md` owns product purpose, scope, workflows, and operational behavior.
2. `ARCHITECTURE.md` owns persistence, synchronization, backend, printing, and release behavior.
3. Approved Pencil production frames own geometry and visual composition: POS
   `W26Y6`, Settings `bELEf`, and Lock `QfSKg`.
4. This `DESIGN.md` owns tokens, interaction presentation, and reusable UI contracts.
5. `BRAND.md` owns confirmed brand assets, personality, and provisional brand facts.
6. `Olasotheme-theme.ts` implements the tokens after alignment with this document.
7. `components.html` is a visual catalog and comparison aid only.
8. Astryx defaults apply only when none of the sources above defines the decision.

The sage background visible around presentation mockups is not application UI. The production app fills the tablet viewport with Cream Surface. Any intentional design change must update the Pencil master and this file in the same change. Confirmed owner assets and values override provisional ones.

## Colors

The system separates brand color from operational color.

- **Olaso Sage** `{colors.primary}` reproduces the supplied digital logo background. Use it for the real logo lockup and brand moments.
- **Operational Green** `{colors.action}` is reserved for selected categories, active segments, and the primary order action.
- **Cream Surface** `{colors.surface}` fills the complete Android application viewport.
- **Raised White** `{colors.surface-raised}` holds products, form controls, and the receipt rail.
- **Espresso Text** `{colors.text}` carries primary text and prices.
- **Muted Text** `{colors.text-muted}` carries captions, metadata, and field labels.
- **Danger Coral** `{colors.danger}` identifies unavailable or restock states. Always pair it with text, not color alone.

Do not use white body text on Olaso Sage. Its contrast is suitable for the large supplied wordmark, not normal UI copy. Operational Green with white is reserved for large or bold control labels.

## Typography

DM Sans is the approved operational family. Its softer geometry feels more human than Inter while preserving compact labels, clear number recognition, and consistent metrics across Android and web references. The custom OLASO wordmark remains the expressive display voice and is artwork, not typography.

- Category names use `{typography.category-title}`.
- Product names and order item names use `{typography.body-strong}`.
- Buttons, tabs, values, and totals use `{typography.label-md}` or `{typography.body-md}`.
- Prices, metadata, helper text, and status labels use `{typography.price}`, `{typography.label-sm}`, and `{typography.caption}`.
- Prices and totals should use tabular figures when the implementation stack supports them.

Never replace the OLASO wordmark with typed text. Implementations use DM Sans, Arial, and the platform sans-serif as the fallback stack. Prices, quantities, and totals use tabular figures.

## Layout

The landscape layout preserves the proportions of the 4:3 reference inside the wider tablet viewport without turning the application into a floating mockup.

- Production application root: 1340 by 800, full-bleed Cream Surface, no outer radius or shadow.
- Content bounds: x 18 through 1322.
- Header: x 18, y 16, width 1304, height 60.
- Menu column: x 18, width 966.
- Receipt rail: x 1002, y 90, width 320, height 688.
- Gap between menu and receipt: 18.
- Search field: x 18, y 90, width 320, height 50.
- Quick add row: y 90, height 50, from x 348 to x 984 with 10-pixel gaps. It
  holds at most three equal-width name-only chips at 15px that fill the remaining
  menu-column width, and disappears entirely when the tablet has no saved sales.
- Category row: y 148, width 966, height 120; three fixed 234-pixel cards with 10-pixel gaps.
- Product grid: y 276, width 966, height 502; five fixed 174-pixel columns distributed across each complete row. The final row stays left-aligned with 8-pixel gaps.

Product cards are intentionally narrow and tall. The wider tablet is used by an additional product column and a wider functional receipt rail, not by enlarging the cards. On a different landscape tablet, preserve these proportions and use an adaptive column count before changing card aspect ratios.

All primary touch targets are at least 44 by 44 pixels. Maintain at least 8 pixels between independent touch targets.

### Viewport behavior

- Treat 1340 by 800 as the design reference, not a promise that Android WebView CSS pixels equal physical screen pixels.
- The physical Galaxy Tab A9 SM-X115 exposes approximately 1007 by 601 CSS pixels for its 1340 by 800 panel. The native APK declares the fixed 1340-pixel HTML viewport and uses Android WebView wide-viewport overview mode to fit it by width before the page loads.
- The installed fixed-layout APK disables user/focus scaling after that native
  fit. Opening and closing a small form field must not leave the whole
  application zoomed or scrollable; browser previews remain unscaled.
- Browser previews remain unscaled so the approved screen can still be inspected directly at 1340 by 800.
- At the reference ratio, preserve the documented geometry exactly.
- On a slightly different landscape viewport, keep 18-pixel minimum outer gutters, the 320-pixel receipt rail, card aspect ratios, and touch targets before distributing remaining space.
- Do not add a centered device mockup, outer presentation background, application border, or application corner radius.
- Avoid nested scrolling. The product region may scroll only when the available height cannot hold the catalog.

### Launch continuity

- The Android launch surface, WebView background, and React startup state form
  one full-bleed Cream Surface sequence. No white flash, default Capacitor blue
  mark, device shell, or unrelated loading card may appear between them.
- Use approved Olaso artwork at its original proportions. Never type or
  reconstruct the wordmark for startup.
- The native Android splash is plain Cream Surface only. The one green OLASO
  wordmark appears afterward in HTML/React using
  `assets/brand/olaso-wordmark-operational-green-transparent.png`, with three
  bouncing Operational Green dots beneath it. Do not show a native green logo,
  a duplicate mark, or `Starting Olaso…` during normal loading. Real
  error/recovery states may still show useful failure text.
- Keep the official white-on-sage square master for sage or dark brand
  placements; white artwork is not visible enough on the cream launch surface.
- Startup artwork reserves its final size and stays visually stable while the
  cream native-to-web handoff completes. Do not hold the splash screen longer
  to disguise slow initialization, and do not add GIF, video, or a new package.
- Until a separate approved compact icon arrives, the Android launcher keeps
  the complete original white-on-sage OLASO artwork proportionally centered in
  the adaptive-icon safe zone. It is an honest application derivative, not an
  official compact master. Never crop or squeeze the wordmark into the mask.
- If startup cannot safely expose the application, show the actionable startup
  failure state on the same cream surface rather than a blank viewport.

## Elevation & Depth

Depth is quiet and structural. The application root is flat and full-bleed. Hierarchy comes from white surfaces, green hairline borders, and spacing rather than a simulated device or presentation card.

- Do not apply a radius, border, or shadow to the production application root.
- Product cards, fields, category cards, and receipt content use borders without drop shadows.
- Product photography keeps its natural shadow and transparent background.
- POS product and cart photos fit completely within their existing image boxes
  (`object-fit: contain`); wide food photos must not be cropped like portraits.
- Do not add gradients, glass effects, glow, or black shadows.

## Shapes

The shape system has three documented roles.

- Cards use 20 to 22 pixels.
- The receipt panel uses 28 pixels. The production application root has no radius.
- Interactive controls use 24 pixels or `{rounded.full}` for a pill or circle.
- Product image crops use 10 pixels.

Do not invent intermediate radii. A new component must choose the closest existing role.

## Components

Shared components are contracts, not duplicated screen-specific markup. The Pencil library contains the visual masters. The HTML catalog contains matching class implementations. The production implementation uses React, Vite, Astryx, and Boxicons inside a Capacitor Android application.

| Component | Required content | Variants and behavior |
| --- | --- | --- |
| `PosShell` | header, menu content, receipt rail | Full-bleed landscape application root at the target size; cream gutters may adapt on wider screens. |
| `HeaderBar` | logo asset, live date/time, report action, cashier | One horizontal line. Use the real OLASO asset; date and time never wrap and time follows the terminal clock-format preference. The Report pill appears only for the owner, prints today's report, and shows its busy state without moving the layout. Carries no notification control until real alerts exist. |
| `ProfileControl` | staff name, role, profile menu | Preserve the 178 by 50 Header control. Every role sees one 44-pixel `Lock / switch staff` action; only the owner sees Settings, and Settings is omitted when already open. |
| `SearchField` | query, search action | 320 by 50 at the target viewport. The magnifier and the input sit on one line in explicit grid columns. Visible focus state. Never use placeholder text as the only accessible label. A clear control stays visible whenever the query is not empty, including after the keyboard is dismissed. POS, Orders, Products, and Stock search fields follow that rule. |
| `QuickAddRow` | best-seller chips | Up to three equal-width 50-pixel-tall chips carrying a product name only at 15px, filling the remaining width beside the search field. Chips come from saved tablet sales, never a fixed list, and the row renders nothing when there are none. An unusually long name may ellipsis. |
| `CategoryCard` | name, item count, status, illustration | `active`, `default`, `warning`. Illustration stays clipped to the right half and feels embedded in the card. |
| `ProductCard` | name, price, transparent product image, add action | 174 by 162. Image fits completely inside 146 by 100 at x 14, y 6. Add control is 44 by 44 at x 122, y 107. A long name or price ellipsises before that control. The price is 11px in a slightly softer ink than the name. Only the add control adds to the order. |
| `SegmentedControl` | options, selected option | 296 by 50. Only one selected segment. An Operational Green pill marks the selection immediately in POS service and payment controls; selected labels are white and unselected labels use dark-soft at the same 11px/600 weight. Other existing selectors retain their motion. Cash/Card, top navigation, Orders status, and Reports tabs use the same green pill. Products category rows use it vertically. Products sidebar category names stay 12px, one line, and ellipsis; they never wrap or push the product count out of the row. Orders, Products, and Stock table row highlights use the same vertical slide and cream selected fill. Products and Stock keep the green mark; Orders does not. Column headers on those three tables are centered over their values. |
| `LabeledField` | visible label, current value | Text and in-app `MenuSelect` list. Control is 129 by 48 on Lock; compact form lists are 36px tall. |
| `MenuSelect` | options, current value | One in-app list from Lock. Lock size keeps the 54px identity control; ordinary lists use the compact size, while a form field may match its neighboring input height (the Staff role field is 48px). Do not use the Android native select. Dates use the shared period calendar attached to the field. Reports and Orders range pickers keep quick periods on the left and the month grid on the right; Costs uses the Reports global period instead of a second month picker. Orders opens on Today and offers Today, Yesterday, This week, Last week, This month, Last month, and All. Date-only fields (Add expense, Add monthly pay) omit the quick-period column and use a 248px month grid. The opener toggles: a second tap on the same button closes it. It opens below the button when there is room, otherwise above. Only the quick period the operator actually chose stays highlighted. A first tap selects a day; a second tap on another day selects the range and keeps the first day when the month changes. |
| `OrderLine` | product, unit price, quantity, size, note, total, Offert | Keep the total right-aligned. Gift and trash keep 44-pixel hits with 36-pixel circles and 8-pixel gaps; green when Offert is active; charged total 0,00. A note is optional. |
| `QuantityStepper` | decrement, quantity, increment | Cart line uses a 100 by 36 pill; plus and minus keep independent 44-pixel hits. Disable decrement at the minimum and expose an accessible value. |
| `PaymentSummary` | total, optional Offert | Pin Total at the bottom of the 115-pixel block, just above Place order. Show Subtotal and Offert only when an Offert amount is greater than zero; those rows expand upward between Payment Details and Total so Total does not move. When they are hidden, the cart list uses that empty space so three lines fit, and keeps a 16-pixel gap above Payment Details. Use tabular figures; the confirmed policy has no tax row. |
| `PrimaryAction` | Split, Place order, order total |296 by50,88px outlined Split plus8px gap and green Place order. Total sits below the primary label. Disable while overlay open/submitting; Split additionally needs two paid units. Card saves directly, Cash opens amounts. |
| `PaymentDialog` | due, quick amounts, custom given, change |480px wide, at most640px tall and viewport-bounded. Cash Place order opens one tender; only the rail Split action opens split mode. No internal Split toggle. Two product lists scroll independently in an intrinsic-height area capped at four44px rows plus heading (196px); payment method,20/50/100/200 chips, custom amount, Given/Change and footer stay outside it. Recorded payer history is bounded/scrollable too. Short keyboard viewports allow outer scrolling. Offert lines stay off lists. Names ellipsise; prices stay right. Cannot close after the first payer. Card is exact due, change0. |
| `ReceiptRail` | service mode, payment method, order, clear cart, totals, primary action | 320 by 688 at the target viewport. A centered Current order title sits at the top with an always-visible clear-cart trash on the right (gray when empty, active when the cart has lines). Dine In / Take Away and Cash / Card sit under that row; payment details and Place order stay at the bottom. An empty cart list is blank. Each line uses the same compact card outline. |

Use existing components before adding a new one. A visual difference that can be expressed as content or a documented variant is not a new component.

## Implementation Contract

### Stack

- React and Vite with TypeScript.
- Astryx components and the local `Olasotheme-theme.ts` theme.
- `@boxicons/react` for interface icons. Use the basic pack consistently and import icons directly.
- CSS Modules for Olaso-specific layout and appearance.
- React state for the first POS screen. Add a state library only when shared cross-route state proves necessary.
- Capacitor supplies the installable Android APK/AAB after the browser implementation matches the approved screen.

The initial screen is light-only so system dark mode cannot alter the approved palette. Dark mode requires a separately designed and tested specification.

### Required file ownership

Every named React component lives in its own `.tsx` file and owns a colocated `.module.css` file when it has component-specific styles.

```text
src/
  main.tsx
  App.tsx
  globals.css
  features/pos/
    PosScreen.tsx
    PosScreen.module.css
    data/
      categories.ts
      products.ts
    components/
      HeaderBar.tsx
      HeaderBar.module.css
      SearchField.tsx
      SearchField.module.css
      CategoryCard.tsx
      CategoryCard.module.css
      CategoryList.tsx
      CategoryList.module.css
      ProductCard.tsx
      ProductCard.module.css
      ProductGrid.tsx
      ProductGrid.module.css
      ReceiptRail.tsx
      ReceiptRail.module.css
      OrderLine.tsx
      OrderLine.module.css
      QuantityStepper.tsx
      QuantityStepper.module.css
      PaymentSummary.tsx
      PaymentSummary.module.css
      PaymentDialog.tsx
      PaymentDialog.module.css
  data/
    localDatabase.ts
    sync.ts
    outbox.ts
  printing/
    printReceipt.ts
    receiptModel.ts
    mockPrinter.ts
  lib/
    theme/
      Olasotheme-theme.ts
```

`App.tsx` only renders the screen. `PosScreen` owns screen composition and transient order state. Leaf components receive data and callbacks through props.

Do not split ordinary markup into meaningless components. A component earns a file when it is reusable, independently interactive, or a named region in the component contract above. Do not use barrel files; import components directly from their files.

### CSS ownership

- `globals.css` contains only the reset, Astryx stylesheet imports, fonts, semantic root variables, body defaults, and the full-viewport baseline.
- Each component's geometry, variants, responsive rules, and interaction states live in that component's CSS Module.
- `PosScreen.module.css` may define the page grid and region placement; it must not restyle child internals.
- Never collect unrelated component styles in one file.
- Never copy the same declaration block into multiple modules. Promote genuinely shared values to semantic tokens, not a shared dump of selectors.
- Avoid inline styles except for a value that is genuinely calculated at runtime.
- Component CSS uses semantic custom properties or Astryx tokens; raw color values belong in the theme/token layer only.

### UI and data boundary

- React components contain presentation and local interaction logic only. They never create database clients, run SQL, read secrets, or contain persistence queries.
- `features/pos/data/` holds temporary static product and category data until the local database is introduced.
- Money and stock calculations are pure functions outside components and keep the runnable checks required by `ARCHITECTURE.md`.
- Feature hooks or screen actions call the application data layer; leaf components only receive data and callbacks.
- SQLite, outbox synchronization, and Convex client code live in the data/sync layer defined by `ARCHITECTURE.md`.
- The APK contains no administrative secret. Public Convex operations validate every argument, identity, permission, price, and stock effect.
- Do not create speculative repositories, interfaces, or adapters around the selected data tools.

### Printing boundary and deferred hardware test

- React components never contain ESC/POS bytes, Android socket logic, printer
  connection handling, or vendor SDK calls.
- `src/lib/printing/printReceipt.ts` is the single application-facing printing function.
- Browser development keeps the deterministic receipt preview and reports the native printer as unavailable; it never simulates paper success.
- The supplied Samsung Galaxy Tab A9 and WDLink WD8260 are available. Replace
  the mock internals through the Goal 03 Capacitor plugin backed by a bounded
  native Kotlin TCP socket and verified WD8260 ESC/POS bytes.
- Prefer the proven generic ESC/POS commands over a proprietary SDK while the
  physical printer continues to pass the compatibility tests.
- The production APK transport is Ethernet/LAN through the router. USB remains
  a standalone desktop receipt-lab path; do not add Android USB or Bluetooth
  transport without a later confirmed requirement.
- Persist the sale before printing. A print failure must not create a duplicate order or erase the receipt; show a clear `Reprint receipt` action.
- The accepted initial receipt is French/English with checked CP858 behavior.
  Arabic and other unsupported-script bitmap rendering are deferred until the
  owner requires them.
- Printed item detail uses one product-and-size heading and one indented,
  middle-dot-separated choices line that wraps cleanly. Do not prefix every
  choice with `+`, and never render Offert as a choice; its zero line charge and
  single totals deduction communicate it.

The application is not production-approved until the real tablet and printer
pass LAN connection, print, cut, recovery, and endurance testing.

### Astryx and icon rules

- Use an Astryx primitive when it matches the required semantics and interaction behavior.
- Olaso geometry and tokens override Astryx's default appearance. Align `Olasotheme-theme.ts` with this file before visual implementation.
- Use Boxicons instead of emoji, Unicode symbols, improvised CSS icons, or icons from a second library.
- Icon-only controls require an accessible name. Decorative icons use `aria-hidden="true"`.
- Icons inherit `currentColor`; component CSS controls their color.

## Interaction and State

- After its first authorized visit, each top-level screen returns in the state
  the operator left it: content, selection, search, filters, report period, and
  scroll position remain prepared. Locking/switching staff clears retained
  management-screen state; LOCK-01 separately decides unfinished-cart handoff.
- Previously saved content stays visible during background refresh. Use a
  full-page loading state only when that screen has no safe saved snapshot;
  never replace a usable screen with a spinner, skeleton, or empty state merely
  because the operator navigated away and back.
- A tab switch provides immediate pressed/selected feedback and does not wait
  for internet, SQLite, image decoding, or a decorative transition. A restrained
  125-to-150-millisecond opacity transition may be added only after measured
  navigation is already immediate and must respect reduced motion.
- The shared Header and Lock clock read tablet time locally, refresh immediately
  on foreground/resume, and then continue their normal interval without an
  internet dependency.
- The Header reserves fixed brand, navigation, and action columns. Changing
  language or 12/24-hour format never shifts navigation; keep the clock visible
  and ellipsize only an exceptionally long date within its reserved space.
- Saving a Settings preference disables repeated submissions without dimming
  the entire preference group. Initial unavailable/loading controls may dim.
- A deliberate staff switch with an unfinished order uses one concise native
  confirmation that says the order will remain. Cancel keeps the current staff
  and order; confirm locks and hands the order to the next verified staff
  member. An empty order locks immediately.
- Tapping a product adds one unit to the active order and provides visible pressed feedback within 100 milliseconds.
- Quantity controls update the line total, subtotal, and total immediately.
  Decrement is disabled at the minimum allowed value.
- Category selection changes the visible catalog without changing card dimensions.
- Search filters product names and categories without clearing the current order.
- Service mode has exactly one selected option: `Dine-in` / `Sur place` or
  `Take-away`. The small café uses no table selector and has no online mode.
- `Place order` is disabled for an empty order and while submission is in progress.
  Separate tap buttons: Place order saves Card directly or opens Cash amounts;
  Split opens mixed payment directly. Repeated in-flight taps do not resubmit.
- Customization keeps full-width option rows in two independent columns within
  a620px dialog when several groups exist. Assign whole groups to the shorter
  column using full option counts; selections never rebalance them. One shared
  scroll region and fixed header/footer; maximum660px height bounded by viewport.
  Single-group products remain320px wide. Preserve current palette and typography.
- Successful submission shows a concise confirmation and starts a fresh receipt only after the local sale transaction commits.
- After local persistence succeeds, printing is attempted once and cloud synchronization runs in the background.
- A print failure preserves the completed sale and exposes `Reprint receipt` without resubmitting the order.
- Orders detail presents Reprint and Cancel as the two footer actions.
  Subtotal, Offert, total, and tender rows hug their content above those
  actions. The payment band grows only when split tenders need it, then
  scrolls at 136px so they never cover Reprint or Cancel. Payment and
  actions stay at the bottom of the card for both completed and cancelled
  receipts.
- The Settings left card uses four aligned preference columns (application,
  receipts, clock, auto-lock), followed by a left-aligned printer block, compact
  sync facts and updates. Keep the existing card bounds and use normal vertical
  flow with overflow only for additional feedback/update content, never overlap.
  Controls are48px; no oversized separate sync tiles. It keeps one printer
  host:port field, Test printer, Sync, and Check for update. Staff & access is
  the right card. Auto-lock offers5/10/15/30minutes and Never; manual Lock remains
  in the Header. There is no Restore saved logo
  action. Both keep 44-pixel targets and ask the operator to inspect paper
  rather than claiming it.
- The owner-only Staff & access panel lists name, role, and quiet `Ready` or
  `Waiting to sync` state. Its Add staff dialog uses only persistent labels for
  name, role, six-digit PIN, and PIN confirmation plus Cancel and Add staff;
  no field receives a decorative icon or identity/storage explanation.
- The current diagnostic explanations are a functional baseline, not final
  coffee-shop copy. POLISH-01 decides what the owner wants shortened or hidden;
  POLISH-02 keeps everyday labels concise and moves retained support detail
  behind deliberate disclosure.
- A local persistence failure keeps the order intact. A cloud failure marks the saved sale as waiting to sync without blocking service.
- Overlays do not steal keyboard focus. A backdrop tap dismisses an open
  keyboard first; a second backdrop tap closes the overlay. After the first
  recorded PaymentDialog tender the overlay cannot close.
- Authorized management saves use the same immediate local feedback. A quiet
  `Waiting to sync` state may communicate pending cloud acknowledgement, but
  offline status never disables an otherwise valid management form.
- Product editing shows the selected product's real sizes and owner-created
  choices rather than four fixed Size/Milk/Syrup/Extras placeholder cards. A
  product with one size does not force an unnecessary cashier size selection.
  Size and choice chips stay on one compact line (name plus price or choice
  count). They fill two rows in the Sizes & options band, then scroll
  sideways. They do not stack availability under the price.
- Product choice controls use concise owner-facing labels for Add, Replace,
  Set amount, Remove, or No stock change. `Copy choices from another product`
  is required; avoid global-group management screens, decorative icon clutter,
  technical explanations, and hidden cross-product editing effects. The Choices
  and Recipe overlays use the same cream card, Cancel/Save footer, and
  hairline rows as Category and Payment. Choices is a 520-pixel card with
  compact 36-pixel fields, short name inputs, and spaced At least / At most
  counts; stock and per-size extras stay behind Stock / By size. Extra sits
  left of the price field; delete stays at the row’s right edge. One Usual per
  group. Tabs are groups; rows under them are choices. Number fields
  keep 0 as a placeholder, not a stuck digit. Recipe is a
  560-pixel card with Ingredient and Amount as row labels and four compact
  name-then-amount columns. It does not explain versioning.
- Edit Product may show a compact honest ingredient-cost range or incomplete
  state. It does not show a gross-profit/margin panel, a detailed simulated
  configuration preview, or packaging costs. Deeper comparison placement is
  deferred until the owner chooses it.
- Ordinary Products and Stock lists exclude archived records. Archived items
  appear only after the operator deliberately selects the existing Archived
  filter; restoration stays available there.
- Loading, empty, unavailable, disabled, pressed, focused, success, and error states are required implementation states, not optional polish.

Motion is restrained: 125 to 200 milliseconds for color, opacity, and state-layer transitions. Never animate flex or grid layout dimensions. POS category selection wipes green in from the left on the tapped card only, in 125ms; the previous card snaps off. It never travels the gap between cards. The product grid does not animate. Respect `prefers-reduced-motion`.

### POS control polish — browser review candidate

SAAS-02 applies Apple's response, clarity, and restraint principles to the
existing POS. Physical tablet acceptance and Pencil master reconciliation are
pending; see `SAAS_TRANSITION.md` for evidence. This is not an app-wide redesign.

- Service and Cash/Card selections update the pill and text together instantly.
  Press feedback uses a state layer; targets never shrink, bounce, or move.
  Selected green controls retain a visible white inset keyboard-focus outline.
- Place order, Split, popup actions, search clear, and quantity controls respond
  on press with shading or color. Keep native click/release activation and all
  disabled guards. Quantity/search hit areas remain circular during feedback.
- Product-choice dialogs retain 320/620px widths, bounded scrolling, and fixed
  header/footer regions. Use 22px headings, 13px option/group text, 11px supporting
  text/prices, and 12px footer labels. Option rows are at least 48px with 8px gaps;
  long names wrap. Selected rows use a green outline and soft green fill while
  retaining the actual radio/checkbox mark.
- Payment retains its 480px width and 640px height cap. Use a 26px amount,
  11px eyebrow, 12px custom-field label, and 13px amount/method/footer controls.
  Secondary split-payment details remain 10–12px. Payment method buttons have
  44px height; list headings wrap instead of clipping. No changes to payment math,
  selection requirements, close restrictions, or the native keyboard boundary.
- The two POS dialogs appear directly, with no entrance motion or delayed input.
  This remains appropriate with reduced motion enabled.

### Category artwork

- Category names and artwork are separate data. Management chooses one key from
  a curated bundled gallery instead of depending on name matching.
- The initial gallery contains Olaso neutral, Coffee, Tea & matcha, Cold drinks,
  Bakery, and Snacks & sweets. Each source is a true-alpha 320 by 320 lossless
  WebP in Operational Green and renders as decorative artwork.
- Include common café directions, but do not attempt an exhaustive category
  list. Every unknown or custom category uses one neutral Olaso illustration
  until the owner selects another gallery asset.
- Artwork stays decorative, right-aligned behind the text layer, right-sized for
  the 234 by 120 card, and available offline. Do not generate it at runtime or
  use generic stock coffee imagery.
- Artwork must retain a compact, bold silhouette with substantial opaque green
  weight at card size. Do not use sparse technical line drawings that disappear
  on the inactive white card.

## Accessibility and Operational Safety

- The shared Header offers a keyboard-only skip link before navigation, using
  the existing white/green focus treatment and a 44px target. It is offscreen
  until focused. Screen changes focus the active main after it becomes visible,
  without stealing focus from its controls or open overlays; they update
  the document title and keep outgoing retained content inert; preserve scroll
  and unfinished input. Profile's spoken name includes its visible name/role.
- Owner-approved text selection: interface labels and displayed values are
  unselectable, including menus, popovers and dialogs. Editable text fields
  retain normal selection and copy/cut/paste with platform password safeguards.
  Roll out per screen through `UI_POLISH_LEDGER.md`; cover portalled overlays
  explicitly. Do not cancel input, focus, scrolling or clipboard events.
- Maintain a minimum 44 by 44 CSS-pixel interactive target; prefer 48 by 48 for Android controls where the approved layout permits it.
- Keep at least 8 pixels between independent touch targets.
- Preserve visible keyboard focus with a 2-pixel Operational Green outline and sufficient offset.
- Native buttons and inputs are preferred beneath Astryx styling. List menus use the shared in-app `MenuSelect` (Lock appearance). Dates use the shared period calendar.
- `MenuSelect` and the staff menu use the WebView Popover top layer so sibling controls and panel clipping cannot cover them. Lists stay within the viewport, open above the trigger when necessary, and remain open during internal scrolling. Long option labels wrap with automatic row height. Preserve the existing trigger geometry and outside-tap/Escape dismissal.
- Table text must retain room for letter descenders: clipped name/date cells use a 1.4 line height without increasing the approved table row geometry.
- Form fields have persistent visible labels. Placeholders are examples, not labels.
- Meaningful product images have useful alt text; decorative category artwork has empty alt text.
- Status never relies on color alone. Pair danger and availability colors with text or an icon.
- Reading and tab order follow the visual order: header, search, categories, products, receipt.
- Prices and totals use tabular figures and locale-aware currency formatting.
- The order remains recoverable after network failure. Never clear it before confirmed success.

## Definition of Done

A screen is complete only when all of the following are true:

- It matches the approved Pencil composition at a 1340 by 800 browser viewport.
- The cream app background reaches every edge; no sage presentation backdrop or floating shell appears.
- Header, search, category row, product grid, and receipt rail use the documented positions and dimensions.
- Product cards remain 174 by 162 and category cards remain 234 by 120 at the reference viewport.
- Every named component is in its own `.tsx` file and any component-specific CSS is colocated in its own `.module.css` file.
- No React component imports a database client or contains persistence logic.
- Astryx supplies applicable primitives, Boxicons supplies all interface icons, and the Olaso tokens control their appearance.
- Keyboard focus, accessible names, touch targets, pressed feedback, empty state, loading state, and failure recovery are verified.
- Product images reserve their dimensions and do not cause layout shift.
- Native launch, WebView startup, and the first React frame use one continuous
  branded cream surface with no default Capacitor or blank-white frame.
- The production build succeeds without TypeScript or lint errors.
- A screenshot comparison is performed at the reference viewport and again on the physical tablet WebView before Android packaging is considered approved.
- The mocked printing flow is verified during development. Production approval
  additionally requires the supplied tablet and printer to pass the accepted
  French/English text, resident logo, long-line, cut, LAN reconnect, paper
  replacement, reprint, and repeated-print tests. QR and Arabic are tested only
  if their deferred scopes are later approved.

## Do's and Don'ts

- Do use `DESIGN.md` as the token and behavior authority.
- Do use the reusable Pencil masters for design iteration.
- Do use `components.html` to compare implementations visually.
- Do keep category illustrations on the right and behind the text layer.
- Do use transparent product PNGs with declared dimensions.
- Do preserve 44-pixel touch controls and 8-pixel minimum separation.
- Do provide pressed, disabled, focus, loading, empty, and error states in production components.
- Do keep each named component and its CSS Module in separate colocated files.
- Do keep persistence and database code outside React component files.
- Do keep operational language short: "Order sent", "Payment failed", "Item unavailable".
- Do keep uncommon technical and support detail behind progressive disclosure.
- Do keep presentation canvases and device mockups outside the production screen node.
- Do place the operational layout within the 18-pixel tablet gutters from left to right.
- Do not stretch the menu across the full 1340-pixel canvas.
- Do not widen product cards beyond the approved aspect ratio to consume empty space.
- Do not recreate the OLASO wordmark with a font.
- Do not add a second component when a variant or prop covers the difference.
- Do not create a giant page component or a global stylesheet containing all component rules.
- Do not import database clients, server secrets, or persistence queries into client components.
- Do not use gradients, glass, glow, coffee-bean decoration, or generic cafe stock imagery.
- Do not use brand playfulness during payment, refunds, or error recovery.
- Do not lock production colors, fonts, languages, or hardware assumptions that are still marked provisional in `BRAND.md`.

## Dashboard polish candidate — 20 September 2026

UI-01 preserves the current light-mode layout by explicit owner instruction.
Its live geometry is the reference for this pass: sales x18/y92/886×686,
stock x922/y92/400×334, recent orders x922/y444/400×334, inside 1340×800.
The older Pencil Dashboard frame `wEoEi` has different panel dimensions and is
historical for this pass; do not resize the application to match it. This
supersedes that frame's Dashboard geometry only, not the POS frame `W26Y6`.
Owner acceptance of the completed pass remains separate from implementation.

- Keep the existing full-bleed 1340 × 800 three-panel Dashboard composition.
- Use 12–17px Dashboard supporting text, 22px metrics and a 44px net-sales total.
  Stock/cancellation labels, chart-detail dates and the best-seller caption
  reuse the 12px supporting-text size. Recent-order separators begin at the
  receipt text's existing 44px row inset.
  Owner-approved Recent orders rows have two lines: receipt number and amount,
  then time and service mode. Omit item count and routine Completed labels;
  keep Cancelled visible on the second line. The full timestamp remains on the
  semantic time element. The latest-four data limit is unchanged.
- Recent orders and Needs attention use borderless green View all navigation
  actions with a chevron and their existing 48px hit height.
- POS service/payment labels reuse the 13px control text size. Cash/Card has a
  48px hit height. Choice/payment close controls have 48px hit areas; close and
  Cancel are borderless secondary actions, with visible focus and press feedback.
  Green confirmation remains primary. The option-row appearance awaits owner
  selection; do not attribute that product choice to the Apple skill.
- Dashboard View all/retry and shared staff-popup actions have 48px-high CSS
  hit areas, visible focus and stable immediate pressed feedback. Do not infer
  native dp equivalence until checked on the tablet. No bounce or travel effect.
- Selecting a chart day shows its date and exact amount in an anchored label;
  first/last labels stay within the chart. Escape or leaving the chart clears
  selection. Axis labels abbreviate large values; details retain exact amounts.
  Grid lines align with the proportional bar heights. Declines use the existing
  warning colors plus explicit text and icon, never color alone.
  Bar heights remain proportional down to zero; do not add a decorative
  minimum height. An all-zero period uses the existing chart-state message
  instead of repeated zero ticks. Comparison percentages follow the selected
  language's decimal convention and retain one decimal place.
  Loading, unavailable and no-comparison messages use the existing neutral
  status treatment without a trend arrow; green/red arrows describe an actual
  available comparison only.
- Unknown/loading/failed summaries display dashes and a chart-state message;
  a confirmed empty snapshot displays zero. Failures offer retry. Do not present
  stale snapshot totals as current when refresh fails.
- Long stock names wrap and the existing list scrolls vertically when needed.
  The shared staff popover is 232px wide with 13px action/error copy and 48px
  language/action controls. Its trigger and header geometry remain unchanged.
  Staff popover actions retain native button semantics and Tab navigation;
  Escape returns keyboard focus to the profile trigger.
- Staff-switch confirmation and report errors remain platform-owned prompts;
  CSS cannot style their native surfaces. Their physical Android review is pending.
