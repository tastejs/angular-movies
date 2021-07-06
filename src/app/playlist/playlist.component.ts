import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, TrackByFunction} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ShareModalComponent } from '../shared/component/share-modal/share-modal.component';
import { MovieDatabaseModel } from '../shared/model/movie-database.model';
import { DatabaseService } from '../shared/service/database/database.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistComponent implements OnInit, OnDestroy {
  isLoadingResults = false;
  moviesToWatch: MovieDatabaseModel[] = [];
  moviesWatched: MovieDatabaseModel[] = [];
  sub: Subscription;

  constructor(
    private databaseService: DatabaseService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.isLoadingResults = true;
    this.sub = this.databaseService.getMoviesCategoriesMovieLater().subscribe((response) => {
      this.moviesToWatch = response.filter(val => val.watched === false);
      this.moviesWatched = response.filter(val => val.watched === true);
      this.isLoadingResults = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteMovie(id: number) {
    this.databaseService.deleteMoviesCategoriesDefault('MovieLater', id, error => {
      if (error) {
        this.snackBar.open(error, 'Hide', { duration: 5000 });
      } else {
        this.translateService.get('Error.List-updated').subscribe(results => this.snackBar.open(results, '', { duration: 2000 }));      }
    });
  }

  shareDialog(movie: MovieDatabaseModel): void {
    this.dialog.open(ShareModalComponent, {
      data: { id: movie.movieId, original_title: movie.original_title }
    });
  }

  watchedMovie(movieId: number, watched: boolean) {
    this.databaseService.updateMovieCategoriesDefault(movieId, watched, error => {
      if (error) {
        this.snackBar.open(error, 'Hide', { duration: 5000 });
      } else {
        this.translateService.get('Error.List-updated').subscribe(results => this.snackBar.open(results, '', { duration: 2000 }));      }
    });
  }


  trackByMovie: TrackByFunction<MovieDatabaseModel> = (idx, movie) => movie.id;

}
