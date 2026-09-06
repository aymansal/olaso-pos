# Coffee setup and short product codes

## Status — 6 September 2026

Completed on production and installed tablet: short codes,18 Coffee products
covering all23 menu listings, exact Standard/Plus prices, milk/syrup/extras,
five measured hot recipes and12 normalized transparent WebP photos.
Five redundant iced records removed through normal authorized deletion only
after verifying no local/cloud sale-item references. Existing hot identities
and historical sale snapshots retained. Catalog now87 products, zero outbox.

Owner approved short name-related codes such as LAT-001 and instructed continuation.
Unknown shot/pump deductions remain unconfigured rather than guessed.

## Codes — implementation boundary

Current displayed code is the product key. Local creation derives that key from
the name; backend updates deliberately do not change it. Do not simply truncate
it or replace IDs. Preserve all sale/recipe/size/choice and synchronization links.
Short codes must be durable, work offline and after install-over/new-device sync,
stay stable on renames, and avoid duplicate allocation across offline devices.
Separate optional cloud code / SQLite product_code (schema25), generated from
three normalized name characters and001–999. Existing saved codes survive rename.
Offline candidates are provisional until the cloud assigns the final unique code
transactionally; normal snapshots reconcile without changing identity or sales.

## Coffee product identity mapping

Five pairs become one product each, preserving the existing hot product identity
and historical receipts. Before retiring redundant iced records, check their
saved history, pending operations, sizes and links; use normal authorized app
operations only. Do not delete history or rewrite old receipts.

| Retained product | Hot Standard MAD | Iced Standard MAD | Existing iced listing |
| --- | ---: | ---: | --- |
| Americano | 13 | 18 | Iced Coffee (workbook calls it Ice Coffee / Americano) |
| Latte | 18 | 22 | Iced Latte |
| Spanish Latte | 25 | 28 | Iced Spanish Latte |
| Salted Caramel Latte | 28 | 29 | Iced Salted Caramel Latte |
| Mocha | 26 | 25 | Iced Mocha Latte |

Other hot-only: Espresso10, Espresso Blend18, Cappuccino17, Flat White18,
Nos Nos13. Other iced-only: Iced Toffe Latte29, Fredo Espresso37,
Iced Caramel Latte27, Iced White Mocha Latte25, Iced Nutella Latte29,
Iced Pistachio Latte35, Iced Bueno Latte32. V60 Hot45/Cold55, one product.
After five merges the category has18 products, still covering all23 listings.
Never invent hot versions for iced-only listings or change Mocha's printed price.

## Configuration

Update6 September: Milk sections removed from Espresso, Espresso Blend,
Americano, Fredo Espresso and V60 after owner approval. Earlier optional-Milk
notes below describe the superseded setup. See OLASO-MENU-RECIPE-AUDIT.md for
the verified correction and full workbook recipe coverage.

- Plus adds15 MAD to the selected preparation's Standard price. Preserve the
  earlier owner decision: Plus recipe quantities remain unconfigured, not an
  invented multiplier. Never silently use Standard quantities for Plus.
- The app already supports per-size recipe/milk effects; model hot/iced recipes
  without conflicting temperature and milk replacement effects. A four-size
  Hot Standard/Hot Plus/Iced Standard/Iced Plus mapping is a possible existing
  capability, not a new UI requirement. Verify all combinations before imports.
- Implemented four named sizes for the five pairs and V60, two for other drinks.
  Milk uses remove Whole + add replacement with exact per-size quantities where
  known, so unconfigured Plus/iced recipes cannot fail a replace-missing-base
  validation or deduct an invented milk amount. Black coffee milk has no default.
- Milk interpretation follows the settled Frappé model: Whole0, Lactose Free5,
  Oat/Coconut/Almond10 MAD. Do not double-charge milk as an extra too. Do not
  silently add milk to black coffee/V60 or invent milk quantities.
- Optional syrup choice: White Chocolate, Vanilla Madagascar, Toffee Nut,
  Hazelnut, Caramel, Chocolate, Agave. Shown syrup surcharge5 MAD; no selection
  by default. Syrup doses are not given by the menu.
- Other extras: Espresso Blend10, Espresso Shot5, Honey2, Crème Fraîche3 MAD.
  Pricing can be represented independently of missing measured stock effects.
- V60 origin list (Ethiopia, Colombia, El Salvador, Guatemala, Kenya, Costa Rica)
  is a daily availability note; do not invent availability or surcharges.

## Recipes and images

Exact ingredient rows and English aliases are in
`OLASO-BEVERAGE-RECIPE-EXTRACTION.md`; use those source facts, not guessed recipes.
Workbook contains5 hot and10 iced recipes. Five hot recipes have measured gram/ml
quantities. Iced recipes contain unconverted espresso shots; Ice Mocha additionally
uses a syrup pump. Freddo has one undefined double espresso. Keep uncertain
deductions explicit and do not label a partial recipe complete.

No recipes supplied for Espresso, Espresso Blend, hot Americano, Salted Caramel
Latte (hot or iced), hot Mocha, Iced Caramel Latte, V60. All ingredient names in
English; preserve existing ingredient IDs and units. No invented purchase costs.

12 approved transparent iced-coffee originals exist in
`output/coffee-transparent-images/`. Use the shared normalized WebP compressor,
existing cap32768 characters and alpha framing. Inspect originals/output together.
There are no hot or V60 photos in that set; do not generate or mislabel new photos.

## Verification and recovery

- Passed32512 combinations through the shared price/ingredient resolver and
  cloud/tablet readback. Physical1340x800 checks cover18 products/48 sizes with
  paid options,320px contained dialog, no console warnings/errors; no sale placed
  and original empty cart retained. Evidence tmp/coffee-verification.json,
  coffee-pos-verification.json, coffee-installed.png and coffee-dialog.png.
- Fixed existing local default-size revision mismatch found on V60: only an
  actual prior default changes revision, matching cloud behavior. Regression
  and production Android build passed; final APK installed over existing data.
- Still intentionally pending: unknown shot/pump conversions, all Plus recipe
  quantities, missing recipes/costs and six missing hot/V60 original photos.
  Do not infer those from generic internet recipes or invent images.
- Read current AGENTS/PLAN/WORK_LEDGER before resuming. Graphify/Ponytail mandatory.
- No direct SQLite/production SQL, seed, reset, or clean install. Use existing
  authenticated local-first actions and normal sync, with revision guards.
- Backup before rows and prepared payloads; log each acknowledged operation.
- Confirm cloud/tablet match, zero pending writes, stable IDs/history, correct
  prices for every size/milk/extra combination and exact known recipe usage.
- Rebuild production APK, install-over, physically inspect and confirm future
  product creation/code stability. Commit/push only scoped changes and evidence.
