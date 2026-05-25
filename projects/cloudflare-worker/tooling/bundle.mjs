import fs from 'node:fs/promises';
import path from 'node:path';
import { resolvePath } from './paths.mjs';
import * as esbuild from 'esbuild';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import fg from 'fast-glob';
import { setupArgv } from './utils.mjs';

const target = resolvePath(
  setupArgv('target', { success: (v) => `Build folder ${v}` })
);

for (const entry of await fg('**/*.{js,mjs}', { cwd: target, onlyFiles: true })) {
  if (entry === 'index.js') {
    await bundleMain();
  } else if (entry.endsWith('.mjs') && entry !== 'index.js') {
    await bundleLazyModule(entry);
  }
}

async function bundleMain() {
  const result = await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    format: 'iife',
    write: false,
    absWorkingDir: target,
    define: {
      global: 'globalThis',
    },
    plugins: [
      NodeGlobalsPolyfillPlugin({ buffer: true }),
      NodeModulesPolyfillPlugin(),
    ],
  });

  let main = result.outputFiles[0].text;
  main += '\nexport default { fetch : globalThis.__workerFetchHandler };';

  await fs.writeFile(path.resolve(target, 'index.js'), main);
}

async function bundleLazyModule(filePath) {
  const result = await esbuild.build({
    entryPoints: [filePath],
    bundle: true,
    format: 'esm',
    write: false,
    absWorkingDir: target,
    define: {
      global: 'globalThis',
    },
    plugins: [NodeModulesPolyfillPlugin()],
  });

  await fs.writeFile(path.resolve(target, filePath), result.outputFiles[0].text);
}
