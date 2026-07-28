import { Command, MagnifyingGlass } from '@phosphor-icons/react';
import styles from './SearchField.module.css';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <label className={styles.search}>
      <MagnifyingGlass size={20} aria-hidden="true" />
      <input
        aria-label="Search products"
        placeholder="Search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Command className={styles.command} size={20} aria-hidden="true" />
    </label>
  );
}
