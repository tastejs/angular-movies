import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in.component';
import { routing } from './sign-in.routing';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [MatButtonModule, routing],
  declarations: [SignInComponent],
})
export class SignInModule {}
