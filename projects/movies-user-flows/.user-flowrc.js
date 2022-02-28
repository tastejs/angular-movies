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

module.exports = getCfg;
