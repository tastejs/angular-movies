import {run} from './generate-routes.impl';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {join} from "node:path";

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
    setupFolder();
  });
  afterEach(() => {
    cleanupFolder();
  });

  it('should throw if params are not given', () => {
    const errorMessage = 'CLI param --targetFile is required';

    // eslint-disable-next-line unicorn/prefer-module
    expect(() => run({} as any)).toThrow(errorMessage);
    expect(() => run({verbose: true, targetFile: ''})).toThrow(errorMessage);
  })

  it('should run if params are given', async () => {
    const sourcePath = './tmp';
    const sourceFile = join(sourcePath, 'routes.base.txt');
    const targetPath = './tmp/output/';
    const targetFile = join(targetPath, 'generated-routes.txt');

    const sourceFolderContent = readdirSync(sourcePath)
    expect(sourceFolderContent.length).toBe(1);

    await run({targetFile, sourceFile, verbose: true}).then((_) => {
      const targetFolderContent = readdirSync(targetPath)
      expect(targetFolderContent.length).toBe(1);

      const sourceFileContent = readFileSync(sourceFile).toString();
      const targetFileContent = readFileSync(targetFile).toString();
      expect(targetFileContent).not.toBe(sourceFileContent);
    });

  })

})
