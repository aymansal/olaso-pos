import {
  CATEGORY_ARTWORK_OPTIONS,
  type CategoryArtworkKey,
} from '../../../../lib/categoryArtwork.ts';
import { useT } from '../../../../lib/locale';
import styles from './CategoryArtworkPicker.module.css';

export function CategoryArtworkPicker({
  value,
  onChange,
}: {
  value: CategoryArtworkKey;
  onChange: (value: CategoryArtworkKey) => void;
}) {
  const t = useT();
  return (
    <fieldset className={styles.picker}>
      <legend>{t('Artwork')}</legend>
      <div>
        {CATEGORY_ARTWORK_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={value === option.key}
            onClick={() => onChange(option.key)}
          >
            <img src={option.image} alt="" width={36} height={36} decoding="async" />
            <span>{t(option.label)}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
