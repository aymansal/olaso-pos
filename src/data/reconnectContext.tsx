import { useConvex, useMutation } from 'convex/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { useConnectionStatus } from './connectionContext';
import {
  syncPendingSales,
  type SaleCancellationPayload,
  type SaleSyncPayload,
} from './localSales';
import {
  makeConnectivityFailuresAvailable,
  makePendingOutboxAvailable,
} from './outbox';
import { replaceOperationalCache } from './operationalCache';
import { useStaffSession } from './sessionContext';
import {
  loadTerminalSettings,
  recordSyncFailure,
} from './terminalSettings';

type ReconnectMode = 'automatic' | 'manual';

type ReconnectResult = {
  synced: number;
  failed: number;
  pending: number;
  refreshed: boolean;
};

type ReconnectState = {
  isSyncing: boolean;
  revision: number;
  run: (mode?: ReconnectMode) => Promise<ReconnectResult>;
};

const ReconnectContext = createContext<ReconnectState | undefined>(undefined);

function toConvexSaleArgs(input: SaleSyncPayload) {
  return {
    ...input,
    lines: input.lines.map(({ recipeVersionId, ...line }) => ({
      ...line,
      productId: line.productId as Id<'products'>,
      ...(recipeVersionId
        ? { recipeVersionId: recipeVersionId as Id<'recipeVersions'> }
        : {}),
      modifierOptionIds: line.modifierOptionIds.map(
        (id) => id as Id<'modifierOptions'>,
      ),
    })),
  };
}

export function ReconnectProvider({ children }: { children: ReactNode }) {
  const { available } = useConnectionStatus();
  const session = useStaffSession();
  const convex = useConvex();
  const acceptMutation = useMutation(api.sales.accept);
  const cancelMutation = useMutation(api.sales.cancel);
  const inFlight = useRef<Promise<ReconnectResult> | undefined>(undefined);
  const requestedMode = useRef<ReconnectMode | undefined>(undefined);
  const previousAvailable = useRef<boolean | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);
  const [revision, setRevision] = useState(0);

  const perform = useCallback(async (mode: ReconnectMode) => {
    if (available !== true) {
      const settings = await loadTerminalSettings();
      return {
        synced: 0,
        failed: 0,
        pending: settings.pendingSyncCount,
        refreshed: false,
      };
    }

    if (mode === 'manual') await makePendingOutboxAvailable();
    else await makeConnectivityFailuresAvailable();

    let synced = 0;
    let failed = 0;
    try {
      for (let batch = 0; batch < 10; batch += 1) {
        const result = await syncPendingSales(
          async (input) => {
            const accepted = await acceptMutation({
              ...toConvexSaleArgs(input),
              sessionToken: session.token,
            });
            return {
              saleId: String(accepted.saleId),
              acknowledgedAt: accepted.acknowledgedAt,
            };
          },
          async (input: SaleCancellationPayload) => {
            const cancelled = await cancelMutation({
              ...input,
              sessionToken: session.token,
            });
            return cancelled.kind === 'original-pending'
              ? cancelled
              : {
                  kind: 'cancelled' as const,
                  correctionId: String(cancelled.correctionId),
                  acknowledgedAt: cancelled.acknowledgedAt,
                };
          },
        );
        synced += result.synced;
        failed += result.failed;
        if (result.failed > 0 || result.processed < 10) break;
        await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      }

      const settings = await loadTerminalSettings();
      let refreshed = false;
      if (settings.pendingSyncCount === 0) {
        const cloud = await convex.query(api.sync.getOperationalSnapshot, {
          sessionToken: session.token,
          deviceId: session.deviceId,
          requestId: crypto.randomUUID(),
        });
        await replaceOperationalCache({
          ...cloud,
          products: cloud.products.map((product) => ({
            ...product,
            status: product.status === 'active' ? 'active' : 'unavailable',
          })),
        });
        refreshed = true;
      }
      setRevision((value) => value + 1);
      return {
        synced,
        failed,
        pending: settings.pendingSyncCount,
        refreshed,
      };
    } catch (caught) {
      const message = await recordSyncFailure(caught);
      setRevision((value) => value + 1);
      throw new Error(message);
    }
  }, [acceptMutation, available, cancelMutation, convex, session.deviceId, session.token]);

  const run = useCallback((mode: ReconnectMode = 'automatic') => {
    requestedMode.current = mode === 'manual' || requestedMode.current === 'manual'
      ? 'manual'
      : 'automatic';
    if (inFlight.current) return inFlight.current;
    setIsSyncing(true);
    const task = (async () => {
      let result: ReconnectResult | undefined;
      while (requestedMode.current) {
        const nextMode = requestedMode.current;
        requestedMode.current = undefined;
        result = await perform(nextMode);
      }
      return result!;
    })().finally(() => {
      if (inFlight.current === task) {
        inFlight.current = undefined;
        setIsSyncing(false);
      }
    });
    inFlight.current = task;
    return task;
  }, [perform]);

  useEffect(() => {
    const previous = previousAvailable.current;
    previousAvailable.current = available;
    if (available === true && previous !== true) {
      void run('automatic').catch(() => undefined);
    }
  }, [available, run]);

  return (
    <ReconnectContext.Provider value={{ isSyncing, revision, run }}>
      {children}
    </ReconnectContext.Provider>
  );
}

export function useReconnect() {
  const reconnect = useContext(ReconnectContext);
  if (!reconnect) throw new Error('Reconnect worker is unavailable.');
  return reconnect;
}
