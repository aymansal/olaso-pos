# Products Feature DOX

## Purpose

Provides owner-facing category, product, modifier, and recipe management with
saved tablet presentation during an outage.

## Ownership

- `ProductsScreen.tsx` owns live workspace state and composes the catalog,
  editor, and category dialog.
- `ProductCatalogPanel`, `CategorySidebar`, and `ProductList` own catalog
  browsing.
- `ProductEditorPanel` owns product editing and opens the modifier and recipe
  dialogs.
- `productManagementTypes.ts` owns the plain feature contracts passed to child
  components.
- `src/data/useProductManagement.ts` is the application data boundary that maps
  Convex results and exposes deliberate feature actions.

## Local Contracts

- Keep category, product, availability, price, and recipe presentation in one
  coherent editing workspace.
- Keep leaf components prop-driven; only the application data hook imports
  Convex.
- Category, product, modifier, and recipe writes use the validated domain
  actions and surface backend failures without optimistic false claims.
- Every recipe save creates a new immutable version; never overwrite historical
  recipe meaning.
- Archive and restore records that history may reference; do not expose
  destructive deletion.
- Offline reads use the saved operational cache and must never remain on a live
  loading state. Protected management writes retain their server boundary.

## Work Guidance

- Use available space to support editing, not decorative or unexplained
  actions.
- Keep list selection and editor content synchronized through the screen/panel
  boundary.
- Do not add database mutations directly to form components.
- Keep dialogs inside the tablet viewport, with bounded internal scrolling when
  option or recipe rows exceed the available height.

## Verification

- Run `npm run build`.
- Inspect Products at 1340 × 800, including compact fields, category layout,
  editor balance, and recipe/stock region.

## Child DOX Index

No child DOX files.
