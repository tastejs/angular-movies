import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './container/about.component';
import { MatIconModule } from '@angular/material/icon';

const ROUTES: Routes = [{ path: '', component: AboutComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ROUTES), MatIconModule],
  declarations: [AboutComponent],
  exports: [AboutComponent],
})
export class AboutModule {}
