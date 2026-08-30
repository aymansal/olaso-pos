import { X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import styles from './CancellationDialog.module.css';

export function CancellationDialog({
  receiptNumber,
  onClose,
  onConfirm,
}: {
  receiptNumber: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onConfirm(reason);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The correction could not be saved.');
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
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="cancel-order-title">
        <header>
          <span><small>WHOLE-SALE CORRECTION</small><h2 id="cancel-order-title">Cancel {receiptNumber}</h2></span>
          <button type="button" onClick={onClose} aria-label="Close cancellation"><X width={18} height={18} aria-hidden="true" /></button>
        </header>
        <p>This records the cancellation and restores the saved stock. Card payment reversals must be handled outside Olaso.</p>
        <label>
          <span>Required reason</span>
          <textarea value={reason} maxLength={240} onChange={(event) => setReason(event.target.value)} />
        </label>
        {error ? <strong>{error}</strong> : null}
        <footer>
          <button type="button" onClick={onClose}>Keep order</button>
          <button type="button" onClick={() => void submit()} disabled={saving || reason.trim().length < 3}>
            {saving ? 'Cancelling…' : 'Cancel order'}
          </button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
