import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceentryComponent } from './maintenanceentry.component';

describe('MaintenanceentryComponent', () => {
  let component: MaintenanceentryComponent;
  let fixture: ComponentFixture<MaintenanceentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
