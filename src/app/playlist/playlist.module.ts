import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PlaylistComponent } from './playlist.component';
import { routing } from './playlist-routing.module';

@NgModule({
  imports: [
    SharedModule,
    routing,
  ],
  declarations: [
    PlaylistComponent,
  ]
})
export class PlaylistModule { }
