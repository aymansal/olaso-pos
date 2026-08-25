import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Activity, version } from 'react';
import { hasPermission } from '../convex/lib/permissions.ts';

assert.match(version, /^19\./);
assert.equal(typeof Activity, 'symbol');

const app = readFileSync('src/App.tsx', 'utf8');
assert.match(app, /const \[visitedScreens, setVisitedScreens\] = useState<AppScreen\[]>\(\['POS'\]\)/);
assert.match(app, /visitedScreens\.map\(\(visited\) =>[\s\S]*?!hasPermission\(staffSession\.role, screenPermission\[visited\]\)/);
assert.match(app, /<Activity[\s\S]*?mode=\{visited === activeScreen \? 'visible' : 'hidden'\}/);
assert.match(app, /async function lock\(\)[\s\S]*?setVisitedScreens\(\['POS'\]\)[\s\S]*?setStaffSession\(undefined\)/);
assert.match(app, /async function unlock\(session: StaffSession\)[\s\S]*?setVisitedScreens\(\['POS'\]\)/);
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
assert.doesNotMatch(reports, /setSnapshot\(undefined\)/);
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

console.log('Role-safe retained screens/categories, revision-aware reloads, saved snapshots, and foreground clocks passed.');
