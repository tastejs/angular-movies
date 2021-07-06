import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AccountDeleteModalComponent } from './account-delete-modal/account-delete-modal.component';
import * as dayjs from 'dayjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit, OnDestroy {
  displayName: string;
  email: string;
  photoURL: string;
  notPhotoURL: string;
  sub: Subscription;
  creationTime: string;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.sub = this.authService.readUser().subscribe(authData => {
      if (authData) {
        this.displayName = authData.displayName;
        this.email = authData.email;
        this.photoURL = authData.photoURL;
        this.notPhotoURL = authData.displayName.slice(0, 1);
        this.creationTime = dayjs(authData.metadata.creationTime).format('YYYY-MM-D');
      }
    });
  }

  ngOnDestroy() {
        this.sub.unsubscribe();
    }

  deleteAccountDialog() {
    const dialogRef = this.dialog.open(AccountDeleteModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.deleteUser(error => {
          if (error) {
            this.snackBar.open(error, 'hide', { duration: 5000});
          } else {
            this.translateService.get('Error.Delete').subscribe(results => this.snackBar.open(results, '', { duration: 2000 }));
            this.router.navigate(['/movies/now-playing']);
          }
        });
      }
    });
  }

}
