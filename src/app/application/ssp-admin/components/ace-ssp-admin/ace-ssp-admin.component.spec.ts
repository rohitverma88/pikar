import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceSspAdminComponent } from './ace-ssp-admin.component';

describe('AceSspAdminComponent', () => {
  let component: AceSspAdminComponent;
  let fixture: ComponentFixture<AceSspAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceSspAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceSspAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
