import { X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { useT } from '../../../../lib/locale';
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
  const t = useT();
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
      setError(
        caught instanceof Error
          ? caught.message
          : t('The correction could not be saved.'),
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
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="cancel-order-title">
        <header>
          <span><small>{t('WHOLE-SALE CORRECTION')}</small><h2 id="cancel-order-title">{t('Cancel {receiptNumber}', { receiptNumber })}</h2></span>
          <button type="button" onClick={onClose} aria-label={t('Close cancellation')}><X width={18} height={18} aria-hidden="true" /></button>
        </header>
        <p>{t('This records the cancellation and restores the saved stock. Card payment reversals must be handled outside Olaso.')}</p>
        <label>
          <span>{t('Required reason')}</span>
          <textarea value={reason} maxLength={240} onChange={(event) => setReason(event.target.value)} />
        </label>
        {error ? <strong>{t(error)}</strong> : null}
        <footer>
          <button type="button" onClick={onClose}>{t('Keep order')}</button>
          <button type="button" onClick={() => void submit()} disabled={saving || reason.trim().length < 3}>
            {saving ? t('Cancelling…') : t('Cancel order')}
          </button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
