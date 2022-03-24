const fs = require('fs');

const base = getOutputPath() + '/';
module.exports = [
  {
    name: 'initial',
    path: base + '(main|styles|runtime|polyfills)*.js',
    limit: '110Kb',
  },
  {
    name: 'main',
    path: base + 'main*',
    limit: '108Kb',
  },
  {
    name: 'styles',
    path: base + 'styles*',
    limit: '2.6Kb',
  },
  {
    name: 'common',
    path: base + 'common*',
    limit: '4KB',
  },
  {
    name: 'movie-detail-page',
    path:
      base +
      'projects_movies_src_app_pages_movie-detail-page_movie-detail-page_module*',
    limit: '5.5KB',
  },
  {
    name: 'person-detail-page',
    path:
      base +
      'projects_movies_src_app_pages_person-detail-page_person-detail-page_module*',
    limit: '4KB',
  },
];

function getOutputPath() {
  const project = 'movies';
  const target = 'build';
  const arrayBuffer = fs.readFileSync('./angular.json');
  const projects = JSON.parse(arrayBuffer).projects[project];
  return projects.architect[target].options.outputPath;
}

function getOutputFiles() {
  const project = 'movies';
  const target = 'build';
  const arrayBuffer = fs.readFileSync('./angular.json');
  const projects = JSON.parse(arrayBuffer).projects[project];
  const outputPath = projects.architect[target].options.outputPath;
  return fs
    .readdirSync(outputPath)
    .filter((name) => name.endsWith('.js') || name.endsWith('.css'))
    .map((f) => [f, outputPath + '/' + f]);
}

function useAngularConfig() {
  /* Debugging/Future automation
const [projectCommand, project, targetCommand, target] = process.argv.slice(
  -(process.argv.length - 2)
);

if (
  !(projectCommand && projectCommand.split('-').join('') === 'project') ||
  !(targetCommand && targetCommand.split('-').join('') === 'target')
) {
  console.error(
    'command: ',
    [projectCommand, project, targetCommand, target].join(' '),
    'is incorrect'
  );
  throw new Error('it has to be: --project <name> --target <name>');
  return;
}

if (projectCommand.split('-').join('') === project) {
  console.log('command: ', projectCommand, 'has to be --project');
}
*/
  const project = 'movies';
  const target = 'build';

  const arrayBuffer = fs.readFileSync('./angular.json');

  const projects = JSON.parse(arrayBuffer).projects[project];
  const bundleBudgets =
    projects.architect[target].budgets ||
    projects.architect[target].configurations.production.budgets;

  const outputPath = projects.architect[target].options.outputPath;

  const relevantFiles = fs
    .readdirSync(outputPath)
    .filter((name) => name.endsWith('.js') || name.endsWith('.css'));

  const sizeLimitConfig = bundleBudgets
    .filter(({ type, name }) => {
      // does the file exist?
      const fileExists = name && relevantFiles.find((f) => f.startsWith(name));
      if (!fileExists && type !== 'anyComponentStyle' && type !== 'initial') {
        console.log(`file: ${name}* is not in the folder ${outputPath}`);
      }

      return type !== 'anyComponentStyle' && fileExists;
    })
    .map(({ type, name, maximumError: limit }) => {
      return {
        gzip: false,
        brotli: true,
        name: 'angular-budgets--' + name || type,
        path: [outputPath, type === 'initial' ? '*' : [name + '.*']].join('/'),
        //limit,
      };
    });
  return sizeLimitConfig;
}
