import { useAction, useConvex, useMutation } from 'convex/react';
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
import {
  reconcileAuthenticatedStaffProfiles,
  replaceOperationalCache,
} from './operationalCache';
import {
  clearStaffSession,
  isPendingStaffSession,
  loadStaffSession,
} from './identitySession';
import { syncPendingCatalogOperations } from './catalogSync';
import {
  dispatchInventoryOperation,
  syncPendingInventoryOperations,
} from './inventorySync';
import {
  dispatchCostOperation,
  syncPendingCostOperations,
} from './costSync';
import {
  hasPendingManagementOperations,
  resolveCloudRecordId,
} from './localManagement';
import { hasPermission, isStaffRole } from './permissions';
import {
  OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
  STAFF_MANAGEMENT_OPERATION_TYPES,
} from './managementOperation';
import {
  replaceSavedCompensation,
  replaceSavedExpenses,
} from './localCostViews';
import {
  cleanupAcknowledgedStaffProvisioning,
} from './localStaff';
import {
  dispatchStaffOperation,
  syncPendingStaffOperations,
} from './staffSync';
import { useStaffSession } from './sessionContext';
import { operationSessionArgs } from './operationSession.ts';
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

async function toConvexSaleArgs({
  actorProfileId: _actorProfileId,
  actorName: _actorName,
  ...input
}: SaleSyncPayload) {
  return {
    ...input,
    lines: await Promise.all(input.lines.map(async ({ recipeVersionId, ...line }) => ({
      ...line,
      productId: await resolveCloudRecordId('product', line.productId) as Id<'products'>,
      ...(recipeVersionId
        ? {
            recipeVersionId: await resolveCloudRecordId(
              'recipe-version',
              recipeVersionId,
            ) as Id<'recipeVersions'>,
          }
        : {}),
      modifierOptionIds: await Promise.all(line.modifierOptionIds.map(
        async (id) => await resolveCloudRecordId(
          'modifier-option',
          id,
        ) as Id<'modifierOptions'>,
      )),
      valuationRevisions: await Promise.all(line.valuationRevisions.map(
        async (valuation) => ({
          ingredientId: await resolveCloudRecordId(
            'ingredient',
            valuation.ingredientId,
          ) as Id<'ingredients'>,
          revision: valuation.revision,
        }),
      )),
    }))),
  };
}

export function ReconnectProvider({
  children,
  onSessionUnavailable,
}: {
  children: ReactNode;
  onSessionUnavailable: () => Promise<void>;
}) {
  const { available, foreground } = useConnectionStatus();
  const session = useStaffSession();
  const sessionArgs = {
    sessionToken: session.token,
    deviceId: session.deviceId,
  };
  const convex = useConvex();
  const acceptMutation = useMutation(api.sales.accept);
  const cancelMutation = useMutation(api.sales.cancel);
  const saveCategoryMutation = useMutation(api.categories.save);
  const archiveCategoryMutation = useMutation(api.categories.setArchived);
  const deleteCategoryMutation = useMutation(api.categories.remove);
  const saveProductMutation = useMutation(api.products.save);
  const setProductStatusMutation = useMutation(api.products.setStatus);
  const deleteProductMutation = useMutation(api.products.remove);
  const saveModifierMutation = useMutation(api.modifiers.saveGroup);
  const archiveModifierMutation = useMutation(api.modifiers.setGroupArchived);
  const saveRecipeMutation = useMutation(api.recipes.saveVersion);
  const saveIngredientMutation = useMutation(api.inventory.saveIngredient);
  const archiveIngredientMutation = useMutation(api.inventory.setIngredientArchived);
  const deleteIngredientMutation = useMutation(api.inventory.removeIngredient);
  const receivePurchaseMutation = useMutation(api.inventory.receivePurchase);
  const recordAdjustmentMutation = useMutation(api.inventory.recordAdjustment);
  const addExpenseMutation = useMutation(api.expenses.add);
  const correctExpenseMutation = useMutation(api.expenses.correct);
  const addCompensationMutation = useMutation(api.staff.addCompensationPeriod);
  const deleteStaffMutation = useMutation(api.staff.remove);
  const checkSession = useAction(api.identity.checkSession);
  const createStaffAction = useAction(api.identity.createStaff);
  const inFlight = useRef<Promise<ReconnectResult> | undefined>(undefined);
  const requestedMode = useRef<ReconnectMode | undefined>(undefined);
  const previousAvailable = useRef<boolean | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);
  const [revision, setRevision] = useState(0);

  const perform = useCallback(async (mode: ReconnectMode) => {
    if (available !== true || !foreground || isPendingStaffSession(session)) {
      const settings = await loadTerminalSettings();
      return {
        synced: 0,
        failed: 0,
        pending: settings.pendingSyncCount,
        refreshed: false,
      };
    }

    let synced = 0;
    let failed = 0;
    try {
      const sessionFor = (
        actor: Parameters<typeof operationSessionArgs>[0],
      ) => operationSessionArgs(actor, session, {
        resolveProfileId: (profileId) => resolveCloudRecordId(
          'staff-profile',
          profileId,
        ),
        loadProfileSession: loadStaffSession,
      });
      const sessionStatus = await checkSession({
        token: session.token,
        deviceId: session.deviceId,
      });
      if (sessionStatus.kind === 'invalid') {
        throw new Error('Staff session is unavailable.');
      }

      if (mode === 'manual') await makePendingOutboxAvailable();
      else await makeConnectivityFailuresAvailable();

      for (let batch = 0; batch < 10; batch += 1) {
        const staffResult = await syncPendingStaffOperations(async (operation) =>
          dispatchStaffOperation(operation, {
            sessionArgs: await sessionFor({
              staffProfileId: operation.actor.staffProfileId,
              name: operation.actor.name,
              requiredPermission: operation.requiredPermission,
            }),
            createStaff: (args) => createStaffAction(args as any) as any,
            deleteStaff: (args) => deleteStaffMutation(args as any),
            resolve: resolveCloudRecordId,
          }));
        synced += staffResult.synced;
        failed += staffResult.failed;
        const catalog = await syncPendingCatalogOperations(async (operation) => {
          const payload = operation.payload as Record<string, any>;
          const acknowledgedAt = Date.now();
          const actorSessionArgs = await sessionFor({
            staffProfileId: operation.actor.staffProfileId,
            name: operation.actor.name,
            requiredPermission: operation.requiredPermission,
          });
          if (operation.operationType === 'management.category.save') {
            const result = await saveCategoryMutation({
              ...actorSessionArgs,
              ...(operation.expectedRevision === undefined
                ? { key: String(payload.key) }
                : {
                    id: await resolveCloudRecordId('category', operation.localRecordId) as Id<'categories'>,
                    expectedRevision: operation.expectedRevision,
                  }),
              name: String(payload.name), artworkKey: String(payload.artworkKey),
              sortOrder: Number(payload.sortOrder),
              clientMutationId: operation.operationId,
            });
            return { recordType: 'category', cloudRecordId: String(result.id), acknowledgedAt };
          }
          if (operation.operationType === 'management.category.archive') {
            const result = await archiveCategoryMutation({
              ...actorSessionArgs,
              id: await resolveCloudRecordId('category', operation.localRecordId) as Id<'categories'>,
              archived: Boolean(payload.archived),
              expectedRevision: operation.expectedRevision!,
              clientMutationId: operation.operationId,
            });
            return { recordType: 'category', cloudRecordId: String(result.id), acknowledgedAt };
          }
          if (operation.operationType === 'management.category.delete') {
            const result = await deleteCategoryMutation({
              ...actorSessionArgs,
              id: await resolveCloudRecordId('category', operation.localRecordId) as Id<'categories'>,
              expectedRevision: operation.expectedRevision!,
              clientMutationId: operation.operationId,
            });
            return { recordType: 'category', cloudRecordId: String(result.id), acknowledgedAt };
          }
          if (operation.operationType === 'management.product.save') {
            const result = await saveProductMutation({
              ...actorSessionArgs,
              ...(operation.expectedRevision === undefined
                ? { key: String(payload.key) }
                : {
                    id: await resolveCloudRecordId('product', operation.localRecordId) as Id<'products'>,
                    expectedRevision: operation.expectedRevision,
                  }),
              ...(payload.categoryId ? {
                categoryId: await resolveCloudRecordId(
                  'category', String(payload.categoryId),
                ) as Id<'categories'>,
              } : {}),
              name: String(payload.name), receiptName: String(payload.receiptName),
              basePriceCentimes: Number(payload.basePriceCentimes),
              status: payload.status, sortOrder: Number(payload.sortOrder),
              modifierGroupIds: await Promise.all((payload.modifierGroupIds as string[]).map(
                async (id) => await resolveCloudRecordId('modifier-group', id) as Id<'modifierGroups'>,
              )),
              clientMutationId: operation.operationId,
            });
            return { recordType: 'product', cloudRecordId: String(result.id), acknowledgedAt };
          }
          if (operation.operationType === 'management.product.status') {
            const result = await setProductStatusMutation({
              ...actorSessionArgs,
              id: await resolveCloudRecordId('product', operation.localRecordId) as Id<'products'>,
              status: payload.status, expectedRevision: operation.expectedRevision!,
              clientMutationId: operation.operationId,
            });
            return { recordType: 'product', cloudRecordId: String(result.id), acknowledgedAt };
          }
          if (operation.operationType === 'management.product.delete') {
            const result = await deleteProductMutation({
              ...actorSessionArgs,
              id: await resolveCloudRecordId('product', operation.localRecordId) as Id<'products'>,
              expectedRevision: operation.expectedRevision!,
              clientMutationId: operation.operationId,
            });
            return { recordType: 'product', cloudRecordId: String(result.id), acknowledgedAt };
          }
          if (operation.operationType === 'management.modifier.archive') {
            const result = await archiveModifierMutation({
              ...actorSessionArgs,
              id: await resolveCloudRecordId('modifier-group', operation.localRecordId) as Id<'modifierGroups'>,
              archived: Boolean(payload.archived), expectedRevision: operation.expectedRevision!,
              clientMutationId: operation.operationId,
            });
            return { recordType: 'modifier-group', cloudRecordId: String(result.id), acknowledgedAt };
          }
          if (operation.operationType === 'management.modifier.save') {
            const options = payload.options as Array<Record<string, any>>;
            const preparedOptions = await Promise.all(options.map(async (option) => {
              const mappedId = await resolveCloudRecordId(
                'modifier-option',
                String(option.id),
              );
              return {
                ...(mappedId !== String(option.id) || !String(option.id).includes(':')
                  ? { id: mappedId as Id<'modifierOptions'> }
                  : {}),
                key: String(option.key), name: String(option.name),
                priceDeltaCentimes: Number(option.priceDeltaCentimes), status: option.status,
                sortOrder: Number(option.sortOrder),
                ingredientEffects: await Promise.all((option.ingredientEffects as Array<Record<string, any>>).map(
                  async (effect) => ({
                    ingredientId: await resolveCloudRecordId('ingredient', String(effect.ingredientId)) as Id<'ingredients'>,
                    quantityDelta: Number(effect.quantityDelta),
                  }),
                )),
              };
            }));
            const result = await saveModifierMutation({
              ...actorSessionArgs,
              ...(operation.expectedRevision === undefined
                ? { key: String(payload.key) }
                : {
                    id: await resolveCloudRecordId('modifier-group', operation.localRecordId) as Id<'modifierGroups'>,
                    expectedRevision: operation.expectedRevision,
                  }),
              name: String(payload.name), required: Boolean(payload.required),
              minSelections: Number(payload.minSelections), maxSelections: Number(payload.maxSelections),
              sortOrder: Number(payload.sortOrder), clientMutationId: operation.operationId,
              options: preparedOptions,
            });
            const latest = await convex.query(api.modifiers.list, actorSessionArgs);
            const cloudOptions = latest.options.filter((option) => option.groupId === result.id);
            return {
              recordType: 'modifier-group', cloudRecordId: String(result.id), acknowledgedAt,
              relatedMappings: options.flatMap((option) => {
                const cloud = cloudOptions.find((candidate) => candidate.key === option.key);
                return cloud ? [{ recordType: 'modifier-option', localRecordId: String(option.id), cloudRecordId: String(cloud._id) }] : [];
              }),
            };
          }
          if (operation.operationType === 'management.recipe.save') {
            const result = await saveRecipeMutation({
              ...actorSessionArgs,
              productId: await resolveCloudRecordId('product', String(payload.productId)) as Id<'products'>,
              expectedProductRevision: operation.expectedRevision!,
              clientMutationId: operation.operationId,
              items: await Promise.all((payload.items as Array<Record<string, any>>).map(async (item) => ({
                ingredientId: await resolveCloudRecordId('ingredient', String(item.ingredientId)) as Id<'ingredients'>,
                quantity: Number(item.quantity),
              }))),
            });
            return { recordType: 'recipe-version', cloudRecordId: String(result.id), acknowledgedAt };
          }
          throw new Error('Catalog synchronization operation is unsupported.');
        });
        synced += catalog.synced;
        failed += catalog.failed;
        const inventory = await syncPendingInventoryOperations(async (operation) =>
          dispatchInventoryOperation(operation, {
            sessionArgs: await sessionFor({
              staffProfileId: operation.actor.staffProfileId,
              name: operation.actor.name,
              requiredPermission: operation.requiredPermission,
            }),
            resolve: resolveCloudRecordId,
            saveIngredient: (args) => saveIngredientMutation(args as any),
            archiveIngredient: (args) => archiveIngredientMutation(args as any),
            deleteIngredient: (args) => deleteIngredientMutation(args as any),
            receivePurchase: (args) => receivePurchaseMutation(args as any),
            recordAdjustment: (args) => recordAdjustmentMutation(args as any),
          }));
        synced += inventory.synced;
        failed += inventory.failed;
        if (staffResult.processed + catalog.processed + inventory.processed > 0) {
          await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
          continue;
        }
        const result = await syncPendingSales(
          async (input) => {
            const actorSessionArgs = await sessionFor({
              staffProfileId: input.actorProfileId,
              name: input.actorName,
              requiredPermission: 'pos',
            });
            const accepted = await acceptMutation({
              ...await toConvexSaleArgs(input),
              sessionToken: actorSessionArgs.sessionToken,
            });
            return {
              saleId: String(accepted.saleId),
              acknowledgedAt: accepted.acknowledgedAt,
            };
          },
          async (input: SaleCancellationPayload) => {
            const {
              actorProfileId,
              actorName,
              ...cancellation
            } = input;
            const actorSessionArgs = await sessionFor({
              staffProfileId: actorProfileId,
              name: actorName,
              requiredPermission: 'orders',
            });
            const cancelled = await cancelMutation({
              ...cancellation,
              sessionToken: actorSessionArgs.sessionToken,
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
        const costs = await syncPendingCostOperations(async (operation) =>
          dispatchCostOperation(operation, {
            sessionArgs: await sessionFor({
              staffProfileId: operation.actor.staffProfileId,
              name: operation.actor.name,
              requiredPermission: operation.requiredPermission,
            }),
            resolve: resolveCloudRecordId,
            addExpense: (args) => addExpenseMutation(args as any),
            correctExpense: (args) => correctExpenseMutation(args as any),
            addCompensation: (args) => addCompensationMutation(args as any),
          }));
        synced += costs.synced;
        failed += costs.failed;
        if (result.processed + costs.processed === 0) break;
        await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      }

      await cleanupAcknowledgedStaffProvisioning();
      const remoteProfiles = await convex.query(api.identity.listActiveProfiles, {
        deviceId: session.deviceId,
      });
      const activeProfiles = remoteProfiles.flatMap((profile) =>
        isStaffRole(profile.role)
          ? [{
              id: String(profile.id),
              name: profile.name,
              role: profile.role,
              revision: Number(profile.revision),
              identityRevision: Number(profile.identityRevision),
            }]
          : [],
      );
      const invalidatedProfileIds = await reconcileAuthenticatedStaffProfiles(
        activeProfiles,
        session.staffProfileId,
      );
      for (const profileId of invalidatedProfileIds) {
        await clearStaffSession(profileId);
      }

      const settings = await loadTerminalSettings();
      let refreshed = false;
      if (!await hasPendingManagementOperations(
        [...OPERATIONAL_MANAGEMENT_OPERATION_TYPES,
          ...STAFF_MANAGEMENT_OPERATION_TYPES],
      )) {
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
      if (hasPermission(session.role, 'expenses')) {
        const expenses = await convex.query(api.expenses.list, {
          ...sessionArgs,
          limit: 100,
        });
        await replaceSavedExpenses(expenses.map((expense) => ({
          ...expense,
          id: String(expense.id),
          ...(expense.correctionOfExpenseId
            ? { correctionOfExpenseId: String(expense.correctionOfExpenseId) }
            : {}),
        })));
      }
      if (hasPermission(session.role, 'compensation')) {
        const compensation = await convex.query(
          api.staff.listAllCompensation,
          sessionArgs,
        );
        await replaceSavedCompensation(compensation.map((period) => ({
          ...period,
          id: String(period.id),
          staffProfileId: String(period.staffProfileId),
        })));
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
      if (message.startsWith('Synchronization access is unavailable.')) {
        await onSessionUnavailable();
      }
      throw new Error(message);
    }
  }, [acceptMutation, addCompensationMutation, addExpenseMutation,
    archiveCategoryMutation, archiveIngredientMutation, archiveModifierMutation,
    available, cancelMutation, checkSession, convex, correctExpenseMutation,
    createStaffAction, deleteCategoryMutation, deleteIngredientMutation,
    deleteProductMutation, deleteStaffMutation, foreground,
    onSessionUnavailable, receivePurchaseMutation, recordAdjustmentMutation,
    saveCategoryMutation, saveIngredientMutation, saveModifierMutation,
    saveProductMutation, saveRecipeMutation, session.deviceId, session.name,
    session.provisioningState, session.role, session.staffProfileId,
    session.token, setProductStatusMutation]);

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
    const ready = available === true && foreground;
    const previous = previousAvailable.current;
    previousAvailable.current = ready;
    if (!(ready && previous !== true)) return;

    let cancelled = false;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    let secondFrame = 0;
    const start = () => {
      if (!cancelled) void run('automatic').catch(() => undefined);
    };
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === 'function') {
          idleHandle = window.requestIdleCallback(start, { timeout: 750 });
        } else {
          timeoutHandle = window.setTimeout(start, 0);
        }
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      if (idleHandle !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    };
  }, [available, foreground, run]);

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
