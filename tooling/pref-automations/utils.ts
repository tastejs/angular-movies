import * as fs from 'fs';

// @ts-ignore
export type Formats = 'json' | 'string';
export function readFile<T = Record<string, any>>(
  path: string,
  format: Formats = 'json'
) {
  if (!fs.existsSync(path)) {
    throw new Error(`the path ${path} does not exist`);
  }
  const raw = fs.readFileSync(path) as any as string;
  if (format === 'string') {
    return raw.toString() as string;
  }
  return JSON.parse(raw) as T;
}

export function formatChunkName(name: string): string | undefined {
  return name.split('src_')?.pop()?.split('_module_ts.')?.shift();
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
