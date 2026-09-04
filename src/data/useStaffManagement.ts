import { useAction } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import {
  createLocalStaff,
  deleteLocalStaff,
  loadLocalStaffProfiles,
  saveStaffIdentityRevision,
  type StaffCreationInput,
  type StaffPinInput,
  type SavedStaffProfile,
  validateStaffPin,
} from './localStaff.ts';
import {
  clearStaffSession,
  createStaffPinCredential,
  saveUpdatedStaffPin,
} from './identitySession.ts';
import { useReconnect } from './reconnectContext.tsx';
import { useStaffSession } from './sessionContext.tsx';

export function useStaffManagement() {
  const session = useStaffSession();
  const updateStaffPin = useAction(api.identity.updateStaffPin);
  const reconnect = useReconnect();
  const [staff, setStaff] = useState<SavedStaffProfile[]>();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const loadedRevision = useRef<number | undefined>(undefined);
  const reload = useCallback(async () => {
    const saved = await loadLocalStaffProfiles();
    setStaff(saved);
    setError('');
    return saved;
  }, []);
  useEffect(() => {
    if (loadedRevision.current === reconnect.revision) return;
    void reload().then(() => {
      loadedRevision.current = reconnect.revision;
    }).catch(() => setError('Saved staff is unavailable on this tablet.'));
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
  const remove = async (profile: SavedStaffProfile) => {
    setError('');
    setMessage('');
    try {
      const result = await deleteLocalStaff({
        deviceId: session.deviceId,
        actor: {
          staffProfileId: session.staffProfileId,
          name: session.name,
          role: session.role,
        },
      }, profile);
      await reload();
      setMessage('Staff member deleted.');
      void reconnect.run('automatic').catch(() => undefined);
      return result;
    } catch (caught) {
      setError(caught instanceof Error
        ? caught.message
        : 'Staff member could not be deleted.');
      throw caught;
    }
  };
  const changePin = async (profile: SavedStaffProfile, input: StaffPinInput) => {
    setError('');
    setMessage('');
    try {
      const credential = await createStaffPinCredential(validateStaffPin(input));
      let identityRevision = profile.identityRevision;
      if (!profile.pending) {
        const updated = await updateStaffPin({
          sessionToken: session.token,
          deviceId: session.deviceId,
          staffProfileId: profile.id as Id<'staffProfiles'>,
          ...credential,
        });
        identityRevision = updated.identityRevision;
      }
      try {
        await saveUpdatedStaffPin(
          profile.id,
          credential,
          identityRevision,
          profile.pending,
        );
        if (!profile.pending) {
          await saveStaffIdentityRevision(profile.id, identityRevision);
        }
      } catch (storageError) {
        if (!profile.pending) {
          await clearStaffSession(profile.id).catch(() => undefined);
        }
        throw storageError;
      }
      await reload();
      setMessage('PIN changed.');
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'PIN could not be changed.';
      setError(message);
      throw caught;
    }
  };
  return {
    staff: staff ?? [],
    isLoading: !staff && !error,
    error: error || undefined,
    message,
    currentStaffId: session.staffProfileId,
    create,
    changePin,
    remove,
  };
}
