import {
  CATEGORY_ARTWORK_OPTIONS,
  type CategoryArtworkKey,
} from '../../../../lib/categoryArtwork.ts';
import styles from './CategoryArtworkPicker.module.css';

export function CategoryArtworkPicker({
  value,
  onChange,
}: {
  value: CategoryArtworkKey;
  onChange: (value: CategoryArtworkKey) => void;
}) {
  return (
    <fieldset className={styles.picker}>
      <legend>Artwork</legend>
      <div>
        {CATEGORY_ARTWORK_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={value === option.key}
            onClick={() => onChange(option.key)}
          >
            <img src={option.image} alt="" width={48} height={48} decoding="async" />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
