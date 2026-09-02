import { Minus, Plus } from '@boxicons/react';
import { useT } from '../../../../lib/locale';
import styles from './QuantityStepper.module.css';

type QuantityStepperProps = {
  productName: string;
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

export function QuantityStepper({
  productName,
  quantity,
  onDecrement,
  onIncrement,
}: QuantityStepperProps) {
  const t = useT();
  return (
    <div className={styles.stepper} aria-label={t('{name} quantity: {quantity}', { name: productName, quantity })}>
      <button
        type="button"
        aria-label={t('Decrease {name} quantity', { name: productName })}
        disabled={quantity === 1}
        onClick={onDecrement}
      >
        <Minus width={16} height={16} />
      </button>
      <strong>{quantity}</strong>
      <button
        type="button"
        aria-label={t('Increase {name} quantity', { name: productName })}
        onClick={onIncrement}
      >
        <Plus width={16} height={16} />
      </button>
    </div>
  );
}
