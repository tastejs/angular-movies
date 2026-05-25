import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthEffects } from '../../auth/auth.effects';
import { RouterLink } from '@angular/router';
import { AccountState } from '../../state/account.state';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [RouterLink],
  selector: 'app-account-menu',
  template: `
    @if (loggedIn() === true) {
      <div><a [routerLink]="['account/list/create']">Create New List</a></div>
      <div><a [routerLink]="['account/my-lists']">My Lists</a></div>
      <div>
        <a
          data-uf="profile-menu-item-signout"
          (click)="authEffects.signOut()"
          title="sign out"
          [routerLink]="'/list/category/popular'"
        >
          Logout
        </a>
      </div>
    } @else if (loggedIn() === false) {
      <div><p>Guest Profile</p></div>
      <div>
        <button
          type="button"
          class="functionality-only-button"
          data-uf="profile-menu-item-login"
          (click)="authEffects.signInStart()"
          title="sign in"
        >
          Login
        </button>
      </div>
    }
  `,
  styleUrls: ['./account-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountMenuComponent {
  authEffects = inject(AuthEffects);
  accountState = inject(AccountState);

  loggedIn = toSignal(this.accountState.loggedIn$);
}
