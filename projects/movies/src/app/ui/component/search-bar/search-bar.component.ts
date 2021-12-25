import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject, Input,
  OnInit,
  Output,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import { filter, fromEvent, map, mapTo, merge, Observable, startWith, switchMap, tap, withLatestFrom } from 'rxjs';
import { getActions } from '../../../shared/rxa-custom/actions';
import { RxState } from '@rx-angular/state';
import { coerceObservable } from '@rx-angular/cdk';

@Component({
  selector: 'app-search-bar',
  template: `
    <form
      (submit)="ui.formSubmit($event)"
      #form
      class="form"
      (click)="ui.formClick($event)"
    >
      <button
        type="submit"
        class="magnifier-button"
        aria-label="Search for a movie"
      >
        <app-search-icon></app-search-icon>
      </button>
      <input *rxLet="search$; let search"
        aria-label="Search Input"
        #searchInput [value]="search"
        (change)="ui.searchChange(searchInput.value)"
        placeholder="Search for a movie..."
        class="input"
      />
    </form>
  `,
  styleUrls: ['search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState]
})
export class SearchBarComponent implements OnInit {
  @ViewChild('searchInput') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('form') formRef!: ElementRef<HTMLFormElement>;
  get input() {
    return this.inputRef.nativeElement;
  }

  ui = getActions<{
    searchChange: string,
    formClick: any,
    outsideFormClick: any,
    formSubmit: any
  }>({searchChange: (value) => value || ''})

  @Input()
  set query(v: string | Observable<string>) {
    this.state.connect('search', coerceObservable(v) as Observable<string>);
  };

  search$ = this.state.select('search');
  @Output() searchSubmit = this.ui.formSubmit$.pipe(
    withLatestFrom(this.state.select('search')),
    map(([_, search]) => search)
  );

  private get outsideClick() {
    return fromEvent(this.document, 'click').pipe(
      filter(e => !this.formRef.nativeElement.contains(e.target as any))
    )
  }


  private readonly nativeElement: HTMLElement = this.elementRef.nativeElement;
  constructor(
    private state: RxState<{search: string, open: boolean}>,
    @Inject(ElementRef) private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.state.connect('search', this.ui.searchChange$.pipe(
      startWith('')
    ))
  }

  ngOnInit() {
    let opened = false;
    this.state.hold(
      merge(
        this.ui.formClick$.pipe(
          filter(() => !opened),
          switchMap(() => this.outsideClick.pipe(
            mapTo(false),
            startWith(true)
          ))
        ),
        this.ui.formSubmit$.pipe(
          tap(e => e.preventDefault()),
          mapTo(false)
        )
      ),
      open => {
        if (open) {
          this.input.focus();
        }
        this.setOpened(open);
        opened = open;
      }
    )
  }

  private setOpened(opened: boolean) {
    opened
      ? this.nativeElement.classList.add('opened')
      : this.nativeElement.classList.remove('opened');
  }

}
