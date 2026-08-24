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
    width: 966px
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

### Deferred owner-led simplification

- Do not redesign or “clean up” the working application piecemeal while
  functional or technical cards are still moving. Only after HARD-07 is
  complete does the owner review every screen and state on the real tablet and
  record the final keep/remove/shorten/hide choices.
- Treat redundant icons, corporate-sounding guidance, duplicate status, and
  permanently visible support detail as review candidates, not automatic bugs.
- Implement only the approved list. Preserve essential validation, destructive
  warnings, error recovery, and accessibility, using progressive disclosure to
  keep technical details out of the everyday operator path.

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
- Search field: y 90, height 50.
- Category row: y 148, width 966, height 120; three fixed 234-pixel cards with 10-pixel gaps.
- Product grid: y 276, width 966, height 502; five fixed 174-pixel columns distributed across each complete row. The final row stays left-aligned with 8-pixel gaps.

Product cards are intentionally narrow and tall. The wider tablet is used by an additional product column and a wider functional receipt rail, not by enlarging the cards. On a different landscape tablet, preserve these proportions and use an adaptive column count before changing card aspect ratios.

All primary touch targets are at least 44 by 44 pixels. Maintain at least 8 pixels between independent touch targets.

### Viewport behavior

- Treat 1340 by 800 as the design reference, not a promise that Android WebView CSS pixels equal physical screen pixels.
- The physical Galaxy Tab A9 SM-X115 exposes approximately 1007 by 601 CSS pixels for its 1340 by 800 panel. The native APK declares the fixed 1340-pixel HTML viewport and uses Android WebView wide-viewport overview mode to fit it by width before the page loads.
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
- On the Cream Surface, use the verified transparent Operational Green asset at
  `assets/brand/olaso-wordmark-operational-green-transparent.png`. Keep the
  official white-on-sage square master for sage or dark brand placements; white
  artwork is not visible enough on the cream launch surface.
- A short `Starting Olaso…` status may appear while SQLite and the local lock
  state initialize. It uses the operational type system, remains calm, and does
  not imply that internet access is required.
- Startup artwork reserves its final size and stays visually stable while the
  native-to-web transition completes. Do not hold the splash screen longer to
  disguise slow initialization.
- The immediate native frame is static. A single brief owner-approved light or
  line reveal may continue in the web startup state only if measurements show
  no startup regression; it animates transform/opacity, remains interruptible,
  and is removed under `prefers-reduced-motion`.
- Do not lock the animation to GIF, video, or another format before checking
  APK size, decode cost, frame quality, and timing on the physical tablet.
- The Android app icon requires a separately approved compact asset. Never crop
  or squeeze the wide launch wordmark into the launcher-icon mask.
- If startup cannot safely expose the application, show the actionable startup
  failure state on the same cream surface rather than a blank viewport.

## Elevation & Depth

Depth is quiet and structural. The application root is flat and full-bleed. Hierarchy comes from white surfaces, green hairline borders, and spacing rather than a simulated device or presentation card.

- Do not apply a radius, border, or shadow to the production application root.
- Product cards, fields, category cards, and receipt content use borders without drop shadows.
- Product photography keeps its natural shadow and transparent background.
- Do not add gradients, glass effects, glow, or black shadows.

## Shapes

The shape system has three documented roles.

- Cards use 20 to 22 pixels.
- The receipt panel uses 28 pixels. The production application root has no radius.
- Interactive controls use 24 pixels or `{rounded.full}` for a pill or circle.
- Product image crops use 10 pixels.

Do not invent intermediate radii. A new component must choose the closest existing role.

## Components

Shared components are contracts, not duplicated screen-specific markup. The Pencil library contains the visual masters. The HTML catalog contains matching class implementations. The production implementation uses React, Vite, Astryx, and Phosphor Icons inside a Capacitor Android application.

| Component | Required content | Variants and behavior |
| --- | --- | --- |
| `PosShell` | header, menu content, receipt rail | Full-bleed landscape application root at the target size; cream gutters may adapt on wider screens. |
| `HeaderBar` | logo asset, live date/time, order count, report action, alerts, cashier | One horizontal line. Use the real OLASO asset; date and time never wrap and time follows the terminal clock-format preference. |
| `SearchField` | query, search action | 966 by 50 at the target viewport. Visible focus state. Never use placeholder text as the only accessible label. |
| `CategoryCard` | name, item count, status, illustration | `active`, `default`, `warning`. Illustration stays clipped to the right half and feels embedded in the card. |
| `ProductCard` | name, price, transparent product image, add action | 174 by 162. Image is 72 by 92 at x 51, y 10. Add control is 44 by 44 at x 122, y 107. |
| `IconButton` | accessible label, icon | 44 by 44 minimum. Circle with a green hairline border. |
| `SegmentedControl` | options, selected option | 266 by 50. Only one selected segment. Selection uses Operational Green plus text. |
| `LabeledField` | visible label, current value | Text and select variants. Control is 129 by 48. |
| `OrderLine` | product, unit price, quantity, size, note, total | Keep the total right-aligned. A note is optional. |
| `QuantityStepper` | decrement, quantity, increment | 116 by 44 so both actions retain independent 44-pixel targets. Disable decrement at the minimum and expose an accessible value. |
| `PaymentSummary` | subtotal, total | Right-align values and emphasize only the total. Use tabular figures; the confirmed policy has no tax row. |
| `PrimaryAction` | action label, order total | 266 by 50. One primary action per screen. Disable it while submitting. |
| `ReceiptRail` | navigation, service mode, order, totals, primary action | 320 by 688 at the target viewport. The rail owns the final action and all order-editing controls; checkout stays uncluttered. |

Use existing components before adding a new one. A visual difference that can be expressed as content or a documented variant is not a new component.

## Implementation Contract

### Stack

- React and Vite with TypeScript.
- Astryx components and the local `Olasotheme-theme.ts` theme.
- `@phosphor-icons/react` for interface icons. Use one consistent weight per visual layer and import icons directly.
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

The application is not production-approved until the real tablet and printer
pass LAN connection, print, cut, recovery, and endurance testing.

### Astryx and icon rules

- Use an Astryx primitive when it matches the required semantics and interaction behavior.
- Olaso geometry and tokens override Astryx's default appearance. Align `Olasotheme-theme.ts` with this file before visual implementation.
- Use Phosphor icons instead of emoji, Unicode symbols, improvised CSS icons, or icons from a second library.
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
- Tapping a product adds one unit to the active order and provides visible pressed feedback within 100 milliseconds.
- Quantity controls update the line total, subtotal, and total immediately.
  Decrement is disabled at the minimum allowed value.
- Category selection changes the visible catalog without changing card dimensions.
- Search filters product names and categories without clearing the current order.
- Service mode has exactly one selected option: `Dine-in` / `Sur place` or
  `Take-away`. The small café uses no table selector and has no online mode.
- `Place order` is disabled for an empty order and while submission is in progress.
- Successful submission shows a concise confirmation and starts a fresh receipt only after the local sale transaction commits.
- After local persistence succeeds, printing is attempted once and cloud synchronization runs in the background.
- A print failure preserves the completed sale and exposes `Reprint receipt` without resubmitting the order.
- Orders detail presents Reprint, View receipt, and sync state as three 50-pixel actions without changing the approved panel geometry.
- The profile-owned Printer settings panel uses persistent IPv4/port labels,
  `Test printer`, and a secondary `Restore saved logo` setup action. The logo
  action requires an explicit replacement warning. Both keep 44-pixel targets
  and ask the operator to inspect paper rather than claiming it.
- The current diagnostic explanations are a functional baseline, not final
  coffee-shop copy. POLISH-01 decides what the owner wants shortened or hidden;
  POLISH-02 keeps everyday labels concise and moves retained support detail
  behind deliberate disclosure.
- A local persistence failure keeps the order intact. A cloud failure marks the saved sale as waiting to sync without blocking service.
- Authorized management saves use the same immediate local feedback. A quiet
  `Waiting to sync` state may communicate pending cloud acknowledgement, but
  offline status never disables an otherwise valid management form.
- Loading, empty, unavailable, disabled, pressed, focused, success, and error states are required implementation states, not optional polish.

Motion is restrained: 125 to 200 milliseconds for color, opacity, and state-layer transitions. Never animate layout dimensions. Respect `prefers-reduced-motion`.

### Category artwork

- Category names and artwork are separate data. Management chooses one key from
  a curated bundled gallery instead of depending on name matching.
- Include common café directions, but do not attempt an exhaustive category
  list. Every unknown or custom category uses one neutral Olaso illustration
  until the owner selects another gallery asset.
- Artwork stays decorative, right-aligned behind the text layer, right-sized for
  the 234 by 120 card, and available offline. Do not generate it at runtime or
  use generic stock coffee imagery.

## Accessibility and Operational Safety

- Maintain a minimum 44 by 44 CSS-pixel interactive target; prefer 48 by 48 for Android controls where the approved layout permits it.
- Keep at least 8 pixels between independent touch targets.
- Preserve visible keyboard focus with a 2-pixel Operational Green outline and sufficient offset.
- Native buttons, inputs, and selects are preferred beneath Astryx styling.
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
- Astryx supplies applicable primitives, Phosphor supplies all interface icons, and the Olaso tokens control their appearance.
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
