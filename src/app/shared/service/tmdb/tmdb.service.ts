import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  MovieCategoryModel,
  MovieCreditsModel,
  MovieDetailsModel,
  MoviePersonModel,
  MovieVideosModel,
  TvCreditsModel
} from '../../../movies/model';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private API_KEY = '431bc17da732dfb3be082e58f7a5cf27';
  private URL_DISCOVER = 'https://api.themoviedb.org/3/discover/movie';
  private URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
  private URL_MOVIE = 'https://api.themoviedb.org/3/movie';
  private URL_PERSON = 'https://api.themoviedb.org/3/person';
  private URL_GENRE = 'https://api.themoviedb.org/3/genre';

  constructor(private http: HttpClient) {
  }

  getMovie(category: string, page: number, lang: string, adult?: string) {
    switch (category) {
      case 'now-playing': return this.getNowPlaying(page, lang);
      case 'upcoming': return this.getUpComing(page, lang);
      case 'discover': return this.getMovieDiscover(page, lang, adult);
    }
  }
  getSearchMovie(name: string, page: number, lang: string, adult: string): Observable<MovieCategoryModel> {
    return this.http.get<MovieCategoryModel>(`
      ${this.URL_SEARCH}?api_key=${this.API_KEY}&language=${lang}&query=${name}&page=${page}&include_adult=${adult}
    `);
  }
  getNowPlaying(page: number, lang: string): Observable<MovieCategoryModel> {
    return this.http.get<MovieCategoryModel>(`${this.URL_MOVIE}/now_playing?api_key=${this.API_KEY}&language=${lang}&page=${page}`);
  }
  getDetailsMovie(movieID: number, lang: string): Observable<MovieDetailsModel> {
    return this.http.get<MovieDetailsModel>(`${this.URL_MOVIE}/${movieID}?api_key=${this.API_KEY}&language=${lang}`);
  }
  getMovieDiscover(page: number, lang: string, adult: string): Observable<MovieCategoryModel> {
    return this.http.get<MovieCategoryModel>(`
      ${this.URL_DISCOVER}?api_key=${this.API_KEY}&language=${lang}&sort_by=popularity.desc&page=${page}&include_adult=${adult}
    `);
  }
  getCastMovie(movieID: number): Observable<MovieCreditsModel> {
    return this.http.get<MovieCreditsModel>(`${this.URL_MOVIE}/${movieID}/credits?api_key=${this.API_KEY}`);
  }
  getVideoMovie(movieID: number, lang: string): Observable<MovieVideosModel> {
    return this.http.get<MovieVideosModel>(`${this.URL_MOVIE}/${movieID}/videos?api_key=${this.API_KEY}&language=${lang}`);
  }
  getGenreMovie(genreID: number, page: number, lang: string, adult: string): Observable<MovieCategoryModel> {
    return this.http.get<MovieCategoryModel>(`
      ${this.URL_GENRE}/${genreID}/movies?api_key=${this.API_KEY}&language=${lang}&page=${page}&include_adult=${adult}
    `);
  }
  getSimilarMovies(movieID: number, lang: string): Observable<MovieCategoryModel> {
    return this.http.get<MovieCategoryModel>(`${this.URL_MOVIE}/${movieID}/similar?api_key=${this.API_KEY}&language=${lang}`);
  }
  getUpComing(page: number, lang: string): Observable<MovieCategoryModel> {
    return this.http.get<MovieCategoryModel>(`${this.URL_MOVIE}/upcoming?api_key=${this.API_KEY}&language=${lang}&page=${page}`);
  }
  getPerson(personID: number, lang: string): Observable<MoviePersonModel> {
    return this.http.get<MoviePersonModel>(`${this.URL_PERSON}/${personID}?api_key=${this.API_KEY}&language=${lang}`);
  }
  getPersonMovies(personID: number, lang: string): Observable<MovieCreditsModel> {
    return this.http.get<MovieCreditsModel>(`${this.URL_PERSON}/${personID}/movie_credits?api_key=${this.API_KEY}&language=${lang}`);
  }
  getPersonTv(personID: number, lang: string): Observable<TvCreditsModel> {
    return this.http.get<TvCreditsModel>(`${this.URL_PERSON}/${personID}/tv_credits?api_key=${this.API_KEY}&language=${lang}`);
  }
  getPager(totalPages: number, currentPage: number = 1) {
    let startPage = 0;
    let endPage = 0;
    if (totalPages >= 1000) {
      totalPages = 1000;
    }
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else if (currentPage >= 1000) {
        startPage = currentPage - 5;
        currentPage = 1000;
        totalPages = 1000;
        endPage = 1000;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // create an array of pages to ng-repeat in the pager control
    const pages = new Array(startPage, currentPage, endPage);

    // return object with all pager properties required by the view
    return {
      currentPage,
      totalPages,
      startPage,
      endPage,
      pages
    };
  }

}
