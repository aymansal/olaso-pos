import { X } from '@boxicons/react';
import { useRef, useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import type { StaffPinInput, SavedStaffProfile } from '../../../../data/localStaff.ts';
import { useT } from '../../../../lib/locale';
import styles from '../StaffDialog/StaffDialog.module.css';

export function StaffPinDialog({
  profile,
  onClose,
  onSave,
}: {
  profile: SavedStaffProfile;
  onClose: () => void;
  onSave: (profile: SavedStaffProfile, input: StaffPinInput) => Promise<unknown>;
}) {
  const t = useT();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [error, setError] = useState('');
  const valid = /^\d{6}$/.test(pin) && pin === confirmPin;

  async function submit() {
    if (!valid || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError('');
    try {
      await onSave(profile, { pin, confirmPin });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'PIN could not be changed.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <OverlayPortal>
      <div className={styles.overlay} role="presentation" onPointerDown={(event) => {
        if (!savingRef.current) closeOnBackdrop(event, onClose);
      }}>
        <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="staff-pin-title">
          <header>
            <h2 id="staff-pin-title">{t('Change PIN for {name}', { name: profile.name })}</h2>
            <button type="button" disabled={saving} onClick={onClose} aria-label={t('Close PIN form')}><X width={18} height={18} /></button>
          </header>
          <div className={styles.form}>
            <label>
              <span>{t('New six-digit PIN')}</span>
              <input type="password" inputMode="numeric" autoComplete="new-password" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))} />
            </label>
            <label>
              <span>{t('Confirm PIN')}</span>
              <input type="password" inputMode="numeric" autoComplete="new-password" value={confirmPin} onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, '').slice(0, 6))} />
            </label>
          </div>
          {error ? <p className={styles.error} role="alert">{t(error)}</p> : null}
          <footer>
            <button type="button" disabled={saving} onClick={onClose}>{t('Cancel')}</button>
            <button type="button" disabled={!valid || saving} onClick={submit}>{saving ? t('Saving…') : t('Change PIN')}</button>
          </footer>
        </section>
      </div>
    </OverlayPortal>
  );
}
