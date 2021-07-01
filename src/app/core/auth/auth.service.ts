import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from "firebase"
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    phoneNumber?: string;
    pseudo?: string;
}

@Injectable()

export class AuthService {
    user: Observable<User>;
    redirectUrl: string;
    uid = '';

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`Users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }

    oAuthLogin(name: string, callback: any) {
        return this.afAuth.signInWithPopup(this.getProvider(name))
            .then(credential => {
                callback();
                this.updateUserData(credential.user);
            })
            .catch(err => callback(err));
    }

    getProvider(name: string) {
        switch (name) {
            case 'google': return new firebase.auth.GoogleAuthProvider();
            case 'facebook': return new firebase.auth.FacebookAuthProvider();
            case 'twitter': return new firebase.auth.TwitterAuthProvider();
        }
    }

    signOut() {
        this.afAuth.signOut().then(() => this.router.navigate(['/']));
    }

    readUser() {
        return this.afAuth.authState;
    }


    deleteUser(callback: any) {
        return this.afAuth.authState.subscribe(authState => {
            authState.delete()
                .then(success => callback())
                .catch(error => callback(error));
        });
    }

    private updateUserData(user) {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`Users/${user.uid}`);
        const data: User = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            uid: user.uid,
            pseudo: null
        };

        return userRef.set(data, { merge: true});
    }
}
