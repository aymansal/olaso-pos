import type { CSSProperties } from 'react';
import { useT } from '../../../../lib/locale';
import type { PaymentMethod } from '../../posSession';
import styles from './PaymentMethodControl.module.css';

const methods: PaymentMethod[] = ['Cash', 'Card'];

export function PaymentMethodControl({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}) {
  const t = useT();
  return (
    <div
      className={styles.control}
      style={{ '--count': methods.length, '--index': methods.indexOf(value) } as CSSProperties}
      role="group"
      aria-label={t('Payment method')}
    >
      <span className={styles.indicator} aria-hidden="true" />
      {methods.map((method) => (
        <button
          key={method}
          type="button"
          className={value === method ? styles.active : undefined}
          aria-pressed={value === method}
          onClick={() => onChange(method)}
        >
          {t(method)}
        </button>
      ))}
    </div>
  );
}
