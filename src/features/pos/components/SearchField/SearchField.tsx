import { Search } from '@boxicons/react';
import styles from './SearchField.module.css';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <label className={styles.search}>
      <Search width={18} height={18} aria-hidden="true" />
      <input
        aria-label="Search products"
        placeholder="Search products"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
