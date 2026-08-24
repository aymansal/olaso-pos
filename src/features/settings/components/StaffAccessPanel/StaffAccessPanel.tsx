import { useState } from 'react';
import type { useStaffManagement } from '../../../../data/useStaffManagement.ts';
import { StaffDialog } from '../StaffDialog/StaffDialog.tsx';
import styles from './StaffAccessPanel.module.css';

type StaffManagement = ReturnType<typeof useStaffManagement>;

function roleLabel(role: string) {
  return role === 'owner' ? 'Owner' : role === 'manager' ? 'Manager' : 'Cashier';
}

export function StaffAccessPanel({ management }: { management: StaffManagement }) {
  const [adding, setAdding] = useState(false);
  return (
    <section className={styles.panel} aria-labelledby="staff-heading">
      <header>
        <div>
          <h2 id="staff-heading">Staff & access</h2>
          <p>People who can use this tablet</p>
        </div>
        <button type="button" onClick={() => setAdding(true)}>Add staff</button>
      </header>
      <div className={styles.list}>
        {management.isLoading ? <p>Loading staff…</p> : management.staff.map((profile) => (
          <article key={profile.id}>
            <span>
              <strong>{profile.name}</strong>
              <small>{roleLabel(profile.role)}</small>
            </span>
            <b>{profile.pending ? 'Waiting to sync' : 'Ready'}</b>
          </article>
        ))}
      </div>
      {management.message ? <p className={styles.message} role="status">{management.message}</p> : null}
      {management.error ? <p className={styles.error} role="alert">{management.error}</p> : null}
      {adding ? <StaffDialog onClose={() => setAdding(false)} onSave={management.create} /> : null}
    </section>
  );
}
