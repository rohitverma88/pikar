import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceSspSalesOrderComponent } from './ace-ssp-sales-order.component';

describe('AceSspSalesOrderComponent', () => {
  let component: AceSspSalesOrderComponent;
  let fixture: ComponentFixture<AceSspSalesOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceSspSalesOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceSspSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
