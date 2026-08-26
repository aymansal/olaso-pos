/**
 * Development-only: recreate Samira Barista with OLASO_CASHIER_PIN.
 * Never logs the PIN.
 */
import assert from 'node:assert/strict';
import {
  click,
  connect,
  sleep,
  unlock,
} from './tablet-session.mjs';

const cashierPin = process.env.OLASO_CASHIER_PIN;
assert.match(cashierPin ?? '', /^\d{6}$/, 'OLASO_CASHIER_PIN must be set');

function setInput(label, value) {
  return `(()=>{const label=${JSON.stringify(label)};const field=[...document.querySelectorAll('label')].find(node=>node.querySelector('span')?.textContent.trim()===label)?.querySelector('input,select');if(!field)throw Error('Missing '+label);if(field.tagName==='SELECT'){field.value=${JSON.stringify(value)};field.dispatchEvent(new Event('change',{bubbles:true}));}else{const proto=field instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(field,${JSON.stringify(value)});field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));}return field.value})()`;
}

async function openStaffAccess(session) {
  await session.evaluate(
    `(()=>{const button=document.querySelector('button[aria-label="Open staff menu"]');if(!button)throw Error('Staff menu missing');button.click();return true})()`,
  );
  await sleep(300);
  await click('Settings', session);
  await session.waitFor(
    `(()=>/Staff & access/.test(document.body.innerText)?true:false)()`,
    20_000,
  );
  await click('Staff & access', session);
  await session.waitFor(
    `(()=>/Add staff/.test(document.body.innerText)?true:false)()`,
    15_000,
  );
}

const session = await unlock('owner');
await session.evaluate('(()=>{window.confirm=()=>true;return true})()');
await openStaffAccess(session);

const staffBefore = await session.evaluate(
  `(()=>[...document.querySelectorAll('article')].map(a=>a.innerText.replace(/\\s+/g,' ').trim()))()`,
);
process.stderr.write(`tablet: staff before ${JSON.stringify(staffBefore)}\n`);

const hasSamira = staffBefore.some((row) => /Samira Barista/.test(row));
if (hasSamira) {
  await session.evaluate(`(()=>{
    const article=[...document.querySelectorAll('article')].find(item=>/Samira Barista/.test(item.innerText));
    const button=[...article.querySelectorAll('button')].find(item=>item.innerText.trim()==='Delete');
    button.click();
    return true;
  })()`);
  await sleep(1200);
  process.stderr.write('tablet: deleted existing Samira\n');
}

await click('Add staff', session);
await session.waitFor(
  `(()=>document.getElementById('staff-dialog-title')?true:false)()`,
  10_000,
);

const filled = {
  name: await session.evaluate(setInput('Name', 'Samira Barista')),
  role: await session.evaluate(setInput('Role', 'cashier')),
  pin: await session.evaluate(setInput('Six-digit PIN', cashierPin)),
  confirm: await session.evaluate(setInput('Confirm PIN', cashierPin)),
};
process.stderr.write(
  `tablet: form name=${filled.name} role=${filled.role} pinLen=${String(filled.pin).length} confirmLen=${String(filled.confirm).length}\n`,
);

const submitState = await session.evaluate(`(()=>{
  const dialog=document.querySelector('[role="dialog"]');
  if(!dialog)return {found:false,disabled:null,text:null};
  const button=[...dialog.querySelectorAll('button')].find(item=>item.innerText.trim()==='Add staff');
  return {found:!!button,disabled:button?.disabled??null,text:button?.innerText??null};
})()`);
process.stderr.write(`tablet: submit ${JSON.stringify(submitState)}\n`);
assert.equal(submitState.found, true, 'Dialog Add staff button missing');
assert.equal(submitState.disabled, false, 'Add staff submit stayed disabled');

await session.evaluate(`(()=>{
  const dialog=document.querySelector('[role="dialog"]');
  const button=[...dialog.querySelectorAll('button')].find(item=>item.innerText.trim()==='Add staff'&&!item.disabled);
  if(!button)throw Error('Dialog Add staff submit missing');
  button.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
  return true;
})()`);

for (let attempt = 0; attempt < 40; attempt += 1) {
  await sleep(250);
  const after = await session.evaluate(`(()=>({
    dialog:!!document.getElementById('staff-dialog-title'),
    alert:document.querySelector('[role="alert"]')?.innerText??null,
    status:document.querySelector('[role="status"]')?.innerText??null,
    staff:[...document.querySelectorAll('article')].map(a=>a.innerText.replace(/\\s+/g,' ').trim()),
  }))()`);
  if (!after.dialog && after.staff.some((row) => /Samira Barista/.test(row))) {
    process.stderr.write(`tablet: after add ${JSON.stringify(after)}\n`);
    break;
  }
  if (after.alert) {
    throw new Error(after.alert);
  }
  if (attempt === 39) {
    process.stderr.write(`tablet: after add stuck ${JSON.stringify(after)}\n`);
    throw new Error(after.alert ?? 'Add staff dialog stayed open');
  }
}

await session.evaluate(
  `(()=>{const button=document.querySelector('button[aria-label="Open staff menu"]');button.click();return true})()`,
);
await sleep(300);
await click('Lock / switch staff', session);
await session.waitFor(
  `(()=>document.querySelector('input[type="password"]')?true:false)()`,
  20_000,
);
session.close();

const cashier = await unlock('cashier');
const productsVisible = await cashier.evaluate(
  `(()=>[...document.querySelectorAll('button')].some(item=>item.getClientRects().length&&item.innerText.trim()==='Products'))()`,
);
assert.equal(productsVisible, false, 'Cashier must not see Products');
const preview = await cashier.evaluate(
  `(()=>(document.body.innerText||'').split('\\n').slice(0,15))()`,
);
cashier.close();
console.log(JSON.stringify({ ok: true, cashierUnlocked: true, productsVisible, preview }, null, 2));
