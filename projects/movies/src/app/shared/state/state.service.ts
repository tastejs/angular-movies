import { Injectable } from '@angular/core';
import { exhaustMap, filter, map, Observable, Subject } from 'rxjs';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState, selectSlice } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { parseTitle } from '../utils/parse-movie-list-title';

interface State {
  genres: MovieGenreModel[];
  genreMovies: Record<string, MovieModel[]>;
  categoryMovies: Record<string, MovieModel[]>;
}

interface Command<T extends commandNames, P = any> {
  type: T;
  payload?: P;
}

export interface MovieList {
  title: string;
  movies: MovieModel[];
}

type commandNames = 'refreshGenres' | 'fetchCategoryMovies' | 'fetchGenreMovies';
type refreshGenres = Command<'refreshGenres'>;
type fetchCategoryMovies = Command<'fetchCategoryMovies', string>;
type fetchGenreMovies = Command<'fetchGenreMovies', string | number>;

type commands = refreshGenres | fetchCategoryMovies | fetchGenreMovies;

@Injectable({
  providedIn: 'root'
})
export class StateService extends RxState<State> {
  private commands = new Subject<commands>();

  genresNames$ = this.select('genres');
  genreMovieList$ = (genreParam: number | string): Observable<MovieList> => this.select(
    selectSlice(['genres', 'genreMovies']),
    map(({ genres, genreMovies }) => {
      const genreIdStr = genreParam as string;
      const genreId = parseInt(genreIdStr, 10);
      const genreName = genres.find((g: MovieGenreModel) => g.id === genreId)?.name || 'unknown genre';
      return {
        title: parseTitle(genreName),
        movies: genreMovies && genreMovies[genreIdStr] || []
      };
    })
  );

  categoryMovieList$ = (listName: string): Observable<MovieList> => this.select(
    map(({ categoryMovies }) => ({
      title: parseTitle(listName),
      movies: categoryMovies && categoryMovies[listName] || []
    }))
  );


  constructor(private tmdb2Service: Tmdb2Service) {
    super();
    this.connect('genres', this.commands.pipe(
      filter(({ type }) => type === 'refreshGenres'),
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      exhaustMap(() => this.tmdb2Service.getGenres()))
    );

    this.connect(
      'categoryMovies',
      this.commands.pipe(
        filter(({ type }) => type === 'fetchCategoryMovies'),
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        optimizedFetch(
          ({ payload: category }) => 'category' + '-' + category,
          ({ payload: category }) => this.tmdb2Service.getMovieCategory(category)
            .pipe(map(({ results }) => ({ [category]: results }))))
      ),
      ({ categoryMovies }, newPartial) => {
        return patch(categoryMovies, newPartial);
      }
    );

    this.connect(
      'genreMovies',
      this.commands.pipe(
        filter(({ type }) => type === 'fetchGenreMovies'),
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        optimizedFetch(
          ({ payload: genre }) => 'genre' + '-' + genre,
          ({ payload: genre }) => this.tmdb2Service.getMovieGenre(genre)
            .pipe(map(({ results }) => ({ [genre]: results }))))
      ),
      ({ genreMovies }, newPartial) => patch(genreMovies, newPartial)
    );
  }

  init(): void {
    this.refreshGenres();
  }

  refreshGenres(): void {
    this.commands.next({ type: 'refreshGenres', payload: null });
  }

  fetchCategoryMovies(category: string): void {
    this.commands.next({ type: 'fetchCategoryMovies', payload: category });
  }

  fetchGenreMovies(genre: string | number): void {
    this.commands.next({ type: 'fetchGenreMovies', payload: genre });
  }
}
