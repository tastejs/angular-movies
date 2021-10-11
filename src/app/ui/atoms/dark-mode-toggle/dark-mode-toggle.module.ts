import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeToggleComponent } from './dark-mode-toggle.component';
import { LetModule } from '@rx-angular/template/let';

@NgModule({
  declarations: [DarkModeToggleComponent],
  exports: [DarkModeToggleComponent],
  imports: [CommonModule, LetModule],
})
export class DarkModeToggleModule {}
