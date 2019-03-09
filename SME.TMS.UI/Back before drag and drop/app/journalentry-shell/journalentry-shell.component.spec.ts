import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalentryShellComponent } from './journalentry-shell.component';

describe('JournalentryShellComponent', () => {
  let component: JournalentryShellComponent;
  let fixture: ComponentFixture<JournalentryShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalentryShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalentryShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
