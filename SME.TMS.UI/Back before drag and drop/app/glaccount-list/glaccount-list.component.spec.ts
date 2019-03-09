import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlaccountListComponent } from './glaccount-list.component';

describe('GlaccountListComponent', () => {
  let component: GlaccountListComponent;
  let fixture: ComponentFixture<GlaccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlaccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlaccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
