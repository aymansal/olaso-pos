import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const body = app.slice(app.indexOf('  async function lock()'), app.indexOf('  async function applyLanguage'));
assert(body.includes('async function lock()'));

for (const fails of [false, true]) {
  let resolveWrite, rejectWrite;
  const pendingWrite = new Promise((resolve, reject) => { resolveWrite = resolve; rejectWrite = reject; });
  let terminal = { isLocked: false };
  let session = { name: 'Owner' };
  let resets = 0;
  let recovery;
  const dependencies = {
    setTerminalLocked: (value) => { assert.equal(value, true); return pendingWrite; },
    resetScreens: () => { resets++; },
    setTerminal: (update) => { terminal = update(terminal); },
    setStaffSession: (value) => { session = value; },
    setStartupError: (value) => { recovery = value; },
    translate: (_language, text) => text, language: 'en',
    loadTerminalSettings: () => { throw Error('Lock must not reload stale settings'); },
  };
  const lock = new Function(...Object.keys(dependencies), `${body};return lock;`)(...Object.values(dependencies));
  const result = lock();
  assert.equal(terminal.isLocked, true, 'Lock must hide screens while database work remains blocked');
  assert.equal(session, undefined, 'Authenticated session must be removed immediately');
  assert.equal(resets, 1);
  if (fails) {
    rejectWrite(Error('Simulated storage failure'));
    await result;
    assert.equal(terminal.isLocked, true);
    assert.match(recovery, /POS remains locked/);
  } else {
    // A slow old completion must never replace newer session/settings state.
    terminal = { isLocked: false }; session = { name: 'Next staff' };
    resolveWrite(); await result;
    assert.equal(terminal.isLocked, false);
    assert.equal(session.name, 'Next staff');
    assert.equal(recovery, undefined);
  }
}
assert.match(app, /await setTerminalLocked\(true\);[\s\S]*?setTerminal\(\{ \.\.\.restored, isLocked: true \}\)/);
console.log('Immediate lock passed: blocked persistence, cleared access, fail-closed error and no stale completion overwrite.');

const reconnect = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const caughtBody = reconnect.slice(reconnect.indexOf('    } catch (caught) {') + '    } catch (caught) {'.length, reconnect.indexOf('\n    }\n  }, [acceptMutation'));
for (const [cancelled, message, expectedRecorded] of [
  [true, 'Snapshot loading was cancelled.', 0],
  [false, 'Snapshot loading was cancelled.', 1],
  [true, 'Actual storage failure', 1],
]) {
  let recorded = 0;
  const args = { isCancelled: () => cancelled, CONNECTION_SYNC_FAILURE: 'Connection unavailable',
    console: { error: () => {} }, recordSyncFailure: async () => { recorded++; return 'Saved failure'; },
    setRevision: () => {}, onSessionUnavailable: async () => {} };
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const handle = new AsyncFunction('caught', ...Object.keys(args), caughtBody);
  await assert.rejects(handle(Error(message), ...Object.values(args)), expectedRecorded ? /Saved failure/ : /Connection unavailable/);
  assert.equal(recorded, expectedRecorded);
}
console.log('Expected lock cancellation does not persist a false sync error; genuine failures still do.');
