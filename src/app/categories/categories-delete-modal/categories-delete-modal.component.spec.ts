import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CategoriesDeleteModalComponent } from './categories-delete-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { CategoriesDeleteModalModule } from './categories-delete-modal.module';

const translations: any = { foo: 'bar' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('CategoriesDeleteModalComponent', () => {
  let component: CategoriesDeleteModalComponent;
  let fixture: ComponentFixture<CategoriesDeleteModalComponent>;

  const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClose']);
  const matDialogData = jasmine.createSpyObj('MAT_DIALOG_DATA', ['']);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          CategoriesDeleteModalModule,
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader },
          }),
        ],
        providers: [
          { provide: MatDialogRef, useValue: matDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: matDialogData },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
