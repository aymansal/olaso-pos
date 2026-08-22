import type { ServiceMode } from '../../posSession';
import styles from './SegmentedControl.module.css';

const options: ServiceMode[] = ['Dine In', 'Take Away'];

type SegmentedControlProps = {
  value: ServiceMode;
  onChange: (value: ServiceMode) => void;
};

export function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  return (
    <div className={styles.control} role="group" aria-label="Service type">
      {options.map((option) => (
        <button
          key={option}
          className={option === value ? styles.active : undefined}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
