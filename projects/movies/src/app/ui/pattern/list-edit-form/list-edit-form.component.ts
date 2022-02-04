import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { LetModule } from '@rx-angular/template';

import { ListEditFormAdapter } from './list-edit-form.adapter';

@Component({
  selector: 'ui-list-edit-form',
  templateUrl: './list-edit-form.component.html',
  styleUrls: [
    './list-edit-form.component.scss',
    '../../component/button/_button.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListEditFormComponent {
  @Input() set mode(mode: 'edit' | 'create') {
    this.adapter.set({ mode });
  }

  constructor(public adapter: ListEditFormAdapter) {}
}

@NgModule({
  imports: [LetModule],
  declarations: [ListEditFormComponent],
  exports: [ListEditFormComponent],
})
export class ListEditFormComponentModule {}
