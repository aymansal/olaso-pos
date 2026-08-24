import { useCallback, useEffect, useState } from 'react';
import {
  createLocalStaff,
  loadLocalStaffProfiles,
  type StaffCreationInput,
  type SavedStaffProfile,
} from './localStaff.ts';
import { useReconnect } from './reconnectContext.tsx';
import { useStaffSession } from './sessionContext.tsx';

export function useStaffManagement() {
  const session = useStaffSession();
  const reconnect = useReconnect();
  const [staff, setStaff] = useState<SavedStaffProfile[]>();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const reload = useCallback(async () => {
    const saved = await loadLocalStaffProfiles();
    setStaff(saved);
    setError('');
    return saved;
  }, []);
  useEffect(() => {
    void reload().catch(() =>
      setError('Saved staff is unavailable on this tablet.'));
  }, [reconnect.revision, reload]);
  const create = async (input: StaffCreationInput) => {
    setError('');
    setMessage('');
    try {
      const result = await createLocalStaff({
        deviceId: session.deviceId,
        actor: {
          staffProfileId: session.staffProfileId,
          name: session.name,
          role: session.role,
        },
      }, input);
      await reload();
      setMessage('Staff member added on this tablet.');
      void reconnect.run('automatic').catch(() => undefined);
      return result;
    } catch (caught) {
      const message = caught instanceof Error
        ? caught.message
        : 'Staff member could not be added.';
      setError(message);
      throw caught;
    }
  };
  return {
    staff: staff ?? [],
    isLoading: !staff && !error,
    error: error || undefined,
    message,
    create,
  };
}
