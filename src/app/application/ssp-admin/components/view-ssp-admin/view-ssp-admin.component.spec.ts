import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSSPAdminComponent } from './view-ssp-admin.component';

describe('ViewSSPAdminComponent', () => {
  let component: ViewSSPAdminComponent;
  let fixture: ComponentFixture<ViewSSPAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSSPAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSSPAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
