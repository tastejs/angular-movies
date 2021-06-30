import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StarComponent} from './star.component';

const routes: Routes = [
  { path: '', component: StarComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
