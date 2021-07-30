import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import {
  filter,
  map,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Pager } from '../../shared/model/pager.model';
import { StateService } from '../../shared/service/state.service';
import { Tmdb2Service } from '../../shared/service/tmdb/tmdb2.service';
import { MovieModel } from '../model/movie.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent {
  request: Observable<any>;
  dataParam: string;
  movies: MovieModel[];
  state$: Observable<{
    loading: boolean;
    movies: MovieModel[];
    title: string;
  }> = this.route.params.pipe(
    switchMap(({ category, genre }) => {
      if (category) {
        return this.tmdb2Service.getMovieCategory(category).pipe(
          map((data) => ({
            loading: false,
            movies: data.results,
            title: category,
          }))
        );
      }
      if (genre) {
        const genreId = parseInt(genre, 10);
        return this.tmdb2Service.getMovieGenre(genre).pipe(
          withLatestFrom(this.tmdbState.genres$.pipe(filter((g) => g != null))),
          tap(([data, genres]) => {
            console.log(data);
          }),
          map(([data, genres]) => ({
            loading: false,
            movies: data.results,
            title: genres?.find((g) => g.id === genreId)?.name,
          }))
        );
      }
      return EMPTY;
    }),
    startWith({ loading: true, movies: null, title: null })
  );

  currentPage: number;
  pager: Pager;
  totalPages: number;
  title: string | number;
  loading: boolean;
  moviesType: Params;

  constructor(
    private tmdb2Service: Tmdb2Service,
    private tmdbState: StateService,
    private route: ActivatedRoute
  ) {}
}
