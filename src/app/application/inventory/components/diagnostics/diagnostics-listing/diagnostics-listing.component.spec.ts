import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticsListingComponent } from './diagnostics-listing.component';

describe('DiagnosticsListingComponent', () => {
  let component: DiagnosticsListingComponent;
  let fixture: ComponentFixture<DiagnosticsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
