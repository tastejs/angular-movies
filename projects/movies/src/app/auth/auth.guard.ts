import {inject, Injectable} from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { Observable, map } from 'rxjs';
import {AuthState} from "../state/auth.state";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  private readonly authService = inject(AuthState);

  canActivate(): Observable<boolean> | boolean {
    return this.checkLogin();
  }

  canActivateChild(): boolean | Observable<boolean> {
    return this.canActivate();
  }

  canLoad(): boolean | Observable<boolean> {
    return this.checkLogin();
  }

  checkLogin(): Observable<boolean> {
    return this.authService.accountId$.pipe(map((auth) => !!auth));
  }
}
