import { TestBed, inject } from '@angular/core/testing';

import { PrestationService } from './prestation.service';

describe('PrestationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrestationService]
    });
  });

  it('should be created', inject([PrestationService], (service: PrestationService) => {
    expect(service).toBeTruthy();
  }));
});
