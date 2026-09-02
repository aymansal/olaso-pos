import { Save, X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import type {
  IngredientSaveInput,
  StockBaseUnit,
} from '../../stockManagementTypes';
import { baseUnitLabel } from '../../stockPresentation';
import { useT } from '../../../../lib/locale';
import styles from './IngredientDialog.module.css';

interface IngredientDialogProps {
  onClose: () => void;
  onSave: (input: IngredientSaveInput) => Promise<void>;
}

const units: StockBaseUnit[] = [
  'millilitre',
  'gram',
  'milligram',
  'piece',
];

export function IngredientDialog({ onClose, onSave }: IngredientDialogProps) {
  const t = useT();
  const [name, setName] = useState('');
  const [baseUnit, setBaseUnit] = useState<StockBaseUnit>('gram');
  const [threshold, setThreshold] = useState('');
  const [openingQuantity, setOpeningQuantity] = useState('');
  const [openingPriceMad, setOpeningPriceMad] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const openingCount = Number(openingQuantity);
  const openingCostCentimes = Math.round(Number(openingPriceMad) * 100);

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onSave({
        name,
        baseUnit,
        lowStockThreshold: Number(threshold),
        openingQuantity: openingCount,
        ...(openingCount === 0 ? {} : { openingCostCentimes }),
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
    !Number.isSafeInteger(openingCount) ||
    openingCount < 0 ||
    (openingCount > 0 &&
      (!Number.isSafeInteger(openingCostCentimes) ||
        openingCostCentimes < 1));

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
        aria-labelledby="ingredient-dialog-title"
      >
        <header>
          <span>
            <small>{t('STOCK RECORD')}</small>
            <h2 id="ingredient-dialog-title">{t('Add ingredient')}</h2>
          </span>
          <button type="button" onClick={onClose} aria-label={t('Close ingredient editor')}>
            <X width={18} height={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.fields}>
          <label>
            <span>{t('Ingredient name')}</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span>{t('Base unit')}</span>
            <MenuSelect
              className={styles.unitMenu}
              ariaLabel="Base unit"
              value={baseUnit}
              onChange={(id) => setBaseUnit(id as StockBaseUnit)}
              options={units.map((unit) => ({
                id: unit,
                label: baseUnitLabel(unit),
              }))}
            />
          </label>
          <label>
            <span>{t('Low-stock threshold')}</span>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
            />
          </label>
          <label>
            <span>{t('Opening quantity')}</span>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={openingQuantity}
              onChange={(event) => setOpeningQuantity(event.target.value)}
            />
          </label>
          <label>
            <span>{t('Price paid')} · {t('MAD')}</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={openingPriceMad}
              placeholder="0"
              disabled={openingCount === 0}
              onChange={(event) => setOpeningPriceMad(event.target.value)}
            />
          </label>
        </div>

        <p className={styles.helper}>
          {t('Quantities stay as whole {unit}. If the shelf already has stock, enter quantity and what you paid. Leave quantity at 0 when the shelf is empty. Base units cannot change after creation.', {
            unit: t(baseUnitLabel(baseUnit)).toLowerCase(),
          })}
        </p>
        {error ? <p className={styles.error}>{t(error)}</p> : null}

        <footer>
          <span />
          <button
            type="button"
            className={styles.save}
            onClick={submit}
            disabled={saving || !name.trim() || invalidNumber}
          >
            <Save width={16} height={16} aria-hidden="true" />
            {saving ? t('Saving…') : t('Save')}
          </button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
