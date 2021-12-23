import { NgModule } from '@angular/core';
import { TitleModule } from '../../atoms/title/title.module';
import { SubtitleModule } from '../../atoms/subtitle/subtitle.module';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [TitleModule, SubtitleModule],
  exports: [HeaderComponent]
})
export class HeaderModule {
}
