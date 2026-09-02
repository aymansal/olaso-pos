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
  const rangeKey = useRef(`${fromDate}:${toDate}`);
  const hasSnapshot = useRef(false);

  useEffect(() => {
    if (available === undefined || !foreground) return;
    const nextRange = `${fromDate}:${toDate}`;
    if (rangeKey.current !== nextRange) {
      rangeKey.current = nextRange;
      hasSnapshot.current = false;
      setSnapshot(undefined);
    }
    const requestKey = `${session.staffProfileId}:${available}:${fromDate}:${toDate}:${reconnect.revision}:${reload}`;
    if (loadedKey.current === requestKey) return;
    let cancelled = false;
    if (!hasSnapshot.current) setIsLoading(true);
    setError('');
    const allTime = !fromDate && !toDate;
    const localRequest = loadOfflineReport(fromDate, toDate) as unknown as Promise<ReportsSnapshot>;
    const request = available
      ? Promise.all([
        convex.query(allTime ? api.reports.getAllSummary : api.reports.getSummary, {
          ...(allTime ? {} : { fromDate, toDate }),
          sessionToken: session.token,
          deviceId: session.deviceId,
        }),
        localRequest.catch(() => undefined),
      ]).then(([cloud, local]) => {
        const snapshot = local && local.current.orderCount > cloud.current.orderCount
          ? local
          : cloud;
        if (!local) return snapshot;
        const stockByName = new Map(
          local.current.ingredientTotals.map((item) => [
            `${item.ingredientName}\0${item.baseUnit}`,
            item.currentStockQuantity ?? 0,
          ]),
        );
        return {
          ...snapshot,
          ...(allTime ? { range: local.range } : {}),
          current: {
            ...snapshot.current,
            ingredientTotals: snapshot.current.ingredientTotals.map((item) => ({
              ...item,
              currentStockQuantity:
                stockByName.get(`${item.ingredientName}\0${item.baseUnit}`)
                ?? item.currentStockQuantity,
            })),
          },
        };
      })
      : localRequest;
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
