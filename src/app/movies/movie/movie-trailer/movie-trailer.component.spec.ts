import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import {MovieTrailerComponent} from './movie-trailer.component';

describe('MovieTrailerComponent', () => {
  let component: MovieTrailerComponent;
  let fixture: ComponentFixture<MovieTrailerComponent>;

  const mock = {
    name: 'vsnlvn',
    url: {
      changingThisBreaksApplicationSecurity: 'ggff'
    }
  };

  const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClose']);
  const matDialogData = jasmine.createSpyObj('MAT_DIALOG_DATA', [mock]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
      ],
      declarations: [MovieTrailerComponent],
      providers: [
        {provide: MatDialogRef, useValue: matDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: matDialogData}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
