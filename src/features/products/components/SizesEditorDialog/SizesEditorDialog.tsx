import { FloppyDisk, Plus, Trash, X } from '@phosphor-icons/react';
import { useState } from 'react';
import type { ManagedProduct, ManagedProductSize } from '../../productManagementTypes';
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
  const [drafts, setDrafts] = useState(() => sizes.map((size) => ({ ...size })));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (index: number, patch: Partial<ManagedProductSize>) => setDrafts((current) =>
    current.map((size, sizeIndex) => sizeIndex === index ? { ...size, ...patch } : size));
  async function save() {
    setSaving(true); setError('');
    try {
      for (const size of drafts) await onSave(size);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Size save failed.');
    } finally { setSaving(false); }
  }
  return <div className={styles.overlay} role="presentation">
    <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="sizes-dialog-title">
      <header><span><small>PRODUCT SIZES</small><h2 id="sizes-dialog-title">Sizes · {product.name}</h2></span>
        <button type="button" onClick={onClose} aria-label="Close sizes editor"><X size={18} /></button></header>
      <div className={styles.rows}>
        {drafts.map((size, index) => <article className={styles.row} key={size.id ?? `new-${index}`}>
          <label><span>Name</span><input value={size.name} onChange={(event) => update(index, { name: event.target.value })} /></label>
          <label><span>Price · MAD</span><input type="number" min="0" step="0.01" value={size.priceCentimes / 100}
            onChange={(event) => update(index, { priceCentimes: Math.round(Number(event.target.value) * 100) })} /></label>
          <label><span>Order</span><input type="number" min="0" value={size.sortOrder}
            onChange={(event) => update(index, { sortOrder: Number(event.target.value) })} /></label>
          <label><span>Availability</span><select value={size.status} onChange={(event) => update(index, { status: event.target.value as ManagedProductSize['status'] })}>
            <option value="active">Active</option><option value="unavailable">Unavailable</option></select></label>
          <label className={styles.default}><input type="radio" name="default-size" checked={size.isDefault}
            onChange={() => setDrafts((current) => current.map((item, itemIndex) => ({ ...item, isDefault: itemIndex === index })))} />Default</label>
          <button type="button" onClick={async () => {
            if (!size.id || size.revision === undefined) { setDrafts((current) => current.filter((_, itemIndex) => itemIndex !== index)); return; }
            try { await onDelete({ id: size.id, revision: size.revision }); setDrafts((current) => current.filter((_, itemIndex) => itemIndex !== index)); }
            catch (caught) { setError(caught instanceof Error ? caught.message : 'Size delete failed.'); }
          }} aria-label={`Delete ${size.name || 'size'}`}><Trash size={16} /></button>
        </article>)}
      </div>
      <button type="button" className={styles.add} disabled={drafts.length >= 8}
        onClick={() => setDrafts((current) => [...current, blankSize(product.id, Math.max(0, ...current.map((item) => item.sortOrder)) + 10)])}><Plus size={15} />Add size</button>
      {error ? <p className={styles.error}>{error}</p> : null}
      <footer><span>Up to 8 saved sizes</span><button type="button" className={styles.save} onClick={save} disabled={saving || drafts.some((size) => !size.name.trim())}><FloppyDisk size={16} />{saving ? 'Saving…' : 'Save sizes'}</button></footer>
    </section>
  </div>;
}
