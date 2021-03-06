import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceMedicineComponent } from './ace-medicine.component';

describe('AceMedicineComponent', () => {
  let component: AceMedicineComponent;
  let fixture: ComponentFixture<AceMedicineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceMedicineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
