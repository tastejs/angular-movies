import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  NavigationExtras,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router, private af: AngularFireAuth) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean | Observable<boolean> {
    const url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): Observable<boolean> {
    return this.af.authState.pipe(
      map((auth) => {
        if (auth === null) {
          // Store the attempted URL for redirecting
          this.authService.redirectUrl = url;
          // Create a dummy session id
          const sessionId = 123456789;

          // Set our navigation extras object
          // that contains our global query params and fragment
          const navigationExtras: NavigationExtras = {
            queryParams: {session_id: sessionId},
            fragment: 'anchor'
          };

          // Navigate to the login page with extras
          this.router.navigate(['/sign-in'], navigationExtras);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
