import { Search, X } from '@boxicons/react';
import { useT } from '../../../../lib/locale';
import styles from './SearchField.module.css';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchField({ value, onChange }: SearchFieldProps) {
  const t = useT();
  return (
    <label className={styles.search}>
      <Search width={18} height={18} aria-hidden="true" />
      <input
        aria-label={t('Search products')}
        placeholder={t('Search products')}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value !== '' ? (
        <button
          type="button"
          className={styles.clear}
          aria-label={t('Clear search')}
          onClick={() => onChange('')}
        >
          <X width={16} height={16} aria-hidden="true" />
        </button>
      ) : null}
    </label>
  );
}
