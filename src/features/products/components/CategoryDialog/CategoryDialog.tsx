import { FloppyDisk, X } from '@phosphor-icons/react';
import { useState } from 'react';
import type { ManagedCategory } from '../../productManagementTypes';
import { CategoryArtworkPicker } from '../CategoryArtworkPicker/CategoryArtworkPicker.tsx';
import { categoryArtworkKey } from '../../../../lib/categoryArtwork.ts';
import styles from './CategoryDialog.module.css';

interface CategoryDialogProps {
  category?: ManagedCategory;
  onClose: () => void;
  onSave: (name: string, artworkKey: string) => Promise<void>;
}

export function CategoryDialog({
  category,
  onClose,
  onSave,
}: CategoryDialogProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [artworkKey, setArtworkKey] = useState(
    categoryArtworkKey(category?.artworkKey),
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const title = category ? `Edit ${category.name}` : 'Add category';

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onSave(name, artworkKey);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Category save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-dialog-title"
      >
        <header>
          <span>
            <small>MENU GROUP</small>
            <h2 id="category-dialog-title">{title}</h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close category editor">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <label>
          <span>Category name</span>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && name.trim()) void submit();
            }}
          />
        </label>

        <CategoryArtworkPicker
          value={artworkKey}
          onChange={setArtworkKey}
        />

        {error ? <p>{error}</p> : null}
        <footer>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.save}
            onClick={submit}
            disabled={saving || !name.trim()}
          >
            <FloppyDisk size={16} aria-hidden="true" />
            {saving ? 'Saving…' : 'Save category'}
          </button>
        </footer>
      </section>
    </div>
  );
}
