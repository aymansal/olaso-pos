import { X } from '@phosphor-icons/react';
import { useState } from 'react';
import { localBusinessDate } from '../../../../lib/date.ts';
import type { SavedCostManagement } from '../../../../data/localCosts.ts';
import styles from './CompensationDialog.module.css';

export function CompensationDialog({
  staff,
  onClose,
  onSave,
}: {
  staff: SavedCostManagement['staff'];
  onClose: () => void;
  onSave: (input: {
    staffProfileId: string;
    monthlyAmountCentimes: number;
    effectiveStartMonth: string;
    effectiveEndMonth?: string;
  }) => Promise<void>;
}) {
  const [staffProfileId, setStaffProfileId] = useState(staff[0]?.id ?? '');
  const [amountMad, setAmountMad] = useState('');
  const [startMonth, setStartMonth] = useState(localBusinessDate().slice(0, 7));
  const [endMonth, setEndMonth] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const monthlyAmountCentimes = Math.round(Number(amountMad) * 100);
  const valid = Boolean(staffProfileId && startMonth)
    && Number.isSafeInteger(monthlyAmountCentimes)
    && monthlyAmountCentimes >= 0
    && (!endMonth || endMonth >= startMonth);

  async function submit() {
    if (!valid) return;
    setSaving(true);
    setError('');
    try {
      await onSave({
        staffProfileId,
        monthlyAmountCentimes,
        effectiveStartMonth: startMonth,
        ...(endMonth ? { effectiveEndMonth: endMonth } : {}),
      });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Compensation could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="compensation-title">
        <header><h2 id="compensation-title">Add compensation</h2><button type="button" onClick={onClose} aria-label="Close compensation"><X size={18} /></button></header>
        <div className={styles.grid}>
          <label>Staff<select autoFocus value={staffProfileId} onChange={(event) => setStaffProfileId(event.target.value)}>{staff.map((profile) => <option value={profile.id} key={profile.id}>{profile.name}</option>)}</select></label>
          <label>Monthly amount · MAD<input type="number" min="0" step="0.01" value={amountMad} onChange={(event) => setAmountMad(event.target.value)} /></label>
          <label>Starts<input type="month" value={startMonth} onChange={(event) => setStartMonth(event.target.value)} /></label>
          <label>Ends (optional)<input type="month" min={startMonth} value={endMonth} onChange={(event) => setEndMonth(event.target.value)} /></label>
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        <footer><button type="button" onClick={onClose}>Cancel</button><button type="button" disabled={!valid || saving} onClick={submit}>{saving ? 'Saving…' : 'Save compensation'}</button></footer>
      </section>
    </div>
  );
}
