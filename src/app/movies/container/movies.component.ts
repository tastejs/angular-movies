import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MovieModel } from '../model/movie.model';
import { Observable, Subscription } from 'rxjs';

import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { StorageService } from 'app/shared/service/storage/storage.service';
import * as dayjs from 'dayjs';
import { Pager } from '../../shared/model/pager.model';
import { Tmdb2Service } from '../../shared/service/tmdb/tmdb2.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent implements OnInit {
  request: Observable<any>;
  dataParam: string;
  movies: MovieModel[];
  currentPage: number;
  parameter: string | number;
  pager: Pager;
  totalPages: number;
  title: string | number;
  loading: boolean;
  lang: string;
  adult: string;
  navigationSubscription: Subscription;
  moviesType: Params;

  constructor(
    private tmdb2Service: Tmdb2Service,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalize the component
      if (e instanceof NavigationEnd) {
        this.reloadPagination();
      }
    });
    this.route.params.subscribe((params: Params) => {
      this.moviesType = params;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.lang = this.storageService.read('language');
    this.adult = this.storageService.read('adult');
    this.currentPage = 1;
    const getCurrentPage: string = sessionStorage.getItem(
      'hubmovies-current-page'
    );
    getCurrentPage
      ? (this.currentPage = Number(getCurrentPage))
      : (this.currentPage = 1);
  }

  getMovies(currentPage: number, params: Params) {
    if (params.term) {
      this.request = this.tmdb2Service.getMovies(
        params.term,
        currentPage,
        this.lang
      );
      this.parameter = params.term;
    } else if (params.category) {
      this.request = this.tmdb2Service.getMovieCategory(params.category);
      console.log('this.request cat', this.request);

      this.parameter = params.category;
    } else if (params.id && params.name) {
      this.request = this.tmdb2Service.getGenres();
      this.parameter = +params.id;
      this.dataParam = params.name;
    } else {
      this.request = null;
      this.loading = false;
    }

    console.log('this.request', this.request);

    if (this.request) {
      this.request.subscribe(
        (response) => {
          console.log('response', response);

          this.parameter === 'upcoming'
            ? (this.movies = response.results.filter((val) =>
                dayjs(val.release_date).isAfter(dayjs().startOf('year'))
              ))
            : (this.movies = response.results);

          this.loading = false;
          this.title = this.parameter;
          this.totalPages = response.total_pages;
          this.pager = this.tmdb2Service.getPager(this.totalPages, currentPage);
          this.cdr.markForCheck();
        },
        (error) => {
          this.loading = false;
        }
      );
    }
    this.loading = false;
  }

  reloadPagination() {
    const findPagination = sessionStorage.getItem('hubmovies-current-page');
    findPagination
      ? (this.currentPage = Number(findPagination))
      : (this.currentPage = 1);
    // this.setPage(this.currentPage);
    this.getMovies(this.currentPage, this.moviesType);
  }

  swipe(currentIndex: number) {
    this.setPage(currentIndex);
  }

  setPage(page: number) {
    this.loading = true;
    if (page < 1 || page > this.pager.totalPages) {
      this.loading = false;
      return;
    }
    this.pager = this.tmdb2Service.getPager(this.totalPages, page);
    this.currentPage = this.pager.currentPage;
    sessionStorage.setItem(
      'hubmovies-current-page',
      this.currentPage.toString()
    );

    this.getMovies(this.currentPage, this.moviesType);
  }
}
