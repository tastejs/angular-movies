// Use Flow configuration file
const fs = require('fs');
const { join } = require('path');

getCfg('');

function getCfg(config: any) {
  let cfg = {
    path: './projects/movies-user-flows/src/user-flows',
  };

  const flows = fs.readdirSync(cfg.path).map((p) => require(join(cfg.path, p)));
  console.log('flows', flows);
  // require('./rawContent');

  return cfg;
}

function resolveVariantConfig(path) {
  if (path.endsWith('.ts')) {
    // Register TS compiler lazily
    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
      },
    });
  }

  const file = require(path);
  // If the user provides a configuration in TS file
  // then there are 2 cases for exporing an object. The first one is:
  // `module.exports = { ... }`. And the second one is:
  // `export default { ... }`. The ESM format is compiled into:
  // `{ default: { ... } }`
  const exports = file.default || file;
  return exports;
}

module.exports = getCfg;
