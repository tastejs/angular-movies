import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { MoviesFirebase, MoviesFirestore } from '../../firebase-app';
import { DatabaseService } from '../../shared/service/database/database.service';
import { StorageService } from '../../shared/service/storage/storage.service';
import { TmdbService } from '../../shared/service/tmdb/tmdb.service';
import { MovieListComponent } from './movie-list.component';

const translations: any = { foo: 'bar' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;

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
          MatIconModule,
          MatProgressSpinnerModule,
          MatSnackBarModule,
          MatTooltipModule,
          RouterTestingModule,
          LazyLoadImageModule,
          HttpClientTestingModule,
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader },
          }),
        ],
        declarations: [MovieListComponent],
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
          StorageService,
          TmdbService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
