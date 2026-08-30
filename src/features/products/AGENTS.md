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
- `ProductImageButton` owns the compressed product-photo picker used by Add
  product and the Edit Product artwork pill.
- `productManagementTypes.ts` owns the plain feature contracts passed to child
  components.
- `src/data/useProductManagement.ts` maps the saved SQLite operational catalog
  and exposes deliberate local-first feature actions.

## Local Contracts

- Keep category, product, availability, price, and recipe presentation in one
  coherent editing workspace.
- The catalog opens on All products. Category selection is an explicit operator
  action. Uncategorized is always the last sidebar row, even at count 0; it is
  a filter for products with no category, not a saved menu group, and cannot
  be renamed, archived, or deleted. Edit Product size and choice chips are
  one compact line and fill two rows, then scroll sideways.
- Search, availability, and sort sit on the Products title row with Add
  product. The product table shows a fixed page of seven equal-height rows
  with the same sliding three-page window as Orders; it does not scroll, and
  short pages do not stretch rows. Each column header sits
  over that column’s values. PRODUCT lines up with the product name; the
  icon stays in the leading gutter. Table rows show the product name only;
  the product code stays on Edit Product. Add product, Add category, and Add
  ingredient keep their compact layouts with larger type and 47-pixel fields.
  Add product is name plus photo on one row, category and price on the next.
  Sizes keeps name, price, order, availability, default, and delete on one
  line with a shared header row. Photos are
  compressed to a small JPEG on the tablet before SQLite or Convex. The Edit
  Product artwork pill stays in place and opens the same photo picker.
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
- Delete permanently removes a live category or product. Do not archive a
  product from Edit Product or the availability filter; ordinary lists still
  exclude leftover archived rows. Category archive/restore stays on the
  category manage menu. Historical orders and recipes stay intact; deleting a
  category leaves its products uncategorized.
- Offline reads and authorized writes use the saved operational cache and must
  never remain on a live loading state. Cloud acknowledgement follows later in
  dependency order.

## Work Guidance

- Use available space to support editing, not decorative or unexplained
  actions.
- Keep list selection and editor content synchronized through the screen/panel
  boundary. Sizes save only new or changed rows, with the default size last, so
  adding a size does not rewrite already saved sizes.
- Do not add database mutations directly to form components.
-   Keep dialogs inside the tablet viewport, with bounded internal scrolling when
  option or recipe rows exceed the available height. Choices is a 520-pixel
  card with compact 36-pixel fields, short names, and spaced At least / At most
  counts; Copy / Stock / By size stay quiet. Extra sits left of the price;
  one Usual per group; tabs are groups and rows are choices. Number fields keep 0 as a
  placeholder, not a stuck digit. Recipe is four compact columns in
  a 560-pixel overlay, with Ingredient and Amount as row labels; it does not
  explain versioning.

## Verification

- Run `npm run build`.
- Inspect Products at 1340 × 800, including compact fields, category layout,
  editor balance, and recipe/stock region.

## Child DOX Index

No child DOX files.
