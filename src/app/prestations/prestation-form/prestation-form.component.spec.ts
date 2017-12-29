import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationFormComponent } from './prestation-form.component';

describe('PrestationFormComponent', () => {
  let component: PrestationFormComponent;
  let fixture: ComponentFixture<PrestationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
