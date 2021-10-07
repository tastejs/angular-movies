import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import {
  distinctUntilChanged,
  exhaustMap,
  filter,
  pluck,
} from 'rxjs/operators';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { MovieGenreModel } from '../../data-access/model';

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
  }

  init(): Promise<void> {
    // move into app initializer
    this.refreshGenres();
    return Promise.resolve();
  }

  refreshGenres() {
    this.commands.next({ type: 'refreshGenres' });
  }

  private reduceSlice(slice: Partial<State>) {
    this.state.next({ ...this.state.getValue(), ...slice });
  }
}
