import styles from './SegmentedControl.module.css';

const options = ['Dine In', 'Take Away', 'Order Online'];

export function SegmentedControl() {
  return (
    <div className={styles.control} role="tablist" aria-label="Service type">
      {options.map((option, index) => (
        <button
          key={option}
          className={index === 0 ? styles.active : undefined}
          type="button"
          role="tab"
          aria-selected={index === 0}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
