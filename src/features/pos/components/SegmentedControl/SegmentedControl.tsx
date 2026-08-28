import type { CSSProperties } from 'react';
import type { ServiceMode } from '../../posSession';
import styles from './SegmentedControl.module.css';

const options: ServiceMode[] = ['Dine In', 'Take Away'];

type SegmentedControlProps = {
  value: ServiceMode;
  onChange: (value: ServiceMode) => void;
};

export function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  const index = options.indexOf(value);
  return (
    <div
      className={styles.control}
      style={{ '--count': options.length, '--index': index } as CSSProperties}
      role="group"
      aria-label="Service type"
    >
      <span className={styles.indicator} aria-hidden="true" />
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
