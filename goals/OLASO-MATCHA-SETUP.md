# Matcha page — production catalog, 6 September 2026

Applied to the existing products through the tablet's normal authenticated
local-first actions and production synchronization. No application code, database
reset, new installation, or invented purchases. Four existing categories retained.

## Products and sizes

Prices below are Standard prices in MAD. Every Plus is its Standard price +20.
Paired products have Hot Standard, Hot Plus, Iced Standard, Iced Plus. Iced-only
products have Standard and Plus. Exactly19 products /54 sizes cover27 listings.

| Product | Hot | Iced |
| --- | ---: | ---: |
| Matcha Latte |28|32|
| Matcha Latte Vanille |35|35|
| Spanish Matcha Latte |32|39|
| Matcha Latte Agave |30|40|
| Matcha Latte Pistachio |38|42|
| Matcha Latte Bueno |35|45|
| Matcha Protein |45|50|
| Hojicha Latte |32|35|
| Iced Strawberry Matcha Latte |—|36|
| Iced Mango Matcha Latte |—|36|
| Iced White Chocolate Matcha Latte |—|35|
| Iced Vanilla Hojicha Latte |—|40|
| Iced Spanish Hojicha Latte |—|45|
| Iced Chocolate Hojicha Latte |—|42|
| Iced Caramel Hojicha Latte |—|42|
| Iced Ube Latte |—|42|
| Iced Spanish Ube Latte |—|42|
| Iced Vanilla Ube Latte |—|42|
| Iced Agave Ube Latte |—|45|

Retained original hot identities, names, codes and prices. Removed only the eight
redundant iced records after proving they had no local or cloud sale references.
Historical sales were not changed. Original catalog backup: tmp/matcha-before.json;
retirement evidence: tmp/matcha-history-before-retire.json and matcha-retired.jsonl.
The removed unused records are backed up, not a promise of in-app undo.

## Choices on all19 products

- Milk: choose one, Whole default/included. Lactose Free +5; Oat, Coconut,
  Almond +10 each. Milk surcharge applies once, not again as an extra.
- Extras: Ceremonial Matcha +15 and Cold Foam +10. Either, both, or neither;
  neither selected by default. No invented extra ingredient doses.
- No syrup-choice group: the source page does not advertise one.

## Measured recipes (Standard only)

Source: OLASO_Fiche_Technique_Boissons.xlsx, Matcha sheet,17 preparations /59
ingredient rows. Source-row extraction: tmp/matcha-recipes-source.json. English
ingredient names, exact quantities and source-row mapping: tmp/matcha-plan.json.

| Preparation | Ingredients |
| --- | --- |
| Hot Matcha Latte | Matcha3g; Whole milk190ml |
| Hot Vanilla | Matcha3g; Whole milk190ml; Vanilla syrup25ml |
| Hot Agave | Matcha3g; Whole milk190ml; Agave syrup25ml |
| Hot Pistachio | Matcha3g; Whole milk150ml; Pistachio cream40g |
| Hot Bueno | Matcha3g; Whole milk150ml; Bueno35g |
| Iced Matcha Latte | Matcha3g; Whole milk180ml; Ice cubes100g |
| Iced Vanilla | Matcha3g; Whole milk180ml; Vanilla syrup20ml; Ice cubes100g |
| Iced Spanish | Matcha3g; Whole milk170ml; Condensed milk35g; Ice cubes100g |
| Iced Strawberry | Matcha3g; Whole milk170ml; Strawberry puree40g; Ice cubes100g |
| Iced Mango | Matcha3g; Whole milk170ml; Mango40g; Ice cubes100g |
| Iced Pistachio | Matcha3g; Whole milk170ml; Pistachio cream50g; Ice cubes100g |
| Iced Bueno | Matcha3g; Whole milk170ml; Bueno40g; Ice cubes100g |
| Iced Agave | Matcha3g; Whole milk190ml; Agave syrup25ml; Ice cubes100g |
| Iced White Chocolate | Matcha3g; Whole milk170ml; White chocolate sauce35g; Ice cubes100g |

Alternative milk removes Whole milk and deducts the selected milk in the exact
quantity for that preparation. Explicit size quantities prevent fallback to a
different preparation. Hot drinks do not deduct ice. No ingredient purchase costs
or opening stock were invented. Six new ingredients: Matcha, Vanilla syrup, Agave
syrup, Pistachio cream, Bueno, White chocolate sauce. Existing identities reused
where names/units actually match; Bueno is not silently merged with Bueno cream,
nor White chocolate sauce with White chocolate.

### Still awaiting owner measurements

- All Plus recipes: deliberately unconfigured, no Standard-quantity fallback.
- Hot Spanish: source says30ml condensed milk, existing ingredient is measured
  in grams. Entire hot preparation deferred; iced35g recipe is configured.
- Both Protein preparations: source uses a whey scoop without a measured weight.
  Entire recipes deferred, not falsely represented as complete. No ice invented
  for iced Protein when absent from its source rows.
- Hojicha and Ube: absent from this worksheet; recipes remain unconfigured.
- Ceremonial Matcha and Cold Foam extras: price configured, dosage still unknown.
- Ingredient costs: pending real supplier prices. Current profit is not proof
  of complete ingredient costing.

## Images and verification

All19 images use existing output/matcha-transparent-images PNGs. Originals
untouched. Exact app compressor normalizes transparent bounds and writes small
WebP files under output/matcha-app-webp-v1 (384/480 square). Merged products use
their corresponding iced photograph, the established shared-photo approach.
Both source and compressed contact sheets were visually inspected.

- tmp/matcha-verification.json:19 products,54 sizes,14 measured preparations,
  19 photos; all1080 size/milk/extra combinations pass price and exact ingredient
  checks; relevant local/cloud rows and all photos match; zero outbox.
- tmp/matcha-pos-verification.json: all19 physical-tablet dialogs and54 size
  selections checked, correct totals with Oat and both extras,320px bounded dialog,
  no horizontal overflow or new console warnings/errors. No sale placed; cart
  preserved empty.
- Screenshots: tmp/matcha-dialog.png, matcha-top.png, matcha-options.png.
- Final total79 products; Coffee18, Matcha19, Cold Drinks19, Bakery & Desserts23.
- Operational helper final-sync waits hit their15-second inspection timeout;
  subsequent reads proved the normal sync completed with no pending/rejected
  operations. No retry-state rewrite or direct database writes used.
