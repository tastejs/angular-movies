import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in.component';
import { routing } from './sign-in.routing';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
      MatButtonModule,
      TranslateModule,
      routing
    ],
    declarations: [SignInComponent]
})
export class SignInModule {}
