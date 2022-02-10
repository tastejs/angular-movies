import { RxState } from '@rx-angular/state';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  AccountListPageAdapter,
  AccountListPageAdapterState,
} from './account-list-page.adapter';

@Component({
  selector: 'ct-person',
  templateUrl: './account-list-page.component.html',
  styleUrls: ['./account-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState],
})
export class AccountListPageComponent {
  readonly listState$ = this.state.select('lists');

  constructor(
    private adapter: AccountListPageAdapter,
    private state: RxState<AccountListPageAdapterState>
  ) {
    this.state.connect(this.adapter.list$);
  }

  back() {
    // this.location.back();
  }
}
