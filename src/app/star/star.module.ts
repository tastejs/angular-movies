import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { StarComponent } from './star.component';
import { routing } from './star-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';


@NgModule({
  imports: [
    SharedModule, routing, LazyLoadImageModule
  ],
  declarations: [StarComponent]
})
export class StarModule { }
