import { CaretDown } from '@phosphor-icons/react';
import styles from './LabeledField.module.css';

type LabeledFieldProps = {
  label: string;
  value: string;
  isSelect?: boolean;
};

export function LabeledField({ label, value, isSelect = false }: LabeledFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <span className={styles.control}>
        <input value={value} readOnly aria-label={label} />
        {isSelect ? <CaretDown size={18} aria-hidden="true" /> : null}
      </span>
    </label>
  );
}
