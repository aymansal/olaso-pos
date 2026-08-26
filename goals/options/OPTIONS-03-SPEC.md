# OPTIONS-03 spec — Cashier selections, stock, and sale snapshots

Follow [PROTOCOL.md](PROTOCOL.md) in full:

1. Read the AGENTS.md chain and this spec. Graphify first.
2. Research official Android/Capacitor guidance. Checkout stays in the existing
   serialized SQLite transaction. Do not add a native checkout plugin.
3. Any bug stops the card.
4. Checks, then Tab A9 testing via `scripts/tablet-session.mjs`.
5. Commit `OPTIONS-03: …`, push `origin/main`, record the SHA.
6. Stop. Report in plain English. Ask before OPTIONS-04.

OPTIONS-01 and OPTIONS-02 must already be on `origin/main`.

## Cart

`src/features/pos/posSession.ts`:

```ts
export type CartLine = {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  choiceValueIds: string[];
};
```

Identity: `JSON.stringify([productId, sizeId, sortedChoiceValueIds])`.

`subtotalCentimes` uses size price plus resolved value deltas from the
operational cache. Still display-only. Commit never trusts it.

Keep reading legacy `modifierOptionIds` only as a compatibility shim if a
process-lifetime cart still holds old lines; do not persist the old shape.

## Selection dialog

Extend `ModifierSelectionDialog` (560px, groups scroll at 500px):

- Size row at the top. Hidden when the product has one size.
- Then applicable product-owned sections for that size.
- Radio when `maximumSelections === 1`, checkbox otherwise.
- Apply default selections. Enforce required, min, max, size applicability
  before Add is enabled.
- `PosScreen.beginAdd` opens the dialog when the product has more than one
  size or any applicable section. A single-size product with no sections adds
  directly.

Receipt rail meta must show the size name plus chosen value names.

## One resolver, two call sites

Wire `resolveProductConfiguration` from `src/lib/productConfiguration.ts`
into:

- `prepareSale()` in `src/data/localSales.ts`
- Convex `sales.accept` recompute in `convex/sales.ts`

Both re-read trusted catalog rows inside the transaction / mutation. The UI
never supplies a price or ingredient list.

## Snapshots and sync

Extend `SavedReceipt` lines with `sizeId`, `sizeName`, `choiceValueIds`, and
named choice snapshots. Add `size_id_snapshot` and `size_name_snapshot` to
`sale_items` through a new append-only SQLite migration (21) if needed.
Historical rows without those columns must still load, reprint, and cancel.

Extend `SaleSyncPayload` and `saleLine` in `convex/sales.ts` with `sizeId` and
`choiceValueIds`. Server maps local IDs through `local_cloud_mappings` the
same way products and modifier options already do in `reconnectContext.tsx`.

Do not rewrite `cancelLocalSale()`. It reverses recorded `stock_movements`.
Confirm with a check that a resolved almond-milk sale restores almond milk,
not whole milk.

## Verification cases

Focused checks and tablet:

- Cappuccino Regular vs a second size with different milk grams
- Almond `replace` of whole milk
- Extra shot `add`
- One value with several ingredient effects
- Cream 3 ml on Regular, 5 ml on Large
- Instruction-only value: price may change, stock does not
- Offline sale, restart, reconnect, reprint, same-day cancellation

Checks: `check:sales`, `check:product-configuration`, `check:pos`,
`check:orders`, `check:reconnect`, `check:offline`, `npx tsc -b`,
`npm run build`, `npx convex dev --once`.
