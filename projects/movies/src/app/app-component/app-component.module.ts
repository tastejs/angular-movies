import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppShellModule } from '../app-shell/app-shell.module';
import { LetModule } from '@rx-angular/template/let';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [RouterModule, AppShellModule, LetModule],
  exports: [AppComponent],
})
export class AppComponentModule {}
