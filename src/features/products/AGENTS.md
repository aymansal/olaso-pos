# Products Feature DOX

## Purpose

Provides owner-facing category browsing, product selection, and product/recipe
editing presentation.

## Ownership

- `ProductsScreen.tsx` composes catalog and editor panels.
- `ProductCatalogPanel`, `CategorySidebar`, and `ProductList` own catalog
  browsing.
- `ProductEditorPanel` owns the selected product form and recipe presentation.
- `data/productsData.ts` owns current static product fixtures.

## Local Contracts

- Keep category, product, availability, price, and recipe presentation in one
  coherent editing workspace.
- Controls are visual fixtures until validated CRUD operations exist.
- Recipe editing must eventually create versions; never overwrite historical
  recipe meaning.
- Product records are editable data, not hardcoded permanent categories.

## Work Guidance

- Use available space to support editing, not decorative or unexplained
  actions.
- Keep list selection and editor content synchronized through the screen/panel
  boundary.
- Do not add database mutations directly to form components.

## Verification

- Run `npm run build`.
- Inspect Products at 1340 × 800, including compact fields, category layout,
  editor balance, and recipe/stock region.

## Child DOX Index

No child DOX files.
