import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
/* SERVICES */
import { TmdbService } from '../shared/service/tmdb/tmdb.service';
import { StorageService } from '../shared/service/storage/storage.service';
/* MODEL */
import {
  MoviePersonModel,
  TvCastModel,
  MovieCastModel,
  MovieModel,
  TvCreditsModel,
} from '../movies/model';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarComponent implements OnInit {
  person: MoviePersonModel;
  movies: MovieCastModel[];
  tvCredits: TvCastModel[];
  isLoadingResults: boolean;
  lang: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.isLoadingResults = true;
    this.lang = this.storageService.read('language');
    const id = this.route.snapshot.paramMap.get('id');
    const getPerson = this.tmdbService.getPerson(+id, this.lang);
    const getPersonMovies = this.tmdbService.getPersonMovies(+id, this.lang);
    const getPersonTv = this.tmdbService.getPersonTv(+id, this.lang);

    forkJoin([getPerson, getPersonMovies, getPersonTv]).subscribe(
      ([person, movies, tvCredits]) => {
        this.isLoadingResults = false;
        this.person = person;
        this.movies = movies.cast.slice(0, 10);
        this.tvCredits = tvCredits.cast.slice(0, 10);
      }
    );
  }

  back() {
    this.location.back();
  }

  trackByMovies: TrackByFunction<MovieModel> = (idx, movie) => movie.id;
  trackByTvCredits: TrackByFunction<TvCreditsModel> = (idx, tvCredits) =>
    tvCredits.id
}
