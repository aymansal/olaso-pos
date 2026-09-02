import { X, ChevronDown } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import type {
  ExpenseInput,
  SavedExpense,
} from '../../../../data/localCosts.ts';
import { PeriodCalendar } from '../../../../components/PeriodCalendar/PeriodCalendar';
import { localBusinessDate } from '../../../../lib/date.ts';
import { useT } from '../../../../lib/locale';
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
  const t = useT();
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
  const [startDate, setStartDate] = useState(localBusinessDate());
  const [endDate, setEndDate] = useState(expense?.effectiveEndDate ?? '');
  const [calendar, setCalendar] = useState<{
    field: 'date' | 'start' | 'end';
    anchor: DOMRect;
  }>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const amountCentimes = Math.round(Number(amountMad) * 100);
  const valid = Boolean(category.trim() && description.trim())
    && Number.isSafeInteger(amountCentimes) && amountCentimes > 0
    && (recurrence === 'one-time'
      ? Boolean(effectiveDate)
      : Boolean(startDate) && (!endDate || endDate >= startDate));

  function toggleCalendar(field: 'date' | 'start' | 'end', rect: DOMRect) {
    setCalendar((current) =>
      current?.field === field ? undefined : { field, anchor: rect },
    );
  }

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
              effectiveStartMonth: startDate.slice(0, 7),
              effectiveStartDate: startDate,
              ...(endDate ? {
                effectiveEndMonth: endDate.slice(0, 7),
                effectiveEndDate: endDate,
              } : {}),
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
          <h2 id="expense-title">{expense ? t('Correct expense') : t('Add expense')}</h2>
          <button type="button" onClick={onClose} aria-label={t('Close expense')}><X width={18} height={18} /></button>
        </header>
        <div className={styles.grid}>
          <label>{t('Category')}<input value={category} onChange={(event) => setCategory(event.target.value)} /></label>
          <label>{t('Amount')} · {t('MAD')}<input type="number" min="0.01" step="0.01" placeholder="0" value={amountMad} onChange={(event) => setAmountMad(event.target.value)} /></label>
          <label className={styles.full}>{t('Description')}<input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
          <label>{t('Repeats')}<MenuSelect size="field" ariaLabel="Repeats" value={recurrence} onChange={(id) => setRecurrence(id as 'one-time' | 'monthly')} options={[{ id: 'one-time', label: 'One time' }, { id: 'monthly', label: 'Split by month days' }]} /></label>
          {recurrence === 'one-time' ? (
            <label>{t('Date')}
              <span className={styles.dateField}>
                <button
                  type="button"
                  aria-expanded={calendar?.field === 'date'}
                  onClick={(event) => toggleCalendar(
                    'date',
                    event.currentTarget.getBoundingClientRect(),
                  )}
                >{effectiveDate}</button>
                <ChevronDown width={14} height={14} aria-hidden="true" />
              </span>
            </label>
          ) : (
            <>
              <label>{t('Starts')}
                <span className={styles.dateField}>
                  <button
                  type="button"
                  aria-expanded={calendar?.field === 'start'}
                  onClick={(event) => toggleCalendar(
                    'start',
                    event.currentTarget.getBoundingClientRect(),
                  )}
                >{startDate}</button>
                  <ChevronDown width={14} height={14} aria-hidden="true" />
                </span>
              </label>
              <label>{t('Ends (optional)')}
                <span className={styles.dateField}>
                  <button
                  type="button"
                  aria-expanded={calendar?.field === 'end'}
                  onClick={(event) => toggleCalendar(
                    'end',
                    event.currentTarget.getBoundingClientRect(),
                  )}
                >{endDate || t('Open')}</button>
                  <ChevronDown width={14} height={14} aria-hidden="true" />
                </span>
              </label>
            </>
          )}
        </div>
        {calendar ? (
          <PeriodCalendar
            mode="day"
            fromDate={
              calendar.field === 'date'
                ? effectiveDate
                : calendar.field === 'start'
                  ? startDate
                  : endDate
                    ? endDate
                    : localBusinessDate()
            }
            toDate={
              calendar.field === 'date'
                ? effectiveDate
                : calendar.field === 'start'
                  ? startDate
                  : endDate
                    ? endDate
                    : localBusinessDate()
            }
            anchor={calendar.anchor}
            onChange={(range) => {
              if (calendar.field === 'date') setEffectiveDate(range.fromDate);
              if (calendar.field === 'start') setStartDate(range.fromDate);
              if (calendar.field === 'end') setEndDate(range.fromDate);
              setCalendar(undefined);
            }}
            onClose={() => setCalendar(undefined)}
          />
        ) : null}
        {error ? <p className={styles.error}>{t(error)}</p> : null}
        <footer className={styles.actions}>
          <button className={styles.ghost} type="button" onClick={onClose}>{t('Cancel')}</button>
          <button className={styles.solid} type="button" disabled={!valid || saving} onClick={submit}>{saving ? t('Saving…') : expense ? t('Save correction') : t('Save expense')}</button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
