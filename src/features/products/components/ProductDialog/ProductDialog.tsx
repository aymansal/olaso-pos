import { Save, X } from '@boxicons/react';
import { useState } from 'react';
import type { ManagedCategory, ProductSaveInput } from '../../productManagementTypes';
import styles from './ProductDialog.module.css';

interface ProductDialogProps {
  categories: ManagedCategory[];
  defaultCategoryId?: string;
  nextSortOrder: number;
  onClose: () => void;
  onSave: (input: ProductSaveInput) => Promise<void>;
}

export function ProductDialog({
  categories,
  defaultCategoryId,
  nextSortOrder,
  onClose,
  onSave,
}: ProductDialogProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(
    defaultCategoryId
      ?? categories.find((category) => category.status === 'active')?.id
      ?? '',
  );
  const [priceMad, setPriceMad] = useState('0');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const price = Number(priceMad);
  const invalidPrice = !Number.isFinite(price) || price < 0;

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onSave({
        name,
        categoryId,
        basePriceCentimes: Math.round(price * 100),
        status: 'active',
        sortOrder: nextSortOrder,
      });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Product save failed.');
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
        aria-labelledby="product-dialog-title"
      >
        <header>
          <span>
            <small>MENU ITEM</small>
            <h2 id="product-dialog-title">Add product</h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close product editor">
            <X width={18} height={18} aria-hidden="true" />
          </button>
        </header>

        <label>
          <span>Product name</span>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && name.trim() && !invalidPrice) void submit();
            }}
          />
        </label>
        <label>
          <span>Category</span>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option
                value={category.id}
                disabled={category.status === 'archived'}
                key={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Price</span>
          <span className={styles.price}>
            <input
              aria-label="Price in MAD"
              type="number"
              min="0"
              step="0.01"
              value={priceMad}
              onChange={(event) => setPriceMad(event.target.value)}
            />
            <small>MAD</small>
          </span>
        </label>

        {error ? <p>{error}</p> : null}
        <footer>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.save}
            onClick={submit}
            disabled={saving || !name.trim() || invalidPrice}
          >
            <Save width={16} height={16} aria-hidden="true" />
            {saving ? 'Saving…' : 'Save product'}
          </button>
        </footer>
      </section>
    </div>
  );
}
