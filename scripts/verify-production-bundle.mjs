import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const url = process.env.VITE_CONVEX_URL;
if (!/^https:\/\/[a-z0-9.-]+\.convex\.cloud$/.test(url ?? '')) {
  throw new Error('Production build did not receive a valid Convex deployment URL.');
}

const assetDirectory = join(process.cwd(), 'dist', 'assets');
const bundles = readdirSync(assetDirectory)
  .filter((file) => file.endsWith('.js'))
  .map((file) => readFileSync(join(assetDirectory, file), 'utf8'));
if (!bundles.some((bundle) => bundle.includes(url))) {
  throw new Error('The packaged web bundle does not contain the production Convex URL.');
}

console.log('Production bundle endpoint verified before Android packaging.');
