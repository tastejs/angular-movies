import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ListDetailAdapter } from '../list-detail-page.adapter';

@Component({
  selector: 'ct-list-movies',
  template: `<ui-movie-list [movies]="adapter.movies$"></ui-movie-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMoviesComponent {
  constructor(public adapter: ListDetailAdapter) {}
}
