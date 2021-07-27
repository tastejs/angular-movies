import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MovieModel } from '../model/movie.model';
import { Observable } from 'rxjs';

import { ActivatedRoute, Params } from '@angular/router';
import { Pager } from '../../shared/model/pager.model';
import { Tmdb2Service } from '../../shared/service/tmdb/tmdb2.service';
import { map, startWith, switchMap } from 'rxjs/operators';

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
    switchMap(({ category }) =>
      this.tmdb2Service
        .getMovieCategory(category)
        .pipe(
          map((data) => ({
            loading: false,
            movies: data.results,
            title: category,
          }))
        )
    ),
    startWith({ loading: true, movies: undefined, title: undefined })
  );

  currentPage: number;
  pager: Pager;
  totalPages: number;
  title: string | number;
  loading: boolean;
  moviesType: Params;

  constructor(
    private tmdb2Service: Tmdb2Service,
    private route: ActivatedRoute
  ) {}
}
