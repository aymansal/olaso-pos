# Legacy modifier surface — flagged, not deleted

Recorded after validating the size/choice/effect logic against the owner's real
menu. Nothing here is removed yet. Each entry states why it still exists and
what has to be true before it can go.

## Dead for new work — safe to delete once history no longer needs the reader

| Location | What it is | Blocker before deletion |
| --- | --- | --- |
| `convex/modifiers.ts` (331 lines) | `list`, `saveGroup`, `setGroupArchived` for shared modifier groups | No screen creates groups any more; `list` still feeds the operational snapshot |
| `src/features/products/components/ModifierGroupDialog/` (369 lines) | Owner UI for the old shared groups | Still mounted by `ProductEditorPanel`; hidden when the product has sizes |
| `ProductEditorPanel.tsx` L14, L22, L34, L48-50, L79, L90-91, L435-440 | Props and dialog wiring for the above | Delete with the dialog |
| `ProductsScreen.tsx` / `useProductManagement.ts` modifier handlers | Save/archive plumbing for groups | Delete with the dialog |
| `localCatalog.ts` L193-255 | `modifierGroupIds` validation and `product_modifier_groups` writes | Product save must stop accepting the field |
| `localSales.ts` L380-441 | Legacy cart branch when a line has no `sizeId` | `PosScreen` always sends `sizeId` (L402, L528), so unreachable for new sales |
| `posSession.ts` L13, L77 | `modifierOptionIds` on `CartLine`, always `[]` | Delete with the `localSales` branch |

## Must stay — historical truth

| Location | Why |
| --- | --- |
| `sale_items.modifier_snapshot_json` | Immutable receipt text for sales taken before OPTIONS-01 |
| `convex/sales.ts` legacy `modifierOptionIds` accept path | Outbox rows queued by an older APK still in flight |
| `modifier_groups` / `modifier_options` / `product_modifier_groups` tables | Referenced by pre-migration products until a data audit confirms zero rows |
| `operationalCache.ts` modifier snapshot rows | Feeds the legacy read path above |

## Deletion order when the card is opened

1. Confirm zero live products carry `product_modifier_groups` rows.
2. Remove the owner UI (dialog + panel props + screen handlers).
3. Remove the `localSales` legacy branch and `CartLine.modifierOptionIds`.
4. Remove `convex/modifiers.ts` and the cache/sync reads.
5. Leave the sale snapshot columns and tables in place permanently.
