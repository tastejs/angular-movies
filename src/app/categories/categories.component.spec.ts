import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MoviesFirebase, MoviesFirestore } from '../firebase-app';
import { DatabaseService } from '../shared/service/database/database.service';
import { CategoriesComponent } from './categories.component';

const translations: any = { foo: 'bar' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  const firebaseConfig = {
    apiKey: 'foo',
    authDomain: 'bar',
    databaseURL: 'baz',
    projectId: '0',
    storageBucket: 'foo',
    messagingSenderId: 'bar',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          MatDialogModule,
          MatIconModule,
          MatListModule,
          MatMenuModule,
          MatProgressSpinnerModule,
          MatTabsModule,
          MatTooltipModule,
          MatSnackBarModule,
          RouterTestingModule,
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader },
          }),
        ],
        declarations: [CategoriesComponent],
        providers: [
          {
            provide: MoviesFirebase,
            useFactory: () =>
              getApps().length === 0
                ? initializeApp(firebaseConfig)
                : getApps()[0],
          },
          {
            provide: MoviesFirestore,
            useFactory: (app: FirebaseApp) => getFirestore(app),
            deps: [MoviesFirebase],
          },
          AuthService,
          DatabaseService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
