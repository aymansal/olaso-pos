import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(
  new URL('../node_modules/sql.js/dist/sql-wasm.wasm', import.meta.url),
);
const targetDirectory = fileURLToPath(
  new URL('../public/assets/', import.meta.url),
);
const target = fileURLToPath(
  new URL('../public/assets/sql-wasm.wasm', import.meta.url),
);

mkdirSync(targetDirectory, { recursive: true });
copyFileSync(source, target);
