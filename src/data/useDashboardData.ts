import { useConvex } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { localBusinessDate } from '../lib/date';
import { useStaffSession } from './sessionContext';

export type DashboardSnapshot =
  FunctionReturnType<typeof api.dashboard.getSnapshot>;

export function useDashboardData() {
  const session = useStaffSession();
  const convex = useConvex();
  const [businessDate] = useState(localBusinessDate);
  const [reload, setReload] = useState(0);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError('');
    void convex
      .query(api.dashboard.getSnapshot, {
        businessDate,
        sessionToken: session.token,
        deviceId: session.deviceId,
      })
      .then((result) => {
        if (!cancelled) setSnapshot(result);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Dashboard data is unavailable. Check the connection and retry.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [businessDate, convex, reload, session.deviceId, session.token]);

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
