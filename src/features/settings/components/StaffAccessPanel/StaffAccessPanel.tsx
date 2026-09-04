import { useState } from 'react';
import type { useStaffManagement } from '../../../../data/useStaffManagement.ts';
import { StaffDialog } from '../StaffDialog/StaffDialog.tsx';
import { StaffPinDialog } from '../StaffPinDialog/StaffPinDialog.tsx';
import type { SavedStaffProfile } from '../../../../data/localStaff.ts';
import { useT } from '../../../../lib/locale';
import styles from './StaffAccessPanel.module.css';

type StaffManagement = ReturnType<typeof useStaffManagement>;

function roleLabel(role: string) {
  return role === 'owner' ? 'Owner' : role === 'manager' ? 'Manager' : 'Cashier';
}

export function StaffAccessPanel({ management }: { management: StaffManagement }) {
  const t = useT();
  const [adding, setAdding] = useState(false);
  const [changingPin, setChangingPin] = useState<SavedStaffProfile>();
  return (
    <section className={styles.panel} aria-labelledby="staff-heading">
      <header className={styles.header}>
        <div>
          <h2 id="staff-heading">{t('Staff & access')}</h2>
          <p>{t('People who can use this tablet')}</p>
        </div>
        <button type="button" onClick={() => setAdding(true)}>{t('Add staff')}</button>
      </header>
      <div className={styles.list}>
        {management.isLoading ? <p>{t('Loading staff…')}</p> : management.staff.map((profile) => (
          <article key={profile.id}>
            <span>
              <strong>{profile.name}</strong>
              <small>{t(roleLabel(profile.role))}</small>
            </span>
            <div className={styles.actions}>
              <b>{profile.pending ? t('Waiting to sync') : t('Ready')}</b>
              <button type="button" className={styles.changePin} onClick={() => setChangingPin(profile)}>
                {t('Change PIN')}
              </button>
              {profile.id !== management.currentStaffId ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(t('Delete {name}? Past records will be preserved.', { name: profile.name }))) {
                      void management.remove(profile).catch(() => undefined);
                    }
                  }}
                >
                  {t('Delete')}
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {management.message ? <p className={styles.message} role="status">{t(management.message)}</p> : null}
      {management.error ? <p className={styles.error} role="alert">{t(management.error)}</p> : null}
      {adding ? <StaffDialog onClose={() => setAdding(false)} onSave={management.create} /> : null}
      {changingPin ? <StaffPinDialog profile={changingPin} onClose={() => setChangingPin(undefined)} onSave={management.changePin} /> : null}
    </section>
  );
}
