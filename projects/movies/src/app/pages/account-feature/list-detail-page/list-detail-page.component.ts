import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LetDirective } from '@rx-angular/template/let';
import { RxFor } from '@rx-angular/template/for';
import { MovieListComponent } from '../../../ui/pattern/movie-list/movie-list.component';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ListDetailAdapter } from './list-detail-page.adapter';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    LetDirective,
    RxFor,
    MovieListComponent,
    FastSvgComponent,
  ],
  selector: 'ct-list-detail-page',
  templateUrl: './list-detail-page.component.html',
  styleUrls: ['./list-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListDetailPageComponent {
  public readonly adapter = inject(ListDetailAdapter);
  readonly tabs = [
    {
      name: 'View List',
      link: 'view',
    },
    {
      name: 'Edit List',
      link: 'edit',
    },
    {
      name: 'Add/Remove Items',
      link: 'add-remove-items',
    },
    {
      name: 'Choose Image',
      link: 'image',
    },
    {
      name: 'Delete List',
      link: 'delete',
    },
  ];
}
