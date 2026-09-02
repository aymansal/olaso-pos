import { Save, X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import type {
  ManagedIngredient,
  StockAdjustmentMode,
} from '../../stockManagementTypes';
import {
  baseUnitLabel,
  formatStockQuantity,
} from '../../stockPresentation';
import { useT } from '../../../../lib/locale';
import styles from './StockAdjustmentDialog.module.css';

interface StockAdjustmentDialogProps {
  ingredient: ManagedIngredient;
  mode: StockAdjustmentMode;
  onClose: () => void;
  onSave: (
    ingredient: ManagedIngredient,
    mode: StockAdjustmentMode,
    quantity: number,
    reason: string,
  ) => Promise<void>;
}

export function StockAdjustmentDialog({
  ingredient,
  mode,
  onClose,
  onSave,
}: StockAdjustmentDialogProps) {
  const t = useT();
  const receiving = mode === 'receive';
  const [quantity, setQuantity] = useState(
    receiving
      ? ''
      : ingredient.currentStockQuantity
        ? String(ingredient.currentStockQuantity)
        : '',
  );
  const [reason, setReason] = useState(receiving ? 'Stock received' : '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const parsedQuantity = Number(quantity);
  const invalidQuantity =
    !Number.isSafeInteger(parsedQuantity) ||
    parsedQuantity < (receiving ? 1 : 0) ||
    (!receiving && parsedQuantity === ingredient.currentStockQuantity);

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onSave(ingredient, mode, parsedQuantity, reason);
      onClose();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Stock adjustment failed.',
      );
    } finally {
      setSaving(false);
    }
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
        aria-labelledby="adjustment-dialog-title"
      >
        <header>
          <span>
            <small>{t(receiving ? 'STOCK ADDITION' : 'PHYSICAL COUNT')}</small>
            <h2 id="adjustment-dialog-title">
              {t(receiving ? 'Receive stock' : 'Adjust count')}
            </h2>
          </span>
          <button type="button" onClick={onClose} aria-label={t('Close stock adjustment')}>
            <X width={18} height={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.ingredient}>
          <span>
            <strong>{ingredient.name}</strong>
            <small>
              {t('Current: {quantity}', {
                quantity: formatStockQuantity(
                  ingredient.currentStockQuantity,
                  ingredient.baseUnit,
                ),
              })}
            </small>
          </span>
        </div>

        <div className={styles.fields}>
          <label>
            <span>
              {t(receiving ? 'Quantity received' : 'Counted on hand')} ·{' '}
              {t(baseUnitLabel(ingredient.baseUnit))}
            </span>
            <input
              type="number"
              min={receiving ? 1 : 0}
              step="1"
              value={quantity}
              placeholder="0"
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          <label>
            <span>{t('Reason')}</span>
            <input
              value={reason}
              placeholder={
                t(receiving ? 'Delivery or transfer' : 'Count, spoilage or breakage')
              }
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
        </div>

        <p className={styles.helper}>
          {t('Saving appends one movement and updates the balance atomically.')}
        </p>
        {error ? <p className={styles.error}>{t(error)}</p> : null}
        <footer>
          <button type="button" className={styles.cancel} onClick={onClose}>
            {t('Cancel')}
          </button>
          <button
            type="button"
            className={styles.save}
            onClick={submit}
            disabled={
              saving || invalidQuantity || !reason.trim()
            }
          >
            <Save width={16} height={16} aria-hidden="true" />
            {saving ? t('Saving…') : t(receiving ? 'Receive stock' : 'Save count')}
          </button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
