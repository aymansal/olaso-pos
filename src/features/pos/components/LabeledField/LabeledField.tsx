import styles from './LabeledField.module.css';

type LabeledFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function LabeledField({
  label,
  value,
  onChange,
  placeholder,
}: LabeledFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <span className={styles.control}>
        <input
          aria-label={label}
          autoComplete="off"
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}
