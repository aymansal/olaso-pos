import type { PaymentMethod } from '../../posSession';
import styles from './PaymentMethodControl.module.css';

export function PaymentMethodControl({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}) {
  return (
    <div className={styles.control} role="group" aria-label="Payment method">
      {(['Cash', 'Card'] as const).map((method) => (
        <button
          key={method}
          type="button"
          className={value === method ? styles.active : undefined}
          aria-pressed={value === method}
          onClick={() => onChange(method)}
        >
          {method}
        </button>
      ))}
    </div>
  );
}
