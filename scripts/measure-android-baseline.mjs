import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const adbPath = process.env.ANDROID_ADB
  ?? 'D:/Olaso/tmp/android-toolchain/android-sdk/platform-tools/adb.exe';
const ownerPin = process.env.OLASO_BENCHMARK_PIN;
const runCount = Number(process.env.OLASO_BENCHMARK_RUNS ?? 5);
const port = 9237;
const packageName = 'com.olaso.pos';
const screens = ['Dashboard', 'POS', 'Orders', 'Products', 'Stock', 'Reports'];

assert.match(ownerPin ?? '', /^\d{6}$/, 'Set OLASO_BENCHMARK_PIN without saving or printing it.');
assert(Number.isSafeInteger(runCount) && runCount > 0 && runCount <= 10);

async function adb(...args) {
  return (await execute(adbPath, args, { timeout: 30_000 })).stdout.trim();
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function summarize(values) {
  assert(values.every(Number.isFinite), 'A measurement is missing or invalid.');
  const sorted = [...values].sort((first, second) => first - second);
  return {
    minimumMs: Math.round(sorted[0]),
    medianMs: Math.round(sorted[Math.floor(sorted.length / 2)]),
    maximumMs: Math.round(sorted.at(-1)),
    samples: values.map((value) => Math.round(value)),
  };
}

class WebViewSession {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.socket.addEventListener('message', ({ data }) => {
      const response = JSON.parse(data);
      const waiting = this.pending.get(response.id);
      if (!waiting) return;
      this.pending.delete(response.id);
      if (response.error || response.result?.exceptionDetails) {
        waiting.reject(new Error('Tablet inspection failed without exposing application data.'));
      } else {
        waiting.resolve(response.result?.result?.value);
      }
    });
    this.socket.addEventListener('close', () => {
      for (const waiting of this.pending.values()) {
        waiting.reject(new Error('The tablet page closed during measurement.'));
      }
      this.pending.clear();
    });
  }

  static async connect() {
    const deadline = Date.now() + 15_000;
    let lastError;
    while (Date.now() < deadline) {
      try {
        const pid = await adb('shell', 'pidof', packageName);
        assert.match(pid, /^\d+$/);
        await adb('forward', `tcp:${port}`, `localabstract:webview_devtools_remote_${pid}`);
        const targets = await (await fetch(`http://127.0.0.1:${port}/json`, {
          signal: AbortSignal.timeout(1_000),
        })).json();
        const target = targets.find(({ type }) => type === 'page');
        if (!target) throw new Error('The app page is not ready.');
        const socket = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('The app page did not open.')), 2_000);
          socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
          socket.addEventListener('error', () => { clearTimeout(timer); reject(new Error('The app page could not be inspected.')); }, { once: true });
        });
        return new WebViewSession(socket);
      } catch (error) {
        lastError = error;
        await sleep(80);
      }
    }
    throw lastError ?? new Error('The tablet app page is unavailable.');
  }

  evaluate(expression) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('Tablet measurement timed out.'));
      }, 12_000);
      this.pending.set(id, {
        resolve: (value) => { clearTimeout(timer); resolve(value); },
        reject: (error) => { clearTimeout(timer); reject(error); },
      });
      this.socket.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: {
          expression: `(async()=>(${expression}))()`,
          awaitPromise: true,
          returnByValue: true,
        },
      }));
    });
  }

  async waitFor(expression, timeout = 15_000) {
    const deadline = performance.now() + timeout;
    while (performance.now() < deadline) {
      const result = await this.evaluate(expression);
      if (result) return result;
      await sleep(40);
    }
    throw new Error('Expected tablet screen did not become ready.');
  }

  close() {
    this.socket.close();
  }
}

const installObserver = `(()=>{
  if(window.__olasoBaseline)return true;
  const record=window.__olasoBaseline={attachedAt:performance.now(),stages:[],calls:[],imagesAdded:0,imagesRemoved:0,longTasks:[]};
  const mark=name=>{if(!record.stages.some(stage=>stage.name===name))record.stages.push({name,at:Math.round(performance.now())})};
  const inspect=()=>{
    const text=document.body?.innerText??'';
    if(text.includes('Preparing the offline workspace'))mark('sqlite-opening');
    if(text.includes('Checking terminal access'))mark('sqlite-ready');
    if(document.querySelector('input[type="password"]'))mark('lock-screen');
    if(document.querySelector('select')?.options.length)mark('lock-profiles-ready');
    if(document.querySelector('main[aria-label="Olaso point of sale"]')){
      mark('pos-shell');
      if(document.querySelector('[aria-label^="Add "]'))mark('cached-menu-ready');
    }
  };
  new MutationObserver(records=>{
    for(const change of records){
      for(const node of change.addedNodes)if(node.nodeType===1)record.imagesAdded+=(node.matches?.('img')?1:0)+(node.querySelectorAll?.('img').length??0);
      for(const node of change.removedNodes)if(node.nodeType===1)record.imagesRemoved+=(node.matches?.('img')?1:0)+(node.querySelectorAll?.('img').length??0);
    }
    inspect();
  }).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  try{new PerformanceObserver(list=>record.longTasks.push(...list.getEntries().map(entry=>Math.round(entry.duration)))).observe({type:'longtask',buffered:true})}catch{}
  const bridge=window.Capacitor;
  if(bridge){
    const original=bridge.toNative;
    bridge.toNative=function(plugin,name,...args){
      if(plugin==='CapacitorSQLite')record.calls.push({name,at:Math.round(performance.now())});
      return original.apply(this,[plugin,name,...args]);
    };
  }
  inspect();
  return true;
})()`;

const snapshot = `(()=>({
  now:Math.round(performance.now()),
  viewport:[innerWidth,innerHeight],
  online:navigator.onLine,
  active:document.querySelector('[aria-current="page"]')?.textContent.trim()??null,
  navigation:performance.getEntriesByType('navigation').map(entry=>({domInteractive:Math.round(entry.domInteractive),contentLoaded:Math.round(entry.domContentLoadedEventEnd),loadEnd:Math.round(entry.loadEventEnd)}))[0]??null,
  paint:performance.getEntriesByType('paint').map(entry=>({name:entry.name,at:Math.round(entry.startTime)})),
  resources:performance.getEntriesByType('resource').map(entry=>({name:entry.name.split('/').pop(),type:entry.initiatorType,duration:Math.round(entry.duration)})),
  images:[...document.images].map(image=>({name:image.currentSrc.split('/').pop(),natural:[image.naturalWidth,image.naturalHeight],display:[Math.round(image.getBoundingClientRect().width),Math.round(image.getBoundingClientRect().height)],complete:image.complete})),
  stages:window.__olasoBaseline?.stages??[],
  sqliteCalls:window.__olasoBaseline?.calls??[],
  imagesAdded:window.__olasoBaseline?.imagesAdded??0,
  imagesRemoved:window.__olasoBaseline?.imagesRemoved??0,
  longTasks:window.__olasoBaseline?.longTasks??[]
}))()`;

async function unlockOwner(session) {
  await session.waitFor(`(()=>document.querySelector('select')?.options.length&&document.querySelector('input[type="password"]')?true:false)()`);
  await session.evaluate(`(()=>{const select=document.querySelector('select');const owner=[...select.options].find(option=>option.textContent.trim()==='Olaso Owner');if(!owner)throw Error('Owner profile is unavailable');select.value=owner.value;select.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
  await sleep(25);
  await session.evaluate(`(()=>{const input=document.querySelector('input[type="password"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(ownerPin)});input.dispatchEvent(new Event('input',{bubbles:true}));return true})()`);
  await sleep(25);
  const started = performance.now();
  await session.evaluate(`(()=>{const button=[...document.querySelectorAll('button')].find(item=>item.innerText.includes('Unlock POS'));if(!button)throw Error('Unlock button missing');button.click();return true})()`);
  await session.waitFor(`(()=>document.querySelector('main[aria-label="Olaso point of sale"]')&&document.querySelector('[aria-label^="Add "]')?true:false)()`, 20_000);
  return Math.round(performance.now() - started);
}

async function measureLaunch(kind, iteration) {
  if (kind === 'cold') await adb('shell', 'am', 'force-stop', packageName);
  const started = performance.now();
  const launch = await adb('shell', 'am', 'start', '-W',
    ...(kind === 'warm' ? ['--activity-clear-task'] : []),
    '-n', `${packageName}/.MainActivity`);
  const launchState = /LaunchState:\s*([^\r\n]+)/.exec(launch)?.[1]?.trim();
  const activityTime = Number(/TotalTime:\s*(\d+)/.exec(launch)?.[1]);
  assert.equal(launchState, kind.toUpperCase(), `Android reported ${launchState}, not ${kind}.`);
  assert(Number.isFinite(activityTime));

  const session = await WebViewSession.connect();
  await session.evaluate(installObserver);
  await session.waitFor(`(()=>document.querySelector('select')?.options.length&&document.querySelector('input[type="password"]')?true:false)()`);
  const lockReady = Math.round(performance.now() - started);
  const beforeUnlock = await session.evaluate(snapshot);
  const unlockToMenu = await unlockOwner(session);
  const afterUnlock = await session.evaluate(snapshot);
  const result = {
    iteration,
    state: launchState,
    androidDisplayMs: activityTime,
    lockReadyMs: lockReady,
    unlockToCachedMenuMs: unlockToMenu,
    beforeUnlock,
    afterUnlock,
  };
  console.error(`${kind} ${iteration}/${runCount}: Android ${activityTime} ms, lock ${lockReady} ms, menu after PIN ${unlockToMenu} ms`);
  return { session, result };
}

async function measureNavigation(session) {
  const measurements = [];
  for (let iteration = 1; iteration <= runCount; iteration += 1) {
    for (const screen of screens) {
      const before = await session.evaluate(snapshot);
      if (before.active === screen) continue;
      const started = performance.now();
      await session.evaluate(`(()=>{const button=[...document.querySelectorAll('nav[aria-label="Primary navigation"] button')].find(item=>item.innerText.trim()===${JSON.stringify(screen)});if(!button)throw Error('Navigation is unavailable');button.click();return true})()`);
      await session.waitFor(`(()=>{const active=document.querySelector('[aria-current="page"]')?.textContent.trim();if(active!==${JSON.stringify(screen)})return false;const text=document.querySelector('main')?.innerText??'';return /Loading (?:the saved menu|saved costs|products|ingredients|orders|report|dashboard)/i.test(text)?false:true})()`);
      await sleep(80);
      const after = await session.evaluate(snapshot);
      measurements.push({
        iteration,
        screen,
        readyMs: Math.round(performance.now() - started),
        sqliteCalls: after.sqliteCalls.length - before.sqliteCalls.length,
        imagesAdded: after.imagesAdded - before.imagesAdded,
        imagesRemoved: after.imagesRemoved - before.imagesRemoved,
        resourceRequests: after.resources.length - before.resources.length,
        images: after.images,
      });
    }
    console.error(`navigation round ${iteration}/${runCount} completed`);
  }
  return measurements;
}

async function packageAssets() {
  const directory = 'dist/assets';
  const entries = await Promise.all((await readdir(directory)).map(async (name) => ({
    name,
    bytes: (await stat(`${directory}/${name}`)).size,
  })));
  return {
    apkBytes: (await stat('android/app/build/outputs/apk/debug/app-debug.apk')).size,
    files: entries.sort((first, second) => second.bytes - first.bytes),
  };
}

await adb('shell', 'input', 'keyevent', 'KEYCODE_WAKEUP');
await adb('shell', 'input', 'keyevent', '82');

const environment = {
  serial: (await adb('get-serialno')),
  model: (await adb('shell', 'getprop', 'ro.product.model')),
  android: (await adb('shell', 'getprop', 'ro.build.version.release')),
  api: Number(await adb('shell', 'getprop', 'ro.build.version.sdk')),
  webView: /Current WebView package \(name, version\): \(([^)]+)\)/
    .exec(await adb('shell', 'dumpsys', 'webviewupdate'))?.[1],
  debugBuild: true,
};

const cold = [];
const warm = [];
let active;
try {
  for (let index = 1; index <= runCount; index += 1) {
    active?.close();
    const measured = await measureLaunch('cold', index);
    active = measured.session;
    cold.push(measured.result);
  }
  for (let index = 1; index <= runCount; index += 1) {
    active?.close();
    const measured = await measureLaunch('warm', index);
    active = measured.session;
    warm.push(measured.result);
  }

  const navigation = await measureNavigation(active);
  const result = {
    measuredAt: new Date().toISOString(),
    environment,
    launch: {
      cold,
      warm,
      summary: {
        coldAndroidDisplay: summarize(cold.map(({ androidDisplayMs }) => androidDisplayMs)),
        coldLockReady: summarize(cold.map(({ lockReadyMs }) => lockReadyMs)),
        coldUnlockToMenu: summarize(cold.map(({ unlockToCachedMenuMs }) => unlockToCachedMenuMs)),
        warmAndroidDisplay: summarize(warm.map(({ androidDisplayMs }) => androidDisplayMs)),
        warmLockReady: summarize(warm.map(({ lockReadyMs }) => lockReadyMs)),
        warmUnlockToMenu: summarize(warm.map(({ unlockToCachedMenuMs }) => unlockToCachedMenuMs)),
      },
    },
    navigation: {
      samples: navigation,
      summary: Object.fromEntries(screens.map((screen) => {
        const selected = navigation.filter((sample) => sample.screen === screen);
        return [screen, {
          timing: summarize(selected.map(({ readyMs }) => readyMs)),
          sqliteCalls: selected.map(({ sqliteCalls }) => sqliteCalls),
          imagesAdded: selected.map(({ imagesAdded }) => imagesAdded),
          imagesRemoved: selected.map(({ imagesRemoved }) => imagesRemoved),
          resources: selected.map(({ resourceRequests }) => resourceRequests),
        }];
      })),
    },
    assets: await packageAssets(),
    finalScreen: await active.evaluate(snapshot),
  };
  assert.deepEqual(result.finalScreen.viewport, [1340, 800]);
  assert.equal(cold.length, runCount);
  assert.equal(warm.length, runCount);
  console.log(JSON.stringify(result, null, 2));
} finally {
  active?.close();
}
