import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// CSS Modules only rewrite class names. A selector that starts with an element
// name stays global, so one lazily loaded screen chunk can restyle every other
// screen for the rest of the session.
function cssModules(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return cssModules(path);
    return entry.name.endsWith('.module.css') ? [path] : [];
  });
}

const leaks = [];
for (const path of cssModules('src')) {
  const source = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, block] of source.matchAll(/([^{}]+)\{/g)) {
    if (block.trimStart().startsWith('@')) continue;
    for (const selector of block.split(',')) {
      const leftmost = selector.trim().split(/[\s>+~]/)[0];
      const scoped = leftmost.includes('.') || leftmost.includes('#');
      if (/^[a-zA-Z]/.test(leftmost) && !scoped) leaks.push(`${path} -> ${selector.trim()}`);
    }
  }
}

assert.deepEqual(leaks, [], `Unscoped element selectors in CSS Modules:\n${leaks.join('\n')}`);

console.log('CSS Module scoping checks passed.');
