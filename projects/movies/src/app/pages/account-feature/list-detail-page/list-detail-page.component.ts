import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ListDetailAdapter } from './list-detail-page.adapter';
import { LetModule } from '@rx-angular/template/let';
import { ForModule } from '@rx-angular/template/experimental/for';
import { MovieListComponent } from '../../../ui/pattern/movie-list/movie-list.component';
import { FastIconModule } from '../../../shared/fast-icon/fast-icon.module';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    LetModule,
    ForModule,
    MovieListComponent,
    FastIconModule,
  ],
  selector: 'ct-list-detail-page',
  templateUrl: './list-detail-page.component.html',
  styleUrls: ['./list-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListDetailPageComponent {
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

  constructor(public adapter: ListDetailAdapter) {}
}
