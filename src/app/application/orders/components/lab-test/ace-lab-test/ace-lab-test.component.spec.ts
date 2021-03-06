import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceLabTestComponent } from './ace-lab-test.component';

describe('AceLabTestComponent', () => {
  let component: AceLabTestComponent;
  let fixture: ComponentFixture<AceLabTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceLabTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceLabTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
