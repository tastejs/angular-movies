import { MovieModel } from '../../data-access/model/movie.model';
import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { RouterState } from '../../shared/state/router.state';
import { combineLatest, map, startWith, switchMap, tap } from 'rxjs';
import { W780H1170 } from '../../data-access/configurations/image-sizes';
import { MovieCastModel } from '../../data-access/model/movie-cast.model';
import { MovieDetailsModel } from '../../data-access/model/movie-details.model';
import { ImageTag } from '../../shared/utils/image-tag.interface';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { MovieState } from '../../shared/state/movie.state';
import { MovieResource } from '../../data-access/api/movie.resource';
import { addImageTag } from '../../shared/utils/image-object.transform';

export type MovieDetail = MovieDetailsModel & ImageTag & { languages_runtime_release: string, videoUrl: string | false };

export interface MovieDetailPageModel {
  loading: boolean;
  movie: MovieDetail;
  recommendations: MovieModel[];
  cast: MovieCastModel[];
}

function transformToMovieDetail(res: any): MovieDetail {
  if (Array.isArray(res?.spoken_languages) && res?.spoken_languages.length !== 0) {
    res.spoken_languages = res.spoken_languages[0].english_name;
  } else {
    res.spoken_languages = false;
  }
  res.languages_runtime_release = `${
    res.spoken_languages + ' / ' || ''
  } ${res.runtime} MIN. / ${new Date(
    res.release_date
  ).getFullYear()}`;

  res.videoUrl = res?.videos?.results[0] || false;

  addImageTag(res, { pathProp: 'poster_path', dims: W780H1170 });
  return res as MovieDetail;
}

@Injectable({
  providedIn: 'root'
})
export class MovieDetailAdapter extends RxState<MovieDetailPageModel> {

  routedMovieSlice$ = this.select(selectSlice(['movie', 'loading']));
  routerMovieId$ = this.routerState.select(getIdentifierOfTypeAndLayout('movie', 'detail'), tap(v => console.log('router detail', v)));

  movieRecomendationsById$ = this.routerMovieId$.pipe(
    switchMap((identifier) =>
      this.movieResource.getMovieRecomendations(identifier).pipe(
        map((res: any) => res.results),
        startWith([])
      )
    )
  );

  movieCastById$ = this.routerMovieId$.pipe(
    switchMap((identifier) =>
      this.movieResource.getCredits(identifier).pipe(
        map((res: any) => res.cast || []),
        startWith([])
      )
    )
  );

  constructor(private movieState: MovieState, private routerState: RouterState, private movieResource: MovieResource) {
    super();
    this.connect(
      combineLatest({ id: this.routerMovieId$, globalSlice: this.movieState.select(selectSlice(['movies', 'moviesContext'])) }).pipe(
        map(({ id, globalSlice }) => {
          const { movies, moviesContext: loading } = globalSlice;
          return ({
            loading,
            movie: movies[id] !== undefined ? transformToMovieDetail(movies[id]) : null
          }) as MovieDetailPageModel;
        }))
    );
  }

}
