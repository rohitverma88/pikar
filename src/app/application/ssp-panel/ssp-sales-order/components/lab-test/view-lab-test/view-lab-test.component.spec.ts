import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLabTestComponent } from './view-lab-test.component';

describe('ViewLabTestComponent', () => {
  let component: ViewLabTestComponent;
  let fixture: ComponentFixture<ViewLabTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLabTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLabTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
