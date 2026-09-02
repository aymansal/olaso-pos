import { Save, X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import { useT } from '../../../../lib/locale';
import type { ManagedCategory, ProductSaveInput } from '../../productManagementTypes';
import { ProductImageButton } from '../ProductImageButton/ProductImageButton';
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
  const t = useT();
  const [name, setName] = useState('');
  const [imageJpeg, setImageJpeg] = useState<string>();
  const [categoryId, setCategoryId] = useState(
    defaultCategoryId
      ?? categories.find((category) => category.status === 'active')?.id
      ?? '',
  );
  const [priceMad, setPriceMad] = useState('');
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
        ...(imageJpeg ? { imageJpeg } : {}),
      });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Product save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <OverlayPortal>
    <div
      className={styles.overlay}
      role="presentation"
      onPointerDown={(event) => closeOnBackdrop(event, onClose)}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
      >
        <header>
          <span>
            <small>{t('MENU ITEM')}</small>
            <h2 id="product-dialog-title">{t('Add product')}</h2>
          </span>
          <button type="button" onClick={onClose} aria-label={t('Close product editor')}>
            <X width={16} height={16} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.nameRow}>
          <label>
            <span>{t('Product name')}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && name.trim() && !invalidPrice) void submit();
              }}
            />
          </label>
          <ProductImageButton
            className={styles.photo}
            previewUrl={imageJpeg}
            onChange={setImageJpeg}
            onError={setError}
            disabled={saving}
            label="Add product photo"
          />
        </div>
        <div className={styles.pair}>
          <label>
            <span>{t('Category')}</span>
            <MenuSelect
              className={styles.categoryMenu}
              ariaLabel="Category"
              value={categoryId}
              onChange={setCategoryId}
              options={[
                { id: '', label: 'Uncategorized' },
                ...categories.map((category) => ({
                  id: category.id,
                  label: category.name,
                  disabled: category.status === 'archived',
                })),
              ]}
            />
          </label>
          <label>
            <span>{t('Price')}</span>
            <span className={styles.price}>
              <input
                aria-label={t('Price in MAD')}
                type="number"
                min="0"
                step="0.01"
                value={priceMad}
                placeholder="0"
                onChange={(event) => setPriceMad(event.target.value)}
              />
              <small>{t('MAD')}</small>
            </span>
          </label>
        </div>

        {error ? <p>{t(error)}</p> : null}
        <footer>
          <button type="button" className={styles.cancel} onClick={onClose}>
            {t('Cancel')}
          </button>
          <button
            type="button"
            className={styles.save}
            onClick={submit}
            disabled={saving || !name.trim() || invalidPrice}
          >
            <Save width={14} height={14} aria-hidden="true" />
            {saving ? t('Saving…') : t('Save')}
          </button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
