import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiagnosticsComponent } from './view-diagnostics.component';

describe('ViewDiagnosticsComponent', () => {
  let component: ViewDiagnosticsComponent;
  let fixture: ComponentFixture<ViewDiagnosticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiagnosticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
