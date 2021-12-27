import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter, fromEvent, map, merge, Observable, startWith, switchMap, take, withLatestFrom } from 'rxjs';
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
  styles: [
      `
      :host {
        display: contents;
      }

      .form {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--theme-shadow-1);
        background-color: var(--palette-secondary-dark);
        border: 1px solid var(--palette-secondary-main);
        width: 2rem;
        cursor: pointer;
        padding: 2rem;
        height: 2rem;
        outline: none;
        border-radius: 100px;
        transition: width var(--theme-anim-duration-standard) var(--theme-anim-easing-easeInOut);
      }

      .magnifier-button {
        line-height: 0;
        pointer-events: none;
        cursor: none;
        background-color: transparent;
        border: none;
        outline: none;
        color: var(--palette-secondary-contrast-text);
      }

      .input {
        font-size: 1.5rem;
        line-height: 1;
        font-weight: 300;
        background-color: transparent;
        width: 100%;
        margin-left: 0;
        color: var(--palette-secondary-contrast-text);
        border: none;
        transition: margin-left var(--theme-anim-duration-standard) var(--theme-anim-easing-easeInOut);
      }

      input:focus,
      input:active {
        outline: none;
      }

      input::placeholder {
        color: var(--palette-secondary-contrast-text);
      }

      :host.opened .form {
        width: 30rem;
        cursor: auto;
      }

      :host.opened .magnifier-button {
        pointer-events: auto;
        cursor: pointer;
      }

      :host.opened .input {
        margin-left: 1rem;
        cursor: pointer;
      }

      @media only screen and (max-width: 1300px) {
        .magnifier-button {
          font-size: 1rem;
        }

        .input {
          font-size: 1.25rem;
        }

        .form {
          padding: 1.5rem;
          border: 1px solid hsl(0deg 0% 0% / 0%);
          background-color: var(--palette-secondary-main);
        }
      }

      @media only screen and (max-width: 900px) {
        .input {
          font-size: 1rem;
        }
      }

      @media only screen and (max-width: 600px) {
        .input {
          font-size: 0.875rem;
        }
      }

      @media only screen and (max-width: 500px) {
        .form {
          max-width: 16rem;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState]
})
export class SearchBarComponent implements OnInit {
  @ViewChild('searchInput') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('form') formRef!: ElementRef<HTMLFormElement>;

  ui = getActions<{
    searchChange: string,
    formClick: Event,
    outsideFormClick: Event,
    formSubmit: Event
  }>({
    searchChange: s => s + '',
    formSubmit: e => {
      e.preventDefault();
      return e;
    }
  });

  @Input()
  set query(v: string | Observable<string>) {
    this.state.connect('search', coerceObservable(v) as Observable<string>);
  };

  search$ = this.state.select('search');
  @Output() searchSubmit = this.ui.formSubmit$.pipe(
    withLatestFrom(this.state.select('search')),
    map(([_, search]) => search)
  );

  private readonly closedFormClick$ = this.ui.formClick$.pipe(
    withLatestFrom(this.state.select('open')),
    filter(([_, opened]) => !opened)
  );

  private outsideClick(): Observable<Event> {
    // any click on the page (we can't use the option `once:true` as we might get multiple false trigger)
    return fromEvent(this.document, 'click').pipe(
      // forward if the current element is NOT the element that triggered the click
      // means we clicked somewhere else in the page but the form
      filter(e => !this.formRef.nativeElement.contains(e.target as any))
    );
  }

  /**
   * **🚀 Perf Tip for TBT, TTI:**
   *
   * We avoid `@HostListener('document')` as it would add an event listener on component bootstrap no matter if we need it or not.
   * This obviously will not scale.
   *
   * To avoid this we only listen to document click events after we clicked on the closed form.
   * If the needed event to close the form is received we stop listening to the document.
   *
   * This way we reduce the active event listeners to a minimum.
   */
  private readonly outsideOpenFormClick$ = this.closedFormClick$.pipe(
    switchMap(() => this.outsideClick().pipe(take(1)))
  );

  private readonly classList = this.elementRef.nativeElement.classList;

  constructor(
    private state: RxState<{ search: string, open: boolean }>,
    @Inject(ElementRef) private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.state.set({ open: false });
  }

  ngOnInit() {
    this.state.hold(this.state.select('open'), this.setOpenedStyling);
    this.state.hold(this.closedFormClick$, this.focusInput);

    this.state.connect('search', this.ui.searchChange$.pipe(startWith('')));
    this.state.connect('open', merge(this.ui.formSubmit$, this.outsideOpenFormClick$), () => false);
    this.state.connect('open', this.closedFormClick$, () => true);
  }

  private focusInput = () => {
    return this.inputRef.nativeElement.focus();
  };

  private setOpenedStyling = (opened: boolean) => {
    opened
      ? this.classList.add('opened')
      : this.classList.remove('opened');
  };

}

