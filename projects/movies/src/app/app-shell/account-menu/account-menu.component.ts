import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getActions } from '../../shared/rxa-custom/actions';
import { AuthEffects } from '../../data-access/auth/auth.effects';
import { RxState } from '@rx-angular/state';
import { AuthState } from '../../data-access/auth/auth.state';
import { map, tap } from 'rxjs';

@Component({
  selector: 'account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class AccountMenuComponent {
  ui = getActions<{
    signOut: Event;
    signIn: Event;
  }>();

  loggedIn$ = this.state.select('loggedIn');

  constructor(
    private authEffects: AuthEffects,
    private authState: AuthState,
    private state: RxState<{ loggedIn: boolean }>
  ) {
    this.state.connect(
      'loggedIn',
      this.authState.accountId$.pipe(
        tap(console.log),
        map((s) => s === null)
      )
    );
    this.state.hold(this.ui.signOut$, () => this.authEffects.signOut());
    this.state.hold(this.ui.signIn$, () =>
      this.authEffects.approveRequestToken()
    );
  }
}
