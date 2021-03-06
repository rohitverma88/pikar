import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSspSalesOrderComponent } from './view-ssp-sales-order.component';

describe('ViewSspSalesOrderComponent', () => {
  let component: ViewSspSalesOrderComponent;
  let fixture: ComponentFixture<ViewSspSalesOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSspSalesOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSspSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
