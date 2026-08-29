import { ArrowDown, Save, SliderAlt, X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal } from '../../../../components/OverlayPortal';
import type {
  ManagedIngredient,
  StockAdjustmentMode,
} from '../../stockManagementTypes';
import {
  baseUnitLabel,
  formatStockQuantity,
} from '../../stockPresentation';
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
  const receiving = mode === 'receive';
  const [quantity, setQuantity] = useState(
    receiving ? '' : String(ingredient.currentStockQuantity),
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
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="adjustment-dialog-title"
      >
        <header>
          <span>
            <small>{receiving ? 'STOCK ADDITION' : 'PHYSICAL COUNT'}</small>
            <h2 id="adjustment-dialog-title">
              {receiving ? 'Receive stock' : 'Adjust count'}
            </h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close stock adjustment">
            <X width={18} height={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.ingredient}>
          <span className={styles.icon}>
            {receiving ? (
              <ArrowDown width={18} height={18} aria-hidden="true" />
            ) : (
              <SliderAlt width={18} height={18} aria-hidden="true" />
            )}
          </span>
          <span>
            <strong>{ingredient.name}</strong>
            <small>
              Current: {formatStockQuantity(
                ingredient.currentStockQuantity,
                ingredient.baseUnit,
              )}
            </small>
          </span>
        </div>

        <div className={styles.fields}>
          <label>
            <span>
              {receiving ? 'Quantity received' : 'Counted on hand'} ·{' '}
              {baseUnitLabel(ingredient.baseUnit)}
            </span>
            <input
              autoFocus
              type="number"
              min={receiving ? 1 : 0}
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          <label>
            <span>Reason</span>
            <input
              value={reason}
              placeholder={
                receiving ? 'Delivery or transfer' : 'Count, spoilage or breakage'
              }
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
        </div>

        <p className={styles.helper}>
          Saving appends one movement and updates the balance atomically.
        </p>
        {error ? <p className={styles.error}>{error}</p> : null}
        <footer>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
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
            {saving ? 'Saving…' : receiving ? 'Receive stock' : 'Save count'}
          </button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
