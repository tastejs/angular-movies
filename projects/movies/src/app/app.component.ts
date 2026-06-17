import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppShellComponent } from './app-shell/app-shell.component';
import { RouterOutlet } from '@angular/router';
import { RxLet } from '@rx-angular/template/let';

@Component({
  selector: 'app-root',
  template: `
    <app-shell *rxLet="[]">
      <router-outlet />
    </app-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppShellComponent, RouterOutlet, RxLet],
})
export class AppComponent {}
