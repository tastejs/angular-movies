import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MovieCastModel,
  MovieDetailsModel,
  MovieGenreModel,
  MovieModel,
} from '../model';
import { Tmdb2Service } from '../../shared/service/tmdb/tmdb2.service';
import { ActivatedRoute } from '@angular/router';
import { W342H513 } from '../../shared/utils/image-sizes';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent implements OnInit {
  movie: MovieDetailsModel & { languages_runtime_release: string };
  recommendations: MovieModel[];
  cast: MovieCastModel[];
  isConnected = false;
  isLoadingResults = false;
  categories: string[] = [];
  W342H513 = W342H513;

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private tmdb: Tmdb2Service,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.tmdb.getMovie(this.route.snapshot.params.id).subscribe((res: any) => {
      if (res.spoken_languages.length !== 0) {
        res.spoken_languages = res.spoken_languages[0].english_name;
      } else {
        res.spoken_languages = false;
      }
      this.movie = res;
      this.movie.languages_runtime_release = `${
        res.spoken_languages + ' / ' || ''
      } ${this.movie.runtime} MIN. / ${new Date(
        this.movie.release_date
      ).getFullYear()}`;
      this.cdr.detectChanges();
    });
    this.tmdb
      .getMovieRecomendations(this.route.snapshot.params.id)
      .subscribe((res: any) => {
        this.recommendations = res.results;
        this.cdr.detectChanges();
      });
    this.tmdb
      .getCredits(this.route.snapshot.params.id)
      .subscribe((res: any) => {
        this.cast = res.cast;
        this.cdr.detectChanges();
      });
  }

  back() {
    this.location.back();
  }

  trackByGenre: TrackByFunction<MovieGenreModel> = (idx, genre) => genre.name;
  trackByCast: TrackByFunction<MovieCastModel> = (idx, cast) => cast.cast_id;
}
