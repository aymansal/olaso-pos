import { useRef, useState } from 'react';
import { formatMoney } from '../../../../lib/money';
import { useT } from '../../../../lib/locale';
import styles from './PrimaryAction.module.css';

type PrimaryActionProps = {
  totalCentimes: number;
  disabled: boolean;
  processing: boolean;
  canSplit: boolean;
  onSplit: () => void;
  onPlaceOrder: () => Promise<void>;
};

export function PrimaryAction({ totalCentimes, disabled, processing, canSplit, onSplit, onPlaceOrder }: PrimaryActionProps) {
  const t = useT();
  const committing = useRef(false);
  const [busy, setBusy] = useState(false);
  const locked = disabled || processing || busy;

  async function commit() {
    if (locked || committing.current) return;
    committing.current = true;
    setBusy(true);
    try {
      await onPlaceOrder();
    } finally {
      committing.current = false;
      setBusy(false);
    }
  }

  return (
    <div className={styles.actions}>
      <button type="button" className={styles.split} disabled={locked || !canSplit} onClick={onSplit}>
        {t('Split')}
      </button>
      <button type="button" className={styles.place} disabled={locked} onClick={() => void commit()}>
        <span>{processing || busy ? t('Saving…') : t('Place order')}</span>
        <small>{formatMoney(totalCentimes)}</small>
      </button>
    </div>
  );
}
