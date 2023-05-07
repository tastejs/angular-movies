import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ListDetailAdapter } from '../list-detail-page.adapter';
import { MovieListComponent } from '../../../../ui/pattern/movie-list/movie-list.component';

@Component({
  standalone: true,
  imports: [MovieListComponent],
  selector: 'ct-list-movies',
  template: `<ui-movie-list [movies]="adapter.movies$"></ui-movie-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListMoviesComponent {
  public readonly adapter = inject(ListDetailAdapter);
}
