import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationDetailComponent } from './facturation-detail.component';

describe('FacturationDetailComponent', () => {
  let component: FacturationDetailComponent;
  let fixture: ComponentFixture<FacturationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
