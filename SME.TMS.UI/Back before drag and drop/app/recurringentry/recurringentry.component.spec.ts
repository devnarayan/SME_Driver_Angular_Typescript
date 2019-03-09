import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringentryComponent } from './recurringentry.component';

describe('RecurringentryComponent', () => {
  let component: RecurringentryComponent;
  let fixture: ComponentFixture<RecurringentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
