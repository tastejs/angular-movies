import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { trackByProp } from '../../../shared/utils/track-by';
import {
  AccountListPageAdapter,
  ListWithPoster,
} from './account-list-page.adapter';
import { ForModule } from '@rx-angular/template/experimental/for';
import { GridListComponent } from '../../../ui/component/grid-list/grid-list.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule, ForModule, GridListComponent],
  selector: 'ct-person',
  templateUrl: './account-list-page.component.html',
  styleUrls: ['./account-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class AccountListPageComponent {
  readonly lists$ = this.adapter.select('lists');
  readonly trackById = trackByProp<ListWithPoster>('id');

  constructor(private adapter: AccountListPageAdapter) {}
}
