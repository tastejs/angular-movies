import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { MovieModel } from '../../data-access/model/movie.model';
import { StateService } from '../../shared/state/state.service';


type MoviesState = {
  loading: boolean;
  movies: MovieModel[];
  title: string;
};

@Component({
  selector: 'app-movies',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListPageComponent extends RxState<MoviesState> {
  movies: MovieModel[] = [];

  readonly movies$ = this.select('movies');
  readonly loading$ = this.select('loading');
  readonly title$ = this.select('title');

  constructor(
    private state: StateService,
  ) {
    super();
    this.set({ loading: true });
    this.connect(this.state.routedMovieList$);
  }

}
