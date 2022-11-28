import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistComponent } from './playlist.component';

const routes: Routes = [
  { path: '', component: PlaylistComponent }
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
