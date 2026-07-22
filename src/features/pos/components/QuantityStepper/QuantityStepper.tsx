import { Minus, Plus } from '@phosphor-icons/react';
import styles from './QuantityStepper.module.css';

export function QuantityStepper() {
  return (
    <div className={styles.stepper} aria-label="Quantity: 2">
      <button type="button" aria-label="Decrease quantity"><Minus size={16} /></button>
      <strong>2</strong>
      <button type="button" aria-label="Increase quantity"><Plus size={16} /></button>
    </div>
  );
}
