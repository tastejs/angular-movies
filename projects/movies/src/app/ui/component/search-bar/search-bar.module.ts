import { LetModule } from '@rx-angular/template/let';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar.component';
import { SearchIconModule } from '../icons/search/search-icon.module';

@NgModule({
  declarations: [SearchBarComponent],
  imports: [CommonModule, LetModule, SearchIconModule],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}
