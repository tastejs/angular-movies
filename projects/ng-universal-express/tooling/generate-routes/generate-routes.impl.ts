import {
  existsSync,
  mkdirSync,
  readFileSync,
  WriteFileOptions,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';
import { EOL } from 'node:os';

import { TMDBMovieModel } from '../../../movies/src/app/data-access/api/model/movie.model';
import { GenresResponse } from '../../../movies/src/app/data-access/api/resources/genre.resource';
import { environment } from '../../../movies/src/environments/environment';
import { getLog } from '../utils';

export function run(parameters: {
  targetFile: string;
  sourceFile?: string;
  verbose?: boolean;
}): Promise<void> {
  // setup
  let { targetFile, sourceFile, verbose } = parameters;

  const log = getLog(verbose);

  // validation
  if (!targetFile) {
    throw new Error('CLI param --targetFile is required');
  }

  let defaultRoutes: string[] = [];

  if (sourceFile && existsSync(sourceFile)) {
    log(`Read source rout.txt ${sourceFile}`);
    defaultRoutes = readFileSync(sourceFile)
      .toString()
      .split(EOL)
      .filter((v) => !!v);
    log(`Default routes: ${defaultRoutes}`);
  }

  // URLs

  const movieGenresURL = readApi('genre/movie/list');
  const genresListURL = (id: string | number) => readApi(`list/genre/${id}`);
  const movieDetailURL = (id: string | number) => readApi(`detail/movie/${id}`);
  const moviesPopularURL = readApi('movie/popular');

  const movieGenresRoutes = _fetch<{ genres: GenresResponse }>(movieGenresURL, {
    headers: getTmdbHeaders(),
  }).then(({ genres }) => {
    return genres.map(({ id }) => genresListURL(id));
  });

  // how many page details of popular movies should be pre-rendered
  // @ts-ignore
  const moviesPopularRoutes = (options: { pages: number }) => {
    return Array.from({ length: options.pages }, (_, index) => {
      return _fetch<{ results: TMDBMovieModel[] }>(moviesPopularURL, {
        headers: getTmdbHeaders(),
        params: {
          sort_by: 'popularity.asc',
          page: index + 1,
        },
      }).then(({ results }) => results.map(({ id }) => movieDetailURL(id)));
    });
  };
  // GENERATE
  return Promise.all([
    Promise.resolve(defaultRoutes),
    movieGenresRoutes, // list the routes of the genres featured in the app sidebar
    // list routes for movie details equivalent to N pages of popular movies list
    ...moviesPopularRoutes({ pages: 2 }),
  ])
    .then((routes) => {
      const normalizedRoutes = routes
        .flat()
        .flatMap(
          (route) =>
            route.replace('https://api.themoviedb.org/3', '') as string,
        );

      const content = normalizedRoutes.join(EOL);
      log(`Content: ${content}`);
      writeFileSyncRecursive(targetFile, content);
    })
    .catch((error) => console.error(error));
}

function readApi(url: string): string {
  return `${environment.tmdbBaseUrl}/${environment.apiV3}/${url}`;
}

function writeFileSyncRecursive(
  filename: string,
  content: string,
  options?: WriteFileOptions,
): void {
  const options_ = options || { encoding: 'utf8' };
  mkdirSync(dirname(filename), { recursive: true });
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

function _fetch<T>(
  url: string,
  f: RequestInit & { params?: Record<string, any> },
) {
  const { params, ...fetchRequestInit } = f;
  const parametersAsString = new URLSearchParams(params).toString();
  const urlToFetch = `${url}${parametersAsString ? '?' + parametersAsString : ''}`;
  return fetch(urlToFetch, fetchRequestInit).then((response: Response) =>
    response.json(),
  ) as Promise<T>;
}
