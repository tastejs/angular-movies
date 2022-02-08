import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { TMDBAccountList } from '../../../data-access/api/model/list.model';
import { trackByProp } from '../../../shared/utils/track-by';
import { AccountListPageAdapter } from './account-list-page.adapter';

@Component({
  selector: 'ct-person',
  templateUrl: './account-list-page.component.html',
  styleUrls: ['./account-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class AccountListPageComponent {
  readonly lists$ = this.adapter.select('lists');
  readonly trackById = trackByProp<TMDBAccountList>('id');

  constructor(private adapter: AccountListPageAdapter) {}
}
