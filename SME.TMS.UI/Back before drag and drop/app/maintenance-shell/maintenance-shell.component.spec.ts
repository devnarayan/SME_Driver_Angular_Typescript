import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceShellComponent } from './maintenance-shell.component';

describe('MaintenanceShellComponent', () => {
  let component: MaintenanceShellComponent;
  let fixture: ComponentFixture<MaintenanceShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
