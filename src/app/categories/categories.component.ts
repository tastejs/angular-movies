import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../shared/service/database/database.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MovieDatabaseModel } from '../shared/model/movie-database.model';
import { Subscription } from 'rxjs';
import { ShareModalComponent } from '../shared/component/share-modal/share-modal.component';
import { CategoriesAddModalComponent } from './categories-add-modal/categories-add-modal.component';
import { CategoriesDeleteModalComponent } from './categories-delete-modal/categories-delete-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  movies: Array<any>;
  getCategories: Array<any>;
  isLoadingResults: boolean;
  sub: Subscription;
  categories = [];

  constructor(
    private databaseService: DatabaseService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.isLoadingResults = true;
    this.sub = this.databaseService.getMoviesCategoriesDefault('FavoriteMovie').subscribe(response => {
      this.movies = response;
      this.isLoadingResults = false;
    });

    this.sub = this.databaseService.getAllCategoriesUser().subscribe(response => {
      this.getCategories = response;
      this.categories = this.getCategories.map(value => value.name);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cancelClick(event) {
    event.stopPropagation();
  }

  tabChanged(event: MatTabChangeEvent) {
    const name = event.tab.textLabel;
    if (event.index !== 0) {
      this.sub = this.databaseService.getMovieCategory(name).subscribe(response => {
        this.movies = response;
      });
    } else {
      this.sub = this.databaseService.getMoviesCategoriesDefault('FavoriteMovie').subscribe(response => {
        this.movies = response;
      });
    }
  }

  deleteMovieFromFavorites(id: number, event) {
    event.stopPropagation();
    this.databaseService.deleteMoviesCategoriesDefault('FavoriteMovie', id, (error) => {
        if (error) {
          this.snackBar.open(error, 'Hide', { duration: 5000 });
        } else {
          this.translateService.get('Error.List-updated').subscribe(results => this.snackBar.open(results, '', { duration: 2000 }));
        }
    });
  }

  deleteMovieFromCategory(category: string, id: number) {
    this.databaseService.deleteMovieCategory(category, id, (error) => {
      if (error) {
        this.snackBar.open(error, 'Hide', { duration: 5000 });
      } else {
        this.translateService.get('Error.List-updated').subscribe(results => this.snackBar.open(results, '', { duration: 2000 }));
      }
    });
  }

  shareDialog(movie: MovieDatabaseModel) {
    this.dialog.open(ShareModalComponent, {
      data: { id: movie.movieId, original_title: movie.original_title }
    });
  }

  addCategoryDialog() {
    const dialogRef = this.dialog.open(CategoriesAddModalComponent, {
      data: {name: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.databaseService.addCategories(result, (error) => {
          if (error) {
            this.snackBar.open(error, 'hide', { duration: 5000});
          } else {
            this.translateService.get('Error.List-updated').subscribe(results => this.snackBar.open(results, '', { duration: 2000 }));
          }
        });
      }
    });
  }

  deleteCategoryDialog() {
    const dialogRef = this.dialog.open(CategoriesDeleteModalComponent, {
      width: '250px',
      data: {name: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.databaseService.deleteCategories(result, (error) => {
          if (error) {
            this.snackBar.open(error, 'hide', { duration: 5000});
          } else {
            this.translateService.get('Error.List-updated').subscribe(results => this.snackBar.open(results, '', { duration: 2000 }));
          }
        });
      }
    });
  }

}
