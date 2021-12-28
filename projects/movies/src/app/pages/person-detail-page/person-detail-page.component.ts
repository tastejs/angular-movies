import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { MovieCastModel } from '../../data-access/model/movie-cast.model';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { Router } from '@angular/router';
import { PersonDetailAdapter, PersonDetailPageAdapterState } from './person-detail-page.adapter';

@Component({
  selector: 'ct-person',
  templateUrl: './person-detail-page.component.html',
  styleUrls: ['./person-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState]
})
export class PersonDetailPageComponent {
  readonly detailState$ = this.state.select(
    selectSlice(['loading', 'person'])
  );
  readonly recommendedLoading$ = this.state.select('loading');
  readonly recommendations$ = this.state.select('recommendations');

  constructor(
    private location: Location,
    private adapter: PersonDetailAdapter,
    private router: Router,
    private state: RxState<PersonDetailPageAdapterState>
  ) {
    this.state.set({
      recommendations: [],
      loading: true
    });
    this.state.connect(this.adapter.routedPersonSlice$);
    this.state.connect('recommendations', this.adapter.movieRecomendationsById$);
  }

  toGenre(genre: MovieGenreModel) {
    this.router.navigate(['/list', 'genre', genre.id]);
  }

  back() {
    this.location.back();
  }

  trackByGenre: TrackByFunction<MovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<MovieCastModel> = (_, cast) => cast.cast_id;
}
