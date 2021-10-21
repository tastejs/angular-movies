import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { map, startWith, switchMap } from 'rxjs';
import { RxState, selectSlice } from '@rx-angular/state';
import {
  MovieCastModel,
  MovieDetailsModel,
  MovieGenreModel,
  MovieModel,
} from '../../data-access/model/index';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { ActivatedRoute, Router } from '@angular/router';
import { W780H1170 } from '../../shared/utils/image-sizes';

type MovieDetail = MovieDetailsModel & { languages_runtime_release: string };

@Component({
  selector: 'app-movie',
  templateUrl: './movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class MovieDetailPageComponent {
  W342H513 = W780H1170;
  readonly detailState$ = this.state.select(
    selectSlice(['loading', 'movie', 'cast'])
  );

  readonly recommendedLoading$ = this.state.select('loading');
  readonly recommendations$ = this.state.select('recommendations');

  private readonly id$ = this.route.params.pipe(map(({ id }) => id));

  constructor(
    private location: Location,
    private tmdb: Tmdb2Service,
    private route: ActivatedRoute,
    private router: Router,
    private state: RxState<{
      loading: boolean;
      movie: MovieDetail | null;
      recommendations: MovieModel[];
      cast: MovieCastModel[];
    }>
  ) {
    state.set({
      movie: null,
      recommendations: [],
      cast: [],
      loading: true,
    });
    this.connectMovie();
    this.state.connect(
      'recommendations',
      this.id$.pipe(
        switchMap((id) =>
          this.tmdb.getMovieRecomendations(id).pipe(
            map((res: any) => res.results),
            startWith([])
          )
        )
      )
    );
    this.state.connect(
      'cast',
      this.id$.pipe(
        switchMap((id) =>
          this.tmdb.getCredits(id).pipe(
            map((res: any) => res.cast || []),
            startWith([])
          )
        )
      )
    );
  }

  toGenre(genre: MovieGenreModel) {
    this.router.navigate(['/genre', genre.id]);
  }

  back() {
    this.location.back();
  }

  private connectMovie(): void {
    this.state.connect(
      this.id$.pipe(
        switchMap((id) =>
          this.tmdb.getMovie(id).pipe(
            map((res: any) => {
              if (res.spoken_languages.length !== 0) {
                res.spoken_languages = res.spoken_languages[0].english_name;
              } else {
                res.spoken_languages = false;
              }
              res.languages_runtime_release = `${
                res.spoken_languages + ' / ' || ''
              } ${res.runtime} MIN. / ${new Date(
                res.release_date
              ).getFullYear()}`;
              return {
                movie: res as MovieDetail,
                loading: false,
              };
            }),
            startWith({
              loading: true,
              movie: null,
            })
          )
        )
      )
    );
  }

  trackByGenre: TrackByFunction<MovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<MovieCastModel> = (_, cast) => cast.cast_id;
}
