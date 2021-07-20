import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Tmdb2Service } from './tmdb/tmdb2.service';
import { MovieGenreModel } from '../../movies/model/movie-genre.model';
import {
  distinctUntilChanged,
  exhaustMap,
  filter,
  pluck,
} from 'rxjs/operators';

interface State {
  genres: MovieGenreModel[];
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private state = new BehaviorSubject<State>({} as State);
  private commands = new Subject<{ type: string; payload?: any }>();

  genres$ = this.state.pipe(pluck('genres'), distinctUntilChanged());

  constructor(private tmdb2Service: Tmdb2Service) {
    this.commands
      .pipe(
        filter((command) => command.type === 'refreshGenres'),
        exhaustMap(() => this.tmdb2Service.getGenres())
      )
      .subscribe((genres) => this.reduceSlice({ genres }));

    // move into app initializer
    this.refreshGenres();
  }

  refreshGenres() {
    this.commands.next({ type: 'refreshGenres' });
  }

  private reduceSlice(slice: Partial<State>) {
    console.log(slice);
    this.state.next({ ...this.state.getValue(), ...slice });
  }
}
