import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { MoviesFirebase, MoviesFirestore } from '../firebase-app';
import { AppShellComponent } from './app-shell.component';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../shared/service/storage/storage.service';

const translations: any = { foo: 'bar' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('AppShellComponent', () => {
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
          BrowserAnimationsModule,
          FormsModule,
          MatFormFieldModule,
          MatIconModule,
          MatSelectModule,
          MatSidenavModule,
          MatSnackBarModule,
          MatToolbarModule,
          RouterTestingModule,
          HttpClientTestingModule,
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader },
          }),
          ServiceWorkerModule.register('', { enabled: false }),
        ],
        declarations: [AppShellComponent],
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
          StorageService,
        ],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
