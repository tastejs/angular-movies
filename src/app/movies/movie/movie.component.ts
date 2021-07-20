import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {
  MovieCastModel,
  MovieCrewModel,
  MovieDetailsModel,
  MovieGenreModel,
  MovieModel,
} from '../model';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent implements OnInit {
  id: number;
  url: string;
  movie: MovieDetailsModel;
  moviesUrl: SafeResourceUrl[];
  videos: any[];
  similarMovies: MovieModel[];
  cast: MovieCastModel[];
  crew: MovieCrewModel[];
  isConnected = false;
  baseUrl = 'https://www.youtube.com/embed/';
  safeUrl: any;
  isLoadingResults = false;
  sub: Subscription;
  categories: string[] = [];
  lang: string;

  constructor(public dialog: MatDialog, private location: Location) {}

  ngOnInit() {}

  back() {
    this.location.back();
  }

  trackByGenre: TrackByFunction<MovieGenreModel> = (idx, genre) => genre.name;
  trackByCategory: TrackByFunction<string> = (idx, category) => category;
  trackByCast: TrackByFunction<MovieCastModel> = (idx, cast) => cast.cast_id;
  trackByUrl: TrackByFunction<SafeResourceUrl> = (idx, url) => url;
}
