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
- `App.tsx` selects the active top-level screen and restores the non-secret
  local terminal-lock state before exposing the application.
- `App.tsx` owns the single deliberate staff-switch action and the POS session;
  it preserves an unfinished cart across an in-process lock and never clears
  profile-scoped protected access.
- `App.tsx` mounts the reconnect worker only inside an authenticated staff
  session, so locked connection changes never perform cloud work.
- `data/` owns the application-level Convex provider, feature-facing data
  hooks, local SQLite boundary, operational cache, and outbox.
- `printing/` owns printer diagnostics, the Capacitor transport wrapper, the
  saved-snapshot receipt model, and deterministic WD8260 byte encoding; React
  components receive only plain settings, actions, and feedback.
- `components/` and `lib/` hold only proven cross-feature UI and formatting
  contracts; the shared receipt preview, money formatter, and stock-quantity
  formatter are the current examples.
- `globals.css` owns only font/reset imports, semantic root variables, body
  defaults, and the full-viewport baseline.
- `features/` owns screen-specific composition, temporary fixtures where still
  required, components, plain feature types, and styles.

## Local Contracts

- Keep `App.tsx` a thin screen selector until real routing is required.
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
