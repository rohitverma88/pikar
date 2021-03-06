import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceVendorComponent } from './ace-vendor.component';

describe('AceVendorComponent', () => {
  let component: AceVendorComponent;
  let fixture: ComponentFixture<AceVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
