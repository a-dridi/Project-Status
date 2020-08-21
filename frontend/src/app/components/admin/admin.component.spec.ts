import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { ProjectstatusService } from 'src/app/projectstatus.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let httpClientSpy: { get: jasmine.Spy };
  let projectStatusService: ProjectstatusService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    projectStatusService = new ProjectstatusService(httpClientSpy as any);

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('empty projects array should make projectsCreated boolean false', () => {
    component.loadProjects();
    expect(component.projectsCreated).toBeFalse();
  });
});
