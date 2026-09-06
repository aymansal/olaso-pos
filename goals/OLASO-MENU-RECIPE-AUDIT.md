# Menu recipe audit — 6 September 2026

## Applied correction

Removed the active Milk choice section from Espresso, Espresso Blend,
Americano (both preparations), Fredo Espresso and V60 (both preparations).
Used the existing authenticated local-first section deletion action; verified
the five sections inactive/absent in SQLite and production Convex. No pending
outbox operations. Product IDs, prices, recipes and images unchanged.
Other milk-based drinks retain their Milk choices. Syrups, extras and Plus
prices were not removed: their owner-specific preparation rules remain open.
Historical sales are untouched; no test sale or print was made.

## Workbook comparison

Reread the supplied WhatsApp transfer OLASO_Fiche_Technique_Boissons.xlsx,
all five distinct recipe sheets: 50 preparations,181 ingredient rows.
Compared every currently configured preparation's complete ingredient list and
quantity against those source rows with explicit English-name aliases.
Also verified current recipe IDs/items/per-size quantities match SQLite/cloud.

| Source sheet | Fully entered | Source recipes | Remaining |
| --- | ---: | ---: | ---: |
| Hot Coffee | 5 | 5 | 0 |
| Ice Drinks | 0 | 10 | 10 |
| Frappé | 4 | 10 | 6 |
| Lemonades | 8 | 8 | 0 |
| Matcha | 14 | 17 | 3 |
| Total | 31 | 50 | 19 |

The31 configured preparations contain106 exact ingredient rows. The remaining
19 contain75 source rows, not configured. Do not claim all workbook recipes or
all workbook ingredients are installed. No recipe edits were made in this audit.

### Remaining source recipes

- Ice Drinks: Ice Mocha, Ice Nutella, Ice Latte, Ice Spanish Latte,
  Ice Toffee Latte, Ice Coffee / Americano, Ice Pistachio Latte,
  Ice Bueno Latte, Espresso Freddo, Ice White Mocha Latte.
  Need stock quantity for one espresso shot/double espresso; Mocha also needs
  chocolate syrup pump volume. Existing hot recipes do not cover iced sizes.
- Frappé: Caramel, Bueno, Pistache, Matcha need syrup pump measurements;
  Signature needs shot measurement and cinnamon quantity;
  Cerelac needs scoop weight.
- Matcha: hot Spanish Matcha Latte needs clarification of30ml condensed milk
  against the existing gram-based stock item; hot and iced Protein need scoop
  weight. Iced Spanish Matcha is already entered correctly with35g.

Plus recipes remain unconfigured as the owner previously requested. The source
has no soft-ice-cream, croissant, brioche, Hojicha, Ube or Iced Tea recipes.
Missing supplier prices are a separate cost-completeness issue, not the reason
for these measurement gaps. Never guess units or imply zero cost is real cost.

## Evidence and next action

Local evidence: tmp/black-coffee-before.json, tmp/menu-recipe-audit.json,
tmp/recipe-source-comparison.json. Runnable audit helpers under tmp compare the
live cloud/tablet with the original workbook.31/50 and106/181 assertions pass.
Physical POS visual check was inconclusive: a dialog assertion failed and the
cart changed during inspection. Stopped interaction; preserved the current cart.
Do not claim this visual check passed. Data readback did pass for all five.

Content-only change through the existing SQLite/Convex management boundary;
no application/native source, new dependency, APK or layout change required.
Next: owner review of corrected coffee dialogs, then obtain the missing
measurements before configuring the remaining19 recipes. Do not silently
replace the exact owner recipes with generic internet recipes.
