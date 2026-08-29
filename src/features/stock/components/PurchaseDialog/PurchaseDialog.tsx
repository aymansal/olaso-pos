import { Package, X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal } from '../../../../components/OverlayPortal';
import type { ManagedIngredient } from '../../stockManagementTypes';
import { formatMoney } from '../../../../lib/money';
import { formatStockQuantity } from '../../stockPresentation';
import styles from './PurchaseDialog.module.css';

interface PurchaseDialogProps {
  ingredient: ManagedIngredient;
  onClose: () => void;
  onSave: (input: {
    packageLabel: string;
    packageCount: number;
    quantityPerPackage: number;
    packagePriceCentimes: number;
    supplierLabel?: string;
    note?: string;
  }) => Promise<void>;
}

export function PurchaseDialog({ ingredient, onClose, onSave }: PurchaseDialogProps) {
  const [packageLabel, setPackageLabel] = useState('Carton');
  const [packageCount, setPackageCount] = useState('1');
  const [quantityPerPackage, setQuantityPerPackage] = useState('');
  const [priceMad, setPriceMad] = useState('');
  const [supplierLabel, setSupplierLabel] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const count = Number(packageCount);
  const quantity = Number(quantityPerPackage);
  const priceCentimes = Math.round(Number(priceMad) * 100);
  const valid = Number.isSafeInteger(count) && count > 0
    && Number.isSafeInteger(quantity) && quantity > 0
    && Number.isSafeInteger(priceCentimes) && priceCentimes > 0
    && packageLabel.trim();

  async function submit() {
    if (!valid) return;
    setSaving(true);
    setError('');
    try {
      await onSave({
        packageLabel,
        packageCount: count,
        quantityPerPackage: quantity,
        packagePriceCentimes: priceCentimes,
        ...(supplierLabel.trim() ? { supplierLabel } : {}),
        ...(note.trim() ? { note } : {}),
      });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Purchase could not be saved.');
    } finally { setSaving(false); }
  }

  const totalQuantity = valid ? count * quantity : 0;
  const totalCost = valid ? count * priceCentimes : 0;
  return <OverlayPortal><div className={styles.overlay} role="presentation"><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="purchase-title">
    <header><span><small>PACKAGE RECEIPT</small><h2 id="purchase-title">Receive purchase</h2></span><button type="button" onClick={onClose} aria-label="Close purchase receipt"><X width={18} height={18} /></button></header>
    <p className={styles.ingredient}><Package width={18} height={18} /> <strong>{ingredient.name}</strong><span>On hand {formatStockQuantity(ingredient.currentStockQuantity, ingredient.baseUnit)}</span></p>
    <div className={styles.grid}>
      <label>Package label<input value={packageLabel} onChange={(event) => setPackageLabel(event.target.value)} /></label>
      <label>Packages<input type="number" min="1" step="1" value={packageCount} onChange={(event) => setPackageCount(event.target.value)} /></label>
      <label>Quantity per package<input autoFocus type="number" min="1" step="1" value={quantityPerPackage} onChange={(event) => setQuantityPerPackage(event.target.value)} /></label>
      <label>Price per package · MAD<input type="number" min="0.01" step="0.01" value={priceMad} onChange={(event) => setPriceMad(event.target.value)} /></label>
      <label>Supplier (optional)<input value={supplierLabel} onChange={(event) => setSupplierLabel(event.target.value)} /></label>
      <label>Note (optional)<input value={note} onChange={(event) => setNote(event.target.value)} /></label>
    </div>
    <p className={styles.summary}>Adds {formatStockQuantity(totalQuantity, ingredient.baseUnit)} · purchase cash {formatMoney(totalCost)}</p>
    {error ? <p className={styles.error}>{error}</p> : null}
    <footer><button type="button" onClick={onClose}>Cancel</button><button type="button" onClick={submit} disabled={saving || !valid}>{saving ? 'Saving…' : 'Save purchase'}</button></footer>
  </section></div></OverlayPortal>;
}
