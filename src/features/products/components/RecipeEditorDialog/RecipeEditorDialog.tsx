import { FloppyDisk, Plus, Trash, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import type {
  ManagedProduct,
  ManagedRecipeData,
} from '../../productManagementTypes';
import styles from './RecipeEditorDialog.module.css';

type RecipeDraftItem = {
  ingredientId: string;
  quantity: number;
};

interface RecipeEditorDialogProps {
  product: ManagedProduct;
  data: ManagedRecipeData;
  onClose: () => void;
  onSave: (items: RecipeDraftItem[]) => Promise<void>;
}

export function RecipeEditorDialog({
  product,
  data,
  onClose,
  onSave,
}: RecipeEditorDialogProps) {
  const [items, setItems] = useState<RecipeDraftItem[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
    setError('');
  }, [data.versionNumber, product.id]);

  function updateItem(
    index: number,
    patch: Partial<RecipeDraftItem>,
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function addItem() {
    const ingredient = data.ingredients.find(
      (candidate) =>
        !items.some((item) => item.ingredientId === candidate.id),
    );
    if (ingredient) {
      setItems((current) => [
        ...current,
        { ingredientId: ingredient.id, quantity: 1 },
      ]);
    }
  }

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onSave(items);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Recipe save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-dialog-title"
      >
        <header>
          <span>
            <small>IMMUTABLE VERSION</small>
            <h2 id="recipe-dialog-title">Recipe · {product.name}</h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close recipe editor">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <p className={styles.version}>
          {data.versionNumber
            ? `Editing version ${data.versionNumber} creates version ${data.versionNumber + 1}.`
            : 'Saving creates the first active recipe version.'}
        </p>

        <div className={styles.items}>
          {items.map((item, index) => {
            const ingredient = data.ingredients.find(
              (candidate) => candidate.id === item.ingredientId,
            );
            return (
              <div className={styles.item} key={`${item.ingredientId}-${index}`}>
                <label>
                  <span>Ingredient</span>
                  <select
                    value={item.ingredientId}
                    onChange={(event) =>
                      updateItem(index, { ingredientId: event.target.value })
                    }
                  >
                    {data.ingredients.map((candidate) => (
                      <option value={candidate.id} key={candidate.id}>
                        {candidate.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.quantity}>
                  <span>Quantity</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(index, {
                        quantity: Number(event.target.value),
                      })
                    }
                  />
                  <small>{ingredient?.baseUnit ?? 'unit'}</small>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setItems((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  aria-label={`Remove ${ingredient?.name ?? 'ingredient'}`}
                >
                  <Trash size={16} aria-hidden="true" />
                </button>
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
          <Plus size={15} aria-hidden="true" />
          Add ingredient
        </button>

        {error ? <p className={styles.error}>{error}</p> : null}
        <footer>
          <span>
            {data.versions.length} saved version
            {data.versions.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            className={styles.save}
            onClick={submit}
            disabled={saving || items.length === 0}
          >
            <FloppyDisk size={16} aria-hidden="true" />
            {saving ? 'Saving…' : 'Save new version'}
          </button>
        </footer>
      </section>
    </div>
  );
}
