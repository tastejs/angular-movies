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
import { ForModule } from '@rx-angular/template/for';
import { RxState } from '@rx-angular/state';
import { GridListComponent } from '../../../ui/component/grid-list/grid-list.component';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

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

  state = new RxState<{ prop1: number; prop2: string }>();

  constructor(private adapter: AccountListPageAdapter) {
    const prop1$ = this.state.select('prop1');
    const _prop1$ = this.state.select(map(({ prop1 }) => prop1));
    // --> prop$
    const __prop1$ = this.state.prop1$;

    this.state.connect('prop1', concat(of('a'), of('b')));
    this.state.connect(of({ prop1: 'a' }));
    // $prop <--
    this.state.$prop1(of({ prop1: 'a' }));
  }
}
