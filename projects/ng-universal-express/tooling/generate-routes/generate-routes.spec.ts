import {run} from './generate-routes-command';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {join} from "node:path";
// import * as process from "node:process";
// let originalCwd = '';

function setupFolder(): void {
  const target = './tmp';
  if (!existsSync(target)) {
    mkdirSync(target, {recursive: true});
  }
  writeFileSync(join(target, '/routes.base.txt'), '/popular');
}

function cleanupFolder(): void {
  rmSync('./tmp', {recursive: true});
}

describe('generate-routes', () => {

  beforeEach(() => {
    // originalCwd = process.cwd();
    setupFolder();
  });
  afterEach(() => {
    // process.chdir(originalCwd);
    cleanupFolder();
  });

  it('should throw if params are not given', () => {
    const errorMessage = 'CLI param --targetFile is required';

    // eslint-disable-next-line unicorn/prefer-module
    expect(() => run({} as any)).toThrow(errorMessage);
    expect(() => run({targetFile: ''})).toThrow(errorMessage);
  })

  it('should run if params are given', async () => {
    const sourcePath = './tmp'
    const sourceFilePath = './tmp/routes.base.txt'
    const targetPath = './tmp/output/'
    const targetFilePath = join(targetPath, 'generated-routes.txt')

    const sourceFolder = readdirSync(sourcePath)
    expect(sourceFolder.length).toBe(1);

    await run({targetFile: targetFilePath, sourceFile: sourceFilePath}).then((_) => {
      const targetFolder = readdirSync(targetPath)
      expect(targetFolder.length).toBe(1);

      const sourceFile = readFileSync(sourceFilePath).toString()
      const targetFilePath = readFileSync(join(targetPath, targetFolder.pop()?.toString() || '')).toString()
      expect(targetFilePath).not.toBe(sourceFile);
    });

  })

})
