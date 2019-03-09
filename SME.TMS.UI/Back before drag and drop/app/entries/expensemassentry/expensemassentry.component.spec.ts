import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensemassentryComponent } from './expensemassentry.component';

describe('ExpensemassentryComponent', () => {
  let component: ExpensemassentryComponent;
  let fixture: ComponentFixture<ExpensemassentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensemassentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensemassentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
