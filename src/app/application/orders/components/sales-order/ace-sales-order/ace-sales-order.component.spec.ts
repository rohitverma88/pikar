import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceSalesOrderComponent } from './ace-sales-order.component';

describe('AceSalesOrderComponent', () => {
  let component: AceSalesOrderComponent;
  let fixture: ComponentFixture<AceSalesOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceSalesOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
