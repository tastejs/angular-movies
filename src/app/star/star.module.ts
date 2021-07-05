import {NgModule} from '@angular/core';
import {StarComponent} from './star.component';
import {routing} from './star-routing.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  imports: [
    routing,
    LazyLoadImageModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    TranslateModule
  ],
  declarations: [StarComponent],
  exports: [
    StarComponent
  ]
})
export class StarModule { }
