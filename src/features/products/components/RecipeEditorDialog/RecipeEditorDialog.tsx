import { Save, Plus, Trash, X } from '@boxicons/react';
import { Fragment, useEffect, useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import type {
  ManagedIngredient,
  ManagedProduct,
  ManagedRecipeData,
  ManagedProductSize,
} from '../../productManagementTypes';
import styles from './RecipeEditorDialog.module.css';

const COLUMNS = 4;

type RecipeDraftItem = {
  ingredientId: string;
  quantity: number;
};

interface RecipeEditorDialogProps {
  product: ManagedProduct;
  data: ManagedRecipeData;
  sizes: ManagedProductSize[];
  onClose: () => void;
  onSave: (
    items: RecipeDraftItem[],
    sizeQuantities: Array<{ ingredientId: string; productSizeId: string; quantity: number }>,
  ) => Promise<void>;
}

function unitLabel(unit: ManagedIngredient['baseUnit']) {
  if (unit === 'millilitre') return 'ml';
  if (unit === 'gram') return 'g';
  if (unit === 'milligram') return 'mg';
  return 'pc';
}

function pads(count: number, prefix: string) {
  return Array.from({ length: count }, (_, index) => (
    <span key={`${prefix}-${index}`} />
  ));
}

export function RecipeEditorDialog({
  product,
  data,
  sizes,
  onClose,
  onSave,
}: RecipeEditorDialogProps) {
  const [items, setItems] = useState<RecipeDraftItem[]>([]);
  const [sizeQuantities, setSizeQuantities] = useState(data.sizeQuantities);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const extraSizes = sizes.filter((size) => size.status === 'active').slice(0, 4);
  const sizeRows = extraSizes.length > 1 ? extraSizes : [];

  useEffect(() => {
    setItems(
      data.items.length
        ? data.items.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
          }))
        : data.ingredients[0]
          ? [{ ingredientId: data.ingredients[0].id, quantity: 1 }]
          : [],
    );
    setSizeQuantities(data.sizeQuantities);
    setError('');
  }, [data.versionNumber, product.id]);

  function updateItem(index: number, patch: Partial<RecipeDraftItem>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function addItem() {
    const ingredient = data.ingredients.find(
      (candidate) => !items.some((item) => item.ingredientId === candidate.id),
    );
    if (ingredient) {
      setItems((current) => [
        ...current,
        { ingredientId: ingredient.id, quantity: 1 },
      ]);
    }
  }

  function quantityFor(ingredientId: string, sizeId: string, baseQuantity: number) {
    return sizeQuantities.find(
      (item) => item.ingredientId === ingredientId && item.productSizeId === sizeId,
    )?.quantity ?? baseQuantity;
  }

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onSave(items, sizeQuantities);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Recipe save failed.');
    } finally {
      setSaving(false);
    }
  }

  const blocks: RecipeDraftItem[][] = [];
  for (let start = 0; start < items.length; start += COLUMNS) {
    blocks.push(items.slice(start, start + COLUMNS));
  }

  return (
    <OverlayPortal>
      <div
        className={styles.overlay}
        role="presentation"
        onPointerDown={(event) => closeOnBackdrop(event, onClose)}
      >
        <section
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="recipe-dialog-title"
        >
          <header className={styles.header}>
            <span className={styles.heading}>
              <small>RECIPE</small>
              <h2 id="recipe-dialog-title">{product.name}</h2>
            </span>
            <button type="button" onClick={onClose} aria-label="Close recipe editor">
              <X width={18} height={18} aria-hidden="true" />
            </button>
          </header>

          <div className={styles.body}>
            {blocks.map((row, blockIndex) => {
              const start = blockIndex * COLUMNS;
              const empty = COLUMNS - row.length;
              return (
                <div className={styles.block} key={start}>
                  <span className={styles.rowLabel}>Ingredient</span>
                  {row.map((item, offset) => (
                    <MenuSelect
                      key={`ingredient-${start + offset}`}
                      ariaLabel={`Ingredient ${start + offset + 1}`}
                      value={item.ingredientId}
                      onChange={(id) =>
                        updateItem(start + offset, { ingredientId: id })
                      }
                      options={data.ingredients.map((candidate) => ({
                        id: candidate.id,
                        label: candidate.name,
                      }))}
                    />
                  ))}
                  {pads(empty, `pad-ingredient-${start}`)}

                  <span className={styles.rowLabel}>Amount</span>
                  {row.map((item, offset) => {
                    const ingredient = data.ingredients.find(
                      (candidate) => candidate.id === item.ingredientId,
                    );
                    return (
                      <span className={styles.amount} key={`amount-${start + offset}`}>
                        <span className={styles.qty}>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="0"
                            aria-label={`${ingredient?.name ?? 'Ingredient'} amount`}
                            value={item.quantity || ''}
                            onChange={(event) =>
                              updateItem(start + offset, {
                                quantity: Number(event.target.value),
                              })
                            }
                          />
                          <small>{ingredient ? unitLabel(ingredient.baseUnit) : ''}</small>
                        </span>
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() =>
                            setItems((current) =>
                              current.filter((_, itemIndex) => itemIndex !== start + offset),
                            )
                          }
                          aria-label={`Remove ${ingredient?.name ?? 'ingredient'}`}
                        >
                          <Trash width={14} height={14} aria-hidden="true" />
                        </button>
                      </span>
                    );
                  })}
                  {pads(empty, `pad-amount-${start}`)}

                  {sizeRows.map((size) => (
                    <Fragment key={size.id}>
                      <span className={styles.rowLabel}>{size.name}</span>
                      {row.map((item, offset) => (
                        <input
                          key={`size-${size.id}-${start + offset}`}
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          aria-label={`${size.name} amount`}
                          value={quantityFor(item.ingredientId, size.id!, item.quantity) || ''}
                          onChange={(event) => {
                            const quantity = Number(event.target.value);
                            setSizeQuantities((current) => [
                              ...current.filter(
                                (entry) =>
                                  entry.ingredientId !== item.ingredientId
                                  || entry.productSizeId !== size.id,
                              ),
                              {
                                ingredientId: item.ingredientId,
                                productSizeId: size.id!,
                                quantity,
                              },
                            ]);
                          }}
                        />
                      ))}
                      {pads(empty, `pad-size-${size.id}-${start}`)}
                    </Fragment>
                  ))}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.add}
            onClick={addItem}
            disabled={items.length >= data.ingredients.length}
          >
            <Plus width={15} height={15} aria-hidden="true" />
            Add ingredient
          </button>

          {error ? <p className={styles.error}>{error}</p> : null}

          <footer className={styles.footer}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.save}
              onClick={submit}
              disabled={saving || items.length === 0}
            >
              <Save width={16} height={16} aria-hidden="true" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </footer>
        </section>
      </div>
    </OverlayPortal>
  );
}
