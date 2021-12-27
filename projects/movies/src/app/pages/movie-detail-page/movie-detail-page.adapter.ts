import { MovieModel } from '../../data-access/model/movie.model';
import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { StateService } from '../../shared/state/state.service';
import { RouterStateService } from '../../shared/state/router-state.service';
import { map, startWith, switchMap, withLatestFrom } from 'rxjs';
import { W780H1170 } from '../../data-access/configurations/image-sizes';
import { MovieCastModel } from '../../data-access/model/movie-cast.model';
import { MovieDetailsModel } from '../../data-access/model/movie-details.model';
import { ImageTag } from '../../shared/utils/image-object';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';

export type MovieDetail = MovieDetailsModel & ImageTag & { languages_runtime_release: string };

export interface MovieDetailPageModel {
  loading: boolean;
  movie: MovieDetail;
  recommendations: MovieModel[];
  cast: MovieCastModel[];
}

function transformToMovieDetail(res: any): MovieDetail {
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

  res.url = `https://image.tmdb.org/t/p/w${W780H1170.WIDTH}/${res.poster_path}`;
  res.imgWidth = W780H1170.WIDTH;
  res.imgHeight = W780H1170.HEIGHT;
  res.imgRatio = res.imgWidth / res.imgHeight;

  return res as MovieDetail;
}

@Injectable({
  providedIn: 'root'
})
export class MovieDetailAdapter extends RxState<MovieDetailPageModel> {

  routedMovieSlice$ = this.select(selectSlice(['movie', 'loading']))
  routerMovie$ = this.routerState.select(getIdentifierOfTypeAndLayout('movie', 'detail'));


  movieRecomendationsById$ = this.routerMovie$.pipe(
    switchMap((identifier) =>
      this.tmdb.getMovieRecomendations(identifier).pipe(
        map((res: any) => res.results),
        startWith([])
      )
    )
  );

  movieCastById$ = this.routerMovie$.pipe(
    switchMap((identifier) =>
      this.tmdb.getCredits(identifier).pipe(
        map((res: any) => res.cast || []),
        startWith([])
      )
    )
  );

  constructor(private globalState: StateService, private routerState: RouterStateService, private tmdb: Tmdb2Service) {
    super();
    this.connect(this.globalState.select(
      selectSlice(['movies', 'moviesContext']),
      withLatestFrom(this.routerMovie$),
      map(([{ movies, moviesContext }, identifier]) => {
        return ({
            loading: moviesContext,
            movie: transformToMovieDetail(movies[identifier]) || null
          }
        ) as MovieDetailPageModel;
      })
    ));
  }

}
