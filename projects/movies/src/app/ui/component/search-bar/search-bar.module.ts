import { LetModule } from '@rx-angular/template/let';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { SearchBarComponent } from './search-bar.component';

@NgModule({
  declarations: [SearchBarComponent],
  imports: [CommonModule, LetModule, FastSvgModule],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}
