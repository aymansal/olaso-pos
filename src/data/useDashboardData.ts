import { useConvex } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';

export type DashboardSnapshot =
  FunctionReturnType<typeof api.dashboard.getSnapshot>;

export function currentBusinessDate(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useDashboardData() {
  const convex = useConvex();
  const [businessDate] = useState(currentBusinessDate);
  const [reload, setReload] = useState(0);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError('');
    void convex
      .query(api.dashboard.getSnapshot, { businessDate })
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
  }, [businessDate, convex, reload]);

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
