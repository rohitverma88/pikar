import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SspsalesOrderListingComponent } from './ssp-sales-order-listing.component';

describe('SspsalesOrderListingComponent', () => {
  let component: SspsalesOrderListingComponent;
  let fixture: ComponentFixture<SspsalesOrderListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SspsalesOrderListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SspsalesOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
