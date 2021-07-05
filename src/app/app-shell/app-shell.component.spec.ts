import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
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
import { Observable, of } from 'rxjs';
import { AppShellComponent } from './app-shell.component';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../shared/service/storage/storage.service';

const translations: any = {foo: 'bar'};

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
    messagingSenderId: 'bar'
  };

  beforeEach(waitForAsync(() => {

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
        AngularFireAuthModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: FakeLoader},
        }),
        ServiceWorkerModule.register('', {enabled: false})
      ],
      declarations: [
        AppShellComponent
      ],
      providers: [
        AuthService,
        AngularFireAuthModule,
        AngularFirestoreModule,
        StorageService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
