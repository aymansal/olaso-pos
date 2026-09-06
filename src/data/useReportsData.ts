import { useConvex } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { localBusinessDate } from '../lib/date';
import { collectCloudAllReportPages } from './cloudAllReport';
import { useConnectionStatus } from './connectionContext';
import { loadOfflineReport } from './offlineViews';
import { useReconnect } from './reconnectContext';
import { useStaffSession } from './sessionContext';
import { pendingReportSaleIds } from './pendingReportCorrections';

export type ReportsSnapshot =
  FunctionReturnType<typeof api.reports.getSummary>;

function hasSameSales(local: ReportsSnapshot, cloud: ReportsSnapshot) {
  return local.current.orderCount === cloud.current.orderCount
    && local.current.itemCount === cloud.current.itemCount
    && local.current.netCentimes === cloud.current.netCentimes;
}

function selectReportSnapshot(cloud: ReportsSnapshot, local?: ReportsSnapshot) {
  if (!local || local.current.orderCount > cloud.current.orderCount) return local ?? cloud;
  // Older cloud daily metrics predate profile IDs; the matching local receipts
  // retain their immutable sale actor, so only that more detailed breakdown wins.
  if (!hasSameSales(local, cloud)) return cloud;
  return {
    ...cloud,
    current: {
      ...cloud.current,
      profileTotals: local.current.profileTotals,
    },
  };
}

export function useReportsData(fromDate: string, toDate: string) {
  const { available, foreground } = useConnectionStatus();
  const session = useStaffSession();
  const reconnect = useReconnect();
  const convex = useConvex();
  const [reload, setReload] = useState(0);
  const [snapshot, setSnapshot] = useState<ReportsSnapshot>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const loadedKey = useRef<string | undefined>(undefined);
  const rangeKey = useRef(`${fromDate}:${toDate}`);
  const hasSnapshot = useRef(false);

  useEffect(() => {
    if (available === undefined || !foreground) return;
    const nextRange = `${fromDate}:${toDate}`;
    const rangeChanged = rangeKey.current !== nextRange;
    if (rangeChanged) rangeKey.current = nextRange;
    const requestKey = `${session.staffProfileId}:${available}:${fromDate}:${toDate}:${reconnect.revision}:${reload}`;
    if (loadedKey.current === requestKey) return;
    let cancelled = false;
    if (hasSnapshot.current) {
      if (rangeChanged) setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');
    const allTime = !fromDate && !toDate;
    const localRequest = loadOfflineReport(fromDate, toDate) as unknown as Promise<ReportsSnapshot>;
    const request = available
      ? Promise.all([
        pendingReportSaleIds().then((pendingCancelledSaleIds) => allTime
          ? collectCloudAllReportPages(
            (paginationOpts) => convex.query(api.reports.getAllSummaryPage, {
              sessionToken: session.token,
              deviceId: session.deviceId,
              paginationOpts,
              pendingCancelledSaleIds,
            }),
            () => convex.query(api.reports.getAllSummaryStock, {
              sessionToken: session.token,
              deviceId: session.deviceId,
            }),
            localBusinessDate(),
            () => cancelled,
          )
          : convex.query(api.reports.getSummary, {
            fromDate,
            toDate,
            pendingCancelledSaleIds,
            sessionToken: session.token,
            deviceId: session.deviceId,
          })),
        localRequest.catch(() => undefined),
      ]).then(([cloud, local]) => {
        const snapshot = selectReportSnapshot(cloud, local);
        if (!local) return snapshot;
        const stockByName = new Map(
          local.current.ingredientTotals.map((item) => [
            `${item.ingredientName}\0${item.baseUnit}`,
            item.currentStockQuantity ?? 0,
          ]),
        );
        return {
          ...snapshot,
          ...(allTime ? { range: {
            ...snapshot.range,
            from: local.range.from < cloud.range.from ? local.range.from : cloud.range.from,
          } } : {}),
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
          setIsRefreshing(false);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSnapshot(undefined);
          hasSnapshot.current = false;
          loadedKey.current = requestKey;
          setIsRefreshing(false);
          setIsLoading(false);
          setError('Saved report data is unavailable on this tablet.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [available, convex, foreground, fromDate, reconnect.revision, reload, session.deviceId, session.token, toDate]);

  const retry = useCallback(() => {
    setReload((value) => value + 1);
  }, []);

  return { snapshot, isLoading, isRefreshing, error, retry };
}
