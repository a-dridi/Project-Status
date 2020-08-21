import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientsAddComponent } from './manage-clients-add.component';

describe('ManageClientsAddComponent', () => {
  let component: ManageClientsAddComponent;
  let fixture: ComponentFixture<ManageClientsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageClientsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClientsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
