import { createContext, useContext, type ReactNode } from 'react';
import type { StaffSession } from './identitySession';

type ActiveSession = StaffSession & { deviceId: string };

const SessionContext = createContext<ActiveSession | undefined>(undefined);

export function StaffSessionProvider({
  session,
  children,
}: {
  session: ActiveSession;
  children: ReactNode;
}) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useStaffSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('Staff session is required while the terminal is unlocked.');
  return session;
}
