import { useConvex } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { localBusinessDate } from '../lib/date';
import { useConnectionStatus } from './connectionContext';
import { loadOfflineDashboard } from './offlineViews';
import { useReconnect } from './reconnectContext';
import { useStaffSession } from './sessionContext';

export type DashboardSnapshot =
  FunctionReturnType<typeof api.dashboard.getSnapshot>;

export function useDashboardData() {
  const { available, foreground } = useConnectionStatus();
  const session = useStaffSession();
  const reconnect = useReconnect();
  const convex = useConvex();
  const businessDate = localBusinessDate();
  const [reload, setReload] = useState(0);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const loadedKey = useRef<string | undefined>(undefined);
  const hasSnapshot = useRef(false);

  useEffect(() => {
    if (available === undefined || !foreground) return;
    const requestKey = `${session.staffProfileId}:${available}:${businessDate}:${reconnect.revision}:${reload}`;
    if (loadedKey.current === requestKey) return;
    let cancelled = false;
    if (!hasSnapshot.current) setIsLoading(true);
    setError('');
    const request = available
      ? convex.query(api.dashboard.getSnapshot, {
          businessDate,
          sessionToken: session.token,
          deviceId: session.deviceId,
        })
      : loadOfflineDashboard(businessDate) as Promise<DashboardSnapshot>;
    void request
      .then((result) => {
        if (!cancelled) {
          setSnapshot(result);
          hasSnapshot.current = true;
          loadedKey.current = requestKey;
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Saved dashboard data is unavailable on this tablet.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [available, businessDate, convex, foreground, reconnect.revision, reload, session.deviceId, session.token]);

  const refresh = useCallback(() => {
    setReload((value) => value + 1);
  }, []);

  return {
    businessDate,
    snapshot,
    isLoading,
    error,
    refresh,
  };
}
