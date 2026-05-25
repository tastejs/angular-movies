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

function isMainEntry(entryPoint?: string): boolean {
  return !!entryPoint?.endsWith('/main.ts');
}

function isLazyEntry(name: string): boolean {
  return /\.(?:component|routes)-.*\.js$/.test(name);
}

function collectInitialAssets(
  outputs: Record<
    string,
    { bytes: number; entryPoint?: string; imports?: Array<{ path: string }> }
  >
): StatsAsset[] {
  const main = Object.keys(outputs).find((name) => /^main-.*\.js$/.test(name));
  if (!main) {
    return [];
  }

  const seen = new Set<string>();
  const visit = (name: string) => {
    if (seen.has(name) || !outputs[name] || isLazyEntry(name)) {
      return;
    }

    seen.add(name);

    for (const imp of outputs[name].imports ?? []) {
      if (imp.path.endsWith('.js') && !isLazyEntry(imp.path)) {
        visit(imp.path);
      }
    }
  };

  visit(main);

  const styles = Object.keys(outputs).find((name) =>
    /^styles-.*\.css$/.test(name)
  );
  if (styles) {
    seen.add(styles);
  }

  return [...seen]
    .map((name) => ({
      name,
      size: outputs[name].bytes,
      entryPoint: outputs[name].entryPoint,
    }))
    .sort((a, b) => b.size - a.size);
}

export function getInitialAssets(stats: {
  assets?: Array<{ name: string; size: number }>;
  outputs?: Record<
    string,
    { bytes: number; entryPoint?: string; imports?: Array<{ path: string }> }
  >;
}): StatsAsset[] {
  if (stats.outputs) {
    return collectInitialAssets(stats.outputs);
  }

  if (stats.assets) {
    return stats.assets
      .filter((asset) =>
        /^(?:main-|styles-|chunk-|runtime|polyfills)/.test(asset.name)
      )
      .sort((a, b) => b.size - a.size);
  }

  throw new Error('Unsupported stats format: expected "assets" or "outputs"');
}

export function isLazyAsset(asset: StatsAsset): boolean {
  const { name, entryPoint } = asset;

  if (!name.endsWith('.js') || name.endsWith('.mjs')) {
    return false;
  }

  if (
    entryPoint &&
    !isMainEntry(entryPoint) &&
    !entryPoint.startsWith('angular:')
  ) {
    return true;
  }

  return isLazyEntry(name);
}

export function formatChunkName(name: string, entryPoint?: string): string {
  if (entryPoint && !entryPoint.startsWith('angular:')) {
    const fileName = entryPoint.split('/').pop() ?? entryPoint;
    return fileName.replace(/\.(ts|tsx)$/, '');
  }

  if (/^styles-.*\.css$/.test(name)) {
    return name;
  }

  const legacyName = name.split('src_')?.pop()?.split('_module_ts.')?.shift();
  if (legacyName && legacyName !== name) {
    return legacyName;
  }

  return name;
}

export function formatBytes(a: number, decimals = 2) {
  if (a === 0) {
    return '0 Bytes';
  }

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const index = Math.floor(Math.log(a) / Math.log(1000));
  const value = a / Math.pow(1000, index);

  return `${parseFloat(value.toFixed(Math.max(0, decimals)))} ${units[index]}`;
}
