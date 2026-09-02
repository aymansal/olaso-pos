import { X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import type { ManagedIngredient } from '../../stockManagementTypes';
import { formatMoney } from '../../../../lib/money';
import { formatStockQuantity } from '../../stockPresentation';
import { useT } from '../../../../lib/locale';
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
  const t = useT();
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
  return <OverlayPortal><div className={styles.overlay} role="presentation" onPointerDown={(event) => closeOnBackdrop(event, onClose)}><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="purchase-title">
    <header><span><small>{t('PACKAGE RECEIPT')}</small><h2 id="purchase-title">{t('Receive purchase')}</h2></span><button type="button" onClick={onClose} aria-label={t('Close purchase receipt')}><X width={18} height={18} /></button></header>
    <p className={styles.ingredient}><strong>{ingredient.name}</strong><span>{t('On hand {quantity}', { quantity: formatStockQuantity(ingredient.currentStockQuantity, ingredient.baseUnit) })}</span></p>
    <div className={styles.grid}>
      <label>{t('Package label')}<input value={packageLabel} onChange={(event) => setPackageLabel(event.target.value)} /></label>
      <label>{t('Packages')}<input type="number" min="1" step="1" value={packageCount} onChange={(event) => setPackageCount(event.target.value)} /></label>
      <label>{t('Quantity per package')}<input type="number" min="1" step="1" placeholder="0" value={quantityPerPackage} onChange={(event) => setQuantityPerPackage(event.target.value)} /></label>
      <label>{t('Price per package')} · {t('MAD')}<input type="number" min="0.01" step="0.01" placeholder="0" value={priceMad} onChange={(event) => setPriceMad(event.target.value)} /></label>
      <label>{t('Supplier (optional)')}<input value={supplierLabel} onChange={(event) => setSupplierLabel(event.target.value)} /></label>
      <label>{t('Note (optional)')}<input value={note} onChange={(event) => setNote(event.target.value)} /></label>
    </div>
    <p className={styles.summary}>{t('Adds {quantity} · purchase cash {amount}', { quantity: formatStockQuantity(totalQuantity, ingredient.baseUnit), amount: formatMoney(totalCost) })}</p>
    {error ? <p className={styles.error}>{t(error)}</p> : null}
    <footer><button type="button" onClick={onClose}>{t('Cancel')}</button><button type="button" onClick={submit} disabled={saving || !valid}>{saving ? t('Saving…') : t('Save purchase')}</button></footer>
  </section></div></OverlayPortal>;
}
