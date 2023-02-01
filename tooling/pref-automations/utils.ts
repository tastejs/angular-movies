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
