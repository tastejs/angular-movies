import { TMDBMovieModel } from '../../data-access/model/movie.model';
import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { RouterState } from '../../shared/state/router.state';
import { combineLatest, map, startWith, switchMap } from 'rxjs';
import { W780H1170 } from '../../data-access/configurations/image-sizes';
import { TMDBMovieCastModel } from '../../data-access/model/movie-cast.model';
import { MovieDetailsModel } from '../../data-access/model/movie-details.model';
import { ImageTag } from '../../shared/utils/image/image-tag.interface';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { MovieState } from '../../shared/state/movie.state';
import { addImageTag } from '../../shared/utils/image/image-tag.transform';
import { getCredits, getMoviesRecommendations } from '../../data-access/api/movie.resource';
import { addVideoTag } from '../../shared/utils/video/video-tag.transform';
import { VideoTag } from '../../shared/utils/video/video.interface';

export type MovieDetail = MovieDetailsModel & ImageTag & VideoTag & { languages_runtime_release: string };

export interface MovieDetailPageModel {
  loading: boolean;
  movie: MovieDetail;
  recommendations: TMDBMovieModel[];
  cast: TMDBMovieCastModel[];
}

function transformToMovieDetail(_res: TMDBMovieModel): MovieDetail {
  const res = _res as unknown as MovieDetail;
  let language: string | boolean = false;
  if (Array.isArray(res?.spoken_languages) && res?.spoken_languages.length !== 0) {
    language = res.spoken_languages[0].english_name;
  }
  res.languages_runtime_release = `${
    language + ' / ' || ''
  } ${res.runtime} MIN. / ${new Date(
    res.release_date
  ).getFullYear()}`;

  addVideoTag(res, { pathPropFn: (r: any) => r?.videos?.results[0]?.key + '' });
  addImageTag(res, { pathProp: 'poster_path', dims: W780H1170 });
  return res as MovieDetail;
}

@Injectable({
  providedIn: 'root',
})
export class MovieDetailAdapter extends RxState<MovieDetailPageModel> {
  routedMovieSlice$ = this.select(selectSlice(['movie', 'loading']));
  routerMovieId$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('movie', 'detail')
  );

  movieRecomendationsById$ = this.routerMovieId$.pipe(
    switchMap((identifier) =>
      getMoviesRecommendations(identifier).pipe(
        map((res: any) => res.results),
        startWith([])
      )
    )
  );

  movieCastById$ = this.routerMovieId$.pipe(
    switchMap((identifier) =>
      getCredits(identifier).pipe(
        map((res: any) => res.cast || []),
        startWith([])
      )
    )
  );

  constructor(
    private movieState: MovieState,
    private routerState: RouterState) {
    super();
    this.connect(
      combineLatest({
        id: this.routerMovieId$,
        globalSlice: this.movieState.select(
          selectSlice(['movies', 'moviesContext'])
        ),
      }).pipe(
        map(({ id, globalSlice }) => {
          const { movies, moviesContext: loading } = globalSlice;
          return {
            loading,
            movie:
              movies[id] !== undefined
                ? transformToMovieDetail(movies[id])
                : null,
          } as MovieDetailPageModel;
        })
      )
    );
  }
}
