import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassentryComponent } from './massentry.component';

describe('MassentryComponent', () => {
  let component: MassentryComponent;
  let fixture: ComponentFixture<MassentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
