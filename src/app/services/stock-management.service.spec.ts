import { TestBed } from '@angular/core/testing';

import { StockManagementService } from './stock-management.service';

describe('StockManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockManagementService = TestBed.get(StockManagementService);
    expect(service).toBeTruthy();
  });
});
