# OPTIONS-01 spec — Product-owned size, choice, and exact-recipe storage

Follow [PROTOCOL.md](PROTOCOL.md) in full. Reproduced here because skipping a
link is how cards go wrong:

1. Read the AGENTS.md chain, PLAN.md, WORK_LEDGER.md, PRODUCT.md,
   ARCHITECTURE.md, DESIGN.md, this spec. Graphify first.
2. Research official Android/Capacitor guidance. Record the native-versus-data
   decision. Do not add Kotlin when Capacitor SQLite already fits.
3. Any bug stops the card and is fixed at the root.
4. Automated checks, then physical Tab A9 testing via
   `scripts/tablet-session.mjs`. Never guess coordinates.
5. Commit `OPTIONS-01: …`, push `origin/main`, record the SHA.
6. Stop. Report in plain English. Ask before OPTIONS-02.

This card is storage only. No Products editor rewrite. No POS checkout change.
The app must behave identically after install-over-upgrade.

## Android / Capacitor research gate

Record in the ledger:

- Offline-first: local SQLite is the source of truth; network is a queue.
  https://developer.android.com/topic/architecture/data-layer/offline-first
- Capacitor SQLite additive upgrades through `addUpgradeStatement` and
  `PRAGMA user_version`. Never rewrite a released migration.
  https://github.com/capacitor-community/sqlite/blob/master/docs/UpgradeDatabaseVersion.md
- Serialized transactions on the existing plugin thread.
  https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md
- WebView CDP for tablet evidence.
  https://developer.chrome.com/docs/devtools/remote-debugging/webviews

Decision: keep the existing Capacitor SQLite database. Reject Room,
WorkManager catalog sync, a second database, and a native rewrite.

## Data model

Eight new local tables in `src/data/schema.ts` as migration `toVersion: 20`.
Mirror them one-to-one in `convex/schema.ts`.

Write-time limits: 8 sizes per product, 12 sections per product, 30 values per
section, 10 effects per value.

### SQLite migration 20

Append after version 19. Do not edit 1–19.

```sql
CREATE TABLE product_sizes (
  id TEXT PRIMARY KEY NOT NULL,
  product_id TEXT NOT NULL,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  price_centimes INTEGER NOT NULL CHECK (price_centimes >= 0),
  sort_order INTEGER NOT NULL,
  is_default INTEGER NOT NULL CHECK (is_default IN (0, 1)),
  status TEXT NOT NULL CHECK (status IN ('active', 'unavailable', 'archived')),
  revision INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (product_id, key)
);
CREATE INDEX product_sizes_by_product
  ON product_sizes(product_id, status, sort_order);

CREATE TABLE recipe_size_quantities (
  recipe_version_id TEXT NOT NULL
    REFERENCES recipe_versions(id) ON DELETE CASCADE,
  ingredient_id TEXT NOT NULL,
  product_size_id TEXT NOT NULL,
  size_name_snapshot TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  PRIMARY KEY (recipe_version_id, ingredient_id, product_size_id)
);
CREATE INDEX recipe_size_quantities_by_size
  ON recipe_size_quantities(product_size_id);

CREATE TABLE product_choice_sections (
  id TEXT PRIMARY KEY NOT NULL,
  product_id TEXT NOT NULL,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  selection_mode TEXT NOT NULL CHECK (selection_mode IN ('single', 'multiple')),
  is_required INTEGER NOT NULL CHECK (is_required IN (0, 1)),
  minimum_selections INTEGER NOT NULL CHECK (minimum_selections >= 0),
  maximum_selections INTEGER NOT NULL
    CHECK (maximum_selections >= minimum_selections),
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
  revision INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (product_id, key)
);
CREATE INDEX product_choice_sections_by_product
  ON product_choice_sections(product_id, status, sort_order);

CREATE TABLE product_choice_section_sizes (
  section_id TEXT NOT NULL
    REFERENCES product_choice_sections(id) ON DELETE CASCADE,
  product_size_id TEXT NOT NULL,
  PRIMARY KEY (section_id, product_size_id)
);

CREATE TABLE product_choice_values (
  id TEXT PRIMARY KEY NOT NULL,
  section_id TEXT NOT NULL
    REFERENCES product_choice_sections(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  price_delta_centimes INTEGER NOT NULL,
  is_default_selected INTEGER NOT NULL CHECK (is_default_selected IN (0, 1)),
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
  revision INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (section_id, key)
);
CREATE INDEX product_choice_values_by_section
  ON product_choice_values(section_id, status, sort_order);

CREATE TABLE product_choice_value_sizes (
  value_id TEXT NOT NULL
    REFERENCES product_choice_values(id) ON DELETE CASCADE,
  product_size_id TEXT NOT NULL,
  available INTEGER NOT NULL CHECK (available IN (0, 1)),
  price_delta_centimes INTEGER,
  PRIMARY KEY (value_id, product_size_id)
);

CREATE TABLE product_choice_value_effects (
  id TEXT PRIMARY KEY NOT NULL,
  value_id TEXT NOT NULL
    REFERENCES product_choice_values(id) ON DELETE CASCADE,
  effect_type TEXT NOT NULL CHECK (
    effect_type IN ('add', 'replace', 'set-exact', 'remove')
  ),
  ingredient_id TEXT NOT NULL,
  replacement_ingredient_id TEXT,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  sort_order INTEGER NOT NULL
);
CREATE INDEX product_choice_value_effects_by_value
  ON product_choice_value_effects(value_id, sort_order);
CREATE INDEX product_choice_value_effects_by_ingredient
  ON product_choice_value_effects(ingredient_id);
CREATE INDEX product_choice_value_effects_by_replacement
  ON product_choice_value_effects(replacement_ingredient_id);

CREATE TABLE product_choice_value_effect_sizes (
  effect_id TEXT NOT NULL
    REFERENCES product_choice_value_effects(id) ON DELETE CASCADE,
  product_size_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  PRIMARY KEY (effect_id, product_size_id)
);
```

No foreign key from `recipe_size_quantities.product_size_id` or
`product_choice_*_sizes.product_size_id` to `product_sizes`, matching the
migration-19 snapshot precedent.

`recipe_items.quantity` keeps `CHECK (quantity > 0)`. Per-size overrides may
be `0`.

### Backfill

Every non-archived product gets one size:

- id: `product.id || ':size:regular'`
- key `regular`, name `Regular`
- price copied from `products.price_centimes`
- `is_default = 1`, `sort_order = 10`
- status `active` unless the product is `unavailable`, then `unavailable`

No override rows. No choice sections. With one size and no overrides the base
recipe applies unchanged.

### Convex tables

`productSizes`, `recipeSizeQuantities`, `productChoiceSections`,
`productChoiceSectionSizes`, `productChoiceValues`,
`productChoiceValueSizes`, `productChoiceValueEffects`,
`productChoiceValueEffectSizes`.

Indexes: `by_product`, `by_product_key`, `by_recipe_version`, `by_section`,
`by_value`, `by_effect`, `by_ingredient`. `recipeSizeQuantities.productSizeId`
is `v.string()`, not `v.id('productSizes')`.

Seed one default Regular size per product in `convex/seed.ts`. Leave legacy
modifier groups in place.

## Sync and cache

Extend `convex/sync.ts` `getOperationalSnapshot` additively. Caps:

| Collection | Limit |
| --- | ---: |
| productSizes | 4000 |
| recipeSizeQuantities | 8000 |
| productChoiceSections | 2000 |
| productChoiceSectionSizes | 4000 |
| productChoiceValues | 4000 |
| productChoiceValueSizes | 8000 |
| productChoiceValueEffects | 4000 |
| productChoiceValueEffectSizes | 8000 |

Extend `src/data/operationalCache.ts`:

- `OperationalCacheSnapshot` fields for all eight collections
- `LIMITS`
- `replaceOperationalCache`: archive/clear new tables, delete promoted local
  IDs, upsert snapshot rows, prune
- `pruneStaleOperationalCatalog`: delete archived sizes/sections/values
- `loadOperationalCache`: read the new tables
- `local_cloud_mappings` record types: `product-size`, `choice-section`,
  `choice-value`, `choice-value-effect`

Empty arrays are valid. Existing callers must keep working.

## Resolver — `src/lib/productConfiguration.ts`

Pure function. Not wired into checkout in this card.

```ts
export type ChoiceEffectType = 'add' | 'replace' | 'set-exact' | 'remove';

export function resolveProductConfiguration(input: {
  sizeId: string;
  choiceValueIds: string[];
  sizes: ProductSize[];
  recipeItems: Array<{ ingredientId: string; quantity: number }>;
  sizeQuantities: Array<{
    ingredientId: string;
    productSizeId: string;
    quantity: number;
  }>;
  sections: ProductChoiceSection[];
  sectionSizeIds: Array<{ sectionId: string; productSizeId: string }>;
  values: ProductChoiceValue[];
  valueSizes: Array<{
    valueId: string;
    productSizeId: string;
    available: boolean;
    priceDeltaCentimes: number | null;
  }>;
  effects: ProductChoiceValueEffect[];
  effectSizes: Array<{
    effectId: string;
    productSizeId: string;
    quantity: number;
  }>;
}): { unitPriceCentimes: number; ingredients: Map<string, number> };
```

Rules:

- Selected size must exist and not be archived.
- Price starts at the size price.
- Base ingredients: size override if present, else `recipeItems.quantity`.
- Applicable sections: those with zero size rows, or a row for this size.
- Enforce required / min / max on applicable sections only.
- Reject a value that is unavailable on this size, belongs to a non-applicable
  section, or is archived.
- Price delta: per-size override if present, else the value default.
- Effects in `sort_order`. Quantity: per-size override if present, else default.
- `add`: add quantity. `remove`: drop ingredient. `set-exact`: set quantity.
  `replace`: target must exist; drop it; add replacement at quantity.
- Reject negative resolved quantities, missing replace targets, and two
  selected effects that conflict on the same ingredient.
- Instruction-only values have zero effects.

## Ingredient deletion

`deleteLocalIngredient()` in `src/data/localInventory.ts` must also:

- delete `product_choice_value_effects` whose `ingredient_id` or
  `replacement_ingredient_id` matches
- copy remaining `recipe_size_quantities` onto any repaired recipe version
- mark affected products unavailable, matching DELETE-01

## Tablet driver

Commit `scripts/tablet-session.mjs` and [TABLET-TESTING.md](TABLET-TESTING.md).
Never log PIN values.

## Checks

- Extend `scripts/check-local-database.mjs`: schema 20, backfill Regular size,
  sales/stock rows survive 19→20.
- Extend `scripts/check-local-catalog.mjs` if cache prune needs coverage.
- Add `scripts/check-product-configuration.mjs` and
  `npm run check:product-configuration`.
- Resolver cases: one size identity, per-size quantity, add, replace, set-exact,
  remove, instruction-only, multi-effect, size applicability, required/min/max,
  negative-quantity rejection, missing replace target, conflicting effects,
  per-size price and quantity overrides.

Then: `check:local`, `check:local-catalog`, `check:local-management`,
`check:local-inventory-costs`, `check:sales`, `check:reconnect`,
`check:offline`, `check:management`, `check:product-configuration`,
`npx tsc -b`, `npm run build`, `npx convex dev --once`, `graphify update .`,
`android:sync`, `android:beta`.

Tablet: install over existing app, prove 19→20, offline sale, restart,
reconnect, cashier cannot open Settings. Dump console/logcat.

## Out of scope

OPTIONS-02 editor. OPTIONS-03 checkout. OPTIONS-04 cost range and legacy
removal. Do not delete `paper-cup` from seed in this card.
