import { useConvex } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { useConnectionStatus } from './connectionContext';
import { loadOfflineReport } from './offlineViews';
import { useReconnect } from './reconnectContext';
import { useStaffSession } from './sessionContext';

export type ReportsSnapshot =
  FunctionReturnType<typeof api.reports.getSummary>;

export function useReportsData(fromDate: string, toDate: string) {
  const { available, foreground } = useConnectionStatus();
  const session = useStaffSession();
  const reconnect = useReconnect();
  const convex = useConvex();
  const [reload, setReload] = useState(0);
  const [snapshot, setSnapshot] = useState<ReportsSnapshot>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const loadedKey = useRef<string | undefined>(undefined);
  const hasSnapshot = useRef(false);

  useEffect(() => {
    if (available === undefined || !foreground) return;
    const requestKey = `${session.staffProfileId}:${available}:${fromDate}:${toDate}:${reconnect.revision}:${reload}`;
    if (loadedKey.current === requestKey) return;
    let cancelled = false;
    if (!hasSnapshot.current) setIsLoading(true);
    setError('');
    const request = available
      ? convex.query(api.reports.getSummary, {
          fromDate,
          toDate,
          sessionToken: session.token,
          deviceId: session.deviceId,
        })
      : loadOfflineReport(fromDate, toDate) as unknown as Promise<ReportsSnapshot>;
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
          setError('Saved report data is unavailable on this tablet.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [available, convex, foreground, fromDate, reconnect.revision, reload, session.deviceId, session.token, toDate]);

  const retry = useCallback(() => {
    setReload((value) => value + 1);
  }, []);

  return { snapshot, isLoading, error, retry };
}
