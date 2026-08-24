import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';
import type { Id, TableNames } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';

declare const process: { env: Record<string, string | undefined> };

const ENABLE_FLAG = 'OLASO_ENABLE_DEV_SEED';
const CONFIRMATION = 'RESET_OLASO_DEV';
const DEVICE_ID = 'olaso-tab-a9-dev';
const RESET_LIMIT = 250;
const SEED_AT = Date.parse('2026-07-28T08:00:00.000Z');
const TAX_POLICY_LABEL = 'Temporary 0% — pending owner confirmation';

const resetOrder = [
  'inventoryPurchases',
  'saleCorrections',
  'saleItems',
  'stockMovements',
  'dailyMetrics',
  'sales',
  'compensationPeriods',
  'operatingExpenses',
  'staffProfiles',
  'recipeItems',
  'recipeVersions',
  'products',
  'modifierOptions',
  'modifierGroups',
  'ingredients',
  'categories',
] as const satisfies readonly TableNames[];

type SeedTable = (typeof resetOrder)[number];
type ServiceMode = 'dine-in' | 'take-away' | 'online';
type SaleStatus = 'completed' | 'cancelled' | 'refunded';
type IngredientBaseUnit =
  | 'millilitre'
  | 'gram'
  | 'milligram'
  | 'piece';

type IngredientSeed = {
  key: string;
  name: string;
  baseUnit: IngredientBaseUnit;
  openingQuantity: number;
  inventoryValueCentimes?: number;
  lowStockThreshold: number;
};

type IngredientEffectSeed = {
  ingredientKey: string;
  quantityDelta: number;
};

type ProductSeed = {
  key: string;
  categoryKey: string;
  name: string;
  receiptName: string;
  basePriceCentimes: number;
  status: 'active' | 'unavailable' | 'archived';
  imageAssetKey?: string;
  modifierGroupKeys: readonly string[];
  recipe: readonly {
    ingredientKey: string;
    quantity: number;
  }[];
};

type ModifierChoiceSeed = {
  groupKey: string;
  optionKey: string;
};

type SaleLineSeed = {
  productKey: string;
  quantity: number;
  modifiers?: readonly ModifierChoiceSeed[];
};

type SaleSeed = {
  localSaleId: string;
  receiptNumber: string;
  businessDate: string;
  completedAt: number;
  cashierName: string;
  serviceMode: ServiceMode;
  paymentMethod: string;
  status: SaleStatus;
  customerName?: string;
  tableLabel?: string;
  lines: readonly SaleLineSeed[];
};

const staffSeeds = [
  { key: 'owner', name: 'Olaso Owner', role: 'owner' as const },
  { key: 'barista', name: 'Samira Barista', role: 'cashier' as const },
] as const;

type DailyAccumulator = {
  grossCentimes: number;
  netCentimes: number;
  orderCount: number;
  cancelledCentimes: number;
  refundedCentimes: number;
  paymentMethods: Map<
    string,
    { paymentMethod: string; totalCentimes: number; orderCount: number }
  >;
  serviceModes: Map<
    ServiceMode,
    { serviceMode: ServiceMode; totalCentimes: number; orderCount: number }
  >;
  products: Map<
    string,
    {
      productId: Id<'products'>;
      productName: string;
      categoryName?: string;
      quantity: number;
      totalCentimes: number;
    }
  >;
  categories: Map<
    string,
    {
      categoryId: Id<'categories'>;
      categoryName: string;
      quantity: number;
      totalCentimes: number;
    }
  >;
  ingredients: Map<
    string,
    {
      ingredientId: Id<'ingredients'>;
      ingredientName: string;
      baseUnit: IngredientBaseUnit;
      quantity: number;
    }
  >;
  ingredientUsageEventCount: number;
};

const categorySeeds = [
  { key: 'coffee', name: 'Coffee', artworkKey: 'coffee', sortOrder: 10 },
  { key: 'matcha-tea', name: 'Matcha & Tea', artworkKey: 'tea', sortOrder: 20 },
  { key: 'cold-sweet', name: 'Cold & Sweet', artworkKey: 'cold-drinks', sortOrder: 30 },
  {
    key: 'bakery-savoury',
    name: 'Bakery & Savoury',
    artworkKey: 'bakery',
    sortOrder: 40,
  },
] as const;

const ingredientSeeds: readonly IngredientSeed[] = [
  {
    key: 'coffee-beans',
    name: 'Coffee beans',
    baseUnit: 'gram',
    openingQuantity: 9000,
    inventoryValueCentimes: 27000,
    lowStockThreshold: 1000,
  },
  {
    key: 'whole-milk',
    name: 'Whole milk',
    baseUnit: 'millilitre',
    openingQuantity: 30000,
    inventoryValueCentimes: 60000,
    lowStockThreshold: 5000,
  },
  {
    key: 'oat-milk',
    name: 'Oat milk',
    baseUnit: 'millilitre',
    openingQuantity: 9000,
    inventoryValueCentimes: 27000,
    lowStockThreshold: 1500,
  },
  {
    key: 'matcha-powder',
    name: 'Ceremonial matcha',
    baseUnit: 'gram',
    openingQuantity: 1200,
    inventoryValueCentimes: 96000,
    lowStockThreshold: 200,
  },
  {
    key: 'hojicha-powder',
    name: 'Hojicha powder',
    baseUnit: 'gram',
    openingQuantity: 900,
    inventoryValueCentimes: 27000,
    lowStockThreshold: 150,
  },
  {
    key: 'cocoa-powder',
    name: 'Cocoa powder',
    baseUnit: 'gram',
    openingQuantity: 1000,
    inventoryValueCentimes: 18000,
    lowStockThreshold: 150,
  },
  {
    key: 'vanilla-syrup',
    name: 'Vanilla syrup',
    baseUnit: 'millilitre',
    openingQuantity: 5000,
    inventoryValueCentimes: 15000,
    lowStockThreshold: 800,
  },
  {
    key: 'caramel-syrup',
    name: 'Caramel syrup',
    baseUnit: 'millilitre',
    openingQuantity: 5000,
    inventoryValueCentimes: 15000,
    lowStockThreshold: 800,
  },
  {
    key: 'lemon-juice',
    name: 'Lemon juice',
    baseUnit: 'millilitre',
    openingQuantity: 8000,
    inventoryValueCentimes: 12000,
    lowStockThreshold: 1200,
  },
  {
    key: 'sparkling-water',
    name: 'Sparkling water',
    baseUnit: 'millilitre',
    openingQuantity: 20000,
    inventoryValueCentimes: 10000,
    lowStockThreshold: 3000,
  },
  {
    key: 'soft-ice-cream',
    name: 'Soft ice cream portions',
    baseUnit: 'piece',
    openingQuantity: 12,
    inventoryValueCentimes: 7200,
    lowStockThreshold: 10,
  },
  {
    key: 'croissant',
    name: 'Butter croissants',
    baseUnit: 'piece',
    openingQuantity: 12,
    inventoryValueCentimes: 4800,
    lowStockThreshold: 10,
  },
  {
    key: 'brioche',
    name: 'Brioche',
    baseUnit: 'piece',
    openingQuantity: 18,
    lowStockThreshold: 6,
  },
  {
    key: 'paper-cup',
    name: 'Paper cups',
    baseUnit: 'piece',
    openingQuantity: 240,
    inventoryValueCentimes: 12000,
    lowStockThreshold: 50,
  },
] as const;

const modifierGroupSeeds = [
  {
    key: 'size',
    name: 'Size',
    required: true,
    minSelections: 1,
    maxSelections: 1,
    sortOrder: 10,
  },
  {
    key: 'milk',
    name: 'Milk',
    required: true,
    minSelections: 1,
    maxSelections: 1,
    sortOrder: 20,
  },
  {
    key: 'syrup',
    name: 'Syrup',
    required: false,
    minSelections: 0,
    maxSelections: 2,
    sortOrder: 30,
  },
  {
    key: 'extras',
    name: 'Extras',
    required: false,
    minSelections: 0,
    maxSelections: 2,
    sortOrder: 40,
  },
] as const;

const modifierOptionSeeds: readonly {
  groupKey: string;
  key: string;
  name: string;
  priceDeltaCentimes: number;
  ingredientEffects: readonly IngredientEffectSeed[];
  sortOrder: number;
}[] = [
  {
    groupKey: 'size',
    key: 'standard',
    name: 'Standard',
    priceDeltaCentimes: 0,
    ingredientEffects: [],
    sortOrder: 10,
  },
  {
    groupKey: 'size',
    key: 'plus',
    name: 'Plus',
    priceDeltaCentimes: 500,
    ingredientEffects: [],
    sortOrder: 20,
  },
  {
    groupKey: 'milk',
    key: 'whole',
    name: 'Whole milk',
    priceDeltaCentimes: 0,
    ingredientEffects: [],
    sortOrder: 10,
  },
  {
    groupKey: 'milk',
    key: 'oat',
    name: 'Oat milk',
    priceDeltaCentimes: 400,
    ingredientEffects: [
      { ingredientKey: 'whole-milk', quantityDelta: -200 },
      { ingredientKey: 'oat-milk', quantityDelta: 200 },
    ],
    sortOrder: 20,
  },
  {
    groupKey: 'syrup',
    key: 'vanilla',
    name: 'Vanilla',
    priceDeltaCentimes: 300,
    ingredientEffects: [
      { ingredientKey: 'vanilla-syrup', quantityDelta: 20 },
    ],
    sortOrder: 10,
  },
  {
    groupKey: 'syrup',
    key: 'caramel',
    name: 'Caramel',
    priceDeltaCentimes: 300,
    ingredientEffects: [
      { ingredientKey: 'caramel-syrup', quantityDelta: 20 },
    ],
    sortOrder: 20,
  },
  {
    groupKey: 'extras',
    key: 'extra-shot',
    name: 'Extra espresso shot',
    priceDeltaCentimes: 500,
    ingredientEffects: [
      { ingredientKey: 'coffee-beans', quantityDelta: 18 },
    ],
    sortOrder: 10,
  },
  {
    groupKey: 'extras',
    key: 'cold-foam',
    name: 'Cold foam',
    priceDeltaCentimes: 500,
    ingredientEffects: [
      { ingredientKey: 'whole-milk', quantityDelta: 60 },
    ],
    sortOrder: 20,
  },
];

const drinkModifiers = ['size', 'milk', 'syrup', 'extras'] as const;
const coffeeModifiers = ['size', 'syrup', 'extras'] as const;

const productSeeds: readonly ProductSeed[] = [
  {
    key: 'espresso',
    categoryKey: 'coffee',
    name: 'Espresso',
    receiptName: 'Espresso',
    basePriceCentimes: 1000,
    status: 'active',
    imageAssetKey: 'espresso',
    modifierGroupKeys: coffeeModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 18 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'americano',
    categoryKey: 'coffee',
    name: 'Americano',
    receiptName: 'Americano',
    basePriceCentimes: 1300,
    status: 'active',
    imageAssetKey: 'americano',
    modifierGroupKeys: coffeeModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 18 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'cappuccino',
    categoryKey: 'coffee',
    name: 'Cappuccino',
    receiptName: 'Cappuccino',
    basePriceCentimes: 1700,
    status: 'active',
    imageAssetKey: 'cappuccino',
    modifierGroupKeys: drinkModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 18 },
      { ingredientKey: 'whole-milk', quantity: 200 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'latte',
    categoryKey: 'coffee',
    name: 'Latte',
    receiptName: 'Latte',
    basePriceCentimes: 1800,
    status: 'active',
    imageAssetKey: 'latte',
    modifierGroupKeys: drinkModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 18 },
      { ingredientKey: 'whole-milk', quantity: 200 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'mocha',
    categoryKey: 'coffee',
    name: 'Mocha',
    receiptName: 'Mocha',
    basePriceCentimes: 2600,
    status: 'active',
    imageAssetKey: 'mocha',
    modifierGroupKeys: drinkModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 18 },
      { ingredientKey: 'whole-milk', quantity: 200 },
      { ingredientKey: 'cocoa-powder', quantity: 12 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'iced-coffee-milk',
    categoryKey: 'coffee',
    name: 'Iced Coffee Milk',
    receiptName: 'Iced Coffee Milk',
    basePriceCentimes: 2200,
    status: 'active',
    imageAssetKey: 'iced-coffee-milk',
    modifierGroupKeys: drinkModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 18 },
      { ingredientKey: 'whole-milk', quantity: 200 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'cold-brew',
    categoryKey: 'coffee',
    name: 'Cold Brew',
    receiptName: 'Cold Brew',
    basePriceCentimes: 1800,
    status: 'active',
    imageAssetKey: 'cold-brew',
    modifierGroupKeys: coffeeModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 20 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'flat-white',
    categoryKey: 'coffee',
    name: 'Flat White',
    receiptName: 'Flat White',
    basePriceCentimes: 1800,
    status: 'active',
    imageAssetKey: 'flat-white',
    modifierGroupKeys: drinkModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 18 },
      { ingredientKey: 'whole-milk', quantity: 200 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'caramel-mac',
    categoryKey: 'coffee',
    name: 'Caramel Mac',
    receiptName: 'Caramel Mac',
    basePriceCentimes: 2700,
    status: 'active',
    imageAssetKey: 'caramel-mac',
    modifierGroupKeys: drinkModifiers,
    recipe: [
      { ingredientKey: 'coffee-beans', quantity: 18 },
      { ingredientKey: 'whole-milk', quantity: 200 },
      { ingredientKey: 'caramel-syrup', quantity: 20 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'matcha-latte',
    categoryKey: 'matcha-tea',
    name: 'Ceremonial Matcha',
    receiptName: 'Matcha Latte',
    basePriceCentimes: 3000,
    status: 'active',
    modifierGroupKeys: drinkModifiers,
    recipe: [
      { ingredientKey: 'matcha-powder', quantity: 4 },
      { ingredientKey: 'whole-milk', quantity: 200 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'hojicha-latte',
    categoryKey: 'matcha-tea',
    name: 'Hojicha Latte',
    receiptName: 'Hojicha Latte',
    basePriceCentimes: 3200,
    status: 'active',
    modifierGroupKeys: drinkModifiers,
    recipe: [
      { ingredientKey: 'hojicha-powder', quantity: 5 },
      { ingredientKey: 'whole-milk', quantity: 200 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'lemonade',
    categoryKey: 'cold-sweet',
    name: 'Sparkling Lemonade',
    receiptName: 'Lemonade',
    basePriceCentimes: 2500,
    status: 'active',
    modifierGroupKeys: ['size', 'syrup'],
    recipe: [
      { ingredientKey: 'lemon-juice', quantity: 80 },
      { ingredientKey: 'sparkling-water', quantity: 250 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'soft-ice-cream',
    categoryKey: 'cold-sweet',
    name: 'Soft Ice Cream',
    receiptName: 'Soft Ice Cream',
    basePriceCentimes: 2500,
    status: 'unavailable',
    modifierGroupKeys: [],
    recipe: [
      { ingredientKey: 'soft-ice-cream', quantity: 1 },
      { ingredientKey: 'paper-cup', quantity: 1 },
    ],
  },
  {
    key: 'butter-croissant',
    categoryKey: 'bakery-savoury',
    name: 'Butter Croissant',
    receiptName: 'Butter Croissant',
    basePriceCentimes: 1500,
    status: 'active',
    modifierGroupKeys: [],
    recipe: [{ ingredientKey: 'croissant', quantity: 1 }],
  },
  {
    key: 'brioche',
    categoryKey: 'bakery-savoury',
    name: 'Brioche',
    receiptName: 'Brioche',
    basePriceCentimes: 1800,
    status: 'active',
    modifierGroupKeys: [],
    recipe: [{ ingredientKey: 'brioche', quantity: 1 }],
  },
];

const stockAdjustmentSeeds = [
  {
    ingredientKey: 'whole-milk',
    quantityDelta: 5000,
    movementType: 'stock-addition',
    reason: 'Development delivery',
    businessDate: '2026-07-25',
    createdAt: Date.parse('2026-07-25T07:30:00.000Z'),
  },
  {
    ingredientKey: 'vanilla-syrup',
    quantityDelta: 1000,
    movementType: 'stock-addition',
    reason: 'Development delivery',
    businessDate: '2026-07-25',
    createdAt: Date.parse('2026-07-25T07:31:00.000Z'),
  },
  {
    ingredientKey: 'croissant',
    quantityDelta: -1,
    movementType: 'manual-adjustment',
    reason: 'Development spoilage adjustment',
    businessDate: '2026-07-26',
    createdAt: Date.parse('2026-07-26T18:10:00.000Z'),
  },
] as const;

const saleSeeds: readonly SaleSeed[] = [
  {
    localSaleId: 'dev-sale-0001',
    receiptNumber: 'OLS-20260722-001',
    businessDate: '2026-07-22',
    completedAt: Date.parse('2026-07-22T09:15:00.000Z'),
    cashierName: 'Amina',
    serviceMode: 'dine-in',
    paymentMethod: 'Cash',
    status: 'completed',
    tableLabel: 'T3',
    lines: [
      { productKey: 'espresso', quantity: 2 },
      {
        productKey: 'cappuccino',
        quantity: 1,
        modifiers: [{ groupKey: 'milk', optionKey: 'whole' }],
      },
    ],
  },
  {
    localSaleId: 'dev-sale-0002',
    receiptNumber: 'OLS-20260722-002',
    businessDate: '2026-07-22',
    completedAt: Date.parse('2026-07-22T12:40:00.000Z'),
    cashierName: 'Youssef',
    serviceMode: 'take-away',
    paymentMethod: 'Card',
    status: 'completed',
    lines: [
      {
        productKey: 'latte',
        quantity: 1,
        modifiers: [
          { groupKey: 'milk', optionKey: 'oat' },
          { groupKey: 'syrup', optionKey: 'vanilla' },
        ],
      },
    ],
  },
  {
    localSaleId: 'dev-sale-0003',
    receiptNumber: 'OLS-20260723-001',
    businessDate: '2026-07-23',
    completedAt: Date.parse('2026-07-23T10:20:00.000Z'),
    cashierName: 'Amina',
    serviceMode: 'online',
    paymentMethod: 'Card',
    status: 'completed',
    customerName: 'Nora',
    lines: [
      {
        productKey: 'matcha-latte',
        quantity: 2,
        modifiers: [{ groupKey: 'milk', optionKey: 'oat' }],
      },
    ],
  },
  {
    localSaleId: 'dev-sale-0004',
    receiptNumber: 'OLS-20260723-002',
    businessDate: '2026-07-23',
    completedAt: Date.parse('2026-07-23T16:05:00.000Z'),
    cashierName: 'Youssef',
    serviceMode: 'dine-in',
    paymentMethod: 'Cash',
    status: 'cancelled',
    tableLabel: 'T1',
    lines: [{ productKey: 'americano', quantity: 1 }],
  },
  {
    localSaleId: 'dev-sale-0005',
    receiptNumber: 'OLS-20260724-001',
    businessDate: '2026-07-24',
    completedAt: Date.parse('2026-07-24T11:30:00.000Z'),
    cashierName: 'Amina',
    serviceMode: 'take-away',
    paymentMethod: 'Cash',
    status: 'completed',
    lines: [
      {
        productKey: 'caramel-mac',
        quantity: 1,
        modifiers: [{ groupKey: 'extras', optionKey: 'extra-shot' }],
      },
    ],
  },
  {
    localSaleId: 'dev-sale-0006',
    receiptNumber: 'OLS-20260724-002',
    businessDate: '2026-07-24',
    completedAt: Date.parse('2026-07-24T15:45:00.000Z'),
    cashierName: 'Youssef',
    serviceMode: 'dine-in',
    paymentMethod: 'Card',
    status: 'completed',
    tableLabel: 'T6',
    lines: [{ productKey: 'butter-croissant', quantity: 2 }],
  },
  {
    localSaleId: 'dev-sale-0007',
    receiptNumber: 'OLS-20260725-001',
    businessDate: '2026-07-25',
    completedAt: Date.parse('2026-07-25T09:35:00.000Z'),
    cashierName: 'Amina',
    serviceMode: 'dine-in',
    paymentMethod: 'Cash',
    status: 'completed',
    tableLabel: 'T2',
    lines: [{ productKey: 'flat-white', quantity: 1 }],
  },
  {
    localSaleId: 'dev-sale-0008',
    receiptNumber: 'OLS-20260725-002',
    businessDate: '2026-07-25',
    completedAt: Date.parse('2026-07-25T18:20:00.000Z'),
    cashierName: 'Youssef',
    serviceMode: 'online',
    paymentMethod: 'Card',
    status: 'completed',
    customerName: 'Samir',
    lines: [{ productKey: 'lemonade', quantity: 2 }],
  },
  {
    localSaleId: 'dev-sale-0009',
    receiptNumber: 'OLS-20260726-001',
    businessDate: '2026-07-26',
    completedAt: Date.parse('2026-07-26T13:15:00.000Z'),
    cashierName: 'Amina',
    serviceMode: 'take-away',
    paymentMethod: 'Card',
    status: 'completed',
    lines: [
      {
        productKey: 'iced-coffee-milk',
        quantity: 2,
        modifiers: [
          { groupKey: 'syrup', optionKey: 'vanilla' },
          { groupKey: 'extras', optionKey: 'cold-foam' },
        ],
      },
    ],
  },
  {
    localSaleId: 'dev-sale-0010',
    receiptNumber: 'OLS-20260727-001',
    businessDate: '2026-07-27',
    completedAt: Date.parse('2026-07-27T10:05:00.000Z'),
    cashierName: 'Youssef',
    serviceMode: 'dine-in',
    paymentMethod: 'Cash',
    status: 'refunded',
    tableLabel: 'T4',
    lines: [{ productKey: 'mocha', quantity: 1 }],
  },
  {
    localSaleId: 'dev-sale-0011',
    receiptNumber: 'OLS-20260727-002',
    businessDate: '2026-07-27',
    completedAt: Date.parse('2026-07-27T17:55:00.000Z'),
    cashierName: 'Amina',
    serviceMode: 'take-away',
    paymentMethod: 'Card',
    status: 'completed',
    lines: [
      { productKey: 'cappuccino', quantity: 1 },
      { productKey: 'brioche', quantity: 2 },
    ],
  },
  {
    localSaleId: 'dev-sale-0012',
    receiptNumber: 'OLS-20260728-001',
    businessDate: '2026-07-28',
    completedAt: Date.parse('2026-07-28T09:25:00.000Z'),
    cashierName: 'Youssef',
    serviceMode: 'online',
    paymentMethod: 'Card',
    status: 'completed',
    customerName: 'Leila',
    lines: [
      { productKey: 'cold-brew', quantity: 1 },
      { productKey: 'matcha-latte', quantity: 1 },
    ],
  },
  {
    localSaleId: 'dev-sale-0013',
    receiptNumber: 'OLS-20260728-002',
    businessDate: '2026-07-28',
    completedAt: Date.parse('2026-07-28T14:10:00.000Z'),
    cashierName: 'Amina',
    serviceMode: 'dine-in',
    paymentMethod: 'Cash',
    status: 'completed',
    tableLabel: 'T5',
    lines: [
      { productKey: 'soft-ice-cream', quantity: 2 },
      {
        productKey: 'espresso',
        quantity: 1,
        modifiers: [{ groupKey: 'extras', optionKey: 'extra-shot' }],
      },
    ],
  },
];

function assertSeedEnabled() {
  if (process.env[ENABLE_FLAG] !== 'true') {
    throw new Error(
      `Development seeding is disabled. Set ${ENABLE_FLAG}=true on the intended dev deployment.`,
    );
  }
}

function mustGet<Key, Value>(map: Map<Key, Value>, key: Key, label: string) {
  const value = map.get(key);
  if (value === undefined) {
    throw new Error(`Missing ${label}: ${String(key)}`);
  }
  return value;
}

async function clearTable<TableName extends SeedTable>(
  ctx: MutationCtx,
  table: TableName,
) {
  // ponytail: keep reset atomic while fixtures stay below 250 rows per table;
  // add paginated batches only if development data outgrows that ceiling.
  const rows = await ctx.db.query(table).take(RESET_LIMIT + 1);
  if (rows.length > RESET_LIMIT) {
    throw new Error(
      `Refusing to reset ${table}: it exceeds the ${RESET_LIMIT}-row development limit.`,
    );
  }
  for (const row of rows) {
    await ctx.db.delete(row._id);
  }
}

function createCounts() {
  return Object.fromEntries(
    resetOrder.map((table) => [table, 0]),
  ) as Record<SeedTable, number>;
}

function remainingInventoryValue(
  openingValueCentimes: number,
  openingQuantity: number,
  currentQuantity: number,
) {
  return Number(
    (BigInt(openingValueCentimes) * BigInt(currentQuantity) +
      BigInt(openingQuantity) / 2n) /
      BigInt(openingQuantity),
  );
}

function createDailyAccumulator(): DailyAccumulator {
  return {
    grossCentimes: 0,
    netCentimes: 0,
    orderCount: 0,
    cancelledCentimes: 0,
    refundedCentimes: 0,
    paymentMethods: new Map(),
    serviceModes: new Map(),
    products: new Map(),
    categories: new Map(),
    ingredients: new Map(),
    ingredientUsageEventCount: 0,
  };
}

function incrementStockDelta(
  deltas: Map<string, number>,
  ingredientKey: string,
  quantityDelta: number,
) {
  deltas.set(ingredientKey, (deltas.get(ingredientKey) ?? 0) + quantityDelta);
}

export const resetAndSeed = internalMutation({
  args: { confirm: v.literal(CONFIRMATION) },
  handler: async (ctx, _args) => {
    assertSeedEnabled();

    for (const table of resetOrder) {
      await clearTable(ctx, table);
    }

    const counts = createCounts();
    const categoryIds = new Map<string, Id<'categories'>>();
    const categoryNames = new Map<string, string>();
    for (const category of categorySeeds) {
      const id = await ctx.db.insert('categories', {
        key: category.key,
        name: category.name,
        artworkKey: category.artworkKey,
        sortOrder: category.sortOrder,
        status: 'active',
        revision: 1,
        updatedAt: SEED_AT,
      });
      categoryIds.set(category.key, id);
      categoryNames.set(category.key, category.name);
      counts.categories += 1;
    }

    const ingredientIds = new Map<string, Id<'ingredients'>>();
    for (const ingredient of ingredientSeeds) {
      const id = await ctx.db.insert('ingredients', {
        key: ingredient.key,
        name: ingredient.name,
        baseUnit: ingredient.baseUnit,
        currentStockQuantity: ingredient.openingQuantity,
        ...(ingredient.inventoryValueCentimes === undefined
          ? { costStatus: 'incomplete' as const }
          : {
              inventoryValueCentimes: ingredient.inventoryValueCentimes,
              costStatus: 'complete' as const,
              valuationRevision: 1,
            }),
        lowStockThreshold: ingredient.lowStockThreshold,
        status: 'active',
        revision: 1,
        updatedAt: SEED_AT,
      });
      ingredientIds.set(ingredient.key, id);
      counts.ingredients += 1;
    }

    const modifierGroupIds = new Map<string, Id<'modifierGroups'>>();
    const modifierGroupNames = new Map<string, string>();
    for (const group of modifierGroupSeeds) {
      const id = await ctx.db.insert('modifierGroups', {
        key: group.key,
        name: group.name,
        required: group.required,
        minSelections: group.minSelections,
        maxSelections: group.maxSelections,
        status: 'active',
        sortOrder: group.sortOrder,
        revision: 1,
        updatedAt: SEED_AT,
      });
      modifierGroupIds.set(group.key, id);
      modifierGroupNames.set(group.key, group.name);
      counts.modifierGroups += 1;
    }

    const modifierOptions = new Map<
      string,
      {
        groupName: string;
        name: string;
        priceDeltaCentimes: number;
        ingredientEffects: readonly IngredientEffectSeed[];
      }
    >();
    for (const option of modifierOptionSeeds) {
      await ctx.db.insert('modifierOptions', {
        groupId: mustGet(
          modifierGroupIds,
          option.groupKey,
          'modifier group',
        ),
        key: option.key,
        name: option.name,
        priceDeltaCentimes: option.priceDeltaCentimes,
        ingredientEffects: option.ingredientEffects.map((effect) => ({
          ingredientId: mustGet(
            ingredientIds,
            effect.ingredientKey,
            'modifier ingredient',
          ),
          quantityDelta: effect.quantityDelta,
        })),
        status: 'active',
        sortOrder: option.sortOrder,
        revision: 1,
        updatedAt: SEED_AT,
      });
      modifierOptions.set(`${option.groupKey}:${option.key}`, {
        groupName: mustGet(
          modifierGroupNames,
          option.groupKey,
          'modifier group name',
        ),
        name: option.name,
        priceDeltaCentimes: option.priceDeltaCentimes,
        ingredientEffects: option.ingredientEffects,
      });
      counts.modifierOptions += 1;
    }

    const productIds = new Map<string, Id<'products'>>();
    const products = new Map<string, ProductSeed>();
    for (const [sortOrder, product] of productSeeds.entries()) {
      const id = await ctx.db.insert('products', {
        key: product.key,
        categoryId: mustGet(
          categoryIds,
          product.categoryKey,
          'product category',
        ),
        name: product.name,
        receiptName: product.receiptName,
        basePriceCentimes: product.basePriceCentimes,
        status: product.status,
        ...(product.imageAssetKey
          ? { imageAssetKey: product.imageAssetKey }
          : {}),
        sortOrder: (sortOrder + 1) * 10,
        modifierGroupIds: product.modifierGroupKeys.map((key) =>
          mustGet(modifierGroupIds, key, 'product modifier group'),
        ),
        revision: 1,
        updatedAt: SEED_AT,
      });
      productIds.set(product.key, id);
      products.set(product.key, product);
      counts.products += 1;
    }

    const recipeVersionIds = new Map<string, Id<'recipeVersions'>>();
    for (const product of productSeeds) {
      const productId = mustGet(productIds, product.key, 'recipe product');
      const recipeVersionId = await ctx.db.insert('recipeVersions', {
        productId,
        versionNumber: 1,
        status: 'active',
        activationAt: Date.parse('2026-07-21T08:00:00.000Z'),
        firstUsedAt: Date.parse('2026-07-22T09:15:00.000Z'),
        createdAt: Date.parse('2026-07-21T08:00:00.000Z'),
        updatedAt: SEED_AT,
      });
      recipeVersionIds.set(product.key, recipeVersionId);
      counts.recipeVersions += 1;

      for (const item of product.recipe) {
        await ctx.db.insert('recipeItems', {
          recipeVersionId,
          ingredientId: mustGet(
            ingredientIds,
            item.ingredientKey,
            'recipe ingredient',
          ),
          quantity: item.quantity,
          createdAt: Date.parse('2026-07-21T08:00:00.000Z'),
        });
        counts.recipeItems += 1;
      }

      await ctx.db.patch(productId, {
        currentRecipeVersionId: recipeVersionId,
      });
    }

    const stockDeltas = new Map<string, number>();
    for (const ingredient of ingredientSeeds) {
      await ctx.db.insert('stockMovements', {
        ingredientId: mustGet(
          ingredientIds,
          ingredient.key,
          'opening-balance ingredient',
        ),
        quantityDelta: ingredient.openingQuantity,
        movementType: 'seed',
        reason: 'Deterministic development opening balance',
        actorLabel: 'Development seed',
        businessDate: '2026-07-21',
        createdAt: Date.parse('2026-07-21T08:00:00.000Z'),
      });
      counts.stockMovements += 1;
    }

    for (const adjustment of stockAdjustmentSeeds) {
      await ctx.db.insert('stockMovements', {
        ingredientId: mustGet(
          ingredientIds,
          adjustment.ingredientKey,
          'adjustment ingredient',
        ),
        quantityDelta: adjustment.quantityDelta,
        movementType: adjustment.movementType,
        reason: adjustment.reason,
        actorLabel: 'Development seed',
        businessDate: adjustment.businessDate,
        createdAt: adjustment.createdAt,
      });
      incrementStockDelta(
        stockDeltas,
        adjustment.ingredientKey,
        adjustment.quantityDelta,
      );
      counts.stockMovements += 1;
    }

    const daily = new Map<string, DailyAccumulator>();
    for (const saleSeed of saleSeeds) {
      const preparedLines = saleSeed.lines.map((line) => {
        const product = mustGet(products, line.productKey, 'sale product');
        const productId = mustGet(
          productIds,
          line.productKey,
          'sale product ID',
        );
        const recipeVersionId = mustGet(
          recipeVersionIds,
          line.productKey,
          'sale recipe version',
        );
        const selectedModifiers = (line.modifiers ?? []).map((choice) => {
          const option = mustGet(
            modifierOptions,
            `${choice.groupKey}:${choice.optionKey}`,
            'sale modifier',
          );
          return {
            ...option,
            ingredientEffects: option.ingredientEffects,
          };
        });
        const unitPriceCentimes =
          product.basePriceCentimes +
          selectedModifiers.reduce(
            (total, modifier) => total + modifier.priceDeltaCentimes,
            0,
          );
        const ingredientUsage = new Map<string, number>();
        for (const item of product.recipe) {
          incrementStockDelta(
            ingredientUsage,
            item.ingredientKey,
            item.quantity * line.quantity,
          );
        }
        for (const modifier of selectedModifiers) {
          for (const effect of modifier.ingredientEffects) {
            incrementStockDelta(
              ingredientUsage,
              effect.ingredientKey,
              effect.quantityDelta * line.quantity,
            );
          }
        }
        for (const [ingredientKey, quantity] of ingredientUsage) {
          if (quantity < 0) {
            throw new Error(
              `Modifier usage made ${ingredientKey} negative for ${product.key}.`,
            );
          }
        }
        return {
          product,
          productId,
          recipeVersionId,
          quantity: line.quantity,
          unitPriceCentimes,
          lineTotalCentimes: unitPriceCentimes * line.quantity,
          modifiers: selectedModifiers.map((modifier) => ({
            groupName: modifier.groupName,
            optionName: modifier.name,
            priceDeltaCentimes: modifier.priceDeltaCentimes,
          })),
          ingredientUsage,
        };
      });
      const subtotalCentimes = preparedLines.reduce(
        (total, line) => total + line.lineTotalCentimes,
        0,
      );
      const saleId = await ctx.db.insert('sales', {
        deviceId: DEVICE_ID,
        localSaleId: saleSeed.localSaleId,
        receiptNumber: saleSeed.receiptNumber,
        cashierName: saleSeed.cashierName,
        serviceMode: saleSeed.serviceMode,
        ...(saleSeed.customerName
          ? { customerName: saleSeed.customerName }
          : {}),
        ...(saleSeed.tableLabel ? { tableLabel: saleSeed.tableLabel } : {}),
        subtotalCentimes,
        discountCentimes: 0,
        taxCentimes: 0,
        totalCentimes: subtotalCentimes,
        taxPolicyLabel: TAX_POLICY_LABEL,
        paymentMethod: saleSeed.paymentMethod,
        status: saleSeed.status,
        businessDate: saleSeed.businessDate,
        completedAt: saleSeed.completedAt,
        acknowledgedAt: saleSeed.completedAt + 30_000,
        receiptSnapshot: {
          receiptNumber: saleSeed.receiptNumber,
          completedAt: saleSeed.completedAt,
          serviceMode: saleSeed.serviceMode,
          ...(saleSeed.customerName
            ? { customerName: saleSeed.customerName }
            : {}),
          ...(saleSeed.tableLabel
            ? { tableLabel: saleSeed.tableLabel }
            : {}),
          lines: preparedLines.map((line) => ({
            productName: line.product.receiptName,
            quantity: line.quantity,
            unitPriceCentimes: line.unitPriceCentimes,
            lineTotalCentimes: line.lineTotalCentimes,
            modifiers: line.modifiers,
          })),
          subtotalCentimes,
          discountCentimes: 0,
          taxCentimes: 0,
          totalCentimes: subtotalCentimes,
          taxPolicyLabel: TAX_POLICY_LABEL,
          paymentMethod: saleSeed.paymentMethod,
        },
      });
      counts.sales += 1;

      const saleIngredientUsage = new Map<string, number>();
      for (const line of preparedLines) {
        await ctx.db.insert('saleItems', {
          saleId,
          productId: line.productId,
          productName: line.product.name,
          receiptName: line.product.receiptName,
          unitPriceCentimes: line.unitPriceCentimes,
          quantity: line.quantity,
          modifiers: line.modifiers,
          recipeVersionId: line.recipeVersionId,
          lineTotalCentimes: line.lineTotalCentimes,
        });
        counts.saleItems += 1;
        for (const [ingredientKey, quantity] of line.ingredientUsage) {
          incrementStockDelta(saleIngredientUsage, ingredientKey, quantity);
        }
      }

      for (const [ingredientKey, quantity] of saleIngredientUsage) {
        if (quantity === 0) continue;
        await ctx.db.insert('stockMovements', {
          ingredientId: mustGet(
            ingredientIds,
            ingredientKey,
            'sale-movement ingredient',
          ),
          quantityDelta: -quantity,
          movementType: 'sale',
          relatedSaleId: saleId,
          reason: `Recipe deduction for ${saleSeed.receiptNumber}`,
          deviceId: DEVICE_ID,
          actorLabel: saleSeed.cashierName,
          businessDate: saleSeed.businessDate,
          createdAt: saleSeed.completedAt,
        });
        counts.stockMovements += 1;

        if (saleSeed.status === 'completed') {
          incrementStockDelta(stockDeltas, ingredientKey, -quantity);
          continue;
        }

        await ctx.db.insert('stockMovements', {
          ingredientId: mustGet(
            ingredientIds,
            ingredientKey,
            'correction-movement ingredient',
          ),
          quantityDelta: quantity,
          movementType:
            saleSeed.status === 'cancelled' ? 'cancellation' : 'refund',
          relatedSaleId: saleId,
          reason: `${saleSeed.status === 'cancelled' ? 'Cancellation' : 'Refund'} reversal for ${saleSeed.receiptNumber}`,
          deviceId: DEVICE_ID,
          actorLabel: saleSeed.cashierName,
          businessDate: saleSeed.businessDate,
          createdAt: saleSeed.completedAt + 60_000,
        });
        counts.stockMovements += 1;
      }

      const metrics =
        daily.get(saleSeed.businessDate) ?? createDailyAccumulator();
      daily.set(saleSeed.businessDate, metrics);
      if (saleSeed.status === 'cancelled') {
        metrics.cancelledCentimes += subtotalCentimes;
        continue;
      }

      metrics.grossCentimes += subtotalCentimes;
      metrics.orderCount += 1;
      if (saleSeed.status === 'refunded') {
        metrics.refundedCentimes += subtotalCentimes;
        continue;
      }

      metrics.netCentimes += subtotalCentimes;
      for (const [ingredientKey, quantity] of saleIngredientUsage) {
        if (quantity === 0) continue;
        const ingredient = ingredientSeeds.find(
          (candidate) => candidate.key === ingredientKey,
        );
        if (!ingredient) {
          throw new Error(`Unknown metric ingredient: ${ingredientKey}`);
        }
        const ingredientTotal = metrics.ingredients.get(ingredientKey) ?? {
          ingredientId: mustGet(
            ingredientIds,
            ingredientKey,
            'metric ingredient',
          ),
          ingredientName: ingredient.name,
          baseUnit: ingredient.baseUnit,
          quantity: 0,
        };
        ingredientTotal.quantity += quantity;
        metrics.ingredients.set(ingredientKey, ingredientTotal);
        metrics.ingredientUsageEventCount += 1;
      }
      const payment = metrics.paymentMethods.get(saleSeed.paymentMethod) ?? {
        paymentMethod: saleSeed.paymentMethod,
        totalCentimes: 0,
        orderCount: 0,
      };
      payment.totalCentimes += subtotalCentimes;
      payment.orderCount += 1;
      metrics.paymentMethods.set(saleSeed.paymentMethod, payment);

      const service = metrics.serviceModes.get(saleSeed.serviceMode) ?? {
        serviceMode: saleSeed.serviceMode,
        totalCentimes: 0,
        orderCount: 0,
      };
      service.totalCentimes += subtotalCentimes;
      service.orderCount += 1;
      metrics.serviceModes.set(saleSeed.serviceMode, service);

      for (const line of preparedLines) {
        const productTotal = metrics.products.get(line.product.key) ?? {
          productId: line.productId,
          productName: line.product.name,
          categoryName: mustGet(
            categoryNames,
            line.product.categoryKey,
            'metric product category name',
          ),
          quantity: 0,
          totalCentimes: 0,
        };
        productTotal.quantity += line.quantity;
        productTotal.totalCentimes += line.lineTotalCentimes;
        metrics.products.set(line.product.key, productTotal);

        const categoryId = mustGet(
          categoryIds,
          line.product.categoryKey,
          'metric category',
        );
        const categoryTotal = metrics.categories.get(
          line.product.categoryKey,
        ) ?? {
          categoryId,
          categoryName: mustGet(
            categoryNames,
            line.product.categoryKey,
            'metric category name',
          ),
          quantity: 0,
          totalCentimes: 0,
        };
        categoryTotal.quantity += line.quantity;
        categoryTotal.totalCentimes += line.lineTotalCentimes;
        metrics.categories.set(line.product.categoryKey, categoryTotal);
      }
    }

    for (const [businessDate, metrics] of [...daily.entries()].sort()) {
      await ctx.db.insert('dailyMetrics', {
        businessDate,
        grossCentimes: metrics.grossCentimes,
        netCentimes: metrics.netCentimes,
        orderCount: metrics.orderCount,
        cancelledCentimes: metrics.cancelledCentimes,
        refundedCentimes: metrics.refundedCentimes,
        totalsByPaymentMethod: [...metrics.paymentMethods.values()].sort((a, b) =>
          a.paymentMethod.localeCompare(b.paymentMethod),
        ),
        totalsByServiceMode: [...metrics.serviceModes.values()].sort((a, b) =>
          a.serviceMode.localeCompare(b.serviceMode),
        ),
        productTotals: [...metrics.products.values()].sort((a, b) =>
          a.productName.localeCompare(b.productName),
        ),
        categoryTotals: [...metrics.categories.values()].sort((a, b) =>
          a.categoryName.localeCompare(b.categoryName),
        ),
        ingredientTotals: [...metrics.ingredients.values()].sort((a, b) =>
          a.ingredientName.localeCompare(b.ingredientName),
        ),
        ingredientUsageEventCount: metrics.ingredientUsageEventCount,
        updatedAt: SEED_AT,
      });
      counts.dailyMetrics += 1;
    }

    for (const ingredient of ingredientSeeds) {
      await ctx.db.patch(
        mustGet(ingredientIds, ingredient.key, 'stock-balance ingredient'),
        {
          currentStockQuantity:
            ingredient.openingQuantity + (stockDeltas.get(ingredient.key) ?? 0),
          ...(ingredient.inventoryValueCentimes === undefined
            ? {}
            : {
                inventoryValueCentimes: remainingInventoryValue(
                  ingredient.inventoryValueCentimes,
                  ingredient.openingQuantity,
                  ingredient.openingQuantity +
                    (stockDeltas.get(ingredient.key) ?? 0),
                ),
                valuationRevision: 2,
              }),
          updatedAt: SEED_AT,
        },
      );
    }

    const staffIds = new Map<string, Id<'staffProfiles'>>();
    for (const profile of staffSeeds) {
      const id = await ctx.db.insert('staffProfiles', {
        name: profile.name,
        role: profile.role,
        status: 'active',
        revision: 1,
        updatedAt: SEED_AT,
      });
      staffIds.set(profile.key, id);
      counts.staffProfiles += 1;
    }
    await ctx.db.insert('compensationPeriods', {
      staffProfileId: mustGet(staffIds, 'barista', 'staff profile'),
      monthlyAmountCentimes: 550000,
      effectiveStartMonth: '2026-07',
      revision: 1,
      createdAt: SEED_AT,
      updatedBy: 'Development owner',
      clientMutationId: 'seed-compensation-barista-2026-07',
    });
    counts.compensationPeriods += 1;

    return {
      deployment: 'development',
      deviceId: DEVICE_ID,
      staffProfileIds: Object.fromEntries(staffIds),
      counts,
      businessDates: [...daily.keys()].sort(),
    };
  },
});

async function boundedCount<TableName extends SeedTable>(
  ctx: QueryCtx,
  table: TableName,
) {
  const rows = await ctx.db.query(table).take(RESET_LIMIT + 1);
  if (rows.length > RESET_LIMIT) {
    throw new Error(
      `${table} exceeds the ${RESET_LIMIT}-row development verification limit.`,
    );
  }
  return rows.length;
}

export const verify = internalQuery({
  args: {},
  handler: async (ctx) => {
    assertSeedEnabled();

    const counts = Object.fromEntries(
      await Promise.all(
        resetOrder.map(async (table) => [
          table,
          await boundedCount(ctx, table),
        ]),
      ),
    ) as Record<SeedTable, number>;

    const cappuccino = await ctx.db
      .query('products')
      .withIndex('by_key', (query) => query.eq('key', 'cappuccino'))
      .unique();
    if (!cappuccino?.currentRecipeVersionId) {
      throw new Error('Cappuccino is missing its active recipe relationship.');
    }
    const cappuccinoRecipe = await ctx.db.get(
      cappuccino.currentRecipeVersionId,
    );
    const cappuccinoRecipeItems = await ctx.db
      .query('recipeItems')
      .withIndex('by_recipe_version', (query) =>
        query.eq('recipeVersionId', cappuccino.currentRecipeVersionId!),
      )
      .take(10);

    const sampleSale = await ctx.db
      .query('sales')
      .withIndex('by_device_local_sale', (query) =>
        query.eq('deviceId', DEVICE_ID).eq('localSaleId', 'dev-sale-0013'),
      )
      .unique();
    if (!sampleSale) {
      throw new Error('Representative development sale is missing.');
    }
    const sampleSaleItems = await ctx.db
      .query('saleItems')
      .withIndex('by_sale', (query) => query.eq('saleId', sampleSale._id))
      .take(10);
    const sampleMovements = await ctx.db
      .query('stockMovements')
      .withIndex('by_related_sale', (query) =>
        query.eq('relatedSaleId', sampleSale._id),
      )
      .take(20);
    const sampleMetric = await ctx.db
      .query('dailyMetrics')
      .withIndex('by_business_date', (query) =>
        query.eq('businessDate', '2026-07-28'),
      )
      .unique();
    const ingredients = await ctx.db
      .query('ingredients')
      .withIndex('by_status_name', (query) => query.eq('status', 'active'))
      .take(RESET_LIMIT + 1);
    const seededStaff = await ctx.db
      .query('staffProfiles')
      .withIndex('by_status_name', (query) => query.eq('status', 'active'))
      .take(10);
    const seededCompensation = await ctx.db
      .query('compensationPeriods')
      .withIndex('by_client_mutation', (query) =>
        query.eq('clientMutationId', 'seed-compensation-barista-2026-07'),
      )
      .unique();

    if (
      !cappuccinoRecipe ||
      cappuccinoRecipeItems.length !== 3 ||
      sampleSaleItems.length !== 2 ||
      sampleMovements.length !== 3 ||
      !sampleMetric ||
      sampleMetric.orderCount < 2 ||
      seededStaff.length !== 2 ||
      seededCompensation?.monthlyAmountCentimes !== 550000
    ) {
      throw new Error('Development seed relationship verification failed.');
    }

    return {
      counts,
      representativeProduct: {
        key: cappuccino.key,
        recipeVersion: cappuccinoRecipe.versionNumber,
        recipeItemCount: cappuccinoRecipeItems.length,
      },
      representativeSale: {
        localSaleId: sampleSale.localSaleId,
        receiptNumber: sampleSale.receiptNumber,
        lineCount: sampleSaleItems.length,
        movementCount: sampleMovements.length,
        totalCentimes: sampleSale.totalCentimes,
      },
      representativeDailyMetric: {
        businessDate: sampleMetric.businessDate,
        grossCentimes: sampleMetric.grossCentimes,
        netCentimes: sampleMetric.netCentimes,
        orderCount: sampleMetric.orderCount,
      },
      lowStockIngredientKeys: ingredients
        .filter(
          (ingredient) =>
            ingredient.currentStockQuantity <= ingredient.lowStockThreshold,
        )
        .map((ingredient) => ingredient.key)
        .sort(),
      ownerProfileId: seededStaff.find((staff) => staff.role === 'owner')?._id,
    };
  },
});
