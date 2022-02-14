import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ListCreatePageAdapter } from './list-create-page.adapter';
@Component({
  template: `
    <article>
      <ng-container *rxLet="adapter.showHeader$; let showHeader">
        <header *ngIf="showHeader">
          <h1>Create new list</h1>
        </header>
      </ng-container>
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
          <select
            id="list-privacy"
            #privateInput
            (change)="adapter.ui.update({ private: privateInput.value })"
          >
            <option [selected]="private" [value]="true">Yes</option>
            <option [selected]="!private" [value]="false">No</option>
          </select>
        </fieldset>
      </form>
      <ng-container *rxLet="adapter.valid$; let valid">
        <button
          [disabled]="!valid"
          (click)="adapter.ui.submit()"
          class="primary-button"
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
export class ListCreateEditPageComponent {
  constructor(public adapter: ListCreatePageAdapter) {}
}
