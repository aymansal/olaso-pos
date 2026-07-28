# Feature DOX

## Purpose

Owns the six top-level application screens and their local components,
temporary fixture data where still required, and CSS Modules.

## Ownership

Each feature owns:

- one `*Screen.tsx` composition root;
- its screen CSS Module;
- named subcomponents in individual folders;
- temporary static data under `data/`.

The POS feature currently also owns the Header and TopNavigation used by every
screen.

## Local Contracts

- Screens receive `onNavigate` and identify their active `NavigationPage`.
- A screen module places regions; child modules style child internals.
- Keep any remaining static screen data in the feature's `data/` folder instead
  of embedding large arrays in JSX.
- Components receive plain data and callbacks through props.
- Do not import another feature's private components. The current shared
  Header/TopNavigation import from POS is the only established exception.
- Do not add backend, database, sync, or printer logic to feature components.

## Work Guidance

- Prefer a documented variant or props on an existing component over a nearly
  identical new component.
- Create a component file only for a reusable, independently interactive, or
  clearly named screen region.
- Keep fixture data visibly temporary; operational records move behind the data
  layer defined in `ARCHITECTURE.md` one feature at a time.

## Verification

- Run `npm run build`.
- Inspect every touched screen at 1340 × 800 after shared shell changes.
- Inspect only the owning screen after isolated feature changes.

## Child DOX Index

- [`dashboard/AGENTS.md`](dashboard/AGENTS.md) — operational overview.
- [`orders/AGENTS.md`](orders/AGENTS.md) — order history and order detail.
- [`pos/AGENTS.md`](pos/AGENTS.md) — sales workspace, receipt rail, and shared
  application shell.
- [`products/AGENTS.md`](products/AGENTS.md) — product catalog and editor.
- [`stock/AGENTS.md`](stock/AGENTS.md) — ingredient inventory and detail.
- [`reports/AGENTS.md`](reports/AGENTS.md) — report summaries, charts, and
  product performance.
