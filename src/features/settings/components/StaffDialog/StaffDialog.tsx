import { X } from '@boxicons/react';
import { useState } from 'react';
import type { StaffCreationInput } from '../../../../data/localStaff.ts';
import styles from './StaffDialog.module.css';

export function StaffDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (input: StaffCreationInput) => Promise<unknown>;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffCreationInput['role']>('cashier');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const valid = Boolean(name.trim())
    && /^\d{6}$/.test(pin)
    && pin === confirmPin;

  async function submit() {
    if (!valid) return;
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
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="staff-dialog-title">
        <header>
          <h2 id="staff-dialog-title">Add staff</h2>
          <button type="button" onClick={onClose} aria-label="Close staff form"><X width={18} height={18} /></button>
        </header>
        <div className={styles.form}>
          <label>
            <span>Name</span>
            <input autoFocus maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span>Role</span>
            <select value={role} onChange={(event) => setRole(event.target.value as StaffCreationInput['role'])}>
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="owner">Owner</option>
            </select>
          </label>
          <label>
            <span>Six-digit PIN</span>
            <input type="password" inputMode="numeric" autoComplete="new-password" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))} />
          </label>
          <label>
            <span>Confirm PIN</span>
            <input type="password" inputMode="numeric" autoComplete="new-password" value={confirmPin} onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, '').slice(0, 6))} />
          </label>
        </div>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        <footer>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="button" disabled={!valid || saving} onClick={submit}>{saving ? 'Adding…' : 'Add staff'}</button>
        </footer>
      </section>
    </div>
  );
}
