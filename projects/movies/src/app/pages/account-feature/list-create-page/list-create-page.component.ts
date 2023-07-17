import {RxLet} from '@rx-angular/template/let';
import {ChangeDetectionStrategy, Component, inject, OnDestroy,} from '@angular/core';
import {ListCreatePageAdapter} from './list-create-page.adapter';
import {RxIf} from '@rx-angular/template/if';

@Component({
  standalone: true,
  imports: [RxLet, RxIf],
  template: `
    <article>
      <header *rxIf="adapter.showHeader$">
        <h1>Create new list</h1>
      </header>
      <form>
        <fieldset *rxLet="adapter.name$; let name">
          <label for="list-name"> Name </label>
          <input
            id="list-name"
            #nameInput
            type="text"
            [value]="name"
            (input)="adapter.ui.update({ name: nameInput.value })"
          />
        </fieldset>

        <fieldset *rxLet="adapter.description$; let description">
          <label for="list-description"> Description </label>
          <textarea
            id="list-description"
            #descriptionInput
            (input)="adapter.ui.update({ description: descriptionInput.value })"
            rows="8"
            >{{ description }}</textarea
          >
        </fieldset>

        <fieldset *rxLet="adapter.private$; let private">
          <label for="list-privacy"> Private </label>
          <div class="select-wrapper">
            <select
              id="list-privacy"
              class="select"
              #privateInput
              (change)="adapter.ui.update({ private: privateInput.value })"
            >
              <option [selected]="private" [value]="true">Yes</option>
              <option [selected]="!private" [value]="false">No</option>
            </select>
          </div>
        </fieldset>
      </form>
      <ng-container *rxLet="adapter.valid$; let valid">
        <button
          [disabled]="!valid"
          (click)="adapter.ui.submit()"
          class="btn primary-button"
          name="save"
          aria-label="Save list"
        >
          Save
        </button>
      </ng-container>
    </article>
  `,
  styleUrls: [
    './list-create-page.component.scss',
    '../../../ui/component/button/_button.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListCreateEditPageComponent implements OnDestroy {
  public readonly adapter = inject(ListCreatePageAdapter);

  ngOnDestroy(): void {
    this.adapter.resetForm();
  }
}
