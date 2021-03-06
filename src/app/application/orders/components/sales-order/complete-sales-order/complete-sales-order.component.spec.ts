import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CompleteSalesOrderComponent } from './complete-sales-order.component';

describe('CompleteSalesOrderComponent', () => {
  let component: CompleteSalesOrderComponent;
  let fixture: ComponentFixture<CompleteSalesOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteSalesOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
