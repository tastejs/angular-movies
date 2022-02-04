import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
  template: `<article>
    <header>
      <h1>Create new list</h1>
    </header>
    <ui-list-edit-form [mode]="'create'"></ui-list-edit-form>
  </article> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCreateEditPageComponent {}
