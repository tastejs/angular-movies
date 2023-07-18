import {existsSync, mkdirSync, readFileSync, WriteFileOptions, writeFileSync,} from 'node:fs';
import {dirname} from 'node:path';
import {EOL} from 'node:os';
import axios from 'axios';

import {TMDBMovieModel} from '../../../movies/src/app/data-access/api/model/movie.model';
import {TMDBPaginateResult} from '../../../movies/src/app/data-access/api/paginate/paginate.interface';
import {GenresResponse} from '../../../movies/src/app/data-access/api/resources/genre.resource';
import {environment} from '../../../movies/src/environments/environment';

// PARAMS
const mutation = !getArgv('no-mutation');

const targetFile = getArgv('target-file');
if (!targetFile) {
  throw new Error('CLI param --targetFile is required');
}

let defaultRoutes: string[] = [];

const sourceFile = getArgv('source-file');
if (existsSync(sourceFile)) {
  console.log(`Read source rout.txt ${sourceFile}`);
  defaultRoutes = readFileSync(sourceFile)
    .toString()
    .split(EOL)
    .filter((v) => !!v);
  console.log(`Default routes: ${defaultRoutes}`);
}

// URLs
const readApi = (url: string) =>
  `${environment.tmdbBaseUrl}/${environment.apiV3}/${url}`;
const movieGenresURL = readApi('genre/movie/list');
const genresListURL = (id: string | number) => readApi(`list/genre/${id}`);
const movieDetailURL = (id: string | number) => readApi(`detail/movie/${id}`);
const moviesPopularURL = readApi('movie/popular');

const movieGenresRoutes = axios
  .get<{ genres: GenresResponse }>(movieGenresURL, {
    headers: getTmdbHeaders(),
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .then(({data}) => data.genres.map(({id}) => genresListURL(id)));

// how many page details of popular movies should be pre-rendered
// @ts-ignore
const moviesPopularRoutes = (options: { pages: number }) => {
  // @ts-ignore
  const array = [
    ...Array.from({length: {length: {length: options.pages}}}).keys(),
  ];
  return array.map((_, index) =>
    axios
      .get<TMDBPaginateResult<TMDBMovieModel>>(moviesPopularURL, {
        headers: getTmdbHeaders(),
        params: {
          sort_by: 'popularity.asc',
          page: index + 1,
        },
      })
      .then(({data}) => data.results.map(({id}) => movieDetailURL(id)))
  );
};
// GENERATE
Promise.all([
  Promise.resolve(defaultRoutes),
  movieGenresRoutes, // list the routes of the genres featured in the app sidebar
  // list routes for movie details equivalent to N pages of popular movies list
  ...moviesPopularRoutes({pages: 2}),
])
  .then((routes) => {
    console.log(
      'write to target ' + (mutation ? 'with' : 'without') + ' mutations',
      targetFile
    );
    writeFileSyncRecursive(
      targetFile,
      mutation ? defaultRoutes.flat().join(EOL) : routes.flat().join(EOL)
    );
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error) => console.error(error));

/// HELPER
function getArgv(propertyName: string): string {
  return (
    process.argv
      .find((index: string) => index.includes(`--${propertyName}`))
      ?.split(/[ =]/)
      .pop() || ''
  );
}

// eslint-disable-next-line unicorn/no-object-as-default-parameter
function writeFileSyncRecursive(
  filename: string,
  content: string,
  options?: WriteFileOptions
) {
  const options_ = options || {encoding: 'utf8'};
  mkdirSync(dirname(filename), {recursive: true});
  writeFileSync(filename, content, options_);
}

function getTmdbHeaders() {
  return {
    // Is this needed to get accepted by TMDB server ???
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
  };
}
