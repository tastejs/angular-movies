import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, takeUntil } from 'rxjs';

import { SearchIconComponentModule } from '../icons/search/search-icon.component';
import { getActions } from '../../../shared/rxa-custom/actions';

@Component({
  selector: 'app-search-bar',
  template: `
    <form
      (submit)="onFormSubmit($event)"
      #form
      class="form"
      (click)="onFormClick()"
    >
      <button
        type="submit"
        class="magnifier-button"
        aria-label="Search for a movie"
      >
        <app-search-icon></app-search-icon>
      </button>
      <input
        aria-label="Search Input"
        #searchInput
        (change)="onInputChange(searchInput.value)"
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
        transition: width var(--theme-anim-duration-standard)
          var(--theme-anim-easing-easeInOut);
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
        transition: margin-left var(--theme-anim-duration-standard)
          var(--theme-anim-easing-easeInOut);
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('form') formRef!: ElementRef<HTMLFormElement>;
  get input() {
    return this.inputRef.nativeElement;
  }

  ui = getActions<{search: string, destroy: void}>({search: (value) => value || ''})

  @Output() search = this.ui.search$;

  private searchTerm = '';

  private readonly nativeElement: HTMLElement = this.elementRef.nativeElement;
  constructor(
    @Inject(ElementRef) private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    fromEvent(this.document, 'click')
      .pipe(takeUntil(this.ui.destroy$))
      .subscribe((e) => {
        if (!this.formRef.nativeElement.contains(e.target as any)) {
          this.setOpened(false);
        }
      });
  }

  ngOnDestroy() {
    this.ui.destroy();
  }

  setOpened(opened: boolean) {
    opened
      ? this.nativeElement.classList.add('opened')
      : this.nativeElement.classList.remove('opened');
  }

  onFormClick() {
    this.setOpened(true);
    this.input.focus();
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    if (this.searchTerm.length === 0) {
      return;
    }
    this.setOpened(false);
    this.ui.search(this.searchTerm);
    this.input.value = '';
  }

  onInputChange(value: string) {
    this.searchTerm = value;
  }
}

@NgModule({
  declarations: [SearchBarComponent],
  exports: [SearchBarComponent],
  imports: [SearchIconComponentModule],
})
export class SearchBarComponentModule {}
