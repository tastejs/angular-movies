import { Inject, Injectable } from '@angular/core';
import { collection, deleteDoc, doc, FirebaseFirestore, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { MoviesFirestore } from '../../../firebase-app';
import { MovieGenreModel, MovieModel } from '../../../movies/model';
import { MovieDatabaseModel } from '../../model/movie-database.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  uid = '';

  constructor(
    private authService: AuthService,
    @Inject(MoviesFirestore) private store: FirebaseFirestore,
  ) {
    this.authService.readUser().subscribe(auth => {
      auth ? this.uid = auth.uid : this.uid = null;
    });
  }

  /* CATEGORIES*/
  addCategories(name: string, callback: any) {
    const category = {
      userId: this.uid,
      name
    };

    return setDoc(doc(this.store, `Categories/${ this.uid }_${ name }`), category)
      .then(success => callback())
      .catch(err => callback(err));
  }

  getAllCategoriesUser(): Observable<MovieGenreModel[]> {
    const q = query(collection(this.store, 'Categories'), where('userId', '==', this.uid));
    return new Observable(observer => {
      return onSnapshot(q, {
        next: snap => observer.next(snap.docs.map(s => s.data() as MovieGenreModel)),
        error: e => observer.error(e),
        complete: () => observer.complete()
      });
    });
  }

  deleteCategories(category: string, callback: any) {
    return deleteDoc(doc(this.store, `Categories/${ this.uid }_${ category }`))
      .then(success => callback())
      .catch(err => callback(err));
  }
  /* MOVIES TO CATEGORY */
  addMovieCategory(movie: any, category: string, callback: any) {
    const movieDetails = {
      userId: this.uid,
      movieId: movie.id,
      date: new Date(),
      original_title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      category,
      status: movie.status || null,
      watched: false
    };

    return setDoc(
      doc(this.store, `Categories/${ this.uid }_${ category }`, 'movies', `${ this.uid }_${ movie.id }`),
      movieDetails,
      { merge: true }
    )
      .then(success => callback())
      .catch(err => callback(err));
  }
  getMovieCategory(category: string) {
    const q = query(collection(this.store, 'Categories', `${ this.uid }_${ category }`, 'movies'), where('userId', '==', this.uid));
    return new Observable(observer => {
      return onSnapshot(q, {
        next: snap => observer.next(snap.docs.map(s => s.data())),
        error: e => observer.error(e),
        complete: () => observer.complete()
      });
    });
  }
  deleteMovieCategory(category: string, id: number, callback: any) {
    return deleteDoc(doc(this.store, `Categories/${ this.uid }_${ category }`, 'movies', `${ this.uid }_${ id }`))
      .then(success => callback())
      .catch(err => callback(err));
  }
  /* CATEGORIES DEFAULT */
  addMovieCategoriesDefault(movie: any, category: string, callback: any) {
    const movieDetails = {
      userId: this.uid,
      movieId: movie.id,
      date: new Date(),
      original_title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      category,
      status: movie.status || null,
      watched: false
    };

    return setDoc(doc(this.store, `${ category }/${ this.uid }_${ movie.id }`), movieDetails)
      .then(success => callback())
      .catch(err => callback(err));
  }

  getMoviesCategoriesDefault<T = MovieModel>(category: string): Observable<T[]> {
    const q = query(collection(this.store, category), where('userId', '==', this.uid), orderBy('date', 'desc'));
    return new Observable(observer => {
      return onSnapshot(q, {
        next: snap => observer.next(snap.docs.map(s => s.data() as T)),
        error: e => observer.error(e),
        complete: () => observer.complete()
      });
    });
  }

  getMoviesCategoriesMovieLater(): Observable<(MovieDatabaseModel)[]> {
    return this.getMoviesCategoriesDefault<MovieDatabaseModel>('MovieLater');
  }
  updateMovieCategoriesDefault(movieId: number, watched: boolean, callback: any): void {
    updateDoc(doc(this.store, `MovieLater/${ this.uid }_${ movieId }`), { watched })
      .then(success => callback())
      .catch(err => callback(err));
  }
  deleteMoviesCategoriesDefault(category: string, id: number, callback: any) {
    return deleteDoc(doc(this.store, `${ category }/${ this.uid }_${ id }`))
      .then(success => callback())
      .catch(err => callback(err));
  }

  deleteDatafromUser() {
    // waiting feature from firebase
  }

}
