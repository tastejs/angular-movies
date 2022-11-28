import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth/auth.service';
import { DatabaseService } from '../../shared/service/database/database.service';
import { MovieModel } from '../shared/movie.model';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  @Input() title: string | number;
  @Input() movies: MovieModel[];
  @Input() adult: string;
  @Input() lang: string;
  @Input() dataParam: string;

  constructor(
    public authService: AuthService,
    private databaseService: DatabaseService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  movieById(movie: MovieModel) {
    return movie.id;
  }

  addMovie(movie: any) {
    this.databaseService.addMovieCategoriesDefault(
      movie,
      'MovieLater',
      error => {
        if (error) {
          this.snackBar.open(error, 'Hide', { duration: 5000 });
        } else {
          this.translateService
            .get('Error.Movie-added')
            .subscribe(results =>
              this.snackBar.open(results, '', { duration: 2000 })
            );
        }
      }
    );
  }
}
