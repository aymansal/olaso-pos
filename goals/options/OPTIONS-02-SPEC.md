# OPTIONS-02 spec — Owner editor and independent copying

Follow [PROTOCOL.md](PROTOCOL.md) in full:

1. Read the AGENTS.md chain and this spec. Graphify first.
2. Research official Android/Capacitor guidance. Keep writes in Capacitor
   SQLite plus the existing management outbox. No Room. No second store.
3. Any bug stops the card.
4. Checks, then Tab A9 testing via `scripts/tablet-session.mjs`.
5. Commit `OPTIONS-02: …`, push `origin/main`, record the SHA.
6. Stop. Report in plain English. Ask before OPTIONS-03.

OPTIONS-01 storage must already be on `origin/main`.

## Outcome

The owner types the fiche technique: named sizes with prices, a base recipe
with per-size quantities, product-owned choice sections, typed ingredient
effects, and `Copy choices from another product`. POS still uses legacy shared
modifier groups until OPTIONS-03.

## Local-first writes

New functions in `src/data/localCatalog.ts` and `src/data/localRecipes.ts`.
Each write enqueues a `management.*` operation through
`src/data/localManagement.ts` with a parent dependency on the product.

Operation types (add to `managementOperation.ts`):

- `management.product-size.save`
- `management.product-size.delete`
- `management.choice-section.save`
- `management.choice-section.delete`
- `management.choice-copy`

Mirror retry-safe Convex mutations with `clientMutationId` and
`expectedRevision` in a new `convex/productConfiguration.ts` (or extend
`products.ts` / `recipes.ts` if smaller). Caps: 8 sizes, 12 sections, 30
values, 10 effects. Unique keys per product/section.

Deleting a size is blocked while any pending operation or unsynced sale
references it.

## UI

Rebuild inside `src/features/products/`. The editor panel is 440×686 with
absolute offsets — treat this as a layout rebuild, not a chip swap.

- `SizesEditorDialog` — name, price, availability, order, default size.
- `RecipeEditorDialog` — one quantity column per size, pre-filled from the
  default size. Base recipe still lists which ingredients.
- `ProductChoiceSectionDialog` — scoped to the selected product. Section
  name, required/optional, single/multiple, min/max, size applicability.
  Per value: name, price delta, optional per-size price, default selection,
  typed effect rows (Add / Replace / Set exactly / Remove, ingredient,
  replacement ingredient, default amount, optional per-size amount).
- Replace the shared-group chips in `ProductEditorPanel` (lines 325–358) with
  the product's sizes and sections. Keep a compatibility note that POS still
  uses legacy groups until OPTIONS-03.
- Remove `grossProfit`, `margin`, the cost paragraph at lines 405–407, and
  `.cost` in `ProductEditorPanel.module.css`.

Dialogs must fit 1340×800 with bounded internal scrolling, matching existing
ModifierGroupDialog (760×650, options 280px) and RecipeEditorDialog (680×650,
items 390px) patterns.

## Copy choices

Mandatory control: `Copy choices from another product`.

- Copy sections, values, selection rules, size applicability, prices, and
  effects into new destination IDs.
- Both products keep the same real ingredient IDs.
- Map size names automatically only when every source size name has exactly
  one destination size with the same name.
- Otherwise the owner resolves the mapping before the copied section becomes
  available. Never guess silently.
- Editing the destination never edits the source. Add a focused check that
  mutating the copy leaves the source rows unchanged.

## Permissions

Owner and manager may edit. Cashier is rejected at the local operation
boundary and in the UI (Products is already role-gated; prove it).

## Checks

`check:local-catalog`, `check:local-management`, `check:management`,
`check:product-configuration`, `check:permissions`, `npx tsc -b`,
`npm run build`, `npx convex dev --once`.

Tablet: owner creates a second size and a Cream section with per-size amounts,
copies to another product, edits the copy, confirms the source is unchanged,
offline create, restart, ordered reconnect. Cashier cannot open Products
management. Layout 1340×800, no clip, clean logcat.
