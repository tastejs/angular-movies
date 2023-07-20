import {readFileSync,} from 'node:fs';
import {join, relative} from 'node:path';
import {getLog} from "../utils";

export function run(parameters: { targetFolder: string, sourceFile?: string, verbose?: boolean }): Promise<void> {

  // setup
  let {targetFolder, sourceFile, verbose} = parameters;

  const log = getLog(verbose);

  // validation
  if (!targetFolder) {
    throw new Error('CLI param --targetFolder is required');
  }
  if (!sourceFile) {
    throw new Error('CLI param --sourceFile is required');
  }

  const targetFile = join(targetFolder, 'package.json');
  const sourcePackageJson = JSON.parse(readFileSync(sourceFile).toString());
  log(relative(sourceFile, targetFile));

  // writeFileSyncRecursive();
  const targetPackageJson = adoptPackageJson(sourcePackageJson, {main: relative(sourceFile, targetFile)});
  log(targetPackageJson);
  return Promise.resolve();

}

function adoptPackageJson<T extends Record<string, unknown>>(json: T, overrides: T): T {
  return {...json, ...overrides};
}
