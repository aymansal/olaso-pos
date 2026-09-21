/**
 * Development-only Galaxy Tab A9 ADB + WebView CDP driver.
 * Never import into the React application or package in the APK.
 * Never log or print PIN values.
 *
 * Prefer one long-lived process (`smoke`) over chaining reconnecting CLI calls.
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const adbPath = process.env.ANDROID_ADB
  ?? 'D:/Olaso/tmp/android-toolchain/android-sdk/platform-tools/adb.exe';
const port = Number(process.env.OLASO_TABLET_CDP_PORT ?? 9238);
const packageName = 'com.olaso.pos';
const activity = `${packageName}/.MainActivity`;

const PROFILES = {
  owner: { env: 'OLASO_OWNER_PIN', name: 'Olaso Owner' },
  cashier: { env: 'OLASO_CASHIER_PIN', name: 'Samira Barista' },
};

async function adb(...args) {
  return (await execute(adbPath, args, { timeout: 45_000 })).stdout.trim();
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function pinFor(role) {
  const profile = PROFILES[role];
  assert(profile, `Unknown unlock role: ${role}`);
  const pin = process.env[profile.env];
  assert.match(
    pin ?? '',
    /^\d{6}$/,
    `${profile.env} must be a six-digit PIN (value never logged).`,
  );
  return { pin, profileName: profile.name };
}

function redactSecrets(text) {
  return String(text).replace(/\b\d{6}\b/g, '[redacted]');
}

function visibleButtonScript(label) {
  return `(()=>{const label=${JSON.stringify(label)};const node=[...document.querySelectorAll('button,[role="button"],a')].find(item=>{if(!item.getClientRects().length)return false;const text=item.innerText.replace(/\\s+/g,' ').trim();return text===label||text.includes(label)});return !!node})()`;
}

function clickLabelScript(label) {
  return `(()=>{const label=${JSON.stringify(label)};let node=null;try{node=document.querySelector(label)}catch{}if(!node){node=[...document.querySelectorAll('button,[role="button"],a')].find(item=>{if(!item.getClientRects().length)return false;const text=item.innerText.replace(/\\s+/g,' ').trim();return text===label||text.startsWith(label+'\\n')||text.includes('\\n'+label)})}if(!node)throw Error('Control not found: '+label);node.click();return true})()`;
}

class WebViewSession {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.consoleMessages = [];
    this.socket.addEventListener('message', ({ data }) => {
      const response = JSON.parse(data);
      if (response.method === 'Runtime.consoleAPICalled') {
        const args = (response.params?.args ?? [])
          .map((arg) => arg.value ?? arg.description ?? '')
          .join(' ');
        this.consoleMessages.push({
          type: response.params?.type ?? 'log',
          text: redactSecrets(args),
        });
        return;
      }
      if (response.method === 'Log.entryAdded') {
        const entry = response.params?.entry;
        this.consoleMessages.push({
          type: entry?.level ?? 'log',
          text: redactSecrets(entry?.text ?? ''),
        });
        return;
      }
      const waiting = this.pending.get(response.id);
      if (!waiting) return;
      this.pending.delete(response.id);
      if (response.error || response.result?.exceptionDetails) {
        const detail = response.result?.exceptionDetails?.exception?.description
          ?? response.result?.exceptionDetails?.text
          ?? response.error?.message
          ?? 'unknown';
        waiting.reject(
          new Error(`Tablet inspection failed: ${redactSecrets(String(detail).slice(0, 240))}`),
        );
      } else {
        waiting.resolve(response.result?.result?.value);
      }
    });
    this.socket.addEventListener('close', () => {
      for (const waiting of this.pending.values()) {
        waiting.reject(new Error('The tablet page closed during inspection.'));
      }
      this.pending.clear();
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Tablet CDP ${method} timed out.`));
      }, 15_000);
      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  static async connect({ timeoutMs = 30_000 } = {}) {
    const deadline = Date.now() + timeoutMs;
    let lastError;
    while (Date.now() < deadline) {
      try {
        const pid = await adb('shell', 'pidof', packageName);
        assert.match(pid, /^\d+$/, 'App process is not running.');
        await adb(
          'forward',
          `tcp:${port}`,
          `localabstract:webview_devtools_remote_${pid}`,
        );
        const targets = await (
          await fetch(`http://127.0.0.1:${port}/json/list`, {
            signal: AbortSignal.timeout(1_500),
          })
        ).json();
        const target = targets.find(({ type }) => type === 'page');
        if (!target?.webSocketDebuggerUrl) {
          throw new Error('WebView page target is not ready.');
        }
        const socket = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error('WebView debugger socket did not open.')),
            3_000,
          );
          socket.addEventListener(
            'open',
            () => {
              clearTimeout(timer);
              resolve();
            },
            { once: true },
          );
          socket.addEventListener(
            'error',
            () => {
              clearTimeout(timer);
              reject(new Error('WebView debugger socket failed.'));
            },
            { once: true },
          );
        });
        const session = new WebViewSession(socket);
        await session.send('Runtime.enable');
        await session.send('Log.enable');
        return session;
      } catch (error) {
        lastError = error;
        await sleep(120);
      }
    }
    throw lastError ?? new Error('The tablet app page is unavailable.');
  }

  evaluate(expression) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('Tablet evaluation timed out.'));
      }, 15_000);
      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      this.socket.send(
        JSON.stringify({
          id,
          method: 'Runtime.evaluate',
          params: {
            expression: `(async()=>(${expression}))()`,
            awaitPromise: true,
            returnByValue: true,
          },
        }),
      );
    });
  }

  async waitFor(expression, timeout = 25_000) {
    const deadline = performance.now() + timeout;
    let lastError;
    while (performance.now() < deadline) {
      try {
        const result = await this.evaluate(expression);
        if (result) return result;
      } catch (error) {
        lastError = error;
      }
      await sleep(80);
    }
    throw lastError ?? new Error('Expected tablet screen did not become ready.');
  }

  close() {
    try {
      this.socket.close();
    } catch {
      // ignore
    }
  }
}

async function wake() {
  await adb('shell', 'input', 'keyevent', 'KEYCODE_WAKEUP');
}

async function launchApp({ clearTask = false } = {}) {
  await wake();
  const args = ['shell', 'am', 'start', '-W'];
  if (clearTask) args.push('--activity-clear-task');
  args.push('-n', activity);
  await adb(...args);
}

async function restartApp() {
  await adb('shell', 'am', 'force-stop', packageName);
  await sleep(800);
  await launchApp();
}

async function connect() {
  await wake();
  return WebViewSession.connect();
}

async function unlock(role, existingSession) {
  const { pin, profileName } = pinFor(role);
  let session = existingSession;
  if (!session) {
    await launchApp();
    session = await WebViewSession.connect({ timeoutMs: 45_000 });
  }

  await session.waitFor(
    `(()=>document.querySelector('select')?.options.length>0&&document.querySelector('input[type="password"]')?true:false)()`,
    45_000,
  );
  await session.evaluate(
    `(()=>{const select=document.querySelector('select');const profile=[...select.options].find(option=>option.textContent.trim()===${JSON.stringify(profileName)});if(!profile)throw Error('Profile is unavailable');select.value=profile.value;select.dispatchEvent(new Event('change',{bubbles:true}));return true})()`,
  );
  await sleep(40);
  await session.evaluate(
    `(()=>{const input=document.querySelector('input[type="password"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(pin)});input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));return true})()`,
  );
  await sleep(40);
  await session.evaluate(
    `(()=>{const button=[...document.querySelectorAll('button')].find(item=>/Unlock|Déverrouiller/.test(item.innerText)&&!item.innerText.includes('/'));if(!button||button.disabled)throw Error('Unlock button missing');button.click();return true})()`,
  );
  await session.waitFor(
    `(()=>document.querySelector('main[aria-label="Olaso point of sale"],main[aria-label="Caisse Olaso"]')||document.querySelector('[data-olaso-nav="primary"]')?true:false)()`,
    45_000,
  );
  return session;
}

async function evaluate(expression, existingSession) {
  const session = existingSession ?? (await connect());
  try {
    return await session.evaluate(expression);
  } finally {
    if (!existingSession) session.close();
  }
}

async function click(labelOrSelector, existingSession) {
  const session = existingSession ?? (await connect());
  try {
    await session.waitFor(visibleButtonScript(labelOrSelector), 15_000);
    await session.evaluate(clickLabelScript(labelOrSelector));
  } finally {
    if (!existingSession) session.close();
  }
}

async function visibleMainText(session) {
  return session.evaluate(
    `(()=>{const main=[...document.querySelectorAll('main')].find(node=>node.getClientRects().length);if(main?.innerText)return main.innerText;const body=document.body;return body?.innerText??''})()`,
  );
}

async function viewport(session) {
  return session.evaluate(`(()=>({width:innerWidth,height:innerHeight}))()`);
}

async function dump(existingSession) {
  const session = existingSession ?? (await connect());
  try {
    const size = await viewport(session);
    const mainText = redactSecrets(await visibleMainText(session));
    let logcat = '';
    try {
      logcat = redactSecrets(
        await adb(
          'logcat',
          '-d',
          '-t',
          '120',
          '-s',
          'chromium:V',
          'Console:V',
          'Capacitor:V',
          'Capacitor/Console:V',
          'olaso:V',
        ),
      );
    } catch {
      logcat = '(logcat unavailable)';
    }
    return {
      viewport: size,
      mainText,
      consoleMessages: session.consoleMessages.slice(-50),
      logcat,
    };
  } finally {
    if (!existingSession) session.close();
  }
}

async function smoke() {
  const report = {
    steps: [],
    ok: false,
  };

  const step = async (name, work) => {
    const started = performance.now();
    process.stderr.write(`tablet: ${name}…\n`);
    await work();
    report.steps.push({
      name,
      ms: Math.round(performance.now() - started),
    });
    process.stderr.write(`tablet: ${name} ok (${report.steps.at(-1).ms} ms)\n`);
  };

  await step('restart', restartApp);

  let session;
  await step('unlock-owner', async () => {
    session = await unlock('owner');
  });

  await step('viewport-1340x800', async () => {
    const size = await viewport(session);
    assert.equal(size.width, 1340, `Expected width 1340, got ${size.width}`);
    assert.equal(size.height, 800, `Expected height 800, got ${size.height}`);
    report.viewport = size;
  });

  await step('open-products', async () => {
    await click('Products', session);
    await session.waitFor(
      `(()=>/Manage the menu/.test(document.body.innerText)?true:false)()`,
      20_000,
    );
  });

  await step('return-pos', async () => {
    await click('POS', session);
    await session.waitFor(
      `(()=>document.querySelector('main[aria-label="Olaso point of sale"]')?true:false)()`,
      20_000,
    );
  });

  session.close();
  session = undefined;

  await step('restart-again', restartApp);

  await step('unlock-cashier', async () => {
    session = await unlock('cashier');
  });

  await step('cashier-cannot-open-settings', async () => {
    const text = await visibleMainText(session);
    assert(
      !/Settings|Staff & access|Printer & hardware/i.test(text)
      || /Lock|Switch staff/i.test(text),
      'Cashier unlock left unexpected management text visible.',
    );
    const productsVisible = await session.evaluate(visibleButtonScript('Products'));
    assert.equal(
      productsVisible,
      false,
      'Cashier can see Products navigation and must not.',
    );
    report.cashierNav = redactSecrets(text).split('\n').slice(0, 20);
  });

  await step('dump', async () => {
    report.dump = await dump(session);
  });

  session.close();
  report.ok = true;
  console.log(JSON.stringify(report, null, 2));
}

async function main(argv) {
  const [command, ...rest] = argv;
  assert(
    command,
    'Usage: node scripts/tablet-session.mjs <connect|unlock|click|text|dump|smoke|restart> …',
  );

  if (command === 'restart') {
    await restartApp();
    console.log(JSON.stringify({ ok: true, command: 'restart' }));
    return;
  }

  if (command === 'smoke') {
    await smoke();
    return;
  }

  if (command === 'connect') {
    const session = await connect();
    const size = await viewport(session);
    session.close();
    console.log(JSON.stringify({ ok: true, viewport: size }));
    return;
  }

  if (command === 'unlock') {
    const role = rest[0];
    assert(role === 'owner' || role === 'cashier', 'unlock requires owner or cashier');
    const session = await unlock(role);
    const size = await viewport(session);
    session.close();
    console.log(JSON.stringify({ ok: true, role, viewport: size }));
    return;
  }

  if (command === 'click') {
    const label = rest.join(' ').trim();
    assert(label, 'click requires a visible label or CSS selector');
    await click(label);
    console.log(JSON.stringify({ ok: true, selector: label }));
    return;
  }

  if (command === 'text') {
    const session = await connect();
    const text = redactSecrets(await visibleMainText(session));
    session.close();
    console.log(text);
    return;
  }

  if (command === 'dump') {
    const report = await dump();
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

export {
  WebViewSession,
  adb,
  click,
  connect,
  dump,
  evaluate,
  launchApp,
  restartApp,
  sleep,
  smoke,
  unlock,
};

const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : 'Tablet session failed.');
    process.exitCode = 1;
  });
}
