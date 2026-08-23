import { useConvex } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { localBusinessDate } from '../lib/date';
import { useConnectionStatus } from './connectionContext';
import { loadOfflineDashboard } from './offlineViews';
import { useReconnect } from './reconnectContext';
import { useStaffSession } from './sessionContext';

export type DashboardSnapshot =
  FunctionReturnType<typeof api.dashboard.getSnapshot>;

export function useDashboardData() {
  const { available } = useConnectionStatus();
  const session = useStaffSession();
  const reconnect = useReconnect();
  const convex = useConvex();
  const [businessDate] = useState(localBusinessDate);
  const [reload, setReload] = useState(0);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (available === undefined) return;
    let cancelled = false;
    setIsLoading(true);
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
        if (!cancelled) setSnapshot(result);
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
  }, [available, businessDate, convex, reconnect.revision, reload, session.deviceId, session.token]);

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
