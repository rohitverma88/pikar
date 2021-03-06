import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceDiagnosticsComponent } from './ace-diagnostics.component';

describe('AceDiagnosticsComponent', () => {
  let component: AceDiagnosticsComponent;
  let fixture: ComponentFixture<AceDiagnosticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceDiagnosticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
