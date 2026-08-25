import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addLocalCompensationPeriod,
  addLocalExpense,
  correctLocalExpense,
  type ExpenseInput,
  type SavedCostManagement,
  type SavedExpense,
} from './localCosts.ts';
import { loadLocalCostManagement } from './localCostViews.ts';
import { useReconnect } from './reconnectContext.tsx';
import { useStaffSession } from './sessionContext.tsx';

export function useCostManagement(month: string) {
  const session = useStaffSession();
  const reconnect = useReconnect();
  const [saved, setSaved] = useState<SavedCostManagement>();
  const [error, setError] = useState('');
  const loadedKey = useRef<string | undefined>(undefined);
  const context = {
    deviceId: session.deviceId,
    actor: {
      staffProfileId: session.staffProfileId,
      name: session.name,
      role: session.role,
    },
  };
  const reload = useCallback(async () => {
    const result = await loadLocalCostManagement(month, session.role);
    setSaved(result);
    setError('');
    return result;
  }, [month, session.role]);
  useEffect(() => {
    const currentKey = `${session.role}:${month}:${reconnect.revision}`;
    if (loadedKey.current === currentKey) return;
    void reload().then(() => {
      loadedKey.current = currentKey;
    }).catch(() => setError('Saved costs are unavailable on this tablet.'));
  }, [reconnect.revision, reload]);
  const save = async <T,>(operation: Promise<T>) => {
    const result = await operation;
    await reload();
    void reconnect.run('automatic').catch(() => undefined);
    return result;
  };
  return {
    saved,
    isLoading: !saved && !error,
    error: error || undefined,
    reload,
    addExpense: (input: ExpenseInput) => save(addLocalExpense(context, input)),
    correctExpense: (expense: SavedExpense, input: ExpenseInput) =>
      save(correctLocalExpense(context, expense, input)),
    addCompensation: (input: {
      staffProfileId: string;
      monthlyAmountCentimes: number;
      effectiveStartMonth: string;
      effectiveEndMonth?: string;
    }) => save(addLocalCompensationPeriod(context, input)),
  };
}
