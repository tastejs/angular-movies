import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp } from 'firebase/app';
import {
  Auth,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  User as FireUser,
} from 'firebase/auth';
import { doc, FirebaseFirestore, getDoc, updateDoc } from 'firebase/firestore';
import { ConnectableObservable, of, ReplaySubject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  publishReplay,
  switchMap,
} from 'rxjs/operators';
import { MoviesFirebase, MoviesFirestore } from '../firebase-app';

interface User extends FireUser {
  pseudo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // tslint:disable-next-line:variable-name
  private _user = new ReplaySubject<User>(1);
  user = this._user.pipe(
    map((u) => u?.uid),
    distinctUntilChanged(),
    switchMap((uid) => {
      if (uid) {
        return getDoc(doc(this.store, `Users/${uid}`)).then((userData) =>
          userData.data()
        );
      } else {
        return of(null);
      }
    }),
    publishReplay(1)
  );
  redirectUrl: string;
  uid = '';
  private readonly fireAuth: Auth;
  constructor(
    private router: Router,
    @Inject(MoviesFirestore) private store: FirebaseFirestore,
    @Inject(MoviesFirebase) app: FirebaseApp
  ) {
    this.fireAuth = getAuth(app);
    (this.user as ConnectableObservable<User>).connect();
    onAuthStateChanged(this.fireAuth, this._user);
  }

  oAuthLogin(name: string, callback: any) {
    return signInWithPopup(this.fireAuth, this.getProvider(name))
      .then((credential) => {
        callback();
        this.updateUserData(credential.user);
      })
      .catch((err) => callback(err));
  }

  getProvider(name: string) {
    switch (name) {
      case 'google':
        return new GoogleAuthProvider();
      case 'facebook':
        return new FacebookAuthProvider();
      case 'twitter':
        return new TwitterAuthProvider();
    }
  }

  signOut() {
    signOut(this.fireAuth).then(() => this.router.navigate(['/']));
  }

  readUser() {
    return this._user;
  }

  deleteUser(callback: any) {
    return signOut(this.fireAuth).catch(callback);
  }

  private updateUserData(user) {
    return updateDoc(doc(this.store, `Users/${user.uid}`), {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      uid: user.uid,
      pseudo: null,
    });
  }
}
