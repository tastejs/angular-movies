import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MovieModel } from '../model';
import { W342H513 } from '../../shared/utils/image-sizes';

interface Movie extends MovieModel {
  url: string;
}

@Component({
  selector: 'app-movie-list',
  template: `
    <div class="header">
      <h1 class="title">{{ title }}</h1>
      <h2 class="subtitle" *ngIf="dataParam">{{ dataParam }}</h2>
    </div>
    <div
      class="movies-list--grid"
      *ngIf="movies && movies.length > 0; else noData"
    >
      <a
        class="movies-list--grid-item"
        *ngFor="let movie of movies; trackBy: movieById"
        (click)="toMovie(movie)"
      >
        <div class="movies-list--grid-item-image">
          <img
            loading="lazy"
            [src]="movie.url"
            [width]="W342H513.WIDTH"
            [height]="W342H513.HEIGHT"
            alt="poster movie"
            [title]="movie.title"
          />
        </div>
        <div class="movies-list--grid-item__details">
          <h2 class="movies-list--grid-item__details-title">
            {{ movie.title }}
          </h2>
          <star-rating [rating]="movie.vote_average"></star-rating>
        </div>
      </a>
      <div cass="pagination"></div>
    </div>

    <ng-template #noData>
      <h3>
        No results
        <mat-icon>sentiment_very_dissatisfied</mat-icon>
      </h3>
    </ng-template>
  `,
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  W342H513 = W342H513;

  @Input() title: string | number;
  movies: Movie[];

  @Input('movies')
  set _movies(movies: Movie[]) {
    this.movies = movies.map((m: Movie) => {
      m.url =
        'https://image.tmdb.org/t/p/w' + W342H513.WIDTH + '/' + m.poster_path;
      return m;
    });
  }

  @Input() adult: string;
  @Input() lang: string;
  @Input() dataParam: string;

  constructor(private router: Router) {}

  movieById(idx: number, movie: MovieModel) {
    return movie.id;
  }

  toMovie(movie: MovieModel) {
    this.router.navigate(['movie', movie.id]);
  }

  addMovie(movie: any) {}
}
