import { Minus, Plus } from '@boxicons/react';
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
  return (
    <div className={styles.stepper} aria-label={`${productName} quantity: ${quantity}`}>
      <button
        type="button"
        aria-label={`Decrease ${productName} quantity`}
        disabled={quantity === 1}
        onClick={onDecrement}
      >
        <Minus width={16} height={16} />
      </button>
      <strong>{quantity}</strong>
      <button
        type="button"
        aria-label={`Increase ${productName} quantity`}
        onClick={onIncrement}
      >
        <Plus width={16} height={16} />
      </button>
    </div>
  );
}
