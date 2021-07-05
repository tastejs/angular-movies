import {NgModule} from '@angular/core';
import {PlaylistComponent} from './playlist.component';
import {routing} from './playlist-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    TranslateModule,
    routing,
  ],
  declarations: [
    PlaylistComponent,
  ]
})
export class PlaylistModule {
}
