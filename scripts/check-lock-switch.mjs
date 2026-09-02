import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  addProduct,
  createInitialPosSession,
  hasUnfinishedCart,
} from '../src/features/pos/posSession.ts';

const empty = createInitialPosSession();
assert.equal(hasUnfinishedCart(empty), false);
assert.equal(hasUnfinishedCart({
  ...empty,
  cart: addProduct(empty.cart, 'espresso', 'espresso-reg'),
}), true);

const app = readFileSync('src/App.tsx', 'utf8');
const header = readFileSync(
  'src/features/pos/components/Header/Header.tsx',
  'utf8',
);
const profile = readFileSync(
  'src/features/pos/components/ProfileControl/ProfileControl.tsx',
  'utf8',
);
const settings = readFileSync(
  'src/features/settings/SettingsScreen.tsx',
  'utf8',
);
const switchFlow = app.match(
  /async function requestStaffSwitch\(\)[\s\S]*?if \(startupError/,
)?.[0] ?? '';

assert.match(switchFlow, /hasUnfinishedCart\(posSession\)/);
assert.match(switchFlow, /The current order will stay for the next staff member/);
assert.match(switchFlow, /await lock\(\)/);
assert.doesNotMatch(switchFlow, /setPosSession/);
assert.match(header, /<ProfileControl/);
assert.match(header, /Boolean\(onOpenSettings\)/);
assert.match(profile, /canOpenSettings \? \(/);
assert.match(profile, /Lock \/ switch staff/);
assert.match(profile, /await onSwitchStaff\(\)/);
assert.match(app, /<Header[\s\S]*?onSwitchStaff=\{requestStaffSwitch\}/);
assert.match(app, /onOpenSettings=\{activeScreen === 'Settings' \? undefined : openSettings\}/);
assert.match(app, /onPreferencesChange=\{updatePreferences\}/);
assert.match(settings, /onPreferencesChange\(input\)/);
assert.doesNotMatch(settings, /onLock=/);
assert.doesNotMatch(settings, /Lock application/);
assert.doesNotMatch(settings, /onOpenSettings=/);
assert.doesNotMatch(settings, /<Header/);

console.log('Role-safe lock, cart preservation, and shared profile-control checks passed.');
