import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestListingComponent } from './lab-test-listing.component';

describe('LabTestListingComponent', () => {
  let component: LabTestListingComponent;
  let fixture: ComponentFixture<LabTestListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabTestListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTestListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
