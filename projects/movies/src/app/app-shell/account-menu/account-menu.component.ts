import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { getActions } from '../../shared/rxa-custom/actions';
import { AuthEffects } from '../../data-access/auth/auth.effects';
import { RxState } from '@rx-angular/state';
import { AuthStateService } from '../../data-access/auth/auth.state';
import { map } from 'rxjs';

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
    private router: Router,
    private authEffects: AuthEffects,
    private authState: AuthStateService,
    private state: RxState<{ loggedIn: boolean }>
  ) {
    this.state.connect(
      'loggedIn',
      this.authState.accountId$.pipe(map((s) => s === null))
    );
  }

  signIn() {
    this.authEffects.approveRequestToken();
  }

  signOut() {
    this.authEffects.signOut();
    this.router.navigate(['/movies/popular']);
  }
}
