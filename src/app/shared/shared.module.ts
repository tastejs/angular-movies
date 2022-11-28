import { NgModule, ModuleWithProviders } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedMaterialModule } from './shared-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShareModalComponent } from './component/share-modal/share-modal.component';
import { DatabaseService } from './service/database/database.service';
import { TmdbService } from './service/tmdb/tmdb.service';
import { PaginationComponent } from './component/pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CdkTableModule,
    SharedMaterialModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ShareModalComponent,
    PaginationComponent,
    CdkTableModule,
    SharedMaterialModule,
    TranslateModule
  ],
  declarations: [
    ShareModalComponent,
    PaginationComponent
  ],
  entryComponents: [
    ShareModalComponent,
    PaginationComponent
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        DatabaseService,
        TmdbService
      ]
    };
  }

}
