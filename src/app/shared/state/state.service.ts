import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';

import { exhaustMap, filter } from 'rxjs/operators';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { MovieGenreModel, MovieModel } from '../../data-access/model';
import { patch, RxState, selectSlice } from '@rx-angular/state';

interface State {
  genres: MovieGenreModel[];
  listMovies: Record<string, MovieModel[]>;
  genreMovies: Record<string, MovieModel[]>;
}

interface Command<T extends commandNames, P = unknown> {
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

const parseTitle = (title: string) => title?.replace(/[-_]/, ' ');

@Injectable({
  providedIn: 'root'
})
export class StateService extends RxState<State> {
  private commands = new Subject<commands>();

  genresNames$ = this.select('genres');
  genresList$ = (genreParam: number | string): Observable<MovieList> => this.select(
    selectSlice(['genres', 'genreMovies']),
    map(({ genres, genreMovies }) => {
      const genreId = parseInt(genreParam as string, 10);
      const genreName = genres.find((g: MovieGenreModel) => g.id === genreId)?.name || 'unknown genre';
      return {
        title: parseTitle(genreName),
        movies: genreMovies[genreId]
      };
    })
  );

  moviesList$ = (listName: string): Observable<MovieList> => this.select(
    map(({ listMovies }) => ({
      title: parseTitle(listName),
      movies: listMovies[listName] || []
    }))
  );


  constructor(private tmdb2Service: Tmdb2Service) {
    super();
    this.connect('genres', this.commands.pipe(
      filter(({ type }) => type === 'refreshGenres'),
      exhaustMap(() => this.tmdb2Service.getGenres()))
    );

    this.connect(
      'listMovies',
      this.commands.pipe(
        filter(({ type }) => type === 'fetchCategoryMovies'),
        exhaustMap(({ payload }) => this.tmdb2Service.getMovieCategory(payload as string)
          .pipe(map(({ results }) => ({ [payload as string]: results }))))
      ),
      ({ listMovies }, newPartial) => {
        return patch(listMovies, newPartial);
      }
    );

    this.connect(
      'genreMovies',
      this.commands.pipe(
        filter(({ type }) => type === 'fetchGenreMovies'),
        exhaustMap(({ payload }) => this.tmdb2Service.getMovieGenre(payload as string)
          .pipe(map(({ results }) => ({ [payload as string]: results }))))),
      ({ listMovies }, newValue) => patch(listMovies, newValue)
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
