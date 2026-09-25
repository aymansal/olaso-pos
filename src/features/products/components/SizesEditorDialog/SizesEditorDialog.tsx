import { Save, Plus, Trash, X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import { useT } from '../../../../lib/locale';
import type { ManagedProduct, ManagedProductSize } from '../../productManagementTypes';
import { queueProductSizeSaves } from '../../queueProductSizeSaves';
import styles from './SizesEditorDialog.module.css';

interface SizesEditorDialogProps {
  product: ManagedProduct;
  sizes: ManagedProductSize[];
  onClose: () => void;
  onSave: (size: ManagedProductSize) => Promise<unknown>;
  onDelete: (size: Required<Pick<ManagedProductSize, 'id' | 'revision'>>) => Promise<unknown>;
}

const blankSize = (productId: string, sortOrder: number): ManagedProductSize => ({
  productId, name: '', priceCentimes: 0, sortOrder, isDefault: false, status: 'active',
});

export function SizesEditorDialog({ product, sizes, onClose, onSave, onDelete }: SizesEditorDialogProps) {
  const t = useT();
  const [drafts, setDrafts] = useState(() => sizes.map((size) => ({ ...size })));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (index: number, patch: Partial<ManagedProductSize>) => setDrafts((current) =>
    current.map((size, sizeIndex) => sizeIndex === index ? { ...size, ...patch } : size));
  async function save() {
    setSaving(true); setError('');
    try {
      for (const size of queueProductSizeSaves(drafts, sizes)) await onSave(size);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Size save failed.');
    } finally { setSaving(false); }
  }
  return <OverlayPortal><div className={styles.overlay} data-products-palette role="presentation" onPointerDown={(event) => closeOnBackdrop(event, onClose)}>
    <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="sizes-dialog-title">
      <header><span><small>{t('PRODUCT SIZES')}</small><h2 id="sizes-dialog-title">{t('Sizes · {name}', { name: product.name })}</h2></span>
        <button type="button" onClick={onClose} aria-label={t('Close sizes editor')}><X width={18} height={18} /></button></header>
      <div className={styles.rows}>
        <div className={styles.columnHead} aria-hidden="true">
          <span>{t('Name')}</span>
          <span>{t('Price')}</span>
          <span>{t('Sort order')}</span>
          <span>{t('Availability')}</span>
          <span>{t('Default')}</span>
          <span />
        </div>
        {drafts.map((size, index) => <article className={styles.row} key={size.id ?? `new-${index}`}>
          <input aria-label={t('Size name')} value={size.name} onChange={(event) => update(index, { name: event.target.value })} />
          <input aria-label={t('Price in MAD')} type="number" min="0" step="0.01" placeholder="0" value={size.priceCentimes / 100 || ''}
            onChange={(event) => update(index, { priceCentimes: Math.round(Number(event.target.value) * 100) })} />
          <input aria-label={t('Sort order')} type="number" min="0" placeholder="0" value={size.sortOrder || ''}
            onChange={(event) => update(index, { sortOrder: Number(event.target.value) })} />
          <MenuSelect className={styles.availabilityMenu} ariaLabel="Availability" value={size.status} onChange={(id) => update(index, { status: id as ManagedProductSize['status'] })} options={[{ id: 'active', label: 'Active' }, { id: 'unavailable', label: 'Unavailable' }]} />
          <label className={styles.default}><input type="radio" name="default-size" checked={size.isDefault}
            onChange={() => setDrafts((current) => current.map((item, itemIndex) => ({ ...item, isDefault: itemIndex === index })))} />{t('Default')}</label>
          <button type="button" onClick={async () => {
            if (!size.id || size.revision === undefined) { setDrafts((current) => current.filter((_, itemIndex) => itemIndex !== index)); return; }
            try { await onDelete({ id: size.id, revision: size.revision }); setDrafts((current) => current.filter((_, itemIndex) => itemIndex !== index)); }
            catch (caught) { setError(caught instanceof Error ? caught.message : 'Size delete failed.'); }
          }} aria-label={t('Delete {name}', { name: size.name || t('Size') })}><Trash width={16} height={16} /></button>
        </article>)}
      </div>
      <button type="button" className={styles.add} disabled={drafts.length >= 8}
        onClick={() => setDrafts((current) => [...current, blankSize(product.id, Math.max(0, ...current.map((item) => item.sortOrder)) + 10)])}><Plus width={15} height={15} />{t('Add size')}</button>
      {error ? <p className={styles.error}>{t(error)}</p> : null}
      <footer><span>{t('Up to 8 saved sizes')}</span><button type="button" className={styles.save} onClick={save} disabled={saving || drafts.some((size) => !size.name.trim())}><Save width={16} height={16} />{saving ? t('Saving…') : t('Save sizes')}</button></footer>
    </section>
  </div></OverlayPortal>;
}
