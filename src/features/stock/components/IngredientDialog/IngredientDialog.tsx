import { Archive, Save, X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal } from '../../../../components/OverlayPortal';
import type {
  IngredientSaveInput,
  ManagedIngredient,
  StockBaseUnit,
} from '../../stockManagementTypes';
import { baseUnitLabel } from '../../stockPresentation';
import styles from './IngredientDialog.module.css';

interface IngredientDialogProps {
  ingredient?: ManagedIngredient;
  onClose: () => void;
  onSave: (input: IngredientSaveInput) => Promise<void>;
  onSetArchived: (
    ingredient: ManagedIngredient,
    archived: boolean,
  ) => Promise<void>;
  onDelete: (ingredient: ManagedIngredient) => Promise<void>;
}

const units: StockBaseUnit[] = [
  'millilitre',
  'gram',
  'milligram',
  'piece',
];

export function IngredientDialog({
  ingredient,
  onClose,
  onSave,
  onSetArchived,
  onDelete,
}: IngredientDialogProps) {
  const [name, setName] = useState(ingredient?.name ?? '');
  const [baseUnit, setBaseUnit] = useState<StockBaseUnit>(
    ingredient?.baseUnit ?? 'gram',
  );
  const [threshold, setThreshold] = useState(
    String(ingredient?.lowStockThreshold ?? 0),
  );
  const [openingQuantity, setOpeningQuantity] = useState('0');
  const [openingPriceMad, setOpeningPriceMad] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const archived = ingredient?.status === 'archived';
  const openingCount = Number(openingQuantity);
  const openingCostCentimes = Math.round(Number(openingPriceMad) * 100);

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onSave({
        id: ingredient?.id,
        name,
        baseUnit,
        lowStockThreshold: Number(threshold),
        openingQuantity: ingredient ? undefined : openingCount,
        ...(ingredient || openingCount === 0
          ? {}
          : { openingCostCentimes }),
        expectedRevision: ingredient?.revision,
      });
      onClose();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Ingredient save failed.',
      );
    } finally {
      setSaving(false);
    }
  }

  const invalidNumber =
    !Number.isSafeInteger(Number(threshold)) ||
    Number(threshold) < 0 ||
    (!ingredient &&
      (!Number.isSafeInteger(openingCount) ||
        openingCount < 0 ||
        (openingCount > 0 &&
          (!Number.isSafeInteger(openingCostCentimes) ||
            openingCostCentimes < 1))));

  return (
    <OverlayPortal>
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ingredient-dialog-title"
      >
        <header>
          <span>
            <small>STOCK RECORD</small>
            <h2 id="ingredient-dialog-title">
              {ingredient ? 'Edit ingredient' : 'Add ingredient'}
            </h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close ingredient editor">
            <X width={18} height={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.fields}>
          <label className={styles.name}>
            <span>Ingredient name</span>
            <input
              autoFocus
              value={name}
              disabled={archived}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            <span>Base unit</span>
            <select
              value={baseUnit}
              disabled={Boolean(ingredient)}
              onChange={(event) =>
                setBaseUnit(event.target.value as StockBaseUnit)
              }
            >
              {units.map((unit) => (
                <option value={unit} key={unit}>
                  {baseUnitLabel(unit)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Low-stock threshold</span>
            <input
              type="number"
              min="0"
              step="1"
              value={threshold}
              disabled={archived}
              onChange={(event) => setThreshold(event.target.value)}
            />
          </label>
          {!ingredient ? (
            <>
              <label>
                <span>Opening quantity</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={openingQuantity}
                  onChange={(event) => setOpeningQuantity(event.target.value)}
                />
              </label>
              <label>
                <span>Price paid · MAD</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={openingPriceMad}
                  disabled={openingCount === 0}
                  onChange={(event) => setOpeningPriceMad(event.target.value)}
                />
              </label>
            </>
          ) : null}
        </div>

        <p className={styles.helper}>
          Quantities stay as whole {baseUnitLabel(baseUnit).toLowerCase()}.
          If the shelf already has stock, enter quantity and what you paid.
          Leave quantity at 0 when the shelf is empty. Base units cannot change
          after creation.
        </p>
        {error ? <p className={styles.error}>{error}</p> : null}

        <footer>
          {ingredient ? (
            <div className={styles.actions}>
            <button
              type="button"
              className={styles.archive}
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                setError('');
                try {
                  await onSetArchived(ingredient, !archived);
                  onClose();
                } catch (caught) {
                  setError(
                    caught instanceof Error
                      ? caught.message
                      : 'Ingredient status failed.',
                  );
                } finally {
                  setSaving(false);
                }
              }}
            >
              <Archive width={15} height={15} aria-hidden="true" />
              {archived ? 'Restore' : 'Archive'}
            </button>
            <button
              type="button"
              className={styles.deleteAction}
              disabled={saving}
              onClick={async () => {
                if (!window.confirm(
                  `Delete ${ingredient.name}? Drinks using it will need updating.`,
                )) return;
                setSaving(true);
                setError('');
                try {
                  await onDelete(ingredient);
                  onClose();
                } catch (caught) {
                  setError(caught instanceof Error
                    ? caught.message
                    : 'Ingredient could not be deleted.');
                } finally {
                  setSaving(false);
                }
              }}
            >
              Delete
            </button>
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            className={styles.save}
            onClick={submit}
            disabled={saving || archived || !name.trim() || invalidNumber}
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
