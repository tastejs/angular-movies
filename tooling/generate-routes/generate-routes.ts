import { writeFileSync } from 'fs';
import { EOL } from 'os';
import axios from 'axios';
import { TMDBMovieModel } from '../../projects/movies/src/app/data-access/api/model/movie.model';
import { TMDBPaginateResult } from '../../projects/movies/src/app/data-access/api/paginate/paginate.interface';
import { GenresResponse } from '../../projects/movies/src/app/data-access/api/resources/genre.resource';
import { environment } from '../../projects/movies/src/environments/environment';

const routesFile = './routes.txt';

const defaultRoutes = [
  '/list/category/popular',
  '/list/category/top_rated',
  '/list/category/upcoming',
];

const movieGenresURL = 'https://api.themoviedb.org/3/genre/movie/list';
const moviesPopularURL = 'https://api.themoviedb.org/3/movie/popular';

const movieGenresRoutes = axios
  .get<{ genres: GenresResponse }>(movieGenresURL, {
    headers: { authorization: `Bearer ${environment.tmdbApiReadAccessKey}` },
  })
  .then(({ data }) => data.genres.map(({ id }) => '/list/genre/' + id));

const moviesPopularRoutes = (options: {
  pages: number; // how many page details of popular movies should be pre-rendered
}) =>
  [...Array(options.pages).keys()].map((_, i) =>
    axios
      .get<TMDBPaginateResult<TMDBMovieModel>>(moviesPopularURL, {
        headers: {
          authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
        },
        params: {
          sort_by: 'popularity.desc',
          page: i + 1,
        },
      })

      .then(({ data }) => data.results.map(({ id }) => '/detail/movie/' + id))
  );

Promise.all([
  Promise.resolve(defaultRoutes),
  movieGenresRoutes, // list the routes of the genres featured in the app sidebar
  // list routes for movie details equivalent to N pages of popular movies list
  ...moviesPopularRoutes({ pages: 2 }),
])
  .then((routes) => {
    writeFileSync(routesFile, routes.flat().join(EOL), 'utf8');
  })
  .catch((e) => console.error(e));
