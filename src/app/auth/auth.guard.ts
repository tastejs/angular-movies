import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthStateService } from './auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthStateService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkLogin();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(): boolean | Observable<boolean> {
    return this.checkLogin();
  }

  checkLogin(): Observable<boolean> {
    return this.authService.accountId$.pipe(map((auth) => !!auth));
  }
}
