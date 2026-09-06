# Coffee setup and short product codes

## Status — 6 September 2026

Owner requested short codes for existing/future products, followed by Coffee
menu setup. Read-only production check found23 Coffee products, no coffee photos
or recipes linked. No production changes performed for this card yet.

Two questions sent to owner: name-related LAT-001/ESP-001 versus plain P-0001;
and whether to defer unknown shot/pump deductions. Await answers before applying.

## Codes — implementation boundary

Current displayed code is the product key. Local creation derives that key from
the name; backend updates deliberately do not change it. Do not simply truncate
it or replace IDs. Preserve all sale/recipe/size/choice and synchronization links.
Short codes must be durable, work offline and after install-over/new-device sync,
stay stable on renames, and avoid duplicate allocation across offline devices.
Choose the smallest correct persistence/allocation design after format decision;
do not claim sequential device-local numbering is globally collision-safe.

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

- Plus adds15 MAD to the selected preparation's Standard price. Preserve the
  earlier owner decision: Plus recipe quantities remain unconfigured, not an
  invented multiplier. Never silently use Standard quantities for Plus.
- The app already supports per-size recipe/milk effects; model hot/iced recipes
  without conflicting temperature and milk replacement effects. A four-size
  Hot Standard/Hot Plus/Iced Standard/Iced Plus mapping is a possible existing
  capability, not a new UI requirement. Verify all combinations before imports.
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

- Read current AGENTS/PLAN/WORK_LEDGER before resuming. Graphify/Ponytail mandatory.
- No direct SQLite/production SQL, seed, reset, or clean install. Use existing
  authenticated local-first actions and normal sync, with revision guards.
- Backup before rows and prepared payloads; log each acknowledged operation.
- Confirm cloud/tablet match, zero pending writes, stable IDs/history, correct
  prices for every size/milk/extra combination and exact known recipe usage.
- Rebuild production APK, install-over, physically inspect and confirm future
  product creation/code stability. Commit/push only scoped changes and evidence.
