import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceProductsComponent } from './ace-products.component';

describe('AceProductsComponent', () => {
  let component: AceProductsComponent;
  let fixture: ComponentFixture<AceProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
