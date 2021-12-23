import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar.component';
import { LetModule } from '@rx-angular/template';
import { SearchIconModule } from '../icons/search/search-icon.component';

@NgModule({
  declarations: [SearchBarComponent],
  imports: [CommonModule, LetModule, SearchIconModule],
  exports: [SearchBarComponent]
})
export class SearchBarModule {
}
