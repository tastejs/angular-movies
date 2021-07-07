import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import { AccountDeleteModalComponent } from './account-delete-modal/account-delete-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { setProp } from '../shared/utils/css-variables';
import { stringColor } from '../shared/utils/color';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  userWithSideEffect$ = this.authService.readUser().pipe(
    filter((u) => u != null),
    map(({ displayName, email, photoURL }) => ({
      displayName,
      email,
      photoURL,
    })),
    // It's bad practice to add a side effect to a data stream and also use it for something else.
    // In this case we do it becase of simplicity
    tap(({ displayName }) => {
      // **🚀 Perf Tip:**
      // Use css variables instead of Angular directives or template experssions to avoid change detection
      setProp('avatarColor', stringColor(displayName.slice(0, 1)));
    })
  );

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  deleteAccountDialog() {
    const dialogRef = this.dialog.open(AccountDeleteModalComponent);

    // @TODO Notice this code includes a side effect
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.deleteUser((error) => {
          if (error) {
            this.snackBar.open(error, 'hide', { duration: 5000 });
          } else {
            this.translateService
              .get('Error.Delete')
              .subscribe((results) =>
                this.snackBar.open(results, '', { duration: 2000 })
              );
            this.router.navigate(['/movies/now-playing']);
          }
        });
      }
    });
  }
}
