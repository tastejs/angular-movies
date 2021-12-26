import { YargsCommandObject } from '../../cli/model';
import { getCliParam } from '../../cli/utils';
import { writeFileSync } from 'fs';
import { ImagePool } from '@squoosh/lib';
import { Promise } from '@rx-angular/cdk';

export const runCommand: YargsCommandObject = {
  command: 'squoosh',
  description:
    'Run a squoosh optimization on a set of files selected via a glob pattern',
  module: {
    handler: async (argv) => {
      if (argv.verbose) {
        console.info(`run "squoosh" as a yargs command`);
      }

      await squoosh(argv);
    },
  },
};

interface Generators {
  mozjpeg: any;
  wp2: any;
  oxipng: any;
}

const generators: Generators = {
  // --mozjpeg [config]                                     Use MozJPEG to generate a .jpg file with the given configuration
  mozjpeg: {},
  // --webp [config]                                        Use WebP to generate a .webp file with the given configuration
  // --avif [config]                                        Use AVIF to generate a .avif file with the given configuration
  // --jxl [config]                                         Use JPEG-XL to generate a .jxl file with the given configuration
  // --wp2 [config]                                         Use WebP2 to generate a .wp2 file with the given configuration
  wp2: 'auto',
  // --oxipng [config]                                      Use OxiPNG to generate a .png file with the given configuration
  oxipng: { level: 2, interlace: false },
};

export async function squoosh(argv: any): Promise<void> {
  const path = getCliParam(['path', 'p']);
  if (!path) {
    throw new Error(`The path argument can't be empty.`);
  }
  const generator: keyof Generators = (getCliParam(['generators', 'g']) ||
    '') as keyof Generators;
  if (!(generator in generators)) {
    throw new Error(`The passed generator: "${generator}" does not exist.`);
  }

  if(getCliParam(['verbose', 'v'])) {
    console.log(`Start optimization of ${path} with ${generator} generator`);
  }
  const imagePool = new ImagePool();
  const image = imagePool.ingestImage(path);

  await image.encode({
    [generator]: generators[generator],
  });
  const { binary } = await image.encodedWith[generator];
  await writeFileSync(path, binary);
  await imagePool.close();

}
