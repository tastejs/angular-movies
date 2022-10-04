import { LetModule } from '@rx-angular/template/let';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
import { AuthEffects } from '../../shared/auth/auth.effects';
import { AuthState } from '../../shared/auth/auth.state';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IfModule } from '@rx-angular/template/experimental/if';
import { describeRxState } from '../../shared/rxa-custom/rx-state.definition';
import { describeRxEffects } from '../../shared/rxa-custom/effects.definition';

export const imports = [RouterModule, CommonModule, LetModule, IfModule];

type Actions = {
  signOut: Event;
  signIn: Event;
};

const { provide: provideRxState, inject: injectRxState } = describeRxState<{
  loggedIn: boolean;
}>();
const { provide: provideRxEffects, inject: injectRxEffects } =
  describeRxEffects();

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, LetModule, IfModule],
  selector: 'account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideRxState(), provideRxEffects()],
})
export class AccountMenuComponent {
  ui = this.actionsF.create();
  private effects = injectRxEffects();
  private state = injectRxState();
  loggedIn$ = this.state.select('loggedIn');

  constructor(
    private authEffects: AuthEffects,
    private authState: AuthState,

    private actionsF: RxActionFactory<Actions>
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
