import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Activity, version } from 'react';
import { hasPermission } from '../convex/lib/permissions.ts';

assert.match(version, /^19\./);
assert.equal(typeof Activity, 'symbol');

const app = readFileSync('src/App.tsx', 'utf8');
assert.match(app, /const \[visitedScreens, setVisitedScreens\] = useState<AppScreen\[]>\(\['POS'\]\)/);
assert.match(app, /visitedScreens\.map\(\(visited\) =>[\s\S]*?!hasPermission\(staffSession\.role, screenPermission\[visited\]\)/);
assert.match(app, /startTransition\(/);
assert.match(app, /fallback=\{null\}/);
assert.match(app, /<Activity[\s\S]*?mode=\{live \|\| leaving \? 'visible' : 'hidden'\}/);
assert.match(app, /function resetScreens\(\)[\s\S]*?setVisitedScreens\(\['POS'\]\)/);
assert.match(app, /async function lock\(\)[\s\S]*?resetScreens\(\)[\s\S]*?setStaffSession\(undefined\)/);
assert.match(app, /async function unlock\(session: StaffSession\)[\s\S]*?resetScreens\(\)/);
assert.match(app, /const DashboardScreen = lazy\(/);
assert.match(app, /const OrdersScreen = lazy\(/);
assert.match(app, /const ProductsScreen = lazy\(/);
assert.match(app, /const ReportsScreen = lazy\(/);
assert.match(app, /const SettingsScreen = lazy\(/);
assert.match(app, /const StockScreen = lazy\(/);
assert.match(app, /initialLevelFilter=\{stockLevelFilter\}/);
assert.match(
  readFileSync('src/features/dashboard/DashboardScreen.tsx', 'utf8'),
  /stockLevel: 'low'/,
);
assert.match(app, /import \{ PosScreen \} from '\.\/features\/pos\/PosScreen'/);
assert.match(app, /import \{ LockScreen \} from '\.\/features\/settings\/LockScreen'/);
assert.doesNotMatch(app, /import \{ DashboardScreen \}/);
assert.match(app, /receiptLanguage=\{terminal\.receiptLanguage\}/);
assert.equal(hasPermission('cashier', 'pos'), true);
assert.equal(hasPermission('cashier', 'orders'), true);
assert.equal(hasPermission('cashier', 'dashboard'), false);
assert.equal(hasPermission('cashier', 'products'), false);
assert.equal(hasPermission('cashier', 'stock'), false);
assert.equal(hasPermission('cashier', 'reports'), false);
assert.equal(hasPermission('cashier', 'settings'), false);

for (const file of [
  'usePosData.ts',
  'useProductManagement.ts',
  'useInventoryManagement.ts',
  'useCostManagement.ts',
  'useStaffManagement.ts',
  'useOrdersData.ts',
  'useDashboardData.ts',
  'useReportsData.ts',
]) {
  const source = readFileSync(`src/data/${file}`, 'utf8');
  assert.match(source, /useRef/, `${file} must retain its completed load marker.`);
  assert.match(source, /reconnect\.revision/, `${file} must reload genuine revisions.`);
}

const reports = readFileSync('src/data/useReportsData.ts', 'utf8');
assert.match(reports, /rangeKey\.current !== nextRange/);
assert.match(reports, /setSnapshot\(undefined\)/);
const pos = readFileSync('src/features/pos/PosScreen.tsx', 'utf8');
assert.match(pos, /const validation = isLoading[\s\S]*?Loading the saved menu[\s\S]*?: validatePosSession/);
assert.match(pos, /const \[visitedCategoryIds, setVisitedCategoryIds\] = useState<string\[\]>\(/);
assert.match(pos, /new Set\(\[\.\.\.visitedCategoryIds, session\.selectedCategoryId\]\)[\s\S]*?categories\.some\(\(category\) => category\.id === categoryId\)/);
assert.match(pos, /setVisitedCategoryIds\(\(current\) =>[\s\S]*?current\.includes\(selectedCategoryId\)/);
assert.match(pos, /retainedCategoryIds\.map\(\(categoryId\) =>[\s\S]*?<Activity[\s\S]*?key=\{categoryId\}[\s\S]*?mode=\{categoryId === session\.selectedCategoryId \? 'visible' : 'hidden'\}/);
assert.match(pos, /products=\{filterProducts\(products, categoryId, session\.query\)\}/);

for (const file of [
  'src/features/pos/components/Header/Header.tsx',
  'src/features/settings/LockScreen.tsx',
]) {
  const source = readFileSync(file, 'utf8');
  assert.match(source, /if \(!foreground\) return;[\s\S]*?setNow\(new Date\(\)\)/);
  assert.match(source, /\}, \[foreground\]\)/);
}

// NAV-PALETTE-01: a screen owns its palette for its whole visible lifetime, so no
// screen palette may hang off the shell, the POS palette must be declared once on
// [data-pos-palette] and carried by the POS screen root and both portalled POS
// dialogs, and the 4px strip must follow the visible frame, not the active screen.
assert.match(app, /const frameScreen = visibleLeaving \?\? visibleContent/);
assert.doesNotMatch(app, /data-pos-trial|data-pos-brand-trial|data-dashboard-trial/);
const globalsCss = readFileSync('src/globals.css', 'utf8');
assert.match(globalsCss, /\[data-pos-palette\] \{[\s\S]*?--olaso-green: #01363e/);
assert.match(globalsCss, /:root:has\(\[data-frame-mint='true'\]\) \{[\s\S]*?--olaso-frame-canvas: #f0f7f3/);
assert.match(globalsCss, /background: var\(--olaso-frame-canvas, var\(--olaso-canvas\)\)/);
assert.match(
  readFileSync('src/features/pos/PosScreen.tsx', 'utf8'),
  /<main className=\{styles\.screen\} data-pos-palette/,
);
for (const portal of [
  'src/features/pos/components/ModifierSelectionDialog/ModifierSelectionDialog.tsx',
  'src/features/pos/components/PaymentDialog/PaymentDialog.tsx',
]) {
  assert.match(
    readFileSync(portal, 'utf8'),
    /className=\{styles\.overlay\}\s+data-pos-palette/,
  );
}

// ORDERS-PALETTE-01: Orders owns its palette the same way. It is declared once on
// [data-orders-palette], carried by the Orders screen root and both portalled
// Orders surfaces, re-points only the canvas and the nonsemantic accent, and the
// frame strip follows a visible Orders screen.
assert.match(
  globalsCss,
  /\[data-orders-palette\] \{[\s\S]*?--olaso-canvas: #f0f7f3[\s\S]*?--olaso-green: #01363e[\s\S]*?--olaso-copy-green: #01363e/,
);
assert.doesNotMatch(globalsCss, /\[data-orders-palette\] \{[^}]*--olaso-(success|danger|gold)/);
assert.match(app, /const frameMint = frameScreen === 'POS' \|\| frameScreen === 'Dashboard'[\s\S]*?=== 'Orders'/);
assert.match(
  readFileSync('src/features/orders/OrdersScreen.tsx', 'utf8'),
  /<main className=\{styles\.screen\} data-orders-palette/,
);
assert.match(
  readFileSync('src/features/orders/components/CancellationDialog/CancellationDialog.tsx', 'utf8'),
  /className=\{styles\.overlay\}\s+data-orders-palette/,
);
assert.match(
  readFileSync('src/components/PeriodCalendar/PeriodCalendar.tsx', 'utf8'),
  /data-orders-palette=\{ordersPalette \? 'true' : undefined\}/,
);
assert.match(
  readFileSync('src/features/orders/components/OrdersListPanel/OrdersListPanel.tsx', 'utf8'),
  /<PeriodCalendar[\s\S]*?ordersPalette/,
);

// ORDERS-PALETTE-01 correction: the remaining nonsemantic green-family fills read two
// Orders-scoped tints and fall back to the original token, so only the Orders screen and
// an Orders-opened calendar change.
assert.match(globalsCss, /\[data-orders-palette\] \{[\s\S]*?--orders-tint: #e9eff0[\s\S]*?--orders-tint-strong: #e4ecec/);
// DASH-ORANGE-01 / ORDERS-ORANGE-01: the approved POS orange is reused in each screen's own
// palette scope and applied to exactly one element per screen.
assert.match(readFileSync('src/features/dashboard/DashboardScreen.module.css', 'utf8'), /--olaso-trial-action: #e06a00/);
assert.match(readFileSync('src/features/dashboard/components/SalesPulse/SalesPulse.module.css', 'utf8'), /\.netValueBrand \{\s*color: var\(--olaso-trial-action, var\(--olaso-text\)\)/);
assert.match(globalsCss, /\[data-orders-palette\] \{[\s\S]*?--olaso-trial-action: #e06a00/);
// ORDERS-ORANGE-01 (corrected): the enabled Reprint carries the full orange action fill with
// the dark action ink on label and glyph; the icon-only rule was removed, not layered over.
assert.match(globalsCss, /\[data-orders-palette\] \{[\s\S]*?--olaso-trial-action: #e06a00[\s\S]*?--olaso-trial-action-ink: #1c211b/);
assert.match(readFileSync('src/features/orders/components/OrderDetailPanel/OrderDetailPanel.module.css', 'utf8'), /\.reprint \{\s*border: 0;\s*color: var\(--olaso-trial-action-ink, var\(--olaso-white\)\);\s*background: var\(--olaso-trial-action, var\(--olaso-green\)\)/);
assert.doesNotMatch(readFileSync('src/features/orders/components/OrderDetailPanel/OrderDetailPanel.module.css', 'utf8'), /\.reprint:not\(:disabled\) svg/);
for (const [file, pattern] of [
  ['src/features/orders/components/OrdersTable/OrdersTable.module.css', /background: var\(--orders-tint-strong, var\(--olaso-table-selected\)\)/],
  ['src/features/orders/components/OrderDetailPanel/OrderDetailPanel.module.css', /background: var\(--orders-tint, var\(--olaso-table-head\)\)/],
  ['src/components/PeriodCalendar/PeriodCalendar.module.css', /background: var\(--orders-tint, var\(--olaso-green-icon\)\)/],
]) {
  assert.match(readFileSync(file, 'utf8'), pattern, `${file} must keep the Orders tint with its original fallback.`);
}
assert.match(
  readFileSync('src/features/orders/components/OrderDetailPanel/OrderDetailPanel.module.css', 'utf8'),
  /--orders-tint-strong, var\(--olaso-green-icon\)\)/,
);
assert.doesNotMatch(readFileSync('src/features/orders/components/OrdersTable/OrdersTable.module.css', 'utf8'), /^\.ready \{/m);
// Orders head/label contrast: the tinted head row and the three small labels regressed by
// the orders tints read the existing darker text token so every pair stays >=4.5:1.
for (const [file, pattern] of [
  ['src/features/orders/components/OrdersTable/OrdersTable.module.css', /\.head \{[\s\S]*?background: var\(--orders-tint, var\(--olaso-table-head\)\)/],
  ['src/features/orders/components/OrdersTable/OrdersTable.module.css', /\.head > span \{[\s\S]*?color: var\(--olaso-text-service\)/],
  ['src/features/orders/components/OrdersTable/OrdersTable.module.css', /\.when span \{[\s\S]*?color: var\(--olaso-text-service\)/],
  ['src/features/orders/components/OrderDetailPanel/OrderDetailPanel.module.css', /\.metaItem small \{\s*color: var\(--olaso-text-service\)/],
]) {
  assert.match(readFileSync(file, 'utf8'), pattern, `${file} must keep the corrected Orders label contrast.`);
}
// PRODUCTS-PALETTE-01: Products owns its palette the same way. It is declared once on
// [data-products-palette], carried by the screen root and all five portalled Products dialogs,
// and re-points only the canvas, the brand green and the neutral surface tokens.
assert.match(globalsCss, /\[data-products-palette\] \{[\s\S]*?--olaso-canvas: #f0f7f3[\s\S]*?--olaso-green: #01363e/);
assert.doesNotMatch(globalsCss, /\[data-products-palette\] \{[^}]*--olaso-(success|danger|gold|green-ink|green-icon)/);
assert.match(app, /frameMint = frameScreen === 'POS' \|\| frameScreen === 'Dashboard'[\s\S]*?=== 'Orders'[\s\S]*?=== 'Products'/);
assert.match(readFileSync('src/features/products/ProductsScreen.tsx', 'utf8'), /<main className=\{styles\.screen\} data-products-palette/);
for (const portal of [
  'src/features/products/components/CategoryDialog/CategoryDialog.tsx',
  'src/features/products/components/ProductDialog/ProductDialog.tsx',
  'src/features/products/components/SizesEditorDialog/SizesEditorDialog.tsx',
  'src/features/products/components/RecipeEditorDialog/RecipeEditorDialog.tsx',
  'src/features/products/components/ProductChoiceSectionDialog/ProductChoiceSectionDialog.tsx',
]) {
  assert.match(readFileSync(portal, 'utf8'), /className=\{styles\.overlay\}\s+data-products-palette/, `${portal} must carry the Products palette on its portal root.`);
}
for (const [file, pattern] of [
  ['src/features/products/components/ProductList/ProductList.module.css', /\.columns span \{[\s\S]*?color: var\(--olaso-text-service\)/],
  ['src/features/products/components/CategorySidebar/CategorySidebar.module.css', /\.category small \{[\s\S]*?color: var\(--olaso-text-service\)/],
  ['src/features/products/components/CategorySidebar/CategorySidebar.module.css', /\.sidebar p \{[\s\S]*?color: var\(--olaso-text-service\)/],
  ['src/features/products/components/ProductEditorPanel/ProductEditorPanel.module.css', /\.option small \{[\s\S]*?color: var\(--olaso-text-service\)/],
]) {
  assert.match(readFileSync(file, 'utf8'), pattern, `${file} must keep the corrected Products label contrast.`);
}
// PRODUCTS-ORANGE-01 (corrected): the owner rejected the orange selected category, so the
// approved action-orange pair is kept declared in the Products palette block but now only the
// Add product CTA consumes it. The selected category pill and its ink stay on the brand teal,
// exactly as before the rejected trial, and Add category stays teal.
assert.match(globalsCss, /\[data-products-palette\] \{[\s\S]*?--olaso-trial-action: #e06a00[\s\S]*?--olaso-trial-action-ink: #1c211b/);
const categorySidebar = readFileSync('src/features/products/components/CategorySidebar/CategorySidebar.module.css', 'utf8');
assert.match(categorySidebar, /\.indicator \{[\s\S]*?background: var\(--olaso-green\)/);
assert.match(categorySidebar, /\.uncategorizedActive \{[\s\S]*?background: var\(--olaso-green\)/);
assert.match(categorySidebar, /\.categoryActive \{[\s\S]*?color: var\(--olaso-white\)/);
assert.match(categorySidebar, /\.addCategory \{[\s\S]*?color: var\(--olaso-green\)/);
assert.doesNotMatch(categorySidebar, /--olaso-trial-action/);
const catalogPanel = readFileSync('src/features/products/components/ProductCatalogPanel/ProductCatalogPanel.module.css', 'utf8');
assert.match(catalogPanel, /\.addProduct \{[\s\S]*?color: var\(--olaso-trial-action-ink, var\(--olaso-white\)\)[\s\S]*?background: var\(--olaso-trial-action, var\(--olaso-green\)\)/);
console.log('Role-safe retained screens/categories, revision-aware reloads, saved snapshots, foreground clocks, and screen-owned transition palettes passed.');
