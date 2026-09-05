# Source Application DOX

## Purpose

Owns the React application mounted by Vite: app-level navigation, theme
application, global tokens, and the feature screens under `features/`.

## Ownership

- `main.tsx` mounts React and applies the pre-built Astryx Olaso theme.
- `main.tsx` mounts the single shared connection provider outside the local
  data/Convex boundary so Android connection and foreground truth can prevent
  the cloud client from opening while hidden or offline; screens consume it
  rather than registering network listeners.
- `App.tsx` selects the active top-level screen, mounts the shared Header, retains only previously
  visited role-authorized React Activity trees, and restores non-secret local
  terminal-lock state before exposing the application.
- `App.tsx` owns the single deliberate staff-switch action and the POS session;
  it preserves an unfinished cart across an in-process lock and never clears
  profile-scoped protected access. Lock/switch destroys every retained screen
  so the next staff member cannot inherit restricted management state.
- `App.tsx` mounts the reconnect worker only inside an authenticated staff
  session, so locked connection changes never perform cloud work.
- `data/` owns the application-level Convex provider, feature-facing data
  hooks, local SQLite boundary, operational cache, and outbox.
- `printing/` owns printer diagnostics, the Capacitor transport wrapper, the
  saved-snapshot receipt model, and deterministic WD8260 byte encoding; React
  components receive only plain settings, actions, and feedback.
- `components/` and `lib/` hold only proven cross-feature UI and formatting
  contracts; the overlay portal, in-app list menu, period calendar, locale
  dictionary, money formatter, stock-quantity formatter,
  and product-configuration resolver are the current examples.
- `globals.css` owns only font/reset imports, semantic root variables, body
  defaults, and the full-viewport baseline.
- Every CSS Module selector must start with a hashed class. CSS Modules leave a
  leading element selector global, so one lazily loaded screen chunk restyles
  every other screen for the rest of the session. `check:css-scope` enforces it.
- `features/` owns screen-specific composition, temporary fixtures where still
  required, components, plain feature types, and styles.

## Local Contracts

- Keep `App.tsx` a thin screen selector until real routing is required.
  The shared Header stays mounted there so top-nav selection can animate.
  POS and Lock stay eagerly imported; Dashboard, Orders, Products, Stock,
  Reports, and Settings load through `React.lazy` on first visit while
  previously visited authorized screens remain in React Activity boundaries.
  First navigation keeps the current screen visible until the next chunk is
  ready. Screen switches then crossfade: the outgoing page fades out while the
  incoming page fades in. Never flash an empty cream fallback.
- Preserve visited screen DOM/state with installed React Activity boundaries;
  hidden effects must stop and unvisited/unauthorized screens never mount.
  Do not replace this with a router, custom cache, or CSS-hidden live screens.
- Preserve the 1340 × 800 full-bleed cream application baseline.
- Keep browser previews unscaled. Android owns native fixed-viewport fitting;
  do not add JavaScript or CSS runtime scaling to the React entry point.
- Use direct imports; do not add barrel files.
- Global CSS may define shared semantic tokens, but not feature or component
  selectors.
- Keep persistence, synchronization, reporting queries, and printing outside
  React components.
- Keep Settings under the shared profile control rather than permanent
  navigation. The staff lock is the authentication boundary and application
  startup fails closed until a valid staff session is established.
- Do not add a shared-state library while local React state is sufficient.
- Shared list menus and the staff menu use native WebView popovers for top-layer
  painting; do not regress to sibling z-index escalation or clipped in-panel lists.
- App owns one configurable inactivity timer through lib/autoLock. Never disables
  this timer only; expiry checks on resume preserve elapsed background time.

## Work Guidance

- Reuse the existing Header and top navigation before creating another app
  shell.
- Put new screen work in the feature that owns it.
- Move code to a shared area only after at least two features genuinely need the
  same contract; do not create speculative shared layers.

## Verification

- Run `npm run build`.
- For visual changes, inspect the affected route at 1340 × 800 and check the
  browser console.

## Child DOX Index

- [`data/AGENTS.md`](data/AGENTS.md) — application data providers, local
  persistence, operational cache, and outbox boundaries.
- [`features/AGENTS.md`](features/AGENTS.md) — feature boundaries and shared
  screen conventions.
