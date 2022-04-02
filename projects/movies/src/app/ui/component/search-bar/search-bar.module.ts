import { LetModule } from '@rx-angular/template/let';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FastIconModule } from '../../../shared/fast-icon/fast-icon.module';
import { SearchBarComponent } from './search-bar.component';

@NgModule({
  declarations: [SearchBarComponent],
  imports: [CommonModule, LetModule, FastIconModule],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}
