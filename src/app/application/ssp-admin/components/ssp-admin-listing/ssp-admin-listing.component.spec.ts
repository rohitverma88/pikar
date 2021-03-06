import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SspAdminListingComponent } from './ssp-admin-listing.component';

describe('SspAdminListingComponent', () => {
  let component: SspAdminListingComponent;
  let fixture: ComponentFixture<SspAdminListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SspAdminListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SspAdminListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
