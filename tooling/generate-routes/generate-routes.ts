import {existsSync, mkdirSync, readFileSync, WriteFileOptions, writeFileSync} from 'fs';
import {dirname} from 'path';
import {EOL} from 'os';
import axios from 'axios';
import {TMDBMovieModel} from '../../projects/movies/src/app/data-access/api/model/movie.model';
import {TMDBPaginateResult} from '../../projects/movies/src/app/data-access/api/paginate/paginate.interface';
import {GenresResponse} from '../../projects/movies/src/app/data-access/api/resources/genre.resource';
import {environment} from '../../projects/movies/src/environments/environment';

// PARAMS
const mutation = !getArgv('no-mutation');

const targetFile = getArgv('target-file');
if (!targetFile) {
  throw new Error('CLI param --targetFile is required');
}

let defaultRoutes: string[] = [];

const sourceFile = getArgv('source-file');
if (existsSync(sourceFile)) {
  console.log('Read source rout.txt ', sourceFile);
  defaultRoutes = readFileSync(sourceFile).toString().split(EOL).filter(v => !!v);
  console.log('Default routes: ', defaultRoutes);
}

// URLs
const readApi = (url: string) => `${environment.tmdbBaseUrl}/${environment.apiV3}/${url}`;
const movieGenresURL = readApi('genre/movie/list');
const genresListURL = (id: string | number) => readApi(`list/genre/${id}`);
const movieDetailURL = (id: string | number) => readApi(`detail/movie/${id}`);
const moviesPopularURL = readApi('movie/popular');

const movieGenresRoutes = axios
  .get<{ genres: GenresResponse }>(movieGenresURL, {
    headers: getTmdbHeaders()
  })
  .then(({data}) => data.genres.map(({id}) => genresListURL(id)));

const moviesPopularRoutes = (options: {
  pages: number; // how many page details of popular movies should be pre-rendered
}) =>
  [...Array(options.pages).keys()].map((_, i) =>
    axios
      .get<TMDBPaginateResult<TMDBMovieModel>>(moviesPopularURL, {
        headers: getTmdbHeaders(),
        params: {
          sort_by: 'popularity.asc',
          page: i + 1,
        },
      })
      .then(({data}) => data.results.map(({id}) => movieDetailURL(id)))
  );


// GENERATE
Promise.all([
  Promise.resolve(defaultRoutes),
  movieGenresRoutes, // list the routes of the genres featured in the app sidebar
  // list routes for movie details equivalent to N pages of popular movies list
  ...moviesPopularRoutes({pages: 2}),
])
  .then((routes) => {
    console.log('write to target ' + (mutation ? 'with' : 'without') + ' mutations', targetFile);
    writeFileSyncRecursive(targetFile, mutation ? defaultRoutes.flat().join(EOL) : routes.flat().join(EOL));
  })
  .catch((e) => console.error(e));


/// HELPER
function getArgv(propName: string): string {
  return process.argv.find((i: string) => i.includes(`--${propName}`))?.split(/[= ]/).pop() || '';
}

function writeFileSyncRecursive(filename: string, content: string, options: WriteFileOptions = {encoding: 'utf8'}) {
  mkdirSync(dirname(filename), {recursive: true})
  writeFileSync(filename, content, options)
}

function getTmdbHeaders() {
  return {
    // Is this needed to get accepted by TMDB server ???
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    authorization: `Bearer ${environment.tmdbApiReadAccessKey}`
  }
}
