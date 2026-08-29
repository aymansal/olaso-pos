# Products Feature DOX

## Purpose

Provides owner-facing category, product, size, product-owned choice, and
recipe management with saved tablet presentation during an outage.

## Ownership

- `ProductsScreen.tsx` owns live workspace state and composes the catalog,
  editor, category dialog, and product create dialog.
- `ProductCatalogPanel`, `CategorySidebar`, and `ProductList` own catalog
  browsing.
- `ProductEditorPanel` owns product editing and opens the size, product-owned
  choice, and recipe dialogs.
- `CategoryArtworkPicker` owns the compact six-choice bundled artwork selector
  inside the existing category dialog.
- `productManagementTypes.ts` owns the plain feature contracts passed to child
  components.
- `src/data/useProductManagement.ts` maps the saved SQLite operational catalog
  and exposes deliberate local-first feature actions.

## Local Contracts

- Keep category, product, availability, price, and recipe presentation in one
  coherent editing workspace.
- The catalog opens on All products. Category selection is an explicit operator
  action.
- The product table shows a fixed page of six rows with the same sliding
  three-page window as Orders; it does not scroll.
- Keep leaf components prop-driven; only the application data hook imports
  Convex.
- Category, product, size, choice, and recipe writes use validated local domain
  actions plus the management outbox and surface synchronization failures
  without optimistic false claims.
- Category names and artwork keys are independent; every create/edit persists
  the explicit selection and missing/future keys render the neutral fallback.
- Every recipe save creates a new immutable version; never overwrite historical
  recipe meaning. The version lists which ingredients the product uses; each
  size stores how much of each ingredient it consumes.
- Product-owned choice sections belong only to the selected product. Editing
  them must never change another product. Choice values use typed ingredient
  effects (add, replace, set-exact, remove) with one default quantity and an
  optional per-size override.
- Do not present a single default-recipe cost, gross profit, or margin inside
  Edit Product. Show only a concise ingredient-cost range or an explicit
  incomplete state.
- Archive/restore remains optional. Concise confirmed category/product Delete
  actions permanently remove the live record while historical orders and
  recipes stay intact; deleting a category leaves its products uncategorized.
- Offline reads and authorized writes use the saved operational cache and must
  never remain on a live loading state. Cloud acknowledgement follows later in
  dependency order.
- Ordinary category/product lists exclude archived records. The existing
  Archived availability filter is the deliberate way to inspect/restore them.

## Work Guidance

- Use available space to support editing, not decorative or unexplained
  actions.
- Keep list selection and editor content synchronized through the screen/panel
  boundary. Sizes save only new or changed rows, with the default size last, so
  adding a size does not rewrite already saved sizes.
- Do not add database mutations directly to form components.
- Keep dialogs inside the tablet viewport, with bounded internal scrolling when
  option or recipe rows exceed the available height.

## Verification

- Run `npm run build`.
- Inspect Products at 1340 × 800, including compact fields, category layout,
  editor balance, and recipe/stock region.

## Child DOX Index

No child DOX files.
