import { TestBed } from '@angular/core/testing';

import { AdminSectionGuardGuard } from './admin-section-guard.guard';

describe('AdminSectionGuardGuard', () => {
  let guard: AdminSectionGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminSectionGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
