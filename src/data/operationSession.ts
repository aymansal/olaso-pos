import { hasPermission, type Permission, type StaffRole } from './permissions.ts';

type ActorEvidence = {
  staffProfileId?: string;
  name: string;
  requiredPermission: Permission;
};

type StoredSession = {
  token: string;
  staffProfileId: string;
  name: string;
  role: StaffRole;
  provisioningState?: 'pending';
};

type ActiveSession = StoredSession & { deviceId: string };

export async function operationSessionArgs(
  actor: ActorEvidence,
  active: ActiveSession,
  services: {
    resolveProfileId: (localProfileId: string) => Promise<string>;
    loadProfileSession: (profileId: string) => Promise<StoredSession | undefined>;
  },
) {
  let savedSession: StoredSession | undefined;
  if (actor.staffProfileId) {
    const profileId = await services.resolveProfileId(actor.staffProfileId);
    savedSession = profileId === active.staffProfileId
      ? active
      : await services.loadProfileSession(profileId);
    if (savedSession?.staffProfileId !== profileId) savedSession = undefined;
  } else if (actor.name.trim() === active.name) {
    savedSession = active;
  }

  if (savedSession && savedSession.provisioningState !== 'pending') {
    if (!hasPermission(savedSession.role, actor.requiredPermission)) {
      throw new Error('The original staff profile can no longer make this change.');
    }
    return {
      sessionToken: savedSession.token,
      deviceId: active.deviceId,
    };
  }

  // Original protected session missing (legacy sales, deleted staff, another
  // unlock). Let the currently signed-in profile authorize sync when it still
  // has the required permission. Sale cashier names stay on the local receipt
  // and are sent explicitly to Convex — the active session only unlocks the
  // transport.
  if (
    active.provisioningState !== 'pending'
    && hasPermission(active.role, actor.requiredPermission)
  ) {
    return {
      sessionToken: active.token,
      deviceId: active.deviceId,
    };
  }

  throw new Error('The original staff session is unavailable for synchronization.');
}
