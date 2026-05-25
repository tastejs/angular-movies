import * as fs from 'fs';

// @ts-ignore
export type Formats = 'json' | 'string';
export function readFile(path: string, format: Formats = 'json') {
  if (!fs.existsSync(path)) {
    throw new Error(`the path ${path} has to point to a stats.json fine`);
  }
  const raw = fs.readFileSync(path) as any as string;
  if (format === 'string') {
    return raw.toString();
  }
  return JSON.parse(raw);
}

export interface StatsAsset {
  name: string;
  size: number;
  entryPoint?: string;
}

export function getStatsAssets(stats: {
  assets?: Array<{ name: string; size: number }>;
  outputs?: Record<string, { bytes: number; entryPoint?: string }>;
}): StatsAsset[] {
  if (stats.assets) {
    return stats.assets.map(({ name, size }) => ({ name, size }));
  }

  if (stats.outputs) {
    return Object.entries(stats.outputs).map(([name, output]) => ({
      name,
      size: output.bytes,
      entryPoint: output.entryPoint,
    }));
  }

  throw new Error('Unsupported stats format: expected "assets" or "outputs"');
}

function isBrowserBundle(name: string): boolean {
  return (
    (name.endsWith('.js') || name.endsWith('.css')) && !name.endsWith('.mjs')
  );
}

function isMainEntry(entryPoint?: string): boolean {
  return !!entryPoint?.endsWith('/main.ts');
}

export function isInitialAsset(asset: StatsAsset): boolean {
  const { name, entryPoint } = asset;

  if (!isBrowserBundle(name) || entryPoint?.includes('.component.')) {
    return false;
  }

  if (entryPoint && !isMainEntry(entryPoint)) {
    return false;
  }

  return /^(?:main-|styles-|chunk-|runtime|polyfills)/.test(name);
}

export function isLazyAsset(asset: StatsAsset): boolean {
  const { name, entryPoint } = asset;

  if (!name.endsWith('.js') || name.endsWith('.mjs')) {
    return false;
  }

  if (entryPoint && !isMainEntry(entryPoint)) {
    return true;
  }

  return /\.(?:component|routes)-.*\.js$/.test(name);
}

export function formatChunkName(name: string, entryPoint?: string): string {
  if (entryPoint) {
    const fileName = entryPoint.split('/').pop() ?? entryPoint;
    return fileName.replace(/\.(ts|tsx)$/, '');
  }

  const legacyName = name.split('src_')?.pop()?.split('_module_ts.')?.shift();
  if (legacyName && legacyName !== name) {
    return legacyName;
  }

  return name.replace(/-[A-Z0-9]{8,}\.(js|css|mjs)$/, '.$1');
}

export function formatBytes(a: number, b = 2, k = 1024) {
  // @ts-ignore

  let d = Math.floor(Math.log(a) / Math.log(k));
  return 0 == a
    ? '0 Bytes'
    : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) +
        ' ' +
        ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d];
}
