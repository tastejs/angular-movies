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

@Component({
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
