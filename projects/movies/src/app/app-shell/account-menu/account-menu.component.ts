import {RxLet} from '@rx-angular/template/let';
import {rxState} from '@rx-angular/state';
import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation,} from '@angular/core';
import {AuthEffects} from '../../auth/auth.effects';
import {RouterLink} from '@angular/router';
import {RxIf} from '@rx-angular/template/if';
import {AccountState} from '../../state/account.state';
import {rxEffects} from "@rx-angular/state/effects";
import {rxActions} from "@rx-angular/state/actions";

export const imports = [RouterLink, RxLet, RxIf];

type Actions = {
  signOut: Event;
  signIn: Event;
};

@Component({
  standalone: true,
  imports: [RouterLink, RxIf, RxLet],
  selector: 'ct-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export default class AccountMenuComponent {
  private readonly effects = rxEffects();
  private readonly authEffects = inject(AuthEffects);
  private readonly accountState = inject(AccountState);
  private readonly state = rxState<{ loggedIn: boolean }>();

  ui = rxActions<Actions>();

  loggedIn$ = this.state.select('loggedIn');

  constructor() {
    this.state.connect('loggedIn', this.accountState.loggedIn$);
    this.effects.register(this.ui.signOut$, this.authEffects.signOut);
    this.effects.register(this.ui.signIn$, this.authEffects.signInStart);
  }
}
