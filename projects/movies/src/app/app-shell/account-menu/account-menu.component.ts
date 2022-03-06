import { LetModule } from '@rx-angular/template/let';
import { RxState } from '@rx-angular/state';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getActions } from '../../shared/rxa-custom/actions';
import { AuthEffects } from '../../shared/auth/auth.effects';
import { AuthState } from '../../shared/auth/auth.state';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RxEffects } from '@rx-angular/state/effects';
export const imports = [RouterModule, CommonModule, LetModule];

@Component({
  selector: 'account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, RxEffects],
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
    private state: RxState<{ loggedIn: boolean }>,
    private effects: RxEffects
  ) {
    this.state.connect(
      'loggedIn',
      this.authState.accountId$.pipe(map((s) => s !== null))
    );
    this.effects.register(this.ui.signOut$, this.authEffects.signOut);
    this.effects.register(
      this.ui.signIn$,
      this.authEffects.approveRequestToken
    );
  }
}
