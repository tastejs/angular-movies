import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  error: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  login(name: string) {
    this.authService.oAuthLogin(name, (error) => {
      if (error) {
        this.error = error;
        this.snackBar.open(this.error, 'hide', { duration: 10000 });
      } else {
        this.authService.readUser().subscribe(authData => {
          if (authData) {
            this.translateService.get('Error.Welcome').subscribe(results =>
              this.snackBar.open(results + ' ' + authData.displayName , '', { duration: 2000 })
            );
            this.router.navigate(['/movies/now-playing']);
          }
        });
      }
    });
  }
}
