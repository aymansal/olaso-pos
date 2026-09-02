import { useT } from '../../../../lib/locale';
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
  const t = useT();
  return (
    <label className={styles.field}>
      <span>{t(label)}</span>
      <span className={styles.control}>
        <input
          aria-label={t(label)}
          autoComplete="off"
          placeholder={placeholder ? t(placeholder) : undefined}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}
