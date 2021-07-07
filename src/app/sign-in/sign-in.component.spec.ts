import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MoviesFirebase, MoviesFirestore } from '../firebase-app';
import { SignInComponent } from './sign-in.component';

const translations: any = { foo: 'bar' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

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
          MatSnackBarModule,
          RouterTestingModule,
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader },
          }),
        ],
        declarations: [SignInComponent],
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
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
