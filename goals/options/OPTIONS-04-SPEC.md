# OPTIONS-04 spec — Honest costs, reconciliation, and legacy closeout

Follow [PROTOCOL.md](PROTOCOL.md) in full:

1. Read the AGENTS.md chain and this spec. Graphify first.
2. Research official Android/Capacitor guidance. Cost math stays in
   `src/lib/costs.ts` plus the shared resolver. No native cost engine.
3. Any bug stops the card.
4. Checks, then the full Tab A9 regression via `scripts/tablet-session.mjs`.
5. Commit `OPTIONS-04: …`, push `origin/main`, record the SHA.
6. Stop. Report in plain English. OPTIONS sequence is complete; next is
   POLISH-01 only when the owner asks.

OPTIONS-01 through OPTIONS-03 must already be on `origin/main`.

## Honest cost range

Replace the single default-recipe cost in `useProductManagement` (lines 69–97)
with a bounded range across valid size and choice combinations, or an explicit
incomplete state.

`ManagedProductCost` becomes:

```ts
export type ManagedProductCost = {
  complete: boolean;
  hasRecipe: boolean;
  minimumCostCentimes?: number;
  maximumCostCentimes?: number;
  missingIngredientIds?: string[];
};
```

Never invent a number when an ingredient has no valuation. Never show gross
profit, margin percentage, or a simulated receipt inside Edit Product.

Use the shared resolver plus `allocateCentimes` / current ingredient
valuation. Cap enumerated combinations (for example 64) rather than scanning
unbounded history.

## Packaging

Product recipes contain drink or food ingredients only. Remove `paper-cup`
from `convex/seed.ts` product recipes. Keep the ingredient itself if purchases
need it, but do not deduct cups from sales. Confirm with a seed/check
assertion.

## Reconciliation

Prove selected ingredients, inventory valuation, completed-sale
`ingredient_cost_centimes`, stock history, gross profit, and monthly Costs
(`localCostViews` / `dailyMetrics.incompleteCostSaleCount`) agree exactly for
the OPTIONS-03 cases. Reporting already keys off sale-level `costStatus`;
this card verifies and fixes, it does not add a second pipeline.

## Legacy removal

Only after every product has at least one size, every outstanding management
operation and pending sale is safe, and historical sale snapshots still read:

- Stop writing `products.modifierGroupIds` / `product_modifier_groups` for new
  work.
- Remove live shared `modifier_groups` / `modifier_options` from the
  operational snapshot once POS no longer reads them.
- Delete unused `convex/recipes.getCost` if it still has zero call sites.
- Do not delete historical `modifier_snapshot_json` on old `sale_items`.

If any pending outbox row still uses modifier option IDs, keep a compatibility
read until those rows acknowledge. Never leave checkout half-migrated.

## Checks

`check:product-configuration`, `check:sales`, `check:costs`,
`check:monthly-costs`, `check:reports`, `check:local-catalog`,
`check:local-inventory-costs`, `check:management`, `check:reconnect`,
`check:offline`, `npx tsc -b`, `npm run build`, `npx convex dev --once`.

Tablet matrix: offline, restart, reconnect, permissions, copy independence,
stock, cost, cancellation, receipt, migration, clean browser and logcat,
1340×800. Owner and cashier unlocks.
