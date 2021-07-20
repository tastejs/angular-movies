import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MovieModel } from '../model';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  @Input() title: string | number;
  @Input() movies: MovieModel[];
  @Input() adult: string;
  @Input() lang: string;
  @Input() dataParam: string;

  constructor() {}

  movieById(movie: MovieModel) {
    return movie.id;
  }

  addMovie(movie: any) {}
}
