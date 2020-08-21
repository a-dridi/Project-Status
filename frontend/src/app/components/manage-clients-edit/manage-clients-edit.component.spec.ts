import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientsEditComponent } from './manage-clients-edit.component';

describe('ManageClientsEditComponent', () => {
  let component: ManageClientsEditComponent;
  let fixture: ComponentFixture<ManageClientsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageClientsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClientsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
