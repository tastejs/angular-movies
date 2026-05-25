// Assemble the Cloudflare Pages worker folder from Angular build outputs.
import fs from 'node:fs';
import path from 'node:path';
import { resolvePath } from './paths.mjs';

const browserPath = resolvePath('dist/projects/movies/browser');
const serverBuildPath = resolvePath('dist/tmp/_worker-build/server');
const workerPath = resolvePath('dist/projects/movies/worker');

console.log(`Prepare worker at ${workerPath}`);

fs.rmSync(workerPath, { recursive: true, force: true });
fs.mkdirSync(workerPath, { recursive: true });

console.log(`Copy browser assets from ${browserPath}`);
fs.cpSync(browserPath, workerPath, { recursive: true });

console.log(`Copy server bundle from ${serverBuildPath}`);
fs.cpSync(serverBuildPath, workerPath, { recursive: true });

const serverEntry = path.resolve(workerPath, 'main.server.mjs');
const workerEntry = path.resolve(workerPath, 'index.js');

if (!fs.existsSync(serverEntry)) {
  throw new Error(`Expected server entry at ${serverEntry}`);
}

fs.renameSync(serverEntry, workerEntry);
console.log(`Renamed main.server.mjs to index.js`);

for (const manifestFile of [
  'angular-app-engine-manifest.mjs',
  'angular-app-manifest.mjs',
]) {
  const manifestPath = path.resolve(workerPath, manifestFile);
  if (fs.existsSync(manifestPath)) {
    const manifest = fs.readFileSync(manifestPath, 'utf8');
    fs.writeFileSync(
      manifestPath,
      manifest.replaceAll('./main.server.mjs', './index.js')
    );
    console.log(`Updated ${manifestFile} entry point`);
  }
}
