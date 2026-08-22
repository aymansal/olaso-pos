import { useConvex } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { useStaffSession } from './sessionContext';

export type ReportsSnapshot =
  FunctionReturnType<typeof api.reports.getSummary>;

export function useReportsData(fromDate: string, toDate: string) {
  const session = useStaffSession();
  const convex = useConvex();
  const [reload, setReload] = useState(0);
  const [snapshot, setSnapshot] = useState<ReportsSnapshot>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError('');
    setSnapshot(undefined);
    void convex
      .query(api.reports.getSummary, {
        fromDate,
        toDate,
        sessionToken: session.token,
        deviceId: session.deviceId,
      })
      .then((result) => {
        if (!cancelled) setSnapshot(result);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Report data is unavailable. Check the period and retry.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [convex, fromDate, reload, session.deviceId, session.token, toDate]);

  const retry = useCallback(() => {
    setReload((value) => value + 1);
  }, []);

  return { snapshot, isLoading, error, retry };
}
