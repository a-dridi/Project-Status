import { TestBed } from '@angular/core/testing';

import { ProjectstatusService } from './projectstatus.service';

describe('ProjectstatusService', () => {
  let service: ProjectstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
