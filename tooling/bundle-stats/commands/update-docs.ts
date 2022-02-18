import { YargsCommandObject } from '../../cli/model';
import { getCliParam } from '../../cli/utils';
import { formatBytes, readFile } from '../utils';
import * as fs from 'fs';

export async function run(): Promise<void> {
  const statsPath: string = getCliParam(['stats', 's']) || './stats.json';
  const readmePath: string = getCliParam(['target', 't']) || './readme.md';

  const stats = readFile(statsPath);
  const readme = readFile(readmePath, 'string');

  const [top, rest] = readme.split('<!-- bundle-stats-start -->');
  if (rest === undefined) {
    throw new Error(
      `The target file does not contain valid tags. "<!-- bundle-stats-start -->" & "<!-- bundle-stats-end -->"`
    );
  }
  const [_, bottom] = rest.split('<!-- bundle-stats-end -->');

  const initialAssets: [string, number][] = stats.assets
    .filter((o: any) => o.name.match(/main|styles|runtime|polyfills+[.]/g))
    .map(({ name, size }: any) => [name, size]);
  const restAssets: [string, number][] = stats.assets
    .filter(
      (o: any) =>
        !o.name.match(/main|styles|runtime|polyfills+[.]/g) &&
        o.name.endsWith('.js')
    )
    .map(({ name, size }: any) => [name, size]);

  let statsContent =
    top +
    `
<!-- bundle-stats-start -->
| Names             |       Size |
| ---               | ---        |`;

  initialAssets.forEach(([name, size]) => {
    statsContent += `
| ${name}           | ${formatBytes(size)} |`;
  });
  statsContent += `
  | **Initial Total** | **${formatBytes(
    initialAssets.reduce((a, [_, s]) => a + s, 0)
  )}** |`;
  statsContent += `
  | Names             |       Size |`;

  restAssets.forEach(([name, size]) => {
    statsContent += `
| ${name}           | ${formatBytes(size)} |`;
  });
  statsContent +=
    `
<!-- bundle-stats-end -->
` + bottom;

  fs.writeFileSync(readmePath, statsContent);
}

const command = 'update-bundle-stats';

export const updateDocsCommand: YargsCommandObject = {
  command,
  description: 'Update related markdown files with latest bundle stats',
  module: {
    handler: async (argv) => {
      if (argv.verbose) console.info(`run "${command}" as a yargs command`);

      await run();
    },
  },
};
