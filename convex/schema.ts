import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const activeStatus = v.union(v.literal('active'), v.literal('archived'));
const productStatus = v.union(
  v.literal('active'),
  v.literal('unavailable'),
  v.literal('archived'),
);
const recipeStatus = v.union(
  v.literal('draft'),
  v.literal('active'),
  v.literal('superseded'),
);
const baseUnit = v.union(
  v.literal('millilitre'),
  v.literal('gram'),
  v.literal('milligram'),
  v.literal('piece'),
);
const serviceMode = v.union(
  v.literal('dine-in'),
  v.literal('take-away'),
  v.literal('online'),
);
const saleStatus = v.union(
  v.literal('completed'),
  v.literal('cancelled'),
  v.literal('refunded'),
);
const stockMovementType = v.union(
  v.literal('sale'),
  v.literal('stock-addition'),
  v.literal('purchase'),
  v.literal('purchase-reversal'),
  v.literal('manual-adjustment'),
  v.literal('cancellation'),
  v.literal('refund'),
  v.literal('seed'),
);
const costStatus = v.union(v.literal('complete'), v.literal('incomplete'));
const staffRole = v.union(
  v.literal('owner'),
  v.literal('manager'),
  v.literal('cashier'),
);
const expenseRecurrence = v.union(v.literal('one-time'), v.literal('monthly'));
const expenseTransactionType = v.union(v.literal('recorded'), v.literal('reversal'));
const purchaseTransactionType = v.union(
  v.literal('received'),
  v.literal('reversal'),
);
const modifierSnapshot = v.object({
  groupName: v.string(),
  optionName: v.string(),
  priceDeltaCentimes: v.number(),
});
const receiptLine = v.object({
  productName: v.string(),
  quantity: v.number(),
  unitPriceCentimes: v.number(),
  lineTotalCentimes: v.number(),
  modifiers: v.array(modifierSnapshot),
});

export default defineSchema({
  categories: defineTable({
    key: v.string(),
    name: v.string(),
    sortOrder: v.number(),
    status: activeStatus,
    revision: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
    lastMutationId: v.optional(v.string()),
  })
    .index('by_key', ['key'])
    .index('by_status_sort_order', ['status', 'sortOrder'])
    .index('by_updated_at', ['updatedAt']),

  products: defineTable({
    key: v.string(),
    categoryId: v.id('categories'),
    name: v.string(),
    receiptName: v.string(),
    basePriceCentimes: v.number(),
    status: productStatus,
    imageAssetKey: v.optional(v.string()),
    sortOrder: v.number(),
    modifierGroupIds: v.array(v.id('modifierGroups')),
    currentRecipeVersionId: v.optional(v.id('recipeVersions')),
    revision: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
    lastMutationId: v.optional(v.string()),
  })
    .index('by_key', ['key'])
    .index('by_updated_at', ['updatedAt']),

  modifierGroups: defineTable({
    key: v.string(),
    name: v.string(),
    required: v.boolean(),
    minSelections: v.number(),
    maxSelections: v.number(),
    status: activeStatus,
    sortOrder: v.number(),
    revision: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
    lastMutationId: v.optional(v.string()),
  })
    .index('by_key', ['key'])
    .index('by_status_sort_order', ['status', 'sortOrder'])
    .index('by_updated_at', ['updatedAt']),

  modifierOptions: defineTable({
    groupId: v.id('modifierGroups'),
    key: v.string(),
    name: v.string(),
    priceDeltaCentimes: v.number(),
    ingredientEffects: v.array(
      v.object({
        ingredientId: v.id('ingredients'),
        quantityDelta: v.number(),
      }),
    ),
    status: activeStatus,
    sortOrder: v.number(),
    revision: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index('by_group_key', ['groupId', 'key'])
    .index('by_group_status_sort_order', ['groupId', 'status', 'sortOrder'])
    .index('by_updated_at', ['updatedAt']),

  ingredients: defineTable({
    key: v.string(),
    name: v.string(),
    baseUnit,
    currentStockQuantity: v.number(),
    inventoryValueCentimes: v.optional(v.number()),
    costStatus: v.optional(costStatus),
    valuationRevision: v.optional(v.number()),
    lowStockThreshold: v.number(),
    status: activeStatus,
    revision: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
    lastMutationId: v.optional(v.string()),
  })
    .index('by_key', ['key'])
    .index('by_status_name', ['status', 'name'])
    .index('by_updated_at', ['updatedAt']),

  recipeVersions: defineTable({
    productId: v.id('products'),
    sizeKey: v.optional(v.string()),
    versionNumber: v.number(),
    status: recipeStatus,
    activationAt: v.optional(v.number()),
    firstUsedAt: v.optional(v.number()),
    clientMutationId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index('by_product_version', ['productId', 'versionNumber'])
    .index('by_product_client_mutation', [
      'productId',
      'clientMutationId',
    ]),

  recipeItems: defineTable({
    recipeVersionId: v.id('recipeVersions'),
    ingredientId: v.id('ingredients'),
    quantity: v.number(),
    createdAt: v.number(),
  })
    .index('by_recipe_version', ['recipeVersionId'])
    .index('by_ingredient_created_at', ['ingredientId', 'createdAt']),

  sales: defineTable({
    deviceId: v.string(),
    localSaleId: v.string(),
    receiptNumber: v.string(),
    cashierName: v.optional(v.string()),
    serviceMode,
    customerName: v.optional(v.string()),
    tableLabel: v.optional(v.string()),
    subtotalCentimes: v.number(),
    discountCentimes: v.number(),
    taxCentimes: v.number(),
    totalCentimes: v.number(),
    ingredientCostCentimes: v.optional(v.number()),
    costStatus: v.optional(costStatus),
    taxPolicyLabel: v.string(),
    paymentMethod: v.string(),
    receiptLanguage: v.optional(v.union(v.literal('en'), v.literal('fr'))),
    status: saleStatus,
    businessDate: v.string(),
    completedAt: v.number(),
    acknowledgedAt: v.number(),
    correctionOfSaleId: v.optional(v.id('sales')),
    receiptSnapshot: v.object({
      receiptNumber: v.string(),
      completedAt: v.number(),
      serviceMode,
      customerName: v.optional(v.string()),
      tableLabel: v.optional(v.string()),
      lines: v.array(receiptLine),
      subtotalCentimes: v.number(),
      discountCentimes: v.number(),
      taxCentimes: v.number(),
      totalCentimes: v.number(),
      taxPolicyLabel: v.string(),
      paymentMethod: v.string(),
      receiptLanguage: v.optional(v.union(v.literal('en'), v.literal('fr'))),
    }),
  })
    .index('by_device_local_sale', ['deviceId', 'localSaleId'])
    .index('by_completed_at', ['completedAt']),

  saleItems: defineTable({
    saleId: v.id('sales'),
    productId: v.optional(v.id('products')),
    productName: v.string(),
    receiptName: v.string(),
    unitPriceCentimes: v.number(),
    quantity: v.number(),
    modifiers: v.array(modifierSnapshot),
    recipeVersionId: v.optional(v.id('recipeVersions')),
    lineTotalCentimes: v.number(),
    ingredientCostCentimes: v.optional(v.number()),
    costStatus: v.optional(costStatus),
  }).index('by_sale', ['saleId']),

  stockMovements: defineTable({
    ingredientId: v.id('ingredients'),
    quantityDelta: v.number(),
    movementType: stockMovementType,
    relatedSaleId: v.optional(v.id('sales')),
    reason: v.string(),
    deviceId: v.optional(v.string()),
    actorLabel: v.optional(v.string()),
    businessDate: v.string(),
    createdAt: v.number(),
    clientMutationId: v.optional(v.string()),
    costDeltaCentimes: v.optional(v.number()),
    inventoryValueAfterCentimes: v.optional(v.number()),
    valuationRevision: v.optional(v.number()),
  })
    .index('by_ingredient_created_at', ['ingredientId', 'createdAt'])
    .index('by_ingredient_client_mutation', [
      'ingredientId',
      'clientMutationId',
    ])
    .index('by_related_sale', ['relatedSaleId'])
    .index('by_business_date_created_at', ['businessDate', 'createdAt']),

  inventoryPurchases: defineTable({
    ingredientId: v.id('ingredients'),
    stockMovementId: v.id('stockMovements'),
    packageLabel: v.string(),
    packageCount: v.number(),
    quantityPerPackage: v.number(),
    totalQuantity: v.number(),
    packagePriceCentimes: v.number(),
    totalCostCentimes: v.number(),
    receivedAt: v.number(),
    businessDate: v.string(),
    actorLabel: v.string(),
    supplierLabel: v.optional(v.string()),
    note: v.optional(v.string()),
    correctionOfPurchaseId: v.optional(v.id('inventoryPurchases')),
    transactionType: purchaseTransactionType,
    revision: v.number(),
    clientMutationId: v.string(),
  })
    .index('by_ingredient_received_at', ['ingredientId', 'receivedAt'])
    .index('by_business_date_received_at', ['businessDate', 'receivedAt'])
    .index('by_correction_of_received_at', [
      'correctionOfPurchaseId',
      'receivedAt',
    ])
    .index('by_client_mutation', ['clientMutationId']),

  staffProfiles: defineTable({
    name: v.string(),
    role: staffRole,
    status: activeStatus,
    revision: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
    lastMutationId: v.optional(v.string()),
  })
    .index('by_status_name', ['status', 'name'])
    .index('by_updated_at', ['updatedAt'])
    .index('by_client_mutation', ['lastMutationId']),

  staffIdentities: defineTable({
    staffProfileId: v.id('staffProfiles'),
    pinSalt: v.string(),
    pinHash: v.string(),
    credentialVersion: v.number(),
    updatedAt: v.number(),
  })
    .index('by_staff_profile', ['staffProfileId']),

  staffSessions: defineTable({
    tokenHash: v.string(),
    staffProfileId: v.id('staffProfiles'),
    deviceId: v.string(),
    credentialVersion: v.number(),
    createdAt: v.number(),
    lastSeenAt: v.number(),
    revokedAt: v.optional(v.number()),
  })
    .index('by_token_hash', ['tokenHash'])
    .index('by_staff_profile', ['staffProfileId']),

  staffPinAttempts: defineTable({
    staffProfileId: v.id('staffProfiles'),
    deviceId: v.string(),
    failedCount: v.number(),
    lockedUntil: v.optional(v.number()),
    updatedAt: v.number(),
  }).index('by_staff_device', ['staffProfileId', 'deviceId']),

  compensationPeriods: defineTable({
    staffProfileId: v.id('staffProfiles'),
    monthlyAmountCentimes: v.number(),
    effectiveStartMonth: v.string(),
    effectiveEndMonth: v.optional(v.string()),
    revision: v.number(),
    createdAt: v.number(),
    updatedBy: v.optional(v.string()),
    clientMutationId: v.string(),
  })
    .index('by_staff_start_month', ['staffProfileId', 'effectiveStartMonth'])
    .index('by_client_mutation', ['clientMutationId']),

  operatingExpenses: defineTable({
    category: v.string(),
    description: v.string(),
    amountCentimes: v.number(),
    recurrence: expenseRecurrence,
    effectiveDate: v.optional(v.string()),
    effectiveStartMonth: v.optional(v.string()),
    effectiveEndMonth: v.optional(v.string()),
    status: activeStatus,
    transactionType: expenseTransactionType,
    correctionOfExpenseId: v.optional(v.id('operatingExpenses')),
    revision: v.number(),
    createdAt: v.number(),
    updatedBy: v.optional(v.string()),
    clientMutationId: v.string(),
  })
    .index('by_effective_date_status', ['effectiveDate', 'status'])
    .index('by_start_month_status', ['effectiveStartMonth', 'status'])
    .index('by_status_created_at', ['status', 'createdAt'])
    .index('by_correction_of_created_at', ['correctionOfExpenseId', 'createdAt'])
    .index('by_client_mutation', ['clientMutationId']),

  dailyMetrics: defineTable({
    businessDate: v.string(),
    grossCentimes: v.number(),
    netCentimes: v.number(),
    orderCount: v.number(),
    cancelledCentimes: v.number(),
    refundedCentimes: v.number(),
    totalsByPaymentMethod: v.array(
      v.object({
        paymentMethod: v.string(),
        totalCentimes: v.number(),
        orderCount: v.number(),
      }),
    ),
    totalsByServiceMode: v.array(
      v.object({
        serviceMode,
        totalCentimes: v.number(),
        orderCount: v.number(),
      }),
    ),
    productTotals: v.array(
      v.object({
        productId: v.id('products'),
        productName: v.string(),
        categoryName: v.optional(v.string()),
        quantity: v.number(),
        totalCentimes: v.number(),
      }),
    ),
    categoryTotals: v.array(
      v.object({
        categoryId: v.id('categories'),
        categoryName: v.string(),
        quantity: v.number(),
        totalCentimes: v.number(),
      }),
    ),
    ingredientTotals: v.optional(
      v.array(
        v.object({
          ingredientId: v.id('ingredients'),
          ingredientName: v.string(),
          baseUnit,
          quantity: v.number(),
        }),
      ),
    ),
    ingredientUsageEventCount: v.optional(v.number()),
    ingredientCostCentimes: v.optional(v.number()),
    completeCostSaleCount: v.optional(v.number()),
    incompleteCostSaleCount: v.optional(v.number()),
    updatedAt: v.number(),
  }).index('by_business_date', ['businessDate']),
});
