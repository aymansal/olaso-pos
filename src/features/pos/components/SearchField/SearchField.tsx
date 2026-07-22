import { Command, MagnifyingGlass } from '@phosphor-icons/react';
import styles from './SearchField.module.css';

export function SearchField() {
  return (
    <label className={styles.search}>
      <MagnifyingGlass size={20} aria-hidden="true" />
      <input aria-label="Search products" placeholder="Search" />
      <Command className={styles.command} size={20} aria-hidden="true" />
    </label>
  );
}
