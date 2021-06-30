import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { SignInComponent } from './sign-in.component';
import { routing } from './sign-in.routing';

@NgModule({
    imports: [
        SharedModule, routing
    ],
    declarations: [SignInComponent]
})
export class SignInModule {}
