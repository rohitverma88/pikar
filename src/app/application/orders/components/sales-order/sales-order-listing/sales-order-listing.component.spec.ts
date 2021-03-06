import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderListingComponent } from './sales-order-listing.component';

describe('SalesOrderListingComponent', () => {
  let component: SalesOrderListingComponent;
  let fixture: ComponentFixture<SalesOrderListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
