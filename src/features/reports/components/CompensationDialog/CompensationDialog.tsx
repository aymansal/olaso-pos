import { X, ChevronDown } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import { PeriodCalendar } from '../../../../components/PeriodCalendar/PeriodCalendar';
import { localBusinessDate } from '../../../../lib/date.ts';
import type { SavedCostManagement } from '../../../../data/localCosts.ts';
import { useT } from '../../../../lib/locale';
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
    effectiveStartDate: string;
  }) => Promise<void>;
}) {
  const t = useT();
  const [staffProfileId, setStaffProfileId] = useState(staff[0]?.id ?? '');
  const [amountMad, setAmountMad] = useState('');
  const [paidOn, setPaidOn] = useState(localBusinessDate());
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const monthlyAmountCentimes = Math.round(Number(amountMad) * 100);
  const paidMonth = paidOn.slice(0, 7);
  const valid = Boolean(staffProfileId && paidOn)
    && Number.isSafeInteger(monthlyAmountCentimes)
    && monthlyAmountCentimes >= 0;

  async function submit() {
    if (!valid) return;
    setSaving(true);
    setError('');
    try {
      await onSave({
        staffProfileId,
        monthlyAmountCentimes,
        effectiveStartMonth: paidMonth,
        effectiveStartDate: paidOn,
      });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Compensation could not be saved.');
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
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="compensation-title">
        <header><h2 id="compensation-title">{t('Add compensation')}</h2><button type="button" onClick={onClose} aria-label={t('Close compensation')}><X width={18} height={18} /></button></header>
        <div className={styles.grid}>
          <label>{t('Staff')}<MenuSelect size="field" ariaLabel="Staff" value={staffProfileId} placeholder="Select staff" onChange={setStaffProfileId} options={staff.map((profile) => ({ id: profile.id, label: profile.name }))} /></label>
          <label>{t('Monthly amount')} · {t('MAD')}<input type="number" min="0" step="0.01" placeholder="0" value={amountMad} onChange={(event) => setAmountMad(event.target.value)} /></label>
          <label>{t('Paid on')}
            <span className={styles.dateField}>
              <button
                type="button"
                aria-expanded={Boolean(calendarAnchor)}
                onClick={(event) => {
                  if (calendarAnchor) {
                    setCalendarAnchor(undefined);
                    return;
                  }
                  setCalendarAnchor(event.currentTarget.getBoundingClientRect());
                }}
              >{paidOn}</button>
              <ChevronDown width={14} height={14} aria-hidden="true" />
            </span>
          </label>
        </div>
        {calendarAnchor ? (
          <PeriodCalendar
            mode="day"
            fromDate={paidOn}
            toDate={paidOn}
            anchor={calendarAnchor}
            onChange={(range) => {
              setPaidOn(range.fromDate);
            }}
            onClose={() => setCalendarAnchor(undefined)}
          />
        ) : null}
        {error ? <p className={styles.error}>{t(error)}</p> : null}
        <footer className={styles.actions}>
          <button className={styles.ghost} type="button" onClick={onClose}>{t('Cancel')}</button>
          <button className={styles.solid} type="button" disabled={!valid || saving} onClick={submit}>{saving ? t('Saving…') : t('Save compensation')}</button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
