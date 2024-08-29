import { mkdirSync, WriteFileOptions, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function getLog(verbose: boolean = false) {
  return (...logs: any[]) => {
    if (verbose) {
      console.log(...logs);
    }
  };
}

export function getArgv(propertyName: string): string {
  return (
    process.argv
      .find((index: string) => index.includes(`--${propertyName}`))
      ?.split(/[ =]/)
      .pop() || ''
  );
}

export function writeFileSyncRecursive(
  filename: string,
  content: string,
  options?: WriteFileOptions,
): void {
  const options_ = options || { encoding: 'utf8' };
  mkdirSync(dirname(filename), { recursive: true });
  writeFileSync(filename, content, options_);
}
