# Source Application DOX

## Purpose

Owns the React application mounted by Vite: app-level navigation, theme
application, global tokens, and the feature screens under `features/`.

## Ownership

- `main.tsx` mounts React and applies the pre-built Astryx Olaso theme.
- `App.tsx` selects the active top-level screen.
- `data/` owns the application-level Convex provider boundary and later local
  persistence and synchronization operations.
- `globals.css` owns only font/reset imports, semantic root variables, body
  defaults, and the full-viewport baseline.
- `features/` owns screen-specific composition, data fixtures, components, and
  styles.

## Local Contracts

- Keep `App.tsx` a thin screen selector until real routing is required.
- Preserve the 1340 × 800 full-bleed cream application baseline.
- Use direct imports; do not add barrel files.
- Global CSS may define shared semantic tokens, but not feature or component
  selectors.
- Keep persistence, synchronization, reporting queries, and printing outside
  React components.
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

- [`features/AGENTS.md`](features/AGENTS.md) — feature boundaries and shared
  screen conventions.
