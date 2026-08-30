import { X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import type {
  ExpenseInput,
  SavedExpense,
} from '../../../../data/localCosts.ts';
import { localBusinessDate } from '../../../../lib/date.ts';
import styles from './ExpenseDialog.module.css';

export function ExpenseDialog({
  expense,
  onClose,
  onSave,
}: {
  expense?: SavedExpense;
  onClose: () => void;
  onSave: (input: ExpenseInput) => Promise<void>;
}) {
  const [category, setCategory] = useState(expense?.category ?? 'Rent');
  const [description, setDescription] = useState(expense?.description ?? '');
  const [amountMad, setAmountMad] = useState(
    expense ? String(expense.amountCentimes / 100) : '',
  );
  const [recurrence, setRecurrence] = useState<'one-time' | 'monthly'>(
    expense?.recurrence ?? 'one-time',
  );
  const [effectiveDate, setEffectiveDate] = useState(
    expense?.effectiveDate ?? localBusinessDate(),
  );
  const [startMonth, setStartMonth] = useState(
    expense?.effectiveStartMonth ?? localBusinessDate().slice(0, 7),
  );
  const [endMonth, setEndMonth] = useState(expense?.effectiveEndMonth ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const amountCentimes = Math.round(Number(amountMad) * 100);
  const valid = Boolean(category.trim() && description.trim())
    && Number.isSafeInteger(amountCentimes) && amountCentimes > 0
    && (recurrence === 'one-time'
      ? Boolean(effectiveDate)
      : Boolean(startMonth) && (!endMonth || endMonth >= startMonth));

  async function submit() {
    if (!valid) return;
    setSaving(true);
    setError('');
    try {
      await onSave({
        category,
        description,
        amountCentimes,
        recurrence,
        ...(recurrence === 'one-time'
          ? { effectiveDate }
          : {
              effectiveStartMonth: startMonth,
              ...(endMonth ? { effectiveEndMonth: endMonth } : {}),
            }),
      });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Expense could not be saved.');
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
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="expense-title">
        <header>
          <h2 id="expense-title">{expense ? 'Correct expense' : 'Add expense'}</h2>
          <button type="button" onClick={onClose} aria-label="Close expense"><X width={18} height={18} /></button>
        </header>
        <div className={styles.grid}>
          <label>Category<input value={category} onChange={(event) => setCategory(event.target.value)} /></label>
          <label>Amount · MAD<input type="number" min="0.01" step="0.01" placeholder="0" value={amountMad} onChange={(event) => setAmountMad(event.target.value)} /></label>
          <label className={styles.full}>Description<input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
          <label>Repeats<MenuSelect ariaLabel="Repeats" value={recurrence} onChange={(id) => setRecurrence(id as 'one-time' | 'monthly')} options={[{ id: 'one-time', label: 'Once' }, { id: 'monthly', label: 'Monthly' }]} /></label>
          {recurrence === 'one-time' ? (
            <label>Date<input type="date" value={effectiveDate} onChange={(event) => setEffectiveDate(event.target.value)} /></label>
          ) : (
            <>
              <label>Starts<input type="month" value={startMonth} onChange={(event) => setStartMonth(event.target.value)} /></label>
              <label>Ends (optional)<input type="month" min={startMonth} value={endMonth} onChange={(event) => setEndMonth(event.target.value)} /></label>
            </>
          )}
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        <footer>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="button" disabled={!valid || saving} onClick={submit}>{saving ? 'Saving…' : expense ? 'Save correction' : 'Save expense'}</button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
