import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TmdbService } from './tmdb.service';
import { StorageService } from '../storage/storage.service';

describe('TmdbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        StorageService,
        TmdbService
      ]
    });
  });

  it('should be created', inject([TmdbService], (service: TmdbService) => {
    expect(service).toBeTruthy();
  }));
});
