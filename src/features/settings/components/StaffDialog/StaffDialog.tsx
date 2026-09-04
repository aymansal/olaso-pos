import { X } from '@boxicons/react';
import { useRef, useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import type { StaffCreationInput } from '../../../../data/localStaff.ts';
import { useT } from '../../../../lib/locale';
import styles from './StaffDialog.module.css';

export function StaffDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (input: StaffCreationInput) => Promise<unknown>;
}) {
  const t = useT();
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffCreationInput['role']>('cashier');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [error, setError] = useState('');
  const valid = Boolean(name.trim())
    && /^\d{6}$/.test(pin)
    && pin === confirmPin;

  async function submit() {
    if (!valid || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError('');
    try {
      await onSave({ name, role, pin, confirmPin });
      setPin('');
      setConfirmPin('');
      onClose();
    } catch (caught) {
      setError(caught instanceof Error
        ? caught.message
        : 'Staff member could not be added.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <OverlayPortal>
    <div
      className={styles.overlay}
      role="presentation"
      onPointerDown={(event) => {
        if (!savingRef.current) closeOnBackdrop(event, onClose);
      }}
    >
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="staff-dialog-title">
        <header>
          <h2 id="staff-dialog-title">{t('Add staff')}</h2>
          <button type="button" disabled={saving} onClick={onClose} aria-label={t('Close staff form')}><X width={18} height={18} /></button>
        </header>
        <div className={styles.form}>
          <label>
            <span>{t('Name')}</span>
            <input maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span>{t('Role')}</span>
            <MenuSelect
              className={styles.roleSelect}
              ariaLabel="Role"
              value={role}
              onChange={(id) => setRole(id as StaffCreationInput['role'])}
              options={[
                { id: 'cashier', label: 'Cashier' },
                { id: 'manager', label: 'Manager' },
                { id: 'owner', label: 'Owner' },
              ]}
            />
          </label>
          <label>
            <span>{t('Six-digit PIN')}</span>
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
          <button type="button" disabled={!valid || saving} onClick={submit}>{saving ? t('Adding…') : t('Add staff')}</button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
