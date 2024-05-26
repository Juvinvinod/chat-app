import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { statusCheckerGuard } from './status-checker.guard';

describe('statusCheckerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => statusCheckerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
