import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { MoviesFirebase, MoviesFirestore } from '../firebase-app';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const firebaseConfig = {
    apiKey: 'foo',
    authDomain: 'bar',
    databaseURL: 'baz',
    projectId: '0',
    storageBucket: 'foo',
    messagingSenderId: 'bar',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
    });
  });

  it('should ...', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
